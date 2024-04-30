import React from 'react'

import {
  SearchOutlined, EditOutlined, ForkOutlined,
  PartitionOutlined, CaretRightOutlined, CarryOutOutlined
} from '@ant-design/icons'

import type { PipelineNodeDef, IWithStyle } from '../types'


export namespace PIPELINE_NODE {

  /**
   * Pipeline node's type
   */
  export enum Type {
    TRIGGER = 'trigger',
    IF = 'if',
    SWITCH = 'switch',
    TASK = 'task'
  }

  export type GatewayTypes = Type.IF | Type.SWITCH

  export enum PresetTaskKey {
    UPDATE_FIELDS = 'update',
    BROWSE_MCH = 'mch'
  }

  export type PresetTaskTypes = PresetTaskKey.UPDATE_FIELDS | PresetTaskKey.BROWSE_MCH
  export type TaskTypes = PresetTaskKey | 'custom'

  export type AllTypes = Type.TRIGGER | Type.IF | Type.SWITCH | Type.TASK

  export const PRESET_TASK_DEFS: Record<PresetTaskKey, PipelineNodeDef.PresetTasks> = {
    [PresetTaskKey.UPDATE_FIELDS]: {
      nodeType: Type.TASK,
      nodeName: 'Task',
      taskKey: PresetTaskKey.UPDATE_FIELDS,
      taskName: 'Update Fields'
    },
    [PresetTaskKey.BROWSE_MCH]: {
      nodeType: Type.TASK,
      nodeName: 'Task',
      taskKey: PresetTaskKey.BROWSE_MCH,
      taskName: 'Browse MCH'
    }
  }

  export const PRESET_TASK_STYLES: Record<PresetTaskKey, IWithStyle> = {
    [PresetTaskKey.UPDATE_FIELDS]: {
      icon: <EditOutlined />,
      color: 'success'
    },
    [PresetTaskKey.BROWSE_MCH]: {
      icon: <SearchOutlined />,
      color: 'default'
    }
  }


  export const DEFS: Record<Type, PipelineNodeDef.All> = {
    [Type.IF]: {
      nodeType: Type.IF,
      nodeName: 'If',
    },
    [Type.SWITCH]: {
      nodeType: Type.SWITCH,
      nodeName: 'Switch',
    },
    [Type.TASK]: {
      nodeType: Type.TASK,
      nodeName: 'Task',
    },
    [Type.TRIGGER]: {
      nodeType: Type.TRIGGER,
      nodeName: 'Trigger',
    }
  }


  export const STYLES: Record<Type, IWithStyle> = {
    [Type.IF]: {
      icon: <ForkOutlined />,
      color: 'warning'
    },
    [Type.SWITCH]: {
      icon: <PartitionOutlined />,
      color: 'warning'
    },
    [Type.TASK]: {
      icon: <CarryOutOutlined />,
      color: 'success'
    },
    [Type.TRIGGER]: {
      icon: <CaretRightOutlined />,
      color: 'danger'
    }
  }
}

