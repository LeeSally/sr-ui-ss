import type { PIPELINE_NODE } from '../node/consts'
import type { PipelineNodeDef } from './nodeDef'

/**
 * Pipeline node with Next node
 */
export namespace PipelineNodeWithNext {
  /**
   * Interface to contains a next node
   */
  interface IWithNext {
    next?: Nexts
  }

  //===================================================================
  /**
   * Trigger Node
   * @description: a starter node to trigger a pipeline, always contains some conditions
   */
  export interface Trigger  extends PipelineNodeDef.Trigger, IWithNext {
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
  export interface If extends PipelineNodeDef.If {
    trueNext?: Nexts
    falseNext?: Nexts
  }

  /** 
   * Switch Node
   * @description: Switch-case branch node, judge by a value to split into several cases branches
   */
  export interface Switch extends PipelineNodeDef.Switch {
    caseNexts?: Array<Nexts | undefined>
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
  interface ITaskBase<T extends string> extends PipelineNodeDef.ITaskBase<T>, IWithNext {
  }

  // .................................
  // 3.1) Preset task

  /**
   * Task to update data field 
   * (Preset task)
   */
  export type TaskUpdate = ITaskBase<PIPELINE_NODE.PresetTaskKey.UPDATE_FIELDS>

  /**
   * Task to browse MCH data
   * (Preset task)
   */
  export type TaskMCH = ITaskBase<PIPELINE_NODE.PresetTaskKey.BROWSE_MCH>

  /**
   * Preset Tasks
   */
  export type PresetTasks = TaskUpdate | TaskMCH

  // .................................
  // 3.2) Customized task

  /**
   * Custom Task Node's base interface
   */
  export type CustomTask<T extends string> = ITaskBase<T>

  // ......................
  /**
   * All Tasks nodes
   * @description: a node to process task in = Preset Task Nodes  +  Custom Task Nodes
   */
  export type Tasks = PresetTasks| CustomTask<any>

  //  ====================================================================
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