import { useMemo, useState } from 'react'

import { useMemoizedFn } from 'ahooks'

import { isEquals } from 'sr-ui-utils'

import { findRawNode } from '../../canvas/funcs'
import type { PipelineNodeWithNext, PipelineNodeWithPos } from '../../types'
import { cloneObject } from '../funcs'

export interface UsePipelineNodeEditProps {
  editingNode?: PipelineNodeWithNext.All
  editingTrigger?: PipelineNodeWithNext.Trigger
  onEditNode: (node: PipelineNodeWithPos.All) => void
  isEditing: (node: PipelineNodeWithPos.All) => boolean

  changed: boolean

  changeIfNode: (node: PipelineNodeWithNext.If) => void
  changeTriggerNode: (node: PipelineNodeWithNext.Trigger) => void
  changeSwitchNode: (node: PipelineNodeWithNext.Switch) => void

  saveEditing?: () => void
  cancelEditing?: () => void
}

const usePipelineNodeEdit = (
  trigger?: PipelineNodeWithNext.Trigger,
  onChange?: (val: PipelineNodeWithNext.Trigger) => void
): UsePipelineNodeEditProps => {
  const [editingNodeIndex, setEditingNodeIndex] = useState<number[]>()
  const [editingTrigger, setEditingTrigger] = useState<PipelineNodeWithNext.Trigger>()

  /**
   * Start edit node
   * @param {PipelineNodeWithPos.All} node
   */
  const onEditNode = useMemoizedFn((node: PipelineNodeWithPos.All): void => {
    setEditingNodeIndex(node.gridPos.chainIdx)
  })


  const preChange = () => {
    const newTrigger = cloneObject(trigger)
    if (newTrigger === undefined) return {}

    if (editingNodeIndex === undefined) return { newTrigger }
    const rawNode = findRawNode(editingNodeIndex, newTrigger, [0])
    return { newTrigger, rawNode }
  }

  /**
   * Change If node
   * @param {PipelineNodeWithNext.If} ifNode 
   */
  const changeIfNode = (ifNode?: PipelineNodeWithNext.If): void => {
    const { newTrigger, rawNode } = preChange()
    if(newTrigger === undefined || rawNode === undefined) return
    
    const rawIf = rawNode as PipelineNodeWithNext.If

    rawIf.judgeCondition = ifNode?.judgeCondition
    rawIf.trueNext = ifNode?.trueNext
    rawIf.falseNext = ifNode?.falseNext

    setEditingTrigger?.(newTrigger)
  }

  /**
   * Change Trigger node
   * @param {PipelineNodeWithNext.Trigger} triggerNode 
   */
  const changeTriggerNode = (triggerNode: PipelineNodeWithNext.Trigger): void => {
    const { newTrigger, rawNode } = preChange()
    if(newTrigger === undefined || rawNode === undefined) return
    
    const rawTrigger = rawNode as PipelineNodeWithNext.Trigger
   
    rawTrigger.condition = triggerNode?.condition
    setEditingTrigger?.(newTrigger)
  }

  /**
   * Change Switch node
   * @param {PipelineNodeWithNext.Switch} triggerNode 
   */
  const changeSwitchNode = (switchNode: PipelineNodeWithNext.Switch): void => {
    const { newTrigger, rawNode } = preChange()
    if(newTrigger === undefined || rawNode === undefined) return
    
    const rawSwitch = rawNode as PipelineNodeWithNext.Switch

    rawSwitch.judgeField = switchNode?.judgeField
    rawSwitch.caseGroups = switchNode?.caseGroups
    rawSwitch.caseNexts = switchNode?.caseNexts

    setEditingTrigger?.(newTrigger)
  }
  

  const saveEditing = (): void => {
    if (editingTrigger === undefined) return
    onChange?.(editingTrigger)
    cancelEditing()
  }

  const cancelEditing = (): void => {
    setEditingTrigger(undefined)
    setEditingNodeIndex(undefined)
  }

  const editingNode = useMemo(() => {
    const curTrigger = (editingTrigger ?? trigger)
    if (editingNodeIndex === undefined || curTrigger === undefined) return
    const rawNode = findRawNode(editingNodeIndex, curTrigger, [0])
    return rawNode
  }, [editingNodeIndex, editingTrigger, trigger])

  
  const isEditing = (node: PipelineNodeWithPos.All): boolean => {
    return isEquals(editingNodeIndex, node?.gridPos.chainIdx)
  }

  const changed = useMemo(() => {
    if (editingNodeIndex === undefined || trigger === undefined || editingTrigger === undefined) return false
    const rawNode = findRawNode(editingNodeIndex, trigger, [0])
    const newNode = findRawNode(editingNodeIndex, editingTrigger, [0])

    return true
    // console.log(rawNode, newNode, isEquals(rawNode, newNode))
    // return !isEquals(rawNode, newNode)
  }, [editingTrigger])

  return {
    editingTrigger,
    editingNode,
    onEditNode,
    isEditing,
    changed,

    changeIfNode,
    changeTriggerNode,
    changeSwitchNode,

    saveEditing,
    cancelEditing
  }
}

export default usePipelineNodeEdit
