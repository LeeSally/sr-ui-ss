import React, { useState } from 'react'

import { useMemoizedFn, useBoolean } from 'ahooks'

import { QueryConditionContext } from './context'

import ConditionItemBox from './ConditionItemBox'
import EditableConditionItemBox from './EditableConditionItemBox'

import { clsPrefix } from './vars'
import './style.less'

import type { RELATIONAL_OPERATORS, ConditionItemProps, FieldProps } from './types'
import { useEffect } from 'react'

interface QueryConditionitemEditorProps {
  fieldList?: FieldProps[]
  editable?: boolean
  size?: 'default' | 'small'

  defaultEditing?: boolean

  value?: ConditionItemProps
  onChange?: (conds: ConditionItemProps) => void
  clearAll?: () => void
}

const QueryConditionItemEditor: React.FC<QueryConditionitemEditorProps> = (props) => {
  const {
    fieldList, editable = false,
    defaultEditing = false, size = 'default',
    value, onChange, clearAll
  } = props

  const [curCondition, setCurCondition] = useState<ConditionItemProps | undefined>(value)
  const [editing, { setTrue: openEdit, setFalse: endEdit }] = useBoolean(defaultEditing)

  const onSaveItem = async(
    cond: ConditionItemProps
  ): Promise<any> => {
    onChange?.(cond)
    return await Promise.resolve('ok')
  }

  const onDelete = async(
    field: FieldProps,
    operator: RELATIONAL_OPERATORS,
    value: any
  ): Promise<any> => {
    setCurCondition(undefined)
    clearAll?.()
    endEdit()
  }

  useEffect(() => {
    setCurCondition(value)
  }, [value])

  return(
    <QueryConditionContext.Provider value={{
      fieldList,
      editable,
      size
    }}>
      {
        editing
          ? <EditableConditionItemBox defaultValue={curCondition} 
              onSave={onSaveItem} cancelEdit={endEdit}
            />
          : curCondition === undefined
            ? <div className={`${clsPrefix}-empty`}>{'<Empty>'}</div>
            : <ConditionItemBox {...curCondition} delCondition={onDelete} openEdit={openEdit} />
      }
    </QueryConditionContext.Provider>
  )
}

QueryConditionItemEditor.displayName = 'QueryConditionItemEditor'
export default React.memo(QueryConditionItemEditor)
