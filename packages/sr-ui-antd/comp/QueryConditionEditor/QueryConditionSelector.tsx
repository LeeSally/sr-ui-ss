import React, { useState } from 'react'
import type { Key } from 'react'

import { Button, Space } from 'antd'
import { TagOutlined, TagsOutlined } from '@ant-design/icons'
import { useMemoizedFn, useBoolean } from 'ahooks'

import { QueryConditionContext, type QueryConditionContextProps } from './context'
import type {
  ConditionGroupProps, ConditionGroupPropsWithId,
  ConditionItemProps, LOGIC_OPERATORS
} from './types'

import EditableConditionItemBox from './EditableConditionItemBox'
import EditableConditionGroupBox from './EditableConditionGroupBox'
import QueryCondtionGroupEditor from './QueryConditionGroupEditor'
import QueryCondtionItemEditor from './QueryConditionItemEditor'

import { clsPrefix } from './vars'
import './style.less'

interface QueryCondtionSelectorProps extends Omit<QueryConditionContextProps, 'addConditionItem' | 'delConditionItem' | 'addConditionGroup' | 'delConditionGroup'> {
  defaultExpanded?: boolean
  value?: ConditionGroupProps | ConditionItemProps
  onChange?: (conds?: ConditionGroupProps | ConditionItemProps) => void
}

const QueryConditionSelector: React.FC<QueryCondtionSelectorProps> = (props) => {
  const {
    fieldList, editable = false,
    nested = false, layout = 'inline',
    size = 'default', expandable = false,
    operatorOptionFixed = false, defaultExpanded = false,
    value, onChange
  } = props

  const [newType, setNewType] = useState<'item' | 'group'>()
  const [newing, { setTrue: openNew, setFalse: closeNew }] = useBoolean(false)

  const onNewCondition = useMemoizedFn((type: 'item' | 'group') => (e: React.MouseEvent<HTMLElement>): void => {
    setNewType(type)
    openNew()
  })

  const addItemRoot = useMemoizedFn(async (
    cond: ConditionItemProps
  ): Promise<any> => {
    onChange?.(cond)
    return await Promise.resolve(cond)
  })

  const addConditionGroup = useMemoizedFn(async (
    groupId: Key,
    operator: LOGIC_OPERATORS | string,
    parentGroupId: Key
  ): Promise<ConditionGroupPropsWithId | undefined> => {
    const group: ConditionGroupPropsWithId = {
      type: 'group',
      operator,
      items: [],
      id: '0'
    }

    onChange?.(group)
    return await Promise.resolve(group)
  })

  const clearAll = useMemoizedFn((): void => {
    setNewType(undefined)
    onChange?.(undefined)
  })

  return (
    <QueryConditionContext.Provider
      value={{
        fieldList,
        editable,
        expandable,
        nested,
        operatorOptionFixed,
        layout,
        size,
        addConditionGroup
      }}
    >
      {
        newing
          ? newType === 'item'
            ? <EditableConditionItemBox cancelEdit={closeNew} onSave={addItemRoot} />
            : newType === 'group'
              ? <EditableConditionGroupBox parentId={'0'} seq={0} cancelEditing={closeNew} />
              : null
          : value?.type === 'group'
            ? <QueryCondtionGroupEditor
              fieldList={fieldList}
              editable={editable}
              layout={layout}
              size={size}
              nested={nested}
              expandable={expandable}
              defaultExpanded={defaultExpanded}
              operatorOptionFixed={operatorOptionFixed}
              value={value} onChange={onChange} clearAll={clearAll}
            />
            : value?.type === 'item'
              ? <QueryCondtionItemEditor
                fieldList={fieldList} defaultEditing={false} editable={editable}
                size={size} value={value} onChange={onChange} clearAll={clearAll}
              />
              : editable
                ? <Space>
                  <Button type={'link'} icon={<TagOutlined />} onClick={onNewCondition('item')}>Item</Button>
                  <Button type={'link'} icon={<TagsOutlined />} onClick={onNewCondition('group')}>Group</Button>
                </Space>
                : <div className={`${clsPrefix}-empty`}>{'<Empty>'}</div>
      }
    </QueryConditionContext.Provider>
  )
}

export default QueryConditionSelector
