import React, { useContext, useEffect, useMemo, useState } from 'react'

import { Button, Dropdown, Space } from 'antd'
import {
  PlusCircleOutlined, DownOutlined, DeleteOutlined,
  TagOutlined, TagsOutlined, InboxOutlined, PlusOutlined
} from '@ant-design/icons'

import { useBoolean, useMemoizedFn } from 'ahooks'
import { classNames } from 'sr-ui-utils'

import { clsPrefix } from '../vars'

import {
  RELATIONAL_OPERATORS, ConditionGroupProps,
  ConditionGroupPropsWithId, ConditionItemProps, FieldProps, LOGIC_OPERATORS
} from '../types'
import { RelationalOperatorsConst, LogicOperatorsConst } from '../const'

import { QueryConditionContext } from '../context'

import ConditionItemBox from '../ConditionItemBox'
import EditableConditionItemBox from '../EditableConditionItemBox'
import EditableConditionGroupBox from '../EditableConditionGroupBox'

import './style.less'

interface ConditionGroupBoxProps extends Omit<ConditionGroupPropsWithId, 'type'> {
  defaultExpanded?: boolean
}

const ConditionGroupBox: React.FC<ConditionGroupBoxProps> = (props) => {
  const { id, operator, items, defaultExpanded = false } = props

  const {
    editable = false, nested = false, layout = 'inline', size = 'small',
    expandable = false, addConditionItem, delConditionItem, delConditionGroup
  } = useContext(QueryConditionContext)

  const [expanded, { toggle: toggleExpand }] = useBoolean(expandable ? true : defaultExpanded)

  const [newing, { setTrue: openNew, setFalse: closeNew }] = useBoolean(false)
  const [newType, setNewType] = useState<'item' | 'group'>()

  const disabledFields = useMemo(() => {
    if (operator === LOGIC_OPERATORS.OR) return undefined
    const condsItems = items?.filter(item => item.type === 'item') as ConditionItemProps[]
    return condsItems?.map(item => item.field.id)
  }, [items])

  const onAddCondition = useMemoizedFn(async (
    cond: ConditionItemProps
  ): Promise<any> => {
    return await addConditionItem?.(id, cond.field, cond.operator, cond.value) ?? await Promise.reject(new Error('method "addConditionItem" no set'))
  })

  const onDelCondition = useMemoizedFn(async (
    field: FieldProps,
    operator: RELATIONAL_OPERATORS,
    value: any
  ): Promise<any> => {
    return await delConditionItem?.(id, field, operator, value) ?? await Promise.reject(new Error('method "onDelCondition" not set'))
  })

  const onDelConditionGroup = useMemoizedFn((): void => {
    delConditionGroup?.(id).then(() => { }).catch(err => {
      console.warn('Fail to delete', err)
    })
  })

  const onNewCondition = useMemoizedFn((type: 'item' | 'group'): void => {
    setNewType(type)
    openNew()
  })

  const conditionTypeMenu = [
    {
      label: 'Condition Item',
      key: 'item',
      icon: <TagOutlined className={`${clsPrefix}-group-menu-icon`} />,
      onClick: () => {
        onNewCondition('item')
      }
    },
    {
      label: 'Condition Group',
      key: 'group',
      icon: <TagsOutlined className={`${clsPrefix}-group-menu-icon`} />,
      onClick: () => {
        onNewCondition('group')
      }
    }
  ]

  useEffect(() => {
    if (!expanded) closeNew()
  }, [expanded])


  const renderConditionSumDesc = (
    cond: ConditionItemProps | ConditionGroupProps
  ): React.ReactElement => {
    if (cond.type === 'item') {
      return <span className={`${clsPrefix}-group-condition-desc-item`}>
        <span className={`${clsPrefix}-group-condition-desc-item-field`}>{cond.field.name}</span>
        <span className={`${clsPrefix}-group-condition-desc-operator`}>
          {RelationalOperatorsConst[cond.operator]?.symbol ?? RelationalOperatorsConst[cond.operator]?.name ?? cond.operator}
        </span>
        <span className={`${clsPrefix}-group-condition-desc-item-value`}>&quot;{cond.value}&quot;</span>
      </span>
    } else {
      if (cond?.items?.length === 0) {
        return <>
          <span className={`${clsPrefix}-group-condition-desc-root-operator`}>
            {LogicOperatorsConst[operator as LOGIC_OPERATORS]?.name ?? operator}
          </span>
          <span className={`${clsPrefix}-group-empty-box`}>
            {id}
          </span>
        </>
      }

      return (
        <>
          {
            cond?.items?.map((item, index) => 
              <React.Fragment key={index}>
                ({renderConditionSumDesc(item)})
                {
                  index < (cond?.items?.length ?? 0) - 1
                    ? <span className={`${clsPrefix}-group-condition-desc-operator`}>
                      {
                        LogicOperatorsConst[cond.operator as LOGIC_OPERATORS]?.symbol ??
                        LogicOperatorsConst[cond.operator as LOGIC_OPERATORS]?.name ??
                        cond.operator
                      }
                    </span>
                    : null
                }
              </React.Fragment>
            )
          }
        </>
      )
    }
  }

  const summaryDesc = useMemo(() => renderConditionSumDesc({ type: 'group', operator, items }), [operator, items])

  return (
    <div key={id}
      className={classNames(
        `${clsPrefix}-group`, expanded ? 'expanded' : '',
        size === 'small' ? 'small' : ''
      )}
    >
      <div className={`${clsPrefix}-group-header-bar`}>
        <span className={`${clsPrefix}-group-conditions-desc`}>
          {expanded
            ? <Space>
              <span className={`${clsPrefix}-group-conditions-desc-root-operator`}>
                {LogicOperatorsConst[operator as LOGIC_OPERATORS]?.name ?? operator}
              </span>
              {id}
            </Space>
            : summaryDesc
          }
        </span>

        <span className={classNames(`${clsPrefix}-group-header-bar-btns`, !expandable ? 'hide' : '')}>
          <Button type={'text'} size={'small'}
            icon={<DownOutlined style={{ fontSize: 10 }} rotate={expanded ? 180 : 0} />}
            onClick={toggleExpand}
          />
        </span>
      </div>

      {
        expanded
          ? <>
            <div className={`${clsPrefix}-group-filter-list`}
              style={layout === 'vertical' ? { flexDirection: 'column' } : {}}
            >
              {
                items?.map((atom, index) => (
                  <React.Fragment key={index}>
                    {
                      atom.type === 'item'
                        ? <ConditionItemBox {...atom} delCondition={onDelCondition} />
                        : <ConditionGroupBox {...atom} key={atom.id} defaultExpanded={defaultExpanded} />
                    }
                  </React.Fragment>
                ))
              }
            </div>
            {
              items?.length === 0
                ? <span className={`${clsPrefix}-group-empty-box`}>
                  <InboxOutlined className={'icon'} />
                </span>
                : null
            }

            <span className={classNames(`${clsPrefix}-group-editing-wrap`, editable ? '' : 'hide')}>
              {
                newing
                  ? newType === 'item'
                    ? <EditableConditionItemBox cancelEdit={closeNew} onSave={onAddCondition} disabledFields={disabledFields} />
                    : <EditableConditionGroupBox parentId={id} seq={(items?.length ?? 0) + 1} cancelEditing={closeNew} />
                  : <Space size={16}>
                    {
                      nested
                        ? <Dropdown menu={{ items: conditionTypeMenu }} >
                          <Button icon={<PlusOutlined />} size={'small'} type={'link'}>
                            Child
                          </Button>
                        </Dropdown>
                        : <Button icon={<PlusCircleOutlined />} size={'small'} type={'link'}
                          onClick={() => { onNewCondition('item') }}
                        >
                          Child
                        </Button>
                    }
                    <Button
                      icon={<DeleteOutlined />} size={'small'} type={'link'} danger
                      onClick={onDelConditionGroup}
                    >
                      Delete
                    </Button>
                  </Space>
              }
            </span>
          </>
          : null
      }
    </div>
  )
}

ConditionGroupBox.displayName = 'ConditionGroupBox'
export default React.memo(ConditionGroupBox)
