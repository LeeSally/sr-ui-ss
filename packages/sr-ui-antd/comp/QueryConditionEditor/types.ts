import type { Key } from 'react'

export type OperatorsProps<T extends number | string> = Record<T, { name: string, symbol?: string}>

/**
 * Relational Operators
 * 关系运算符
 */
export enum RELATIONAL_OPERATORS {
  EQUAL_TO = '=',
  CONTAIN = 'contain',

  GREATER_THAN = '>',
  LESS_THAN = '<'
}

/**
 * Logic Operators
 * 逻辑运算符
 */
export enum LOGIC_OPERATORS {
  AND = 'and',
  OR = 'or'
}

/**
 * Data Type
 * 数据类型
 */
export enum DATA_TYPES {
  NUM = 'number',
  STR = 'string',
  BOOL = 'boolean',
  LIST = 'list'
}

interface FieldBaseProps<T extends DATA_TYPES> {
  name: string
  id: string
  dataType?: T
}

export type BasicFieldProps = FieldBaseProps<DATA_TYPES.NUM> | FieldBaseProps<DATA_TYPES.STR>  | FieldBaseProps<DATA_TYPES.BOOL>
export interface ListFieldProps extends FieldBaseProps<DATA_TYPES.LIST> {
  listOptions: string[] | number[]
}

export type FieldProps = BasicFieldProps | ListFieldProps

export interface ConditionTypeInterface<T extends 'group' | 'item'> {
  type: T
}

export interface ConditionItemProps extends ConditionTypeInterface<'item'> {
  field: FieldProps
  value: string | number | boolean
  operator: RELATIONAL_OPERATORS
}

export interface ConditionGroupProps extends ConditionTypeInterface<'group'> {
  operator: LOGIC_OPERATORS | string
  items?: Array<ConditionItemProps | ConditionGroupProps>
}

export interface ConditionGroupPropsWithId extends ConditionGroupProps {
  id: Key
  items?: Array<ConditionItemProps | ConditionGroupPropsWithId>
}






