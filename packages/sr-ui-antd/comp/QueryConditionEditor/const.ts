import type { OperatorsProps } from './types'
import { DATA_TYPES,RELATIONAL_OPERATORS, LOGIC_OPERATORS } from './types'

export const RelationalOperatorsConst: OperatorsProps<RELATIONAL_OPERATORS> = {
  [RELATIONAL_OPERATORS.EQUAL_TO]: {
    name: 'equals',
    symbol: '='
  },
  [RELATIONAL_OPERATORS.CONTAIN]: {
    name: 'contains',
  },
  [RELATIONAL_OPERATORS.GREATER_THAN]: {
    name: 'greater than',
    symbol: '>'
  },
  [RELATIONAL_OPERATORS.LESS_THAN]: {
    name: 'less than',
    symbol: '<'
  }
}

export const LogicOperatorsConst: OperatorsProps<LOGIC_OPERATORS> = {
  [LOGIC_OPERATORS.AND]: {
    name: 'AND',
    symbol: '&'
  },
  [LOGIC_OPERATORS.OR]: {
    name: 'OR',
    symbol: '|'
  }
}

export const DataTypeOperatorMap: Record<DATA_TYPES, RELATIONAL_OPERATORS[]> = {
  [DATA_TYPES.STR]: [
    RELATIONAL_OPERATORS.CONTAIN,
    RELATIONAL_OPERATORS.EQUAL_TO
  ],
  [DATA_TYPES.NUM]: [
    RELATIONAL_OPERATORS.GREATER_THAN,
    RELATIONAL_OPERATORS.LESS_THAN,
    RELATIONAL_OPERATORS.EQUAL_TO
  ],
  [DATA_TYPES.BOOL]: [
    RELATIONAL_OPERATORS.EQUAL_TO
  ],
  [DATA_TYPES.LIST]: [
    RELATIONAL_OPERATORS.EQUAL_TO
  ],
}

