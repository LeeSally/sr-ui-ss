import React, { useState, useEffect, useMemo } from 'react'

import { Button, Space } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

import { classNames } from 'sr-ui-utils'

import type { IPipeline, PipelineNodeWithNext } from '../types'
import { PIPELINE_NODE } from '../node/consts'
import { usePipelineEditor } from './hooks'
import { useNodeTypeInfo } from '../node/hooks'

import { TriggerNodeEditor } from '../node/TriggerNode'
import { IfNodeEditor } from '../node/IfNode'
import { SwitchNodeEditor } from '../node/SwitchNode'
import { TaskNodeEditor } from '../node/TaskNode'

import PipelineCanvas from '../canvas'

import { clsPrefix } from '../vars'
import './style.less'

interface PipelineEditorProps {
  pipelineDef?: IPipeline
  loading?: boolean
}

const COLOR_MAP = {
  default: '#69b1ff',
  danger: '#ff4d4f',
  warning: '#ffc53d',
  success: '#95de64'
}

const PipelineEditor: React.FC<PipelineEditorProps> = (props) => {
  const { pipelineDef, loading = false } = props

  const [curTrigger, setCurTrigger] = useState<PipelineNodeWithNext.Trigger | undefined>()

  const changeTrigger = (trigger: PipelineNodeWithNext.Trigger): void => {
    setCurTrigger(trigger)
  }

  const pipelineEditor = usePipelineEditor(curTrigger, changeTrigger)
  const {
    editingNode, changed,
    cancelEditing, saveEditing,
    changeIfNode, changeTriggerNode, changeSwitchNode
  } = pipelineEditor

  const { nodeTypeDef, nodeTypeStyle, taskDef } = useNodeTypeInfo(
    editingNode?.nodeType,
    editingNode?.nodeType === PIPELINE_NODE.Type.TASK ? editingNode.taskKey : undefined
  )

  useEffect(() => {
    setCurTrigger(pipelineDef?.trigger)
  }, [pipelineDef])

  const nodeEditDetailPane = useMemo(() => {
    switch (editingNode?.nodeType) {
      case PIPELINE_NODE.Type.TRIGGER:
        return <TriggerNodeEditor node={editingNode} onChange={changeTriggerNode} />
      case PIPELINE_NODE.Type.IF:
        return <IfNodeEditor node={editingNode} onChange={changeIfNode} />
      case PIPELINE_NODE.Type.TASK:
        return <TaskNodeEditor node={editingNode} />
      case PIPELINE_NODE.Type.SWITCH:
        return <SwitchNodeEditor node={editingNode} onChange={changeSwitchNode} />
    }
  }, [editingNode])


  return (
    <main className={`${clsPrefix}-editor`}>
      <section className={`${clsPrefix}-editor-canvas-box`}>
        <PipelineCanvas
          trigger={curTrigger} loading={loading}
          editor={pipelineEditor}
        />
      </section>
      <section className={classNames(`${clsPrefix}-editor-node-detail-pane`, editingNode === undefined ? 'hide' : '')}>
        <header className={`${clsPrefix}-editor-node-detail-pane-label`}>
          <div>
            <span className={`${clsPrefix}-editor-node-detail-pane-icon`}
              style={{ backgroundColor: COLOR_MAP[nodeTypeStyle?.color ?? 'default'] }}
            >
              {nodeTypeStyle?.icon}
            </span>
          </div>
          <h4 className={`${clsPrefix}-editor-node-detail-pane-title`}>
            {nodeTypeDef?.nodeType === PIPELINE_NODE.Type.TASK
              ? `${nodeTypeDef.nodeName ?? 'Task'} - ${taskDef?.taskName ?? taskDef?.taskKey}`
              : nodeTypeDef?.nodeName
            }
          </h4>
        </header>

        {
          editingNode?.desc !== undefined
            ? <div className={`${clsPrefix}-editor-node-detail-pane-desc`}>
              {editingNode.desc}
            </div>
            : null
        }

        <div className={`${clsPrefix}-editor-node-detail-pane-body`}>
          {nodeEditDetailPane}
        </div>

        <footer className={`${clsPrefix}-editor-node-detail-pane-footer`}>
          <Space>
            <Button type={'primary'}
              icon={<SaveOutlined />}
              onClick={saveEditing} disabled={!changed}
            >
              Save
            </Button>
            <Button type={'link'} onClick={cancelEditing}>Cancel</Button>
          </Space>
        </footer>
      </section>
    </main>
  )
}

export default PipelineEditor
