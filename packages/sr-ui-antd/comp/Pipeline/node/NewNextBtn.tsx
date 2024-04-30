import React from 'react'

import { Space, Button, Dropdown, Badge, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { SubnodeOutlined } from '@ant-design/icons'

import type { PipelineNodeDef } from '../types'
import { PIPELINE_NODE } from './consts'
import { useNodeTypeInfo } from './hooks'

interface NextNodeBtnProps {
  title?: string
  newing?: {
    nodeType?: PIPELINE_NODE.Type
    taskKey?: string
  }
  editing?: boolean
  curNode?: PipelineNodeDef.Nexts
  nextNodeItems?: MenuProps['items']
  onNewingNextKey?: () => void
}

const PipelineNextNodeBtn: React.FC<NextNodeBtnProps> = (props) => {
  const {
    title, newing, editing = false, curNode, nextNodeItems, onNewingNextKey
  } = props

  const { nodeTypeDef, taskDef } = useNodeTypeInfo(
    (newing ?? curNode)?.nodeType, 
    newing?.taskKey ?? (curNode?.nodeType === PIPELINE_NODE.Type.TASK ? curNode.taskKey : undefined)
  )

  return (
    <>
      {
        editing
          ? <Dropdown menu={{ items: nextNodeItems }}
            placement={'bottomLeft'} arrow trigger={['click']}
            onOpenChange={onNewingNextKey}
            disabled={curNode !== undefined || !editing}
          >
            <Button title={title}
              size={'small'} type={curNode !== undefined ? 'link' : 'default'}
              icon={<Badge dot size={'small'} count={newing?.nodeType !== undefined ? 1 : 0}>
                <SubnodeOutlined />
              </Badge>}
            >
              <Space size={3}>
                {title}
                <Typography.Text code type={nodeTypeDef !== undefined ? 'success' : 'secondary'}>
                  {nodeTypeDef?.nodeName ?? '<Blank>'}
                  {nodeTypeDef?.nodeType === PIPELINE_NODE.Type.TASK ? `: ${taskDef?.taskName ?? taskDef?.taskKey ?? 'Task'}` : ''}
                </Typography.Text>
              </Space>
            </Button>
          </Dropdown>
          : <Space size={6} title={title}>
            <SubnodeOutlined />
            <Typography.Text>{title}</Typography.Text>
            {
              curNode !== undefined
                ? <Typography.Text code type={nodeTypeDef !== undefined ? 'success' : 'secondary'}>
                  {nodeTypeDef?.nodeName ?? 'Unkown'}
                  {nodeTypeDef?.nodeType === PIPELINE_NODE.Type.TASK ? `: ${taskDef?.taskName ?? taskDef?.taskKey ?? 'Task'}` : ''}
                </Typography.Text>
                : <Typography.Text code type={'secondary'}>&lt;Blank&gt;</Typography.Text>
            }
          </Space>
      }
    </>
  )
}

export default PipelineNextNodeBtn

