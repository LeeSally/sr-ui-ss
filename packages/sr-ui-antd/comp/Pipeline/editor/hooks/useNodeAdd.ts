import { useState, useEffect, useContext } from 'react'

import { useMemoizedFn } from 'ahooks'

import { PipelineNodeDef, PipelineNodeWithNext, PipelineNodeWithPos } from '../../types'
import { PipelineContext } from '../../context'
import { PIPELINE_NODE } from '../../node/consts'

import { cloneObject } from '../funcs'
import { findRawNode } from '../../canvas/funcs'

export interface UsePipelineNodeAddProps {
  addingNode?: {
    parent: PipelineNodeWithPos.All
    nodeType?: PIPELINE_NODE.Type
    taskKey?: string
  }
  onAddingNode: (nodeType?: PIPELINE_NODE.Type, taskKey?: string) => (e: any) => void
  onAddingParent: (parent: PipelineNodeWithPos.All) => (opened: boolean) => void
}

/**
 * Hook to add (insert) pipeline node
 * @returns 
 */
const usePipelineNodeAdd = (
  trigger?: PipelineNodeWithNext.Trigger,
  onChange?: (val: PipelineNodeWithNext.Trigger) => void
): UsePipelineNodeAddProps => {
  const { customTaskDefs } = useContext(PipelineContext)

  const [addingNode, setAddingNode] = useState<{
    parent: PipelineNodeWithPos.All
    nodeType?: PIPELINE_NODE.Type
    taskKey?: string
  }>()

  /**
   * Set node type of newing node
   * @param {PIPELINE_NODE.Type} nodeType 
   * @param {string} taskKey 
   * @returns 
   */
  const onAddingNode = useMemoizedFn((
    nodeType?: PIPELINE_NODE.Type,
    taskKey?: string
  ) => (e: any) => {
    setAddingNode(prev => {
      if (prev?.parent === undefined || nodeType === undefined) return prev
      return { ...prev, nodeType, taskKey }
    })
  })

  /**
   * Set parent node of newing node
   * @param {PipelineNodeWithPos.All} parent 
   * @returns 
   */
  const onAddingParent = useMemoizedFn((parent: PipelineNodeWithPos.All) => (opened: boolean) => {
    if (!opened) return
    setAddingNode({ parent })
  })

  /**
   * Insert Node after a target parent node
   */
  useEffect(() => {
    if (addingNode?.parent === undefined || addingNode.nodeType === undefined) return
    const newTrigger = cloneObject(trigger)
    if (newTrigger === undefined) return

    const parentIndex = addingNode.parent.gridPos.chainIdx
    const rawParent = findRawNode(parentIndex, newTrigger, [0])
    if (rawParent === undefined) {
      console.error('[Error]: Cannot find parent node', parentIndex, newTrigger)
      return
    }
    // ------- 
    // 1) newing node
    const newIfNode: PipelineNodeWithNext.If = {
      ...PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.IF] as PipelineNodeDef.IBase<PIPELINE_NODE.Type.IF>
    }

    const newSwitchNode: PipelineNodeWithNext.Switch = {
      ...PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.SWITCH] as PipelineNodeDef.IBase<PIPELINE_NODE.Type.SWITCH>
    }

    const presetTaskKey = addingNode.taskKey as PIPELINE_NODE.PresetTaskKey
    let newPresetTaskNode: PipelineNodeWithNext.PresetTasks | undefined
    let newCustomTaskNode: PipelineNodeWithNext.CustomTask<any> | undefined

    if (Object.values(PIPELINE_NODE.PresetTaskKey).includes(presetTaskKey)) {
      // a) Preset task
      newPresetTaskNode = {
        ...PIPELINE_NODE.PRESET_TASK_DEFS[presetTaskKey]
      }
    } else {
      // b) Custom task
      const customTaskKey = addingNode.taskKey
      const customTaskDef = customTaskDefs?.find(def => def.taskKey === customTaskKey) as PipelineNodeDef.TaskCustom<any>
      newCustomTaskNode = { ...customTaskDef }
    }

    // ---------------------------
    // 2) Insert NEW node to target parent node
    // can only insert before: TRIGGER / TASK node
    if (addingNode.parent.nodeType === PIPELINE_NODE.Type.TRIGGER) {
      // 2.1) Parent Node = TRIGGER
      const rawParentTrigger = rawParent as PipelineNodeWithNext.Trigger

      if (addingNode.nodeType === PIPELINE_NODE.Type.IF) {
        // 2.1.1) new node = IF
        newIfNode.trueNext = rawParentTrigger.next
        rawParentTrigger.next = newIfNode
      } else if (addingNode.nodeType === PIPELINE_NODE.Type.SWITCH) {
        // 2.1.2) new node = SWITCH
        newSwitchNode.caseGroups = [['0']]
        newSwitchNode.caseNexts = [
          rawParentTrigger.next
        ]
        rawParentTrigger.next = newSwitchNode
      } else if (addingNode.nodeType === PIPELINE_NODE.Type.TASK) {
        // 2.1.3) new node = TASK
        if (newPresetTaskNode !== undefined) {
          // a) preset task
          newPresetTaskNode.next = rawParentTrigger.next
          rawParentTrigger.next = newPresetTaskNode
        } else if (newCustomTaskNode !== undefined) {
          // b) custom task
          newCustomTaskNode.next = rawParentTrigger.next
          rawParentTrigger.next = newCustomTaskNode
        }
      }
    } else if (addingNode.parent.nodeType === PIPELINE_NODE.Type.TASK) {
      // 2.2) Parent Node = TASK
      const rawParentTask = rawParent as PipelineNodeWithNext.Tasks

      if (addingNode.nodeType === PIPELINE_NODE.Type.IF) {
        // 2.2.1) new node = IF
        newIfNode.trueNext = rawParentTask.next
        rawParentTask.next = newIfNode
      } else if (addingNode.nodeType === PIPELINE_NODE.Type.SWITCH) {
        // 2.2.2) new node = SWITCH
        newSwitchNode.caseGroups = [['0']]
        newSwitchNode.caseNexts = [rawParentTask.next]
        rawParentTask.next = newSwitchNode
      } else if (addingNode.nodeType === PIPELINE_NODE.Type.TASK) {
        // 2.2.3) new node = TASK
        if (newPresetTaskNode !== undefined) {
          // a) preset task
          newPresetTaskNode.next = rawParentTask.next
          rawParentTask.next = newPresetTaskNode
        } else if (newCustomTaskNode !== undefined) {
          // b) custom task
          newCustomTaskNode.next = rawParentTask.next
          rawParentTask.next = newCustomTaskNode
        }
      }
    }

    setAddingNode(undefined)
    onChange?.(newTrigger)
  }, [addingNode, trigger])

  return {
    addingNode,
    onAddingNode,
    onAddingParent,
  }
}

export default usePipelineNodeAdd
