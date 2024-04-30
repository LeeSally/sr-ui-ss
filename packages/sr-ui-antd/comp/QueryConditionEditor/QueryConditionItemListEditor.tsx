import React from 'react'

import { Button, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useBoolean, useMemoizedFn } from 'ahooks'

import { QueryConditionContext } from './context'
import ConditionItemBox from './ConditionItemBox'
import EditableCondtionItemBox from './EditableConditionItemBox'

import type { RELATIONAL_OPERATORS, ConditionItemProps, FieldProps } from './types'

import { clsPrefix } from './vars'
import './style.less'

interface QueryConditionItemListEditorProps {
  fieldList?: FieldProps[]

  editable?: boolean
  size?: 'default' | 'small'

  value?: ConditionItemProps[]
  onChange?: (conds: ConditionItemProps[]) => void

  clearAll?: () => void
}

const QueryConditionItemListEditor: React.FC<QueryConditionItemListEditorProps> = (props) => {
  const {
    fieldList,
    editable = false, size = 'default',
    value, onChange
  } = props

  const [newing, { setTrue: openNew, setFalse: closeNew }] = useBoolean(false)

  /**
   * Append item to list
   * @param {ConditionItemProps} cond 
   * @returns 
   */
  const onAddItem = useMemoizedFn(async (
    cond: ConditionItemProps
  ): Promise<any> => {
    onChange?.([...(value ?? []), cond])
    return await Promise.resolve(cond)
  })

  /**
   * Delete item from list
   * @param {number} index      index number of target item
   * @returns 
   */
  const onDelItem = useMemoizedFn((index: number) => async (
    field: FieldProps,
    operator: RELATIONAL_OPERATORS,
    fieldValue: any
  ): Promise<any> => {
    if (value === undefined || (value instanceof Array && value.length === 0)) return
    onChange?.([...value.slice(0, index), ...value.slice(index + 1)])
  })

  return (
    <QueryConditionContext.Provider
      value={{
        fieldList,
        editable,
        size
      }}
    >
      <div className={`${clsPrefix}-item-list`}>
        {
          value?.map((item, index) => (
            <ConditionItemBox key={index} {...item} delCondition={onDelItem(index)} />
          ))
        }
        {
          value === undefined || value.length === 0
            ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'No item'} />
            : null
        }
        {
          editable
            ? newing
              ? <EditableCondtionItemBox onSave={onAddItem} cancelEdit={closeNew} />
              : <Button
                type={'dashed'} block
                size={size === 'small' ? 'small' : 'middle'}
                onClick={openNew}
              >
                <PlusOutlined style={{ fontSize: 12 }} />
              </Button>
            : null
        }
      </div>
    </QueryConditionContext.Provider>
  )
}

export default QueryConditionItemListEditor
