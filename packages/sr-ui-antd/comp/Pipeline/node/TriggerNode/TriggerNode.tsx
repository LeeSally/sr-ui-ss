import React, { useContext, useMemo } from 'react'

import { useMemoizedFn } from 'ahooks'

import { QueryConditionSelector } from '../../../QueryConditionEditor'

import { PipelineContext, type PipelineContextProps } from '../../context'
import type { PipelineNodeWithPos, IWithEditor } from '../../types'
import { PIPELINE_NODE } from '../consts'

import { stringfyCondition } from '../funcs'
import { useNodeTypeInfo } from '../hooks'

import PipelineBaseNode from '../BaseNode'

interface PipelinTriggerNodeCompProps extends IWithEditor {
  node: PipelineNodeWithPos.Trigger
}

const PipelineTriggerNode: React.FC<PipelinTriggerNodeCompProps> = (props) => {
  const { 
    node, 
    editable = false, editing = false, changed, onEdit, cancelEditing 
  } = props

  const { readableFields } = useContext<PipelineContextProps>(PipelineContext)

  const { nodeTypeDef, nodeTypeStyle } = useNodeTypeInfo(PIPELINE_NODE.Type.TRIGGER)

  const onEditNode = useMemoizedFn((): void => {
    onEdit?.(node)
  })

  const abstractDesc = useMemo(() => {
    return node.condition === undefined
      ? '<Blank>'
      : stringfyCondition(node.condition)
  }, [])

  return (
    <PipelineBaseNode
      label={nodeTypeDef?.nodeName ?? 'Trigger'} {...nodeTypeStyle}
      abstract={abstractDesc} desc={node.desc}
      editable={editable} editing={editing} startEdit={onEditNode} endEdit={cancelEditing}
      changed={changed}
    >
      <QueryConditionSelector 
        fieldList={readableFields ?? []}
        value={node.condition} nested operatorOptionFixed
        layout={'vertical'} size={'small'} defaultExpanded
      />
    </PipelineBaseNode>
  )
}

export default PipelineTriggerNode
