import React, { useMemo } from 'react'

import { Descriptions, Tag, List } from 'antd'
import { useMemoizedFn } from 'ahooks'

import type { PipelineNodeWithPos, IWithEditor } from '../../types'
import { PIPELINE_NODE } from '../consts'
import { useNodeTypeInfo } from '../hooks'

import PipelineBaseNode from '../BaseNode'

interface PipelineMCHTaskNodeCompProps extends IWithEditor {
  node: PipelineNodeWithPos.TaskMCH
}

const PipelineMCHTaskNode: React.FC<PipelineMCHTaskNodeCompProps> = (props) => {
  const { 
    node, 
    editable = false, editing, changed = false, 
    onEdit, onDel, saveEditing, cancelEditing, 
  } = props

  const { nodeTypeStyle, taskDef } = useNodeTypeInfo(PIPELINE_NODE.Type.TASK, node.taskKey)

  const onEditNode = useMemoizedFn((): void => {
    onEdit?.(node)
  })

  const onDelNode = useMemoizedFn((): void => {
    onDel?.(node)
  })

  const abstractDesc = useMemo(() => {
    if (node.browseList === undefined || node.browseList.length === 0) return '<Blank>'
    return node.browseList.map(item => `[${item.transCode}]: ${item.fields.map(field => field.name).join(', ')}`).join(', ')
  }, [node.browseList])

  return (
    <PipelineBaseNode
      label={taskDef?.taskName ?? 'MCH browse task'} {...nodeTypeStyle}
      abstract={abstractDesc} desc={node.desc} run={node?.run}
      editable={editable} editing={editing} changed={changed} 
      saveEditing={saveEditing} cancelEditing={cancelEditing}
      onEdit={onEditNode} onDel={onDelNode}
    >
      <List
        dataSource={node.browseList}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              title={item.transCode}
              description={
                <Descriptions column={1} size={'small'} labelStyle={{ width: 42 }}>
                  <Descriptions.Item label={'Input'}>
                    {Object.keys(item.default?.input ?? {})?.map(fieldId =>
                      <Tag key={fieldId}>
                        {item.fields.find(field => field.id === fieldId)?.name}
                        =
                        {item.default?.input?.[fieldId]}
                      </Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Output'}>
                    {item.default?.output?.map(fieldId =>
                      <Tag key={fieldId}>
                        {item.fields.find(field => field.id === fieldId)?.name}
                      </Tag>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              }
            />
          </List.Item>
        )}
      />
    </PipelineBaseNode>
  )
}

export default PipelineMCHTaskNode
