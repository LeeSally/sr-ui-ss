
import { PauseOutlined, EllipsisOutlined, LoadingOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

import { RunStatus } from '../../types/nodeWithRun'

interface StatusStyle {
  color: string
  bgColor: string
  icon: React.ReactElement
  label: string
}
export const RUN_STATUS_STYLE: Record<RunStatus, StatusStyle> = {
  [RunStatus.NOT_START]: {
    icon: <EllipsisOutlined />,
    color: '#ccc',
    bgColor: '#f5f5f5',
    label: 'Not Start'
  },
  [RunStatus.WAIT]: {
    icon: <PauseOutlined />,
    color: '#ffc53d',
    bgColor: '#feffe6',
    label: 'Wait'
  },
  [RunStatus.RUNNING]: {
    icon: <LoadingOutlined />,
    color: '#69b1ff',
    bgColor: '#e6f4ff',
    label: 'Running'
  },
  [RunStatus.SUCCESS]: {
    icon: <CheckOutlined />,
    color: '#95de64',
    bgColor: '#f6ffed',
    label: 'Success'
  },
  [RunStatus.FAILED]: {
    icon: <CloseOutlined />,
    color: '#ff4d4f',
    bgColor: '#fff1f0',
    label: 'Failed'
  }

}