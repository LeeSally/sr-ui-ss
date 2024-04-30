import { createContext } from 'react'
import type { Key } from 'react'

import type { FieldProps, ConditionGroupPropsWithId, RELATIONAL_OPERATORS, LOGIC_OPERATORS } from './types'


export interface QueryConditionContextProps {
  fieldList?: FieldProps[]
  editable?: boolean
  operatorOptionFixed?: boolean
  nested?: boolean

  layout?: 'inline' | 'vertical'
  size?: 'default' | 'small'
  expandable?: boolean

  addConditionItem?: (groupId: Key, field: FieldProps, operator: RELATIONAL_OPERATORS, value: any) => Promise<ConditionGroupPropsWithId | undefined>
  delConditionItem?: (groupId: Key, field: FieldProps, operator: RELATIONAL_OPERATORS, value: any) => Promise<ConditionGroupPropsWithId | undefined>

  addConditionGroup?: (groupId: Key, operator: LOGIC_OPERATORS | string, parentGroupId: Key) => Promise<ConditionGroupPropsWithId | undefined>
  delConditionGroup?: (groupId: Key) => Promise<ConditionGroupPropsWithId | undefined>
}

export const QueryConditionContext = createContext<QueryConditionContextProps>({
  fieldList: []
})
