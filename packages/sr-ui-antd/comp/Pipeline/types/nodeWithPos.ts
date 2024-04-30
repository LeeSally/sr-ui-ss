import type { PipelineNodeDef, PipelineNodeWithNext } from './'

/**
 * Pipeline node with Position information in canvas
 */
export namespace PipelineNodeWithPos {
  interface IWithPos {
    gridPos: {
      start: [number, number]
      end: [number, number]
      chainIdx: number[]
    }
  }

  interface IWithNext {
    next?: PipelineNodeWithPos.Nexts
  }

  //===================================================================
  /**
   * Trigger Node
   * @description: a starter node to trigger a pipeline, always contains some conditions
   */
  export interface Trigger extends PipelineNodeDef.Trigger, IWithPos, IWithNext {
  }

  //===================================================================
  /**
   * Gateway Node
   * @description: a node to split process into several branches according to some judgement condition
   */

  //.................................
  /** 
   * If Node
   * @description: If branch node, judge by conditions to split process into true / false branch
   */
  export interface If extends PipelineNodeWithNext.If, IWithPos {
    trueNext?: Nexts
    falseNext?: Nexts
  }

  // .................................
  /** 
   * Switch Node
   * @description: Switch-case branch node, judge by a value to split process into several cases branches
   */
  export interface Switch extends PipelineNodeWithNext.Switch, IWithPos {
    caseNexts: Nexts[]
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

  // .................................
  // 2.1. Preset Tasks
  
  /**
   * Task to update data field 
   * (Preset task)
   */
  export interface TaskUpdate extends PipelineNodeDef.TaskUpdate, IWithPos, IWithNext {
  }

  /**
   * Task to browse MCH data
   * (Preset task)
   */
  export interface TaskMCH extends PipelineNodeDef.TaskMCH, IWithPos, IWithNext {
  }

  export type PresetTasks = TaskUpdate | TaskMCH

  // .................................
  /**
   * Custom Task Node's base interface
   */
  export interface TaskCustom<T extends string> extends PipelineNodeDef.TaskCustom<T>, IWithPos, IWithNext {
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
  export type All = Nexts | Trigger
}

