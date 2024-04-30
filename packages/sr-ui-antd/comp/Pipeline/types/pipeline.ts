import { PipelineNodeWithNext } from './nodeWithNext'

export interface IPipeline {
  id: string | number
  name: string
  desc?: string

  trigger?: PipelineNodeWithNext.Trigger
}

