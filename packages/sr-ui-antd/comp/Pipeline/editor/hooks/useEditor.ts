
import type { PipelineNodeWithNext } from '../../types'

import useNodeAdd, { UsePipelineNodeAddProps } from './useNodeAdd'
import useNodeEdit, { UsePipelineNodeEditProps } from './useNodeEdit'
import useNodeDel, { UsePipelineNodeDelProps } from './useNodeDel'

export interface UsePipelineEditorProps extends UsePipelineNodeAddProps, UsePipelineNodeEditProps, UsePipelineNodeDelProps {
}

const usePipelineEditor = (
  trigger?: PipelineNodeWithNext.Trigger,
  onChange?: (val: PipelineNodeWithNext.Trigger) => void
): UsePipelineEditorProps => {

  const editHook = useNodeEdit(trigger, onChange)
  const delHook = useNodeDel(trigger, onChange, editHook.cancelEditing)
  const addHook = useNodeAdd(trigger, onChange)

  return {
    ...addHook,
    ...editHook,
    ...delHook
  }
}

export default usePipelineEditor
