import React, { useContext, useMemo } from 'react'

import { Descriptions, Table } from 'antd'
import type { TableProps } from 'antd'

import type { FieldProps } from '../../../QueryConditionEditor/types'

import { PipelineContext } from '../../context'
import type { PipelineNodeWithNext } from '../../types'

interface PipelineTaskNodeEditorProps {
  node: PipelineNodeWithNext.Tasks
  onChange?: (taskNode: PipelineNodeWithNext.Tasks) => void
}

const PipelineTaskNodeEditor: React.FC<PipelineTaskNodeEditorProps> = (props) => {
  const { node } = props

  const { customTaskDefs } = useContext(PipelineContext)

  const paramTableCols: TableProps<FieldProps>['columns'] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 80
    },
    {
      dataIndex: 'name',
      title: 'Name',
      width: 120
    },
    {
      dataIndex: 'dataType',
      title: 'Data Type',
      width: 60
    }
  ]

  const customTaskDef = useMemo(() =>
    customTaskDefs?.find(def => def.taskKey === node.taskKey)
  , [node, customTaskDefs])

  return (
    <Descriptions column={1} layout={'vertical'}
      size={'small'} contentStyle={{ marginBottom: 24, display: 'block' }}
    >
      {
        customTaskDef !== undefined
          ? <Descriptions.Item label={'Task Parameters'}>
            <Table
              columns={paramTableCols}
              dataSource={customTaskDef.params}
              rowKey={'id'} size={'small'}
            />
          </Descriptions.Item>
          : null
      }
    </Descriptions>
  )
}

export default PipelineTaskNodeEditor
