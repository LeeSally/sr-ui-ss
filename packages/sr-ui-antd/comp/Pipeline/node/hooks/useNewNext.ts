import { useContext, useState } from 'react'

import type { MenuProps } from 'antd'
import { useMemoizedFn } from 'ahooks'

import { PipelineContext } from '../../context'

import { PIPELINE_NODE } from '../consts'

interface NewNextNode {
  nextKey: boolean | string | number
  nodeType?: PIPELINE_NODE.Type
  taskKey?: string
}

interface UseNewNextNode {
  nextNodeItems: MenuProps['items']
  newingNexts?: NewNextNode[]

  onNewingNextKey: (key: string | boolean | number) => () => void
  endNewing: () => void
}

const useNewNextNode = (): UseNewNextNode => {
  const [activeNextKey, setActiveNextKey] = useState<string | boolean | number>()
  const [newingNexts, setNewingNexts] = useState<NewNextNode[] | undefined>()

  const { customTaskDefs } = useContext(PipelineContext)

  /**
   * Set newing next node key:
   * @param {string | number | boolean} nextKey 
   * @returns 
   */
  const onNewingNextKey = useMemoizedFn((nextKey: string | boolean | number) => (): void => {
    setActiveNextKey(nextKey)
    setNewingNexts(prev => {
      if (prev === undefined) prev = []
      const target = prev.find(item => item.nextKey === nextKey)
      if (target === undefined) {
        prev.push({
          nextKey
        })
      } else {
        target.nextKey = nextKey
      }
      return [...prev]
    })
  })

  /**
   * Set newing next node type
   * @param {PIPELINE_NODE.Type} nodeType 
   * @param {string} taskKey 
   * @returns 
   */
  const onNewingNextNode = useMemoizedFn((
    nodeType: PIPELINE_NODE.Type,
    taskKey?: string
  ) => (e: any) => {
    if (activeNextKey === undefined) return
    setNewingNexts(prev => {
      if (prev === undefined) prev = []
      const target = prev.find(item => item.nextKey === activeNextKey)
      if (target === undefined) {
        prev.push({
          nextKey: activeNextKey,
          nodeType,
          taskKey
        })
      } else {
        target.nodeType = nodeType
        target.taskKey = taskKey
      }
      return [...prev]
    })
  })

  const nextNodeItems: MenuProps['items'] = [
    ...Object.values(PIPELINE_NODE.Type).map(nodeKey => {
      const nodeType = nodeKey as PIPELINE_NODE.Type
      return (
        {
          key: nodeType,
          label: PIPELINE_NODE.DEFS[nodeType].nodeName,
          icon: PIPELINE_NODE.STYLES[nodeType].icon,
          onClick: onNewingNextNode(nodeType)
        }
      )
    }).filter(item => ![PIPELINE_NODE.Type.TASK, PIPELINE_NODE.Type.TRIGGER].includes(item.key)),
    {
      type: 'divider'
    },
    {
      key: 'preset-task',
      label: 'Preset Task',
      icon: PIPELINE_NODE.STYLES[PIPELINE_NODE.Type.TASK]?.icon,
      children: [
        ...Object.values(PIPELINE_NODE.PresetTaskKey).map(taskKey => {
          const nodeTaskType = taskKey as PIPELINE_NODE.PresetTaskKey
          const nodeDef = PIPELINE_NODE.PRESET_TASK_DEFS[taskKey]
          return (
            {
              key: `${nodeDef.nodeType ?? PIPELINE_NODE.Type.TASK}-${nodeTaskType}`,
              label: nodeDef.taskName,
              icon: PIPELINE_NODE.PRESET_TASK_STYLES[nodeTaskType].icon,
              onClick: onNewingNextNode(PIPELINE_NODE.Type.TASK, nodeTaskType)
            }
          )
        })
      ]
    },
    {
      key: 'custom-task',
      label: 'Custom Task',
      icon: PIPELINE_NODE.STYLES[PIPELINE_NODE.Type.TASK]?.icon,
      children: [
        ...(customTaskDefs ?? []).map(task => (
          {
            key: `${PIPELINE_NODE.Type.TASK}-${task.taskKey}`,
            label: task.taskName,
            onClick: onNewingNextNode(PIPELINE_NODE.Type.TASK, task.taskKey)
          }
        )
        )
      ]
    }
  ]

  const endNewing = useMemoizedFn((): void => {
    setNewingNexts(undefined)
  })

  return {
    nextNodeItems,
    newingNexts,
    onNewingNextKey,
    endNewing
  }
}

export default useNewNextNode
