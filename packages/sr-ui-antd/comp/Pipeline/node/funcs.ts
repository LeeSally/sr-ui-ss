import type { ConditionGroupProps, ConditionItemProps } from '../../QueryConditionEditor/types'

export const stringfyCondition = (cond: ConditionGroupProps | ConditionItemProps): string => {
  if(cond.type === 'group') {
    const child = cond?.items?.map(item => {
      return stringfyCondition(item)
    })
    return `(${child?.join(` ${cond.operator} `)})`
  } else if(cond.type === 'item') {
    return `[${cond.field.name}] ${cond.operator} "${String(cond.value)}"`
  }
  return ''
}

