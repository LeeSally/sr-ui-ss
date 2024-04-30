import React, { useContext, useMemo } from 'react'

import { Space } from 'antd'
import { useMemoizedFn } from 'ahooks'

import { QueryConditionSelector } from '../../../QueryConditionEditor'

import { PipelineContext } from '../../context'
import type { PipelineNodeWithNext, PipelineNodeWithPos, IWithEditor } from '../../types'
import { PIPELINE_NODE } from '../consts'

import { stringfyCondition } from '../funcs'
import { useNodeTypeInfo } from '../hooks'

import PipelineBaseNode from '../BaseNode'
import PipelineNextNodeBtn from '../NewNextBtn'

interface PipeilneIfNodeCompProps extends IWithEditor {
  node: PipelineNodeWithPos.If
  onChange?: (value?: PipelineNodeWithNext.If) => void
}

const PipelineIfNode: React.FC<PipeilneIfNodeCompProps> = (props) => {
  const {
    node,
    editable = false, editing = false, changed, onEdit, saveEditing, cancelEditing, onDel
  } = props

  const { readableFields } = useContext(PipelineContext)
  const { nodeTypeDef, nodeTypeStyle } = useNodeTypeInfo(PIPELINE_NODE.Type.IF)

  const onEditNode = useMemoizedFn((): void => {
    onEdit?.(node)
  })

  const onDelNode = useMemoizedFn((): void => {
    onDel?.(node)
  })

  const abstractDesc = useMemo(() => {
    return node.judgeCondition === undefined ? '<Blank>' : stringfyCondition(node.judgeCondition)
  }, [node.judgeCondition])

  return (
    <PipelineBaseNode
      label={nodeTypeDef?.nodeName ?? 'If'} {...nodeTypeStyle}
      desc={node.desc} abstract={abstractDesc}
      editable={editable} editing={editing} startEdit={onEditNode} endEdit={cancelEditing}
      changed={changed}
      onSave={saveEditing} onDel={onDelNode}
    >
      <QueryConditionSelector
        fieldList={readableFields ?? []}
        value={node.judgeCondition}
        nested operatorOptionFixed
        layout={'vertical'} size={'small'} defaultExpanded expandable
      />
      <Space direction={'vertical'}>
        <PipelineNextNodeBtn title={'True'} curNode={node.trueNext} />
        <PipelineNextNodeBtn title={'False'} curNode={node.falseNext} />
      </Space>
    </PipelineBaseNode>
  )
}

export default PipelineIfNode
