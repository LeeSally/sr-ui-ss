import React, { useEffect, useContext } from 'react'

import { Descriptions } from 'antd'

import { QueryConditionSelector } from '../../../QueryConditionEditor'
import type { ConditionGroupProps, ConditionItemProps } from '../../../QueryConditionEditor/types'

import { type PipelineContextProps, PipelineContext } from '../../context'
import type { PipelineNodeDef, PipelineNodeWithNext } from '../../types'
import { PIPELINE_NODE } from '../consts'

import { useNewNextNode } from '../hooks'
import PipelineNextNodeBtn from '../NewNextBtn'

interface PipelineIfNodeEditorProps {
  node: PipelineNodeWithNext.If
  onChange?: (ifNode: PipelineNodeWithNext.If) => void
}

const PipelineIfNodeEditor: React.FC<PipelineIfNodeEditorProps> = (props) => {
  const { node, onChange } = props
  const { readableFields, customTaskDefs } = useContext<PipelineContextProps>(PipelineContext)

  const { nextNodeItems, newingNexts, onNewingNextKey } = useNewNextNode()

  const changeCondition = (cond?: ConditionGroupProps | ConditionItemProps): void => {
    const newIf: PipelineNodeWithNext.If = {
      ...node,
      judgeCondition: cond
    }
    onChange?.(newIf)
  }

  useEffect(() => {
    newingNexts?.map(branch => {
      const { nextKey, nodeType, taskKey } = branch
      let newNextNode: PipelineNodeWithNext.Nexts | undefined

      switch (nodeType) {
        case PIPELINE_NODE.Type.IF:
          newNextNode = {
            ...PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.IF] as PipelineNodeDef.If
          }
          break
        case PIPELINE_NODE.Type.SWITCH:
          newNextNode = {
            ...PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.SWITCH] as PipelineNodeDef.Switch
          }
          break
        case PIPELINE_NODE.Type.TASK:
          if (Object.values(PIPELINE_NODE.PresetTaskKey).includes(taskKey as PIPELINE_NODE.PresetTaskKey)) {
            // preset task node
            newNextNode = {
              ...PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.TASK] as PipelineNodeDef.Tasks,
              ...PIPELINE_NODE.PRESET_TASK_DEFS[taskKey as PIPELINE_NODE.PresetTaskKey]
            }
          } else {
            // custom task node
            const customTaskDef = customTaskDefs?.find(def => def.taskKey === taskKey)
            if (customTaskDef !== undefined) {
              newNextNode = { ...customTaskDef }
            }
          }
          break
      }
      const newIf: PipelineNodeWithNext.If = {
        ...node,
      }
      newIf[nextKey === true ? 'trueNext' : 'falseNext'] = newNextNode
      onChange?.(newIf)

      return nextKey
    })
  }, [newingNexts])

  return (
    <>
      <Descriptions column={1} layout={'vertical'} size={'small'}
        contentStyle={{ marginBottom: 24, display: 'block' }}
      >
        <Descriptions.Item label={'If Condition'}>
          <QueryConditionSelector
            fieldList={readableFields ?? []}
            value={node.judgeCondition} onChange={changeCondition}
            editable nested operatorOptionFixed defaultExpanded
            layout={'vertical'}
          />
        </Descriptions.Item>

        <Descriptions.Item label={'True Branch'}>
          <PipelineNextNodeBtn
            curNode={node.trueNext}
            nextNodeItems={nextNodeItems}
            newing={newingNexts?.find(node => node.nextKey === true)} editing
            onNewingNextKey={onNewingNextKey(true)}
          />
        </Descriptions.Item>

        <Descriptions.Item label={'False Branch'}>
          <PipelineNextNodeBtn
            curNode={node.falseNext}
            nextNodeItems={nextNodeItems}
            newing={newingNexts?.find(node => node.nextKey === false)} editing
            onNewingNextKey={onNewingNextKey(false)}
          />
        </Descriptions.Item>
      </Descriptions>
    </>
  )
}

export default PipelineIfNodeEditor
