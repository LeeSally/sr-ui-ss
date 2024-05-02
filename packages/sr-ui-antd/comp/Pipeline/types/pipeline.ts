import type { PipelineNodeWithNext } from './nodeWithNext'
import { PipelineNodeWithRun } from './nodeWithRun'

export interface IPipeline {
  id: string | number
  name: string
  desc?: string

  trigger?: PipelineNodeWithNext.Trigger
}


export interface IPipelineWithRun {
  id: string | number
  name: string
  desc?: string

  trigger?: PipelineNodeWithRun.Trigger
}

