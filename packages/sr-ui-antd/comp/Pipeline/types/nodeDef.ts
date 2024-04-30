import type {
  ConditionGroupProps,
  ConditionItemProps,
  FieldProps
} from '../../QueryConditionEditor/types'
import { IWithStyle } from './'
import type { PIPELINE_NODE } from '../node/consts'

/**
 * Pipeline Node's basic definition
 */
export namespace PipelineNodeDef {
  /**
   * Base interface
   */
  export interface IBase<T extends PIPELINE_NODE.Type = PIPELINE_NODE.Type.TASK> {
    nodeType?: T
    nodeName?: string
    desc?: string
  }

  //===================================================================
  /**
   * Trigger Node
   * @description: a starter node to trigger a pipeline, always contains some conditions
   */
  export interface Trigger extends IBase<PIPELINE_NODE.Type.TRIGGER> {
    condition?: ConditionGroupProps | ConditionItemProps
  }

  //===================================================================
  /**
   * Gateway Node
   * @description: a node to split process into several branches according to some judgement condition
   */

  /** 
   * If Node
   * @description: If branch node, judge by conditions to split process into true / false branch
   */
  export interface If extends IBase<PIPELINE_NODE.Type.IF> {
    judgeCondition?: ConditionGroupProps | ConditionItemProps
  }

  /** 
   * Switch Node
   * @description: Switch-case branch node, judge by a value to split process into several cases branches
   */
  export interface Switch extends IBase<PIPELINE_NODE.Type.SWITCH> {
    judgeField?: FieldProps
    caseGroups?: Array<Array<string | number>>
  }

  /**
   * Gateway Pipeline Node = If + Switch
   */
  export type Gateway = If | Switch

  //===================================================================
  /**
   * Task Node
   * @description:  A node to process sequentially
   */

  /**
   * Task Node's base interface
   */
  export interface ITaskBase<T extends string> extends IBase<PIPELINE_NODE.Type.TASK> {
    taskKey?: T
    taskName?: string
  }

  // ......................
  // 3.1) Preset task Node

  /**
   * Task to update data field 
   * (Preset task)
   */
  export interface TaskUpdate extends ITaskBase<PIPELINE_NODE.PresetTaskKey.UPDATE_FIELDS> {
    fields?: FieldProps[]
  }

  /**
   * Task to browse MCH data
   * (Preset task)
   */
  export interface TaskMCH extends ITaskBase<PIPELINE_NODE.PresetTaskKey.BROWSE_MCH> {
    browseList?: Array<{
      transCode: 'BAPL' | 'BDSL' | 'BCSM' | 'BHPS' | 'BFCL' | 'KSAF'
      fields: FieldProps[]
      default?: {
        input?: Record<string, string>
        output?: string[]
      }
    }>
  }

  /**
   * Preset Tasks
   */
  export type PresetTasks = TaskUpdate | TaskMCH

  // ......................
  // 3.2) Customized Task Node

  /**
   * Custom Task Node's base interface
   */
  export interface TaskCustom<T extends string> extends ITaskBase<T>, Omit<IWithStyle, 'icon'> {
    params?: FieldProps[]
  }

  // ......................
  /**
   * All Tasks Nodes = Preset Task Nodes  +  Custom Task Nodes
   */
  export type Tasks = PresetTasks | TaskCustom<any>

  // ----------------------------------------------------
  /**
   * Next Pipeline Nodes: Gateway Nodes + Task Nodes
   */
  export type Nexts = Gateway | Tasks

  // =============================================
  /**
   * All Pipeilne Nodes
   */
  export type All = Trigger | Nexts
}