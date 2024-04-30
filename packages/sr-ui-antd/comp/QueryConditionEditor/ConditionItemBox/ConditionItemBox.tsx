import React, { useContext } from 'react'

import { Button, Space } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useMemoizedFn } from 'ahooks'

import { classNames } from 'sr-ui-utils'
import { clsPrefix } from '../vars'

import { QueryConditionContext } from '../context'
import type { ConditionItemProps, FieldProps, RELATIONAL_OPERATORS } from '../types'
import { DATA_TYPES } from '../types'
import { RelationalOperatorsConst } from '../const'

import './style.less'

interface ConditionItemBoxProps extends Omit<ConditionItemProps, 'type'> {
  delCondition?: (field: FieldProps, operator: RELATIONAL_OPERATORS, value: any) => Promise<any>
  openEdit?: () => void
}

const ConditionItemBox: React.FC<ConditionItemBoxProps> = (props) => {
  const { field, operator, value, openEdit, delCondition } = props
  const { editable = false, size = 'default' } = useContext(QueryConditionContext)

  const onDelete = useMemoizedFn((): void => {
    delCondition?.(field, operator, value)
      .then(() => { })
      .catch(err => {
        console.error(err)
      })
  })

  return (
    <span className={classNames(`${clsPrefix}-item`, size === 'small' ? 'small' : '')}>
      <span className={`${clsPrefix}-item-content`}>
        <span className={`${clsPrefix}-item-content-name`}>
          {field?.name}
        </span>
        <span className={`${clsPrefix}-item-content-operator`}>
          {
            operator !== undefined
              ? (RelationalOperatorsConst[operator]?.symbol ?? RelationalOperatorsConst[operator]?.name ?? operator)
              : null
          }
        </span>

        <span className={`${clsPrefix}-item-content-value`}>
          {
            field?.dataType === DATA_TYPES.STR
              ? <>&quot;{value}&quot;</>
              : field?.dataType === DATA_TYPES.BOOL
                ? value === true ? 'True' : 'False'
                : field?.dataType === DATA_TYPES.NUM ? Number(value) : value
          }
        </span>
      </span>

      <span className={classNames(`${clsPrefix}-item-btns`, editable ? '' : 'hide')}>
        <Space>
          {
            openEdit !== undefined
              ? <Button
                type={'link'} icon={<EditOutlined />} size={'small'}
                onClick={openEdit} className={`${clsPrefix}-item-btns-btn`}
              />
              : null
          }
          <Button
            type={'link'} danger icon={<DeleteOutlined />} size={'small'}
            onClick={onDelete} className={`${clsPrefix}-item-btns-btn`}
          />
        </Space>
      </span>
    </span>
  )
}

ConditionItemBox.displayName = 'ConditionItemBox'
export default React.memo(ConditionItemBox)
