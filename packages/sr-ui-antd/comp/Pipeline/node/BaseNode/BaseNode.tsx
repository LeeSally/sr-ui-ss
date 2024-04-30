import React, { useEffect } from 'react'

import { Space, Button, Popconfirm, Badge } from 'antd'
import {
  DownOutlined, UpOutlined, QuestionCircleOutlined,
  EditOutlined, CloseOutlined, SaveOutlined, DeleteOutlined, UserOutlined
} from '@ant-design/icons'
import * as antIcons from '@ant-design/icons'
import { useToggle } from 'ahooks'

import { classNames } from 'sr-ui-utils'

import { clsPrefix } from '../../vars'
import './style.less'
import { IWithStyle } from '../../types'

interface PipelineBaseNodeCompProps extends React.PropsWithChildren<any>, IWithStyle {
  label: string
  abstract?: string
  desc?: string

  editable?: boolean
  editing?: boolean
  startEdit?: () => void
  endEdit?: () => void

  changed?: boolean

  onSave?: (val: any) => void
  onDel?: () => void
}

/**
 * Pipeline's base node
 * @param props 
 * @returns 
 */
const PipelineBaseNode: React.FC<PipelineBaseNodeCompProps> = (props) => {
  const {
    label, icon, abstract, desc, color = 'default',
    children,
    editable = false, editing = false, startEdit, endEdit,
    changed = false, onSave, onDel
  } = props

  const [expanded, { toggle: toggleExpand, set: setExpand }] = useToggle(false)

  useEffect(() => {
    if (editing) {
      setExpand(true)
    }
  }, [editing])

  return (
    <div className={classNames(
      `${clsPrefix}-node-base`,
      editing ? 'editing' : '',
      color
    )}>
      <div className={classNames(`${clsPrefix}-node-base-label`, expanded ? '' : 'up')}>
        <span className={classNames(`${clsPrefix}-node-base-label-icon-box`, color)}>
          {icon ?? <QuestionCircleOutlined />}
        </span>
        <span className={`${clsPrefix}-node-base-label-title`}>
          <span className={`${clsPrefix}-node-base-label-title-inner`}>
            <span className={`${clsPrefix}-node-base-label-title-inner-name`} title={label}>
              {label}
            </span>
            <span className={classNames(`${clsPrefix}-node-base-label-title-inner-btn-edit`,
              !editable ? 'hide' : '',
              editing ? 'editing' : ''
            )}>
              {
                editing
                  ? <Space size={3}>
                    <Button type={'link'} size={'small'}
                      icon={<Badge dot size={'small'} count={changed ? 1 : 0}>
                        <SaveOutlined />
                      </Badge>}
                      onClick={onSave} title={'Save Change'} disabled={!changed}
                    />
                    <Button type={'link'} size={'small'} icon={<CloseOutlined />} onClick={endEdit} title={'Cancel Change'} />
                  </Space>
                  : <Space size={3}>
                    <Button type={'link'} size={'small'} icon={<EditOutlined />} onClick={startEdit} />
                    {
                      onDel !== undefined
                        ? <Popconfirm
                          placement={'topLeft'}
                          title={'Confirm to delete?'}
                          onConfirm={onDel}
                          okText={'Yes, Delete!'}
                          okButtonProps={{ danger: true }}
                          cancelText={'No'}
                          cancelButtonProps={{ type: 'link' }}
                        >
                          <Button type={'link'} size={'small'} icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                        : null
                    }
                  </Space>
              }
            </span>
          </span>
        </span>
        <a className={`${clsPrefix}-node-base-label-btn-expand`} onClick={toggleExpand}>
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </a>
      </div>
      {
        abstract !== undefined
          ? <div className={classNames(`${clsPrefix}-node-base-desc`, expanded ? 'expand' : '')}>
            {abstract}
          </div>
          : null
      }
      {
        desc !== undefined && expanded
          ? <div className={classNames(`${clsPrefix}-node-base-desc`, expanded ? 'expand' : '')}>
            <Space>
              <UserOutlined />
              {desc}
            </Space>
          </div>
          : null
      }
      {
        expanded
          ? <div className={`${clsPrefix}-node-base-detail-box`}>
            {children}
          </div>
          : null
      }
    </div>
  )

}

export default PipelineBaseNode
