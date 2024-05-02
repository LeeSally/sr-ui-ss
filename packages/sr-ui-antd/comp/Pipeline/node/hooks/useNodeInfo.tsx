import React, { useContext, useMemo } from 'react'

import { CarryOutOutlined } from '@ant-design/icons'

import { PipelineContext } from '../../context'
import type { PipelineNodeDef, PipelineNodeWithNext, IWithStyle } from '../../types'

import { PIPELINE_NODE } from '../consts'

interface UsePipelineNodeTypeInfoProps {
  nodeTypeDef?: PipelineNodeDef.All
  nodeTypeStyle?: IWithStyle
  taskDef?: PipelineNodeWithNext.Tasks
}

const useNodeTypeInfo = (
  nodeType?: PIPELINE_NODE.Type,
  taskKey?: string,
): UsePipelineNodeTypeInfoProps => {
  const { customTaskDefs } = useContext(PipelineContext)

  const nodeTypeDef = useMemo(() => (
    nodeType !== undefined
      ? PIPELINE_NODE.DEFS[nodeType]
      : undefined
  ), [nodeType])

  const nodeTypeStyle = useMemo(() => {
    if (nodeType === PIPELINE_NODE.Type.TASK) {
      const presetTaskKey = taskKey as PIPELINE_NODE.PresetTaskKey
      if (Object.values(PIPELINE_NODE.PresetTaskKey).includes(presetTaskKey)) {
        // preset task
        return PIPELINE_NODE.PRESET_TASK_STYLES[presetTaskKey]
      }

      const custom = customTaskDefs?.find(def => def.taskKey === taskKey)
      if (custom?.color !== undefined) {
        return {
          color: custom?.color,
          icon: <CarryOutOutlined />
        }
      }
    }

    const defaultStyle: IWithStyle = {
      color: 'success',
      icon: <CarryOutOutlined />
    }

    return nodeType === undefined ? defaultStyle : PIPELINE_NODE.STYLES[nodeType]
  }, [nodeType, taskKey, customTaskDefs])

  const taskDef = useMemo(() => {
    if (nodeType !== PIPELINE_NODE.Type.TASK) return
    const custom = customTaskDefs?.find(def => def.taskKey === taskKey)
    if (custom !== undefined) return custom

    const presetTaskKey = taskKey as PIPELINE_NODE.PresetTaskKey
    if (Object.values(PIPELINE_NODE.PresetTaskKey).includes(presetTaskKey)) {
      return PIPELINE_NODE.PRESET_TASK_DEFS[presetTaskKey]
    }
    return { nodeType, taskKey }
  }, [nodeType, taskKey])

  return {
    nodeTypeDef,
    nodeTypeStyle,
    taskDef
  }
}

export default useNodeTypeInfo
