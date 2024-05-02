import { isEquals } from 'sr-ui-utils'

import type { PipelineNodeWithNext, PipelineNodeWithPos } from '../types'

import { PIPELINE_NODE } from '../node/consts'

/**
 * Traverse Pipeline If node
 * @param {PipelineNodeWithNext.If} ifNode
 * @param {[number, number]} start         coordinate of this node's start position
 * @param idx
 * @returns
 */
const traverseIfNode = (
  ifNode: PipelineNodeWithNext.If,
  start: [number, number],
  idx: number[]
): PipelineNodeWithPos.If => {
  const trueNode = ifNode.trueNext === undefined
    ? undefined
    : traverseNode(ifNode.trueNext, [start[0] + 1, start[1]], [...idx, 0])
  const falseNode = ifNode.falseNext === undefined
    ? undefined
    : traverseNode(ifNode.falseNext, [start[0] + 1, (trueNode?.gridPos.end[1] ?? start[1]) + 1], [...idx, 1])

  return ({
    ...ifNode,
    gridPos: {
      chainIdx: idx,
      start,
      end: [
        Math.max(trueNode?.gridPos.end[0] ?? start[0], falseNode?.gridPos.end[0] ?? start[0]),
        Math.max(trueNode?.gridPos.end[1] ?? start[1], falseNode?.gridPos.end[1] ?? start[1]),
      ]
    },
    trueNext: trueNode,
    falseNext: falseNode
  })
}

/**
 * Traverse Pipeline Switch Node
 * @param {PipelineNodeWithNext.Switch} node
 * @param {[number, number]} start        coordinate of this node's start position
 * @param {number[]} idx
 * @returns
 */
const traverseSwitchNode = (
  node: PipelineNodeWithNext.Switch,
  start: [number, number],
  idx: number[]
): PipelineNodeWithPos.Switch | undefined => {
  const caseNexts: PipelineNodeWithPos.Nexts[] = []
  let prevPos = [start[0], start[1] - 1]
  const maxEnd: [number, number] = [start[0], start[1]]

  node.caseGroups?.map((cases, index) => {
    const caseNext = node.caseNexts?.[index]
    if (caseNext === undefined) return undefined
    const caseNode = traverseNode(caseNext, [start[0] + 1, prevPos[1] + 1], [...idx, index])
    if (caseNode !== undefined) {
      caseNexts.push(caseNode)
    }

    if (caseNode?.gridPos.end !== undefined) {
      if (caseNode.gridPos.end?.[0] > maxEnd[0]) {
        maxEnd[0] = caseNode?.gridPos.end?.[0]
      }
      if (caseNode.gridPos.end?.[1] > maxEnd[1]) {
        maxEnd[1] = caseNode?.gridPos.end?.[1]
      }
    }
    prevPos = [start[0] + 1, prevPos[1] + 1]
    return index
  })
  return ({
    ...node,
    gridPos: {
      chainIdx: idx,
      start,
      end: maxEnd
    },
    caseNexts
  })
}

/**
 * Traverse Pipeline Task node
 * @param {PipelineNodeWithNext.Tasks} node
 * @param {[number, number]} start
 * @param {number[]} idx
 * @returns
 */
const traverseTaskNode = (
  node: PipelineNodeWithNext.Tasks,
  start: [number, number],
  idx: number[]
): PipelineNodeWithPos.Tasks => {
  const nextWithPos = node.next === undefined
    ? undefined
    : traverseNode(node.next, [start[0] + 1, start[1]], [...idx, 0])

  return {
    ...node,
    next: nextWithPos,
    gridPos: {
      start,
      end: nextWithPos?.gridPos.end ?? nextWithPos?.gridPos.start ?? start,
      chainIdx: idx
    }
  }
}

/**
 * Traverse Pipeline Trigger Node
 * @param {PipelineNodeWithNext.Trigger} node
 * @param {[number, number]} start
 * @param {number[]} idx
 * @returns 
 */
