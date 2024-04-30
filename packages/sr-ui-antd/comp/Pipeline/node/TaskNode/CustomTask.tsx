import React, { useMemo } from 'react'

import { useMemoizedFn } from 'ahooks'

import { PIPELINE_NODE } from '../consts'
import type { PipelineNodeWithPos, IWithEditor } from '../../types'

import { useNodeTypeInfo } from '../hooks'
import PipelineBaseNode from '../BaseNode'

interface PipelineCustomTaskNodeComp extends IWithEditor {
  node: PipelineNodeWithPos.TaskCustom<any>
}

const PipelineCustomTaskNode: React.FC<PipelineCustomTaskNodeComp> = (props) => {
  const {
    node,
    editable = false, editing = false, changed, onEdit, cancelEditing, onDel
  } = props

  const { nodeTypeDef, nodeTypeStyle, taskDef } = useNodeTypeInfo(PIPELINE_NODE.Type.TASK, node.taskKey)

  const onEditNode = useMemoizedFn((): void => {
    onEdit?.(node)
  })

  const onDelNode = useMemoizedFn((): void => {
    onDel?.(node)
  })

  const abstractDesc = useMemo(() => {
    return node.params?.map(para => `[${para.name}]`).join(', ') ?? node.desc ?? '<Blank>'
  }, [node.params, node.desc])

  return (
    <PipelineBaseNode
      label={
        nodeTypeDef?.nodeType === PIPELINE_NODE.Type.TASK
          ? taskDef?.taskName ?? taskDef?.taskKey ?? 'Task'
          : nodeTypeDef?.nodeName
      }
      {...nodeTypeStyle}
      abstract={abstractDesc} desc={node.desc}
      editable={editable} editing={editing} startEdit={onEditNode} endEdit={cancelEditing}
      onDel={onDelNode} changed={changed}
    >
    </PipelineBaseNode>
  )
}

export default PipelineCustomTaskNode
