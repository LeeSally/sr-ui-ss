import React, { useMemo, useContext } from 'react'

import { useMemoizedFn } from 'ahooks'

import { QueryConditionItemListEditor } from '../../../QueryConditionEditor'
import type { ConditionItemProps } from '../../../QueryConditionEditor/types'
import { RELATIONAL_OPERATORS } from '../../../QueryConditionEditor/types'

import { PipelineContext } from '../../context'
import type { PipelineNodeWithPos, IWithEditor } from '../../types'

import { PIPELINE_NODE } from '../consts'

import PipelineBaseNode from '../BaseNode'
import { useNodeTypeInfo } from '../hooks'

interface PipelineUpdateTaskNodeCompProps extends IWithEditor {
  node: PipelineNodeWithPos.TaskUpdate
}

const PipelineUpdateTaskNode: React.FC<PipelineUpdateTaskNodeCompProps> = (props) => {
  const { node, editable = false, editing, changed, cancelEditing, onEdit, onDel } = props

  const { writableFields } = useContext(PipelineContext)
  const rawFieldList = useMemo(() => {
    return node.fields?.map(field => ({
      type: 'item',
      field,
      value: field.defaultValue,
      operator: RELATIONAL_OPERATORS.EQUAL_TO
    })) as ConditionItemProps[]
  }, [writableFields, node.fields])

  const { nodeTypeStyle, taskDef } = useNodeTypeInfo(PIPELINE_NODE.Type.TASK, node.taskKey)

  const onEditNode = useMemoizedFn((): void => {
    onEdit?.(node)
  })

  const onDelNode = useMemoizedFn((): void => {
    onDel?.(node)
  })

  const abstractDesc = useMemo(() => {
    return node.fields?.map(field => `[${field.name ?? field.id}]`).join(', ') ?? '<Blank>'
  }, [node.fields])

  return (
    <PipelineBaseNode
      label={taskDef?.taskName ?? 'Update Fields Task'} 
      {...nodeTypeStyle}
      abstract={abstractDesc} desc={node.desc}
      editable={editable} editing={editing} changed={changed} startEdit={onEditNode} endEdit={cancelEditing}
      onDel={onDelNode}
    >
      <QueryConditionItemListEditor
        fieldList={writableFields}
        value={node.fields}
        size={'small'}
      />
    </PipelineBaseNode>
  )
}

export default PipelineUpdateTaskNode