export const traverseTriggerNode = (
  node: PipelineNodeWithNext.Trigger,
  start: [number, number],
  idx: number[]
): PipelineNodeWithPos.Trigger | undefined => {
  if (node.next === undefined) return undefined
  const nextWithPos = traverseNode(node.next, [start[0] + 1, start[1]], [...idx, 0])
  return {
    ...node,
    next: nextWithPos,
    gridPos: {
      start,
      end: nextWithPos?.gridPos.end ?? nextWithPos?.gridPos.start ?? start,
      chainIdx: idx
    }
  }
}

const traverseNode = (
  node: PipelineNodeWithNext.Nexts,
  start: [number, number],
  idx: number[]
): PipelineNodeWithPos.Nexts | undefined => {
  switch (node.nodeType) {
    case PIPELINE_NODE.Type.IF:
      return traverseIfNode(node, start, idx)
    case PIPELINE_NODE.Type.SWITCH:
      return traverseSwitchNode(node, start, idx)
    case PIPELINE_NODE.Type.TASK:
      return traverseTaskNode(node, start, idx)
  }
}

/**
 * Find target node according to chain index
 * @param {number[]} targetIndex    chain index of target node
 * @param {PipelineNodeWithPos.All} curNode     current node to be searched
 * @returns
 */
export const findNode = (
  targetIndex: number[],
  curNode: PipelineNodeWithPos.All
): PipelineNodeWithPos.All | undefined => {
  const curNodeIdx = curNode.gridPos.chainIdx
  if (isEquals(targetIndex, curNodeIdx)) {
    return curNode
  }

  if (curNodeIdx.length < targetIndex.length) {
    const diffLen = curNodeIdx.filter((num, index) => targetIndex[index] !== num).length
    if (diffLen > 0) return

    let found
    switch (curNode.nodeType) {
      case PIPELINE_NODE.Type.IF:
        if (curNode.trueNext !== undefined) {
          found = findNode(targetIndex, curNode.trueNext)
        }

        if (found === undefined && curNode.falseNext !== undefined) {
          found = findNode(targetIndex, curNode.falseNext)
        }
        break
      case PIPELINE_NODE.Type.SWITCH:
        for (let i = 0; i < (curNode.caseNexts.length ?? 0); i++) {
          const caseNext = curNode.caseNexts?.[i]
          if (caseNext !== undefined) {
            found = findNode(targetIndex, caseNext)
          }
          if (found !== undefined) {
            break
          }
        }
        break
      case PIPELINE_NODE.Type.TASK:
      case PIPELINE_NODE.Type.TRIGGER:
        if (curNode.next !== undefined) {
          found = findNode(targetIndex, curNode.next)
        }
        break
      default:
        break
    }

    return found
  }
}

export const findRawNode = (
  targetIndex: number[],
  curNode: PipelineNodeWithNext.All,
  curNodeIndex: number[]
): PipelineNodeWithNext.All | undefined => {
  if (isEquals(targetIndex, curNodeIndex)) {
    return curNode
  }

  if (curNodeIndex.length < targetIndex.length) {
    const diffLen = curNodeIndex.filter((num, index) => targetIndex[index] !== num).length
    if (diffLen > 0) return
    let found
    switch (curNode.nodeType) {
      case PIPELINE_NODE.Type.IF:
        if (curNode.trueNext !== undefined) {
          found = findRawNode(targetIndex, curNode.trueNext, [...curNodeIndex, 0])
        }

        if (found === undefined && curNode.falseNext !== undefined) {
          found = findRawNode(targetIndex, curNode.falseNext, [...curNodeIndex, 1])
        }
        break
      case PIPELINE_NODE.Type.SWITCH:
        for (let i = 0; i < (curNode?.caseNexts?.length ?? 0); i++) {
          const caseNext = curNode?.caseNexts?.[i]
          if (caseNext !== undefined) {
            found = findRawNode(targetIndex, caseNext, [...curNodeIndex, i])
          }
          if (found !== undefined) {
            break
          }
        }
        break
      case PIPELINE_NODE.Type.TASK:
      case PIPELINE_NODE.Type.TRIGGER:
        if (curNode.next !== undefined) {
          found = findRawNode(targetIndex, curNode.next, [...curNodeIndex, 0])
        }
        break
      default:
        break
    }
    return found
  }
}
