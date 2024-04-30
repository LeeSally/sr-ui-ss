import React, { useContext, useState } from 'react'
import type { ChangeEvent } from 'react'

import { Select, Button, Input, Checkbox, Tooltip } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { CheckOutlined, WarningOutlined, CloseOutlined } from '@ant-design/icons'
import { useMemoizedFn } from 'ahooks'

import { classNames } from 'sr-ui-utils'

import { QueryConditionContext } from '../context'
import type { FieldProps, ConditionItemProps } from '../types'
import { DATA_TYPES, RELATIONAL_OPERATORS } from '../types'
import { DataTypeOperatorMap, RelationalOperatorsConst } from '../const'

import { clsPrefix } from '../vars'
import './style.less'

interface EditableConditionItemBoxProps {
  defaultValue?: Omit<ConditionItemProps, 'type'>
  onSave?: (condition: ConditionItemProps) => Promise<any>
  cancelEdit?: () => void
  disabledFields?: string[]
}

const EditableConditionItemBox: React.FC<EditableConditionItemBoxProps> = (props) => {
  const { onSave, cancelEdit, disabledFields, defaultValue } = props

  const [currentField, setCurrentField] = useState<FieldProps | undefined>(defaultValue?.field)
  const [currentVal, setCurerntVal] = useState<string | boolean | number | undefined>(defaultValue?.value)
  const [currentOperator, setCurrentOperator] = useState<RELATIONAL_OPERATORS | undefined>(defaultValue?.operator)
  const { fieldList } = useContext(QueryConditionContext)

  const [addError, setAddError] = useState<Error>()

  const onSelectField = useMemoizedFn((fieldId: any): void => {
    const field = fieldList?.find(item => item.id === fieldId)

    setCurrentField(field)
    setCurrentOperator(field?.dataType !== undefined ? DataTypeOperatorMap[field.dataType][0] : undefined)
    setCurerntVal(undefined)
  })

  const changeStrValue = (ev: ChangeEvent<HTMLInputElement>): void => {
    setCurerntVal(ev.target.value)
  }

  const changeBoolValue = (ev: CheckboxChangeEvent): void => {
    setCurerntVal(ev.target.checked)
  }

  const onOK = (): void => {
    if (currentField === undefined || currentVal === undefined || currentOperator === undefined) return

    const condItem: ConditionItemProps = {
      type: 'item',
      field: currentField,
      operator: currentOperator,
      value: currentVal
    }

    onSave?.(condItem).then(() => {
      setAddError(undefined)
      cancelEdit?.()
    }).catch(err => {
      console.error('[Error] Fail to save condition item', condItem, err)
      setAddError(err)
    })
  }

  return (
    <span className={classNames(`${clsPrefix}-edit-item`)}>
      <span className={`${clsPrefix}-edit-item-content`}>
        <span className={`${clsPrefix}-edit-item-content-field`}>
          <Select size={'small'} onChange={onSelectField} style={{ width: '100%' }} value={currentField?.id}>
            {fieldList?.map(field => (
              <Select.Option key={field.id} value={field.id} disabled={disabledFields?.includes(field.id)}>
                {field.name}
              </Select.Option>
            ))}
          </Select>
        </span>

        {
          currentField?.dataType !== undefined && DataTypeOperatorMap[currentField.dataType].length === 1
            ? DataTypeOperatorMap[currentField.dataType][0]
            : <span className={`${clsPrefix}-edit-item-content-operator`}>
              <Select size={'small'} disabled={currentField === undefined}
                onChange={setCurrentOperator} style={{ width: '100% ' }}
                value={currentOperator}
              >
                {(currentField?.dataType !== undefined
                  ? DataTypeOperatorMap[currentField.dataType]
                  : Object.keys(RELATIONAL_OPERATORS)
                ).map(opr => (
                  <Select.Option key={opr} value={opr}>
                    {
                      RelationalOperatorsConst[opr as RELATIONAL_OPERATORS]?.symbol ??
                      RelationalOperatorsConst[opr as RELATIONAL_OPERATORS]?.name ??
                      opr
                    }
                  </Select.Option>
                ))}
              </Select>
            </span>
        }

        <span className={`${clsPrefix}-edit-item-content-value`}>
          {
            currentField?.dataType === DATA_TYPES.LIST
              ? <Select size={'small'} disabled={currentField === undefined}
                onChange={setCurerntVal} style={{ width: '100% ' }} value={currentVal}
              >
                {currentField.listOptions.map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
              : currentField?.dataType === DATA_TYPES.BOOL
                ? <Checkbox checked={currentVal as boolean} onChange={changeBoolValue} disabled={currentField === undefined} >
                  {currentVal === true ? 'True' : 'False'}
                </Checkbox>
                : <Input size={'small'} disabled={currentField === undefined}
                  value={currentVal as string} onChange={changeStrValue} allowClear width={100}
                />
          }
        </span>
      </span>

      <span className={`${clsPrefix}-edit-item-btns`}>
        <Button type={'link'} icon={<CheckOutlined />} size={'small'}
          disabled={currentField === undefined || currentVal === undefined ||
            (typeof currentVal === 'string' && currentVal.length === 0) ||
            currentOperator === undefined
          }
          onClick={onOK} className={`${clsPrefix}-edit-item-btns-btn`}
        />

        <Button type={'link'} icon={<CloseOutlined />} size={'small'}
          onClick={cancelEdit} className={`${clsPrefix}-edit-item-btns-btn`}
        />
      </span>

      {
        addError !== undefined
          ? <span className={`${clsPrefix}-edit-item-err-info`}>
            <Tooltip title={addError?.toString()} destroyTooltipOnHide={true}>
              <WarningOutlined style={{ color: '@ffa940 ' }} />
            </Tooltip>
          </span>
          : null
      }
    </span>
  )
}

export default EditableConditionItemBox
