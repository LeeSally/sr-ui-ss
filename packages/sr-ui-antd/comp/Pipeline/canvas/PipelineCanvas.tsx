import React, { useState, useEffect, useRef, useMemo, useContext } from 'react'

import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useMemoizedFn } from 'ahooks'

import { PipelineContext } from '../context'
import type {
  PipelineNodeWithNext,
  PipelineNodeWithRun,
  PipelineNodeWithPos,
  DOMPosSize, IWithEditor
} from '../types'

import { PIPELINE_NODE } from '../node/consts'

import { useGridLine } from './hooks'
import type { UsePipelineEditorProps } from '../editor/hooks/useEditor'

import {
  TriggerNode, IfNode, SwitchNode, CustomTaskNode, MCHTaskNode, UpdateTaskNode
} from '../node'
import SvgLayer from './SvgLayer'
import PlaceHolderCell from './PlaceHolderCell'

import { clsPrefix } from '../vars'
import './style.less'

interface PipelineCanvasProps {
  trigger?: PipelineNodeWithNext.Trigger | PipelineNodeWithRun.Trigger
  editor?: UsePipelineEditorProps

  layout?: 'flex' | 'table'
  loading?: boolean
}

const PipelineCanvas: React.FC<PipelineCanvasProps> = (props) => {
  const {
    trigger, editor, layout = 'flex', loading = false
  } = props

  const {
    onAddingNode, onAddingParent,
    onEditNode, isEditing, saveEditing, cancelEditing, editingTrigger,
    changed,
    onDeleteNode
  } = editor ?? {}

  const [cellsSize, setCellsSize] = useState<DOMPosSize[][]>([[]])
  const { wrappedTrigger, grid, flowLines } = useGridLine(editingTrigger ?? trigger)

  const refGridBox = useRef<HTMLDivElement>(null)
  const refCellsObserver = useRef<ResizeObserver[][]>([])

  const containerSize: [number, number] = useMemo(() => {
    return [refGridBox.current?.scrollWidth ?? 0, refGridBox.current?.scrollHeight ?? 0]
  }, [refGridBox.current, cellsSize])

  const { customTaskDefs } = useContext(PipelineContext)

  const dummyMatrix: null[][] = useMemo(() => {
    const width = wrappedTrigger?.gridPos.end[0] ?? 0
    const height = wrappedTrigger?.gridPos.end[1] ?? 0

    return Array(width + 1).fill(null).map(item => Array(height + 1).fill(null))
  }, [wrappedTrigger])

  /**
   * Add resize observer to each cell in grid box
   * @param {number} xIndex    x index of cell
   * @param {number} yIndex    y index of cell
   * @returns 
   */
  const onRefCell = (xIndex: number, yIndex: number) => (ele: HTMLDivElement | null): void => {
    if (ele === null) return

    const cellsObserver = refCellsObserver.current

    if (cellsObserver.length === grid.length) {
      if (cellsObserver[xIndex]?.[yIndex] !== undefined) return
    }

    if (cellsObserver[xIndex] === undefined) {
      cellsObserver[xIndex] = []
    }

    // 1) flex layout
    const resizeObserverFlex = new ResizeObserver(() => {
      setCellsSize(prev => {
        if (prev[xIndex] === undefined) {
          prev[xIndex] = []
        }

        // 1) Height / top changed
        if (ele.offsetTop !== prev[xIndex][yIndex]?.top ||
          ele.offsetHeight !== prev[xIndex][yIndex]?.height) {
          const downsideBros = Array.prototype.slice.call(ele.parentNode?.children ?? []) as HTMLElement[]
          downsideBros.map((bro, index) => {
            if (index > yIndex) {
              prev[xIndex][index] = {
                top: bro.offsetTop,
                left: bro.offsetLeft,
                width: bro.offsetWidth,
                height: bro.offsetHeight
              }
            }
            return index
          })
        }

        // 2) Width / left changed
        if (ele.offsetLeft !== prev[xIndex][yIndex]?.left ||
          ele.offsetWidth !== prev[xIndex][yIndex]?.width
        ) {
          const stages = Array.prototype.slice.call(ele.parentNode?.parentNode?.children ?? []) as HTMLElement[]

          stages.map((stage, idx1) => {
            if (idx1 > xIndex) {
              const cells = Array.prototype.slice.call(stage.children) as HTMLElement[]

              cells.map((cell, idx2) => {
                if (prev[idx1]?.[idx2] !== undefined) {
                  prev[idx1][idx2] = {
                    top: cell.offsetTop,
                    left: cell.offsetLeft,
                    width: cell.offsetWidth,
                    height: cell.offsetHeight
                  }
                }

                return idx2
              })
            }

            return idx1
          })
        }

        prev[xIndex][yIndex] = {
          top: ele.offsetTop,
          left: ele.offsetLeft,
          width: ele.offsetWidth,
          height: ele.offsetHeight
        }
        return [...prev]
      })
    })

    // 2) table layout
    const resizeObserverTbl = new ResizeObserver(() => {
      setCellsSize(prev => {
        if (prev[xIndex] === undefined) {
          prev[xIndex] = []
        }

        const newSize = {
          top: ele.offsetTop,
          left: ele.offsetLeft,
          width: ele.offsetWidth,
          height: ele.offsetHeight
        }

        prev[xIndex][yIndex] = newSize

        prev.map((stages, cIndex) => {
          const accumLeft = prev.filter((item, index) => index < cIndex).reduce((prev, cur) => (prev + cur[0].width), 0)
          stages.map((cell, rIndex) => {
            if (cIndex === xIndex) {
              // same column (X axis): width / left
              cell.width = newSize.width
              cell.left = newSize.left
            } else if (cIndex > xIndex) {
              // cells on the rightside (X axis): left recalculation
              cell.left = accumLeft
            }

            const accumTop = prev[0].filter((item, index) => index < rIndex).reduce((prev, cur) => (prev + cur.height + cur.top), 0)
            if (rIndex === yIndex) {
              // same row (Y axis): height / top
              cell.height = newSize.height
              cell.top = newSize.top
            } else if (rIndex > yIndex) {
              // cells on the downside (Y axis): top recalculation
              cell.top = accumTop
            }
            return rIndex
          })
          return cIndex
        })
        return [...prev]
      })
    })

    // console.log('resize observer...', xIndex, yIndex, ele)
    switch (layout) {
      case 'flex':
        resizeObserverFlex.observe(ele)
        refCellsObserver.current[xIndex][yIndex] = resizeObserverFlex
        break
      case 'table':
        resizeObserverTbl.observe(ele)
        refCellsObserver.current[xIndex][yIndex] = resizeObserverTbl
        break
    }
  }

  useEffect(() => {
    if (refCellsObserver.current.length > grid.length) {
      refCellsObserver.current = refCellsObserver.current.slice(0, grid.length)
    }
    refCellsObserver.current.map((cells, index) => {
      if (cells.length > grid[index].length) {
        refCellsObserver.current[index] = refCellsObserver.current[index].slice(0, grid[index].length)
      }
    })
  }, [grid, refCellsObserver.current])

  const nextNodeItems: MenuProps['items'] = [
    ...Object.values(PIPELINE_NODE.Type).map(nodeKey => {
      const nodeType = nodeKey as PIPELINE_NODE.Type
      return ({
        key: nodeKey,
        label: PIPELINE_NODE.DEFS[nodeType]?.nodeName,
        icon: PIPELINE_NODE.STYLES[nodeType].icon,
        onClick: onAddingNode?.(nodeType),
      })
    }).filter(item => item.key !== PIPELINE_NODE.Type.TASK && item.key !== PIPELINE_NODE.Type.TRIGGER),
    {
      type: 'divider'
    },
    // {
    //   key: 'preset-task',
    //   label: 'Preset Task',
    //   icon: PIPELINE_NODE.STYLES[PIPELINE_NODE.Type.TASK]?.icon,
    //   children: [
    //     ...Object.values(PIPELINE_NODE.PresetTaskKey).map(taskKey => (
    //       {
    //         key: `${PIPELINE_NODE.Type.TASK ?? 'task'}-${taskKey}`,
    //         label: PIPELINE_NODE.PRESET_TASK_DEFS[taskKey].taskName,
    //         icon: PIPELINE_NODE.PRESET_TASK_STYLES[taskKey].icon,
    //         onClick: onAddingNode?.(PIPELINE_NODE.Type.TASK, taskKey)
    //       }
    //     )
    //     )
    //   ]
    // },
    {
      key: 'task',
      label: 'Custom Task',
      icon: PIPELINE_NODE.STYLES[PIPELINE_NODE.Type.TASK]?.icon,
      children: [
        ...(customTaskDefs ?? []).map(task => (
          {
            key: `${PIPELINE_NODE.Type.TASK}-${String(task.taskKey)}`,
            label: task.taskName,
            onClick: onAddingNode?.(PIPELINE_NODE.Type.TASK, task.taskKey)
          }
        ))
      ]
    }
  ]

  const renderNode = (node: PipelineNodeWithPos.All): React.ReactElement | undefined => {
    let comp
    const editProps: IWithEditor = {
      editable: editor !== undefined,
      editing: isEditing?.(node),
      changed,
      onEdit: onEditNode,
      onDel: onDeleteNode,
      saveEditing,
      cancelEditing
    }

    switch (node?.nodeType) {
      case PIPELINE_NODE.Type.TRIGGER:
        comp = <TriggerNode node={node} {...editProps} />
        break
      case PIPELINE_NODE.Type.IF:
        comp = <IfNode node={node} {...editProps} />
        break
      case PIPELINE_NODE.Type.SWITCH:
        comp = <SwitchNode node={node} {...editProps} />
        break
      case PIPELINE_NODE.Type.TASK:
        switch (node.taskKey) {
          case PIPELINE_NODE.PresetTaskKey.BROWSE_MCH:
            comp = <MCHTaskNode node={node as PipelineNodeWithPos.TaskMCH} {...editProps} />
            break
          case PIPELINE_NODE.PresetTaskKey.UPDATE_FIELDS:
            comp = <UpdateTaskNode node={node as PipelineNodeWithPos.TaskUpdate} {...editProps} />
            break
          default:
            comp = <CustomTaskNode node={node} {...editProps} />
            break
        }
        break
      default:
        break
    }

    return comp
  }

  return (
    <div className={`${clsPrefix}-canvas`}>
      {loading ? 'loading...' : null}
      {
        layout === 'flex'
          ? <div className={`${clsPrefix}-canvas-flex-box`} ref={refGridBox}>
            {
              grid.map((stage, xIndex) => (
                <div className={`${clsPrefix}-canvas-flex-box-stage`} key={xIndex}>
                  {
                    Array.from(stage).map((node, yIndex) => {
                      const comp = renderNode(node)
                      if (comp !== undefined) {
                        return (
                          <div className={`${clsPrefix}-canvas-flex-box-stage-cell`} key={yIndex} ref={onRefCell(xIndex, yIndex)}>
                            {comp}
                            {
                              editor === undefined || (node.nodeType === PIPELINE_NODE.Type.IF || node.nodeType === PIPELINE_NODE.Type.SWITCH)
                                ? null
                                : <Dropdown menu={{ items: nextNodeItems }}
                                  placement={'bottomLeft'} arrow trigger={['click']}
                                  onOpenChange={onAddingParent?.(node)}
                                >
                                  <a className={`${clsPrefix}-canvas-flex-box-stage-cell-add-btn`}>
                                    <PlusOutlined />
                                  </a>
                                </Dropdown>

                            }
                          </div>
                        )
                      } else {
                        return (
                          <div className={`${clsPrefix}-canvas-flex-box-stage-cell`} key={yIndex}>
                            <PlaceHolderCell xIndex={xIndex} yIndex={yIndex} />
                          </div>
                        )
                      }
                    })
                  }
                </div>
              ))
            }
          </div>
          : layout === 'table'
            ? <div ref={refGridBox}>
              <table className={`${clsPrefix}-canvas-table-box`}>
                <tbody>
                  {
                    dummyMatrix.map((row, yIndex) => (
                      <tr key={yIndex}>
                        {
                          row.map((col, xIndex) => {
                            const node = grid[xIndex]?.[yIndex]
                            const comp = renderNode(node)

                            return (
                              <td className={`${clsPrefix}-canvas-table-box-cell`} key={xIndex}
                                ref={xIndex === 0 || yIndex === 0 ? onRefCell(xIndex, yIndex) : undefined}
                              >
                                {
                                  comp !== undefined
                                    ? <>
                                      {comp}
                                      {
                                        editor === undefined || (node.nodeType === PIPELINE_NODE.Type.IF || node.nodeType === PIPELINE_NODE.Type.SWITCH)
                                          ? null
                                          : <Dropdown menu={{ items: nextNodeItems }}
                                            placement={'bottomLeft'} arrow trigger={['click']}
                                            onOpenChange={onAddingParent?.(node)}
                                          >
                                            <a className={`${clsPrefix}-canvas-table-box-cell-add-btn`}>
                                              <PlusOutlined />
                                            </a>
                                          </Dropdown>
                                      }
                                    </>
                                    : null
                                }
                              </td>
                            )
                          })
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            : null
      }
      <SvgLayer
        flowLines={flowLines}
        cellsSize={cellsSize}
        containerSize={containerSize}
      />
    </div>
  )
}

PipelineCanvas.displayName = 'PipelineCanvas'
export default React.memo(PipelineCanvas)
