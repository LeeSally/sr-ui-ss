import type { PipelineNodeWithNext, PipelineNodeWithPos } from '../../types'
import { PIPELINE_NODE } from '../../node/consts'

import { cloneObject } from '../funcs'
import { findRawNode } from '../../canvas/funcs'

export interface UsePipelineNodeDelProps {
  onDeleteNode: (node: PipelineNodeWithPos.Nexts) => void
}

/**
 * Hook to delete pipeline node
 * @returns 
 */
const usePipelineNodeDel = (
  trigger?: PipelineNodeWithNext.Trigger,
  onChange?:(trigger: PipelineNodeWithNext.Trigger) => void,
  endEdit?: () => void
): UsePipelineNodeDelProps => {

  /**
   * Delete one node, parent node of it will link to its next nodes chain
   * @param node 
   * @returns 
   */
  const onDeleteNode = (node: PipelineNodeWithPos.Nexts): void => {
    const newTrigger = cloneObject(trigger)
    if (newTrigger === undefined) return

    const nodeIndex = node.gridPos.chainIdx
    const parentIndex = nodeIndex.slice(0, nodeIndex.length - 1)
    const rawParent = findRawNode(parentIndex, newTrigger, [0])
    if (rawParent === undefined) return

    let branchNexts: PipelineNodeWithPos.Nexts[] = []
    if (node.nodeType === PIPELINE_NODE.Type.IF || node.nodeType === PIPELINE_NODE.Type.SWITCH) {
      //  New Node = Branch (IF / SWITCH)
      switch (node.nodeType) {
        case PIPELINE_NODE.Type.IF:
          [node.trueNext, node.falseNext].map(branch => {
            if (branch !== undefined) branchNexts.push(branch)
            return branch
          })
          break
        case PIPELINE_NODE.Type.SWITCH:
          branchNexts = node.caseNexts
          break
        default:
          break
      }
    }

    if (rawParent.nodeType === PIPELINE_NODE.Type.TASK || rawParent.nodeType === PIPELINE_NODE.Type.TRIGGER) {
      // 1. Parent Node = Task / Trigger
      if (node.nodeType === PIPELINE_NODE.Type.TASK) {
        // 1.1) New Node = Task
        rawParent.next = node.next
      } else if (node.nodeType === PIPELINE_NODE.Type.IF || node.nodeType === PIPELINE_NODE.Type.SWITCH) {
        // 1.2) New Node = Branch (IF / SWITCH)
        switch (branchNexts.length) {
          case 0: rawParent.next = undefined; break
          case 1: rawParent.next = branchNexts[0]; break
          default: console.warn('Only keep one branch node, remove unneeded nodes first', node)
        }
      }

    } else if (rawParent.nodeType === PIPELINE_NODE.Type.IF) {
      // 2. Parent Node = IF
      // [0]: True branch,   [1]: False branch
      const branchSeq = node.gridPos.chainIdx[node.gridPos.chainIdx.length - 1]
      const targetBranchKey = branchSeq === 0 ? 'trueNext' : 'falseNext'
      if (node.nodeType === PIPELINE_NODE.Type.TASK) {
        // 2.1) New Node = TASK
        rawParent[targetBranchKey] = node.next
      } else if (node.nodeType === PIPELINE_NODE.Type.IF || node.nodeType === PIPELINE_NODE.Type.SWITCH) {
        // 2.2) New Node = Branch (IF / SWITCH)
        switch (branchNexts.length) {
          case 0: rawParent[targetBranchKey] = undefined; break
          case 1: rawParent[targetBranchKey] = branchNexts[0]; break
          default: console.warn('Only keep one branch node, remove unneeded nodes first', node)
        }
      }
    } else if (rawParent.nodeType === PIPELINE_NODE.Type.SWITCH) {
      // 3. Parent Node = SWITCH
      const branchSeq = node.gridPos.chainIdx[node.gridPos.chainIdx.length - 1]
      if (rawParent.caseNexts?.[branchSeq] === undefined) {
        if (rawParent.caseNexts === undefined) {
          rawParent.caseNexts = []
        }
        rawParent.caseNexts[branchSeq] = undefined
      }

      if (node.nodeType === PIPELINE_NODE.Type.TASK) {
        // 3.1) New Node = TASK
        rawParent.caseNexts[branchSeq] = node.next
      } else if (node.nodeType === PIPELINE_NODE.Type.IF || node.nodeType === PIPELINE_NODE.Type.SWITCH) {
        // 3.2) New Node = Branch (IF / SWITCH)
        switch (branchNexts.length) {
          case 0: rawParent.caseNexts[branchSeq] = undefined; break
          case 1: rawParent.caseNexts[branchSeq] = branchNexts[0]; break
          default: console.warn('Only keep one branch node, remove unneeded nodes first', node)
        }
      }
    }

    onChange?.(newTrigger)
    endEdit?.()
  }

  return {
    onDeleteNode,
  }
}

export default usePipelineNodeDel
