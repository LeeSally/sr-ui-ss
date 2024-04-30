import React, { useMemo } from 'react'

import { Descriptions, Space, Tag } from 'antd'
import { useMemoizedFn } from 'ahooks'

import type { PipelineNodeWithPos, IWithEditor } from '../../types'
import { PIPELINE_NODE } from '../consts'
import { useNodeTypeInfo } from '../hooks'

import PipelineBaseNode from '../BaseNode'

interface PipelineSwitchNodeCompProps extends IWithEditor {
  node: PipelineNodeWithPos.Switch
}

const PipelineSwitchNode: React.FC<PipelineSwitchNodeCompProps> = (props) => {
  const { 
    node,
    editable = false, editing = false, changed, cancelEditing, onEdit, saveEditing,
    onDel
  } = props

  const { nodeTypeDef, nodeTypeStyle } = useNodeTypeInfo(PIPELINE_NODE.Type.SWITCH)

  const onEditNode = useMemoizedFn((): void => {
    onEdit?.(node)
  })

  const onDelNode = useMemoizedFn((): void => {
    onDel?.(node)
  })

  const abstractDesc = useMemo(() => {
    if (node.judgeField === undefined && (node.caseGroups === undefined || node.caseGroups.length === 0)) {
      return '<Blank>'
    }

    const caseList = node?.caseGroups?.map(caseKeys => caseKeys.join(', '))
    return `[${String(node.judgeField?.name ?? node.judgeField?.id ?? 'Unkown')}] = ${caseList?.join(' / ') ?? ''}`
  }, [node.judgeField, node.caseGroups])

  return (
    <PipelineBaseNode
      label={nodeTypeDef?.nodeName ?? 'Switch'} {...nodeTypeStyle}
      abstract={abstractDesc} desc={node.desc}
      editable={editable} editing={editing} startEdit={onEditNode} endEdit={cancelEditing}
      onSave={saveEditing} onDel={onDelNode} changed={changed}
    >
      <Descriptions column={1} size={'small'}>
        <Descriptions.Item label={'Field'}>
          {node.judgeField?.name}
        </Descriptions.Item>
        <Descriptions.Item label={'Cases'}>
          <Space size={16} direction={'vertical'}>
          {
            node?.caseGroups?.map((caseKeys, index) => (
              <div key={index}>
                {caseKeys.map(caseKey => <Tag key={caseKey}>{caseKey}</Tag>)}
              </div>
            ))
          }
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </PipelineBaseNode>
  )
}

export default PipelineSwitchNode
