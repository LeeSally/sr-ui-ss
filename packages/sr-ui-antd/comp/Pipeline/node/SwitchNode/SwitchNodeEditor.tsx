import React, { useState, useEffect, useContext } from 'react'
import type { ChangeEvent } from 'react'

import { Descriptions, Divider, Select, Space, Button, Tag, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useBoolean } from 'ahooks'

import { type PipelineContextProps, PipelineContext } from '../../context'
import type { PipelineNodeDef, PipelineNodeWithNext } from '../../types'
import { PIPELINE_NODE } from '../consts'

import { useNewNextNode } from '../hooks'
import PipelineNextNodeBtn from '../NewNextBtn'

interface SwitchNodeEditorProps {
  node: PipelineNodeWithNext.Switch
  onChange?: (node: PipelineNodeWithNext.Switch) => void
}

const PipelineSwitchNodeEditor: React.FC<SwitchNodeEditorProps> = (props) => {
  const { node, onChange } = props
  const { readableFields, customTaskDefs } = useContext<PipelineContextProps>(PipelineContext)

  const [newingCase, { setTrue: openNewCase, setFalse: closeNewCase }] = useBoolean(false)
  const [activeNewCaseGroupIndex, setActiveNewCaseGroupId] = useState<number>()
  const [newCaseVal, setNewCaseVal] = useState<string>()

  const { nextNodeItems, newingNexts, onNewingNextKey } = useNewNextNode()

  const changeField = (fieldId: string): void => {
    const field = readableFields?.find(field => field.id === fieldId)
    const newSwitch: PipelineNodeWithNext.Switch = {
      ...node,
      judgeField: field
    }
    onChange?.(newSwitch)
  }

  useEffect(() => {
    newingNexts?.map(next => {
      const { nextKey, nodeType, taskKey } = next
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
      const newSwitch: PipelineNodeWithNext.Switch = {
        ...node
      }
      if (newSwitch?.caseNexts === undefined) {
        newSwitch.caseNexts = []
      }
      newSwitch.caseNexts[nextKey as number] = newNextNode
      onChange?.(newSwitch)

      return nextKey
    })
  }, [newingNexts])

  const onDelCase = (groupIndex: number, caseIndex: number) => () => {
    const newCaseGroups = [...node?.caseGroups ?? []]
    const newCaseNexts = [...node?.caseNexts ?? []]
    newCaseGroups[groupIndex].splice(caseIndex, 1)

    if (newCaseGroups[groupIndex].length === 0) {
      newCaseGroups.splice(groupIndex, 1)
      newCaseNexts?.splice(groupIndex, 1)
    }

    const newSwitch: PipelineNodeWithNext.Switch = {
      ...node,
      caseGroups: newCaseGroups,
      caseNexts: newCaseNexts
    }
    onChange?.(newSwitch)
  }

  const onAddingCase = (index: number) => () => {
    setActiveNewCaseGroupId(index)
    openNewCase()
  }

  const onChangeNewCaseVal = (ele: ChangeEvent<HTMLInputElement>): void => {
    setNewCaseVal(ele.target.value)
  }

  const confirmNewCaseVal = (): void => {
    if (activeNewCaseGroupIndex === undefined || newCaseVal === undefined) return
    const newCaseGroups = [...node?.caseGroups ?? []]
    newCaseGroups[activeNewCaseGroupIndex].push(newCaseVal)
    const newSwitch: PipelineNodeWithNext.Switch = {
      ...node,
      caseGroups: newCaseGroups
    }
    onChange?.(newSwitch)
    setNewCaseVal(undefined)
    setActiveNewCaseGroupId(undefined)
    closeNewCase()
  }

  const onAddCaseGroup = (): void => {
    const newCaseGroups = [...node?.caseGroups ?? []]
    newCaseGroups.push([])
    const newSwitch: PipelineNodeWithNext.Switch = {
      ...node,
      caseGroups: newCaseGroups
    }
    onChange?.(newSwitch)
  }

  return (
    <>
      <Descriptions column={1} layout={'vertical'} size={'small'}
        contentStyle={{ marginBottom: 16, display: 'block' }}
      >
        <Descriptions.Item label={'Judge Field'}>
          <Select
            options={readableFields?.map(field => ({
              value: field.id,
              label: field.name
            }))}
            value={node.judgeField?.id}
            style={{ width: 160 }}
            onChange={changeField}
          />
        </Descriptions.Item>
        <Descriptions.Item label={'Cases'}>
          {
            node.caseGroups?.map((cases, index) => (
              <div key={index}>
                <Space direction={'vertical'}>
                  <div>
                    {cases?.map((item, seq) => <Tag key={item} closable onClose={onDelCase(index, seq)}>{item}</Tag>)}

                    {
                      newingCase && activeNewCaseGroupIndex === index
                        ? <Input
                            type={'text'} size={'small'} style={{ maxWidth: 100 }}
                            onChange={onChangeNewCaseVal} onBlur={confirmNewCaseVal}
                            onPressEnter={confirmNewCaseVal} allowClear
                          />
                        : <Button
                          type={'dashed'} onClick={onAddingCase(index)}
                          icon={<PlusOutlined />} size={'small'}
                        />
                    }
                  </div>
                  <PipelineNextNodeBtn
                    curNode={node.caseNexts?.[index]}
                    nextNodeItems={nextNodeItems}
                    newing={newingNexts?.find(node => node.nextKey === index)} editing
                    onNewingNextKey={onNewingNextKey(index)}
                  />
                </Space>
                <Divider />
              </div>
            ))
          }
          <Button type={'dashed'} icon={<PlusOutlined />} block onClick={onAddCaseGroup}>
            Add Case
          </Button>
        </Descriptions.Item>
      </Descriptions>
    </>
  )
}

export default PipelineSwitchNodeEditor
