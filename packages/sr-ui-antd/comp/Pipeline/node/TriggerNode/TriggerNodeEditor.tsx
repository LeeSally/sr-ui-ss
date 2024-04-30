import React, { useContext } from 'react'

import { Descriptions } from 'antd'

import { QueryConditionSelector } from '../../../QueryConditionEditor'
import type { ConditionGroupProps, ConditionItemProps } from '../../../QueryConditionEditor/types'

import { type PipelineContextProps, PipelineContext } from '../../context'
import { PipelineNodeWithNext } from '../../types'

interface PipelineTriggerNodeEditorProps {
  node: PipelineNodeWithNext.Trigger
  onChange?: (triggerNode: PipelineNodeWithNext.Trigger) => void
}

const PipelineTriggerNodeEditor: React.FC<PipelineTriggerNodeEditorProps> = (props) => {
  const { node, onChange } = props
  const { readableFields } = useContext<PipelineContextProps>(PipelineContext)

  const changeCondition = (cond?: ConditionGroupProps | ConditionItemProps): void => {
    const newTrigger: PipelineNodeWithNext.Trigger = {
      ...node,
      condition: cond
    }
    onChange?.(newTrigger)
  }

  return (
    <Descriptions column={1} layout={'vertical'} size={'small'}
      contentStyle={{ marginBottom: 24, display: 'block' }}
    >
      <Descriptions.Item label={'Condition'}>
        <QueryConditionSelector
          fieldList={readableFields ?? []}
          value={node.condition} onChange={changeCondition}
          editable nested operatorOptionFixed
          layout={'vertical'} defaultExpanded
        />
      </Descriptions.Item>
    </Descriptions>
  )
}

export default PipelineTriggerNodeEditor
