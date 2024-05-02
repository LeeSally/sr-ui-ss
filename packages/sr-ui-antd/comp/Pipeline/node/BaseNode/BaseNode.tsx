import React, { useEffect, useMemo } from 'react'

import { Space, Button, Popconfirm, Badge } from 'antd'
import {
  DownOutlined, UpOutlined, QuestionCircleOutlined,
  EditOutlined, CloseOutlined, SaveOutlined, DeleteOutlined, UserOutlined
} from '@ant-design/icons'
import { useToggle } from 'ahooks'

import { classNames } from 'sr-ui-utils'

import type { IWithStyle, IWithEditor, IWithRun } from '../../types'

import { clsPrefix } from '../../vars'
import './style.less'
import { RUN_STATUS_STYLE } from './consts'
import { RunStatus } from '../../types/nodeWithRun'

interface PipelineBaseNodeCompProps extends React.PropsWithChildren<any>, IWithStyle, IWithEditor, IWithRun {
  label: string
  abstract?: string
  desc?: string

  onEdit?: () => void
  onDel?: () => void
}

/**
 * Pipeline's base node
 * @param props 
 * @returns 
 */
const PipelineBaseNode: React.FC<PipelineBaseNodeCompProps> = (props) => {
  const {
    label, abstract, desc,
    icon, color = 'default', run,
    children,
    editable = false, editing = false, changed = false,
    saveEditing, cancelEditing,
    onEdit, onDel
  } = props

  const [expanded, { toggle: toggleExpand, set: setExpand }] = useToggle(false)

  useEffect(() => {
    if (editing) {
      setExpand(true)
    }
  }, [editing])

  const runStatus = useMemo(() => {
    return RUN_STATUS_STYLE[run?.status as RunStatus]
  }, [run?.status])

  return (
    <div
      className={classNames(
        `${clsPrefix}-node-base`,
        editing ? 'editing' : '',
        color
      )}
      style={{ borderColor: runStatus?.color, backgroundColor: runStatus?.bgColor }}
    >
      <div className={classNames(`${clsPrefix}-node-base-label`, expanded ? '' : 'up')}>
        <span className={classNames(`${clsPrefix}-node-base-label-icon-box`, color)}>
          {icon ?? <QuestionCircleOutlined />}
        </span>
        <span className={`${clsPrefix}-node-base-label-title`}>
          <span className={`${clsPrefix}-node-base-label-title-inner`}>
            <span className={`${clsPrefix}-node-base-label-title-inner-name`} title={label}>
              {label}
            </span>
            <span
              className={classNames(`${clsPrefix}-node-base-label-title-inner-status`)}
              title={runStatus?.label}
            >
              <span
                className={classNames(`${clsPrefix}-node-base-label-title-inner-status-icon`)}
                style={{ backgroundColor: runStatus?.color }}
              >
                {runStatus?.icon}
              </span>
              <span
                className={classNames(`${clsPrefix}-node-base-label-title-inner-status-label`)}
                style={{ color: runStatus?.color }}
              >
                {runStatus?.label}
              </span>
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
                      onClick={saveEditing} title={'Save Change'} disabled={!changed}
                    />
                    <Button type={'link'} size={'small'} icon={<CloseOutlined />} onClick={cancelEditing} title={'Cancel Change'} />
                  </Space>
                  : <Space size={3}>
                    <Button type={'link'} size={'small'} icon={<EditOutlined />} onClick={onEdit} />
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
