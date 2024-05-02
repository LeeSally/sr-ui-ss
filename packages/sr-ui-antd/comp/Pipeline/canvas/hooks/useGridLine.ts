import { useState, useEffect } from 'react'
import { RUN_STATUS_STYLE } from '../../node/BaseNode/consts'

import { PIPELINE_NODE } from '../../node/consts'
import type { PipelineNodeWithNext, FlowLine, PipelineNodeWithPos } from '../../types'
import { RunStatus } from '../../types/nodeWithRun'

import { traverseTriggerNode } from '../funcs'

interface UseGridLineProps {
  grid: PipelineNodeWithPos.All[][]
  flowLines: FlowLine.Matrix
  wrappedTrigger?: PipelineNodeWithPos.Trigger
}

const useGridLine = (trigger?: PipelineNodeWithNext.Trigger): UseGridLineProps => {
  const [grid, setGrid] = useState<PipelineNodeWithPos.All[][]>([[]])
  const [wrappedTrigger, setWrappedTrigger] = useState<PipelineNodeWithPos.Trigger>()
  const [flowLines, setFlowLines] = useState<FlowLine.Matrix>([[[]]])

  useEffect(() => {
    if (trigger === undefined) return
    const wrappedNode = traverseTriggerNode(trigger, [0, 0], [0])
    setWrappedTrigger(wrappedNode)
  }, [trigger])

  useEffect(() => {
    if (wrappedTrigger === undefined) return
    const matrix: PipelineNodeWithPos.All[][] = [[]]
    drawNodeToGrid(wrappedTrigger, matrix)
    setGrid(matrix)
  }, [wrappedTrigger])

  /**
   * Put pipeline node into grid
   * @param {PipelineNodeWithPos.Nexts | PipelineNodeWithPos.Trigger} node     the pipeline node to be added
   * @param {PipelineNodeWithPos.All[][]} matrix                  the matrix of grid cells
   * @returns
   */
  const drawNodeToGrid = (
    node?: PipelineNodeWithPos.All,
    matrix?: PipelineNodeWithPos.All[][]
  ): void => {
    if (node === undefined || matrix === undefined) return

    // put current node into grid
    const [startX, startY] = node?.gridPos.start
    if (matrix[startX] === undefined) {
      matrix[startX] = []
    }
    matrix[startX][startY] = node

    // next node
    switch (node.nodeType) {
      case PIPELINE_NODE.Type.IF:
        drawNodeToGrid(node?.trueNext, matrix)
        drawNodeToGrid(node?.falseNext, matrix)
        break
      case PIPELINE_NODE.Type.SWITCH:
        node.caseNexts.map((caseNext, index) => {
          drawNodeToGrid(caseNext, matrix)
          return index
        })
        break
      case PIPELINE_NODE.Type.TASK:
      case PIPELINE_NODE.Type.TRIGGER:
        drawNodeToGrid(node?.next, matrix)
        break
    }
  }

  /**
   * Add end point to start point
   * @param {FlowLineMatrix} lines         the collection of connection lines
   * @param {[number, number]} startPt     the coordination ([x, y]) of start point
   * @param {[number, number]} endPt       the coordination ([x, y]) of end point
   * @param {Omit<FlowLineProps, 'pos'>} other    other affilicate elements of the connection line between start point and end point
   * @returns
   */
  const addEndPt = (
    lines: FlowLine.Matrix,
    startPt: [number, number],
    endPt?: [number, number],
    other?: Omit<FlowLine.Item, 'pos'>
  ): void => {
    if (endPt === undefined) return
    const [startX, startY] = startPt
    if (lines[startX][startY].findIndex(pt => pt.pos[0] === endPt[0] && pt.pos[1] === endPt[1]) === -1) {
      lines[startX][startY].push({ pos: endPt, ...other })
    }
  }

  /**
   * Update flow connection lines between pipeline nodes
   * @param {PipelineNodeWithPos.All} node
   * @returns 
   */
  const updateFlowLine = (node?: PipelineNodeWithPos.All): void => {
    if (node === undefined) return
    setFlowLines(prev => {
      // current => next
      const [currentX, currentY] = node?.gridPos.start
      if (prev[currentX] === undefined || currentY === 0) {
        // prev[currentX] === undefined: assign new array
        // currenY === 0:  clear when create node is the first element
        prev[currentX] = []
      }
      prev[currentX][currentY] = []

      switch (node.nodeType) {
        case PIPELINE_NODE.Type.IF:
          // true 
          const lineStyleTrue = node.trueNext?.run?.status !== undefined
            ? {
              color: RUN_STATUS_STYLE[node.trueNext?.run?.status].color,
              solid: node.trueNext?.run?.status !== RunStatus.NOT_START
            }
            : undefined

          addEndPt(
            prev,
            [currentX, currentY],
            node.trueNext?.gridPos.start,
            {
              tag: { text: 'True', color: 'green' },
              lineStyle: lineStyleTrue
            }
          )

          // false 
          const lineStyleFalse = node.falseNext?.run?.status !== undefined
            ? {
              color: RUN_STATUS_STYLE[node.falseNext?.run?.status].color,
              solid: node.falseNext?.run?.status !== RunStatus.NOT_START
            }
            : undefined
          addEndPt(
            prev,
            [currentX, currentY],
            node.falseNext?.gridPos.start,
            {
              tag: { text: 'False', color: 'red' },
              lineStyle: lineStyleFalse
            }
          )
          break
        case PIPELINE_NODE.Type.SWITCH:
          node.caseGroups?.map((caseKeys, index) => {
            const caseNext = node.caseNexts[index]
            const caseKeysStr = caseKeys.join(', ')

            const lineStyle = caseNext?.run?.status !== undefined
              ? {
                color: RUN_STATUS_STYLE[caseNext?.run?.status].color,
                solid: caseNext?.run?.status !== RunStatus.NOT_START
              }
              : undefined

            addEndPt(
              prev,
              [currentX, currentY],
              caseNext?.gridPos.start,
              { tag: { text: caseKeysStr }, lineStyle }
            )
            return caseNext?.gridPos.start
          })
          break
        case PIPELINE_NODE.Type.TASK:
        case PIPELINE_NODE.Type.TRIGGER:
          const lineStyle = node.next?.run?.status !== undefined
            ? {
              color: RUN_STATUS_STYLE[node.next?.run?.status].color,
              solid: node.next?.run?.status !== RunStatus.NOT_START
            }
            : undefined

          addEndPt(
            prev,
            [currentX, currentY],
            node.next?.gridPos.start,
            { lineStyle }
          )
          break
      }
      return [...prev]
    })
  }

  useEffect(() => {
    grid.map((stage, xIndex) => {
      stage.map((cell, yIndex) => {
        updateFlowLine(cell)
        return yIndex
      })
      return xIndex
    })
  }, [grid])

  return { wrappedTrigger, grid, flowLines }
}

export default useGridLine
