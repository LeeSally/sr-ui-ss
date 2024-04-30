import type { PipelineNodeWithPos } from './'

// Pipeline base node's UI style
export interface IWithStyle {
  color?: 'default' | 'danger' | 'warning' | 'success'
  icon?: React.ReactElement
}

export interface IWithEditor {
  editable?: boolean
  editing?: boolean
  changed?: boolean
  onEdit?: (node: PipelineNodeWithPos.All) => void
  onDel?: (node: PipelineNodeWithPos.Nexts) => void
  saveEditing?: () => void
  cancelEditing?: () => void
}

export interface DOMPosSize {
  top: number
  left: number
  width: number
  height: number
}


export namespace FlowLine {
  export interface Item {
    pos: [number, number]
    tag?: { text: string, color?: string, size?: number }
    lineStyle?: { color: string, width: number }
  }

  export type Matrix = Item[][][]
}