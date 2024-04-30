import { createContext } from 'react'
import type { FieldProps } from '../QueryConditionEditor/types'
import type { PipelineNodeDef } from './types/nodeDef'

export interface PipelineContextProps {
  writableFields?: FieldProps[]
  readableFields?: FieldProps[]
  customTaskDefs?: Array<PipelineNodeDef.TaskCustom<any>>
}

export const pipelineCtxDefaultVal: PipelineContextProps = {
}

export const PipelineContext = createContext<PipelineContextProps>(pipelineCtxDefaultVal)
