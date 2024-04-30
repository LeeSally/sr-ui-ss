import React, { useContext, useState } from 'react'
import type { ChangeEvent, Key } from 'react'

import { Button, Select, Input, Row, Col, Space } from 'antd'
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons'
import { useMemoizedFn } from 'ahooks'

import { QueryConditionContext } from '../context'
import { type ConditionGroupPropsWithId, LOGIC_OPERATORS } from '../types'
import { LogicOperatorsConst } from '../const'

import { clsPrefix } from '../vars'
import './style.less'

interface EditableConditionGroupBoxProps {
  parentId: Key
  seq: number
  cancelEditing?: (condition?: ConditionGroupPropsWithId) => void
}

const EditableConditionGroupBox: React.FC<EditableConditionGroupBoxProps> = (props) => {
  const { parentId, seq, cancelEditing } = props

  const { operatorOptionFixed = false, addConditionGroup } = useContext(QueryConditionContext)
  const [operator, setOperator] = useState<LOGIC_OPERATORS | string>()

  const onOK = useMemoizedFn((): void => {
    if (operator === undefined) return
    const newId = `${parentId}-${seq.toString()}`
    addConditionGroup?.(newId, operator, parentId).then(condition => {
      cancelEditing?.(condition)
    }).catch(err => {
      console.warn(err)
    })
  })

  const onEnterOperator = useMemoizedFn((ev: ChangeEvent<HTMLInputElement>): void => {
    setOperator(ev.target.value)
  })

  const onCancel = useMemoizedFn(() => { 
    cancelEditing?.() 
  })

  return (
    <div className={`${clsPrefix}-edit-group`}>
      <Row gutter={[12, 3]}>
        <Col flex={1}>
          <Space size={6}>
            Combination:
            {
              operatorOptionFixed
                ? <Select style={{ width: 120 }} size={'small'} onChange={setOperator}>
                  {
                    Object.values(LOGIC_OPERATORS).map(opr => (
                      <Select.Option key={opr} value={opr}>
                        {LogicOperatorsConst[opr as LOGIC_OPERATORS]?.name}
                      </Select.Option>
                    ))
                  }
                </Select>
                : <Input onChange={onEnterOperator} size={'small'} />
            }
          </Space>
        </Col>
        <Col flex={'none'}>
          <Space>
            <Button type={'link'} icon={<CheckOutlined />} size={'small'}
              onClick={onOK} disabled={operator === undefined}
            />
            <Button type={'link'} danger icon={<DeleteOutlined />} size={'small'} onClick={onCancel} />
          </Space>
        </Col>
      </Row>
    </div>
  )
}

export default React.memo(EditableConditionGroupBox)
