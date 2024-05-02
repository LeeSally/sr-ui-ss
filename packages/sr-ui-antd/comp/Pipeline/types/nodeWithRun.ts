import type { PIPELINE_NODE } from '../node/consts'
import type { PipelineNodeWithNext } from './nodeWithNext'

export enum RunStatus {
  NOT_START = 'not_start',
  RUNNING = 'running',
  WAIT = 'wait',
  SUCCESS = 'success',
  FAILED = 'failed'
}
/**
 * Interface to contains a run result status
 */
export interface IWithRun {
  run?: {
    status: RunStatus
    desc: string
    processingCount: number
  }
}

/**
 * Pipeline node with run result status
 */
export namespace PipelineNodeWithRun {
  // ===================================================================
  /**
   * Trigger Node
   * @description: a starter node to trigger a pipeline, always contains some conditions
   */
  export interface Trigger extends PipelineNodeWithNext.Trigger, IWithRun {}

  // ===================================================================
  /**
   * Gateway Node
   * @description: a node to split process into several branches according to some judgement condition
   */

  /** 
   * If Node
   * @description: If branch node, judge by conditions to split process into true / false branch
   */
  export interface If extends PipelineNodeWithNext.If, IWithRun {
    trueNext?: Nexts
    falseNext?: Nexts
  }

  /** 
   * Switch Node
   * @description: Switch-case branch node, judge by a value to split into several cases branches
   */
  export interface Switch extends PipelineNodeWithNext.Switch, IWithRun {
    caseNexts?: Array<Nexts | undefined>
  }

  /**
   * Gateway Pipeline Node = If + Switch
   */
  export type Gateway = If | Switch

  // ===================================================================
  /**
   * Task Node
   * @description:  A node to process sequentially
   */
  // .................................
  // 3.1) Preset task

  /**
   * Task to update data field 
   * (Preset task)
   */
  export interface TaskUpdate extends PipelineNodeWithNext.TaskUpdate, IWithRun {}

  /**
   * Task to browse MCH data
   * (Preset task)
   */
  export interface TaskMCH extends PipelineNodeWithNext.TaskMCH, IWithRun {}

  /**
   * Preset Tasks
   */
  export type PresetTasks = TaskUpdate | TaskMCH

  // .................................
  // 3.2) Customized task

  /**
   * Custom Task Node's base interface
   */
  export interface TaskCustom<T extends string> extends PipelineNodeWithNext.TaskCustom<T>, IWithRun {}

  // ......................
  /**
   * All Tasks nodes
   * @description: a node to process task in = Preset Task Nodes  +  Custom Task Nodes
   */
  export type Tasks = PresetTasks | TaskCustom<any>

  // ====================================================================
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