import React, { useState, useEffect } from 'react'
import type { Key } from 'react'

import { useMemoizedFn } from 'ahooks'
import { isEquals } from 'sr-ui-utils'

import { QueryConditionContext, QueryConditionContextProps } from './context'
import type {
  RELATIONAL_OPERATORS, LOGIC_OPERATORS,
  ConditionGroupProps, ConditionGroupPropsWithId, ConditionItemProps, FieldProps
} from './types'

import ConditionGroupBox from './ConditionGroupBox'
import EditableConditionGroupBox from './EditableConditionGroupBox'

import { clsPrefix } from './vars'
import './style.less'

interface QueryConditionGroupEditorProps extends Omit<QueryConditionContextProps, 'addConditionItem' | 'delConditionItem' | 'addConditionGroup' | 'delConditionGroup'> {
  defaultExpanded?: boolean

  value?: ConditionGroupProps
  onChange?: (conds: ConditionGroupPropsWithId) => void
  clearAll?: () => void
}

const QueryConditionGroupEditor: React.FC<QueryConditionGroupEditorProps> = (props) => {
  const {
    fieldList,
    editable = false, nested = false, layout = 'inline', size = 'default', expandable = false,
    operatorOptionFixed = false, defaultExpanded = false,
    value, onChange, clearAll
  } = props

  const [curCondition, setCurCondition] = useState<ConditionGroupPropsWithId | undefined>()

  /**
   * Convert condition group tree to condition nodes with id
   * @param {ConditionGroupProps} conditions  condition group tree
   * @param {number} seq         sequence number of this node
   * @param {string} parentId    parent node's id
   */
  const convertConditonsTree = useMemoizedFn((
    condition: ConditionGroupProps,
    seq: number,
    parentId?: string
  ): ConditionGroupPropsWithId => {
    const nodeId = parentId === undefined ? '0' : `${parentId}-${seq.toString()}`
    const node = {
      ...condition,
      id: nodeId,
      items: condition?.items?.map((item, index) => {
        if (item.type === 'item') return item
        return convertConditonsTree(item, index, nodeId)
      })
    }
    return node
  })


  const getFields = (item: ConditionItemProps | ConditionGroupPropsWithId): string[] => {
    if (item.type === 'group') {
      const list = item.items?.map(itm => getFields(item)).flat()
      return list ?? []
    }
    return [item.field.id]
  }

  /**
   * Find target condition group
   * @param {Key} groupId   target group's id 
   * @param {ConditionGroupPropsWithId} group   group tree nodes
   * @returns 
   */
  const findTargetGroup = useMemoizedFn((
    groupId: Key,
    group: ConditionGroupPropsWithId | undefined
  ): ConditionGroupPropsWithId | undefined => {
    if (group?.id === groupId) {
      return group
    }
    for (let j = 0; j < (group?.items?.length ?? 0); j++) {
      const child = group?.items?.[j]
      if (child?.type !== 'group') continue
      const found = findTargetGroup(groupId, child)
      if (found !== undefined) return found
    }
    return undefined
  })


  /**
   * Find parent condition group
   * @param {Key} id    target condition item's id (condition item / condition group) 
   * @param {ConditionGroupPropsWithId} group    group tree noddes 
   * @returns 
   */
  const findParentGroup = useMemoizedFn((
    id: Key,
    group: ConditionGroupPropsWithId | undefined
  ): ConditionGroupPropsWithId | undefined => {
    const groupItems = group?.items?.filter(child => child.type === 'group') as ConditionGroupPropsWithId[]
    for (let i = 0; i < groupItems.length; i++) {
      const child = groupItems[i]
      if (child.id === id) return group
      const found = findParentGroup(id, child)
      if (found !== undefined) return found
    }
  })


  /**
   * Add one condition item
   * @param {Key} parentGroupId     parent condition group's id
   * @param {FieldProps} field      condition's field
   * @param {RELATIONAL_OPERATORS} operator      the operator of the condition
   * @param {any} value                       the value of the condition
   * @returns 
   */
  const addConditionItem = useMemoizedFn(async (
    parentGroupId: Key,
    field: FieldProps,
    operator: RELATIONAL_OPERATORS,
    value: any
  ): Promise<ConditionGroupPropsWithId | undefined> => {
    let error: Error | undefined
    let finalVal: ConditionGroupPropsWithId | undefined = curCondition
    setCurCondition(prev => {
      if (prev === undefined) {
        return prev
      }

      finalVal = prev
      const parentGroup = findTargetGroup(parentGroupId, prev)
      const targetIndex = parentGroup?.items?.findIndex(child => (
        child.type === 'item' && child.field.id === field.id && child.operator === operator && child.value === value
      ))

      if ((targetIndex ?? -1) >= 0) {
        error = new Error("Can't add duplicated item")
        return prev
      }

      if (parentGroup?.items !== undefined) {
        parentGroup.items = [...parentGroup?.items, { type: 'item', field, operator, value }]
        return { ...prev }
      }
      return prev
    })

    if (error !== undefined) {
      return await Promise.reject(error)
    } else {
      return await Promise.resolve(finalVal)
    }
  })

  /**
   * Delete one condition item
   * @param {Key} parentGroupId                parent condition group's id
   * @param {FieldProps} field                 the field of this condition item 
   * @param {RELATIONAL_OPERATORS} operator    the operator of the condition 
   * @param {any} value                        the value of the condition 
   * @returns 
   */
  const delConditionItem = useMemoizedFn(async (
    parentGroupId: Key,
    field: FieldProps,
    operator: RELATIONAL_OPERATORS,
    value: any
  ): Promise<ConditionGroupPropsWithId | undefined> => {
    let error: Error | undefined
    let finalVal: ConditionGroupPropsWithId | undefined = curCondition

    setCurCondition(prev => {
      if (prev === undefined) {
        // nothing to delete
        return prev
      }

      finalVal = prev
      const parentGroup = findTargetGroup(parentGroupId, prev)
      const targetIndex = parentGroup?.items?.findIndex(child => (
        child.type === 'item' && child.field.id === field.id && child.operator === operator && child.value === value
      ))

      if (parentGroup?.items !== undefined && targetIndex !== undefined) {
        parentGroup.items = [
          ...parentGroup.items.slice(0, targetIndex),
          ...parentGroup.items.slice(targetIndex + 1)
        ]
        return { ...prev }
      } else {
        error = new Error(`Can't find condition item in group ${parentGroupId}`)
      }
      return prev
    })

    if (error !== undefined) {
      return await Promise.reject(error)
    } else {
      return await Promise.resolve(finalVal)
    }
  })

  /**
   * Add condition group
   * @param {Key} groupId      new group's id
   * @param {LOGIC_OPERATORS} operator     the logic operator of this group
   * @param {Key} parentGroupId     parent group's id
   * @returns 
   */
  const addConditionGroup = useMemoizedFn(async (
    groupId: Key,
    operator: LOGIC_OPERATORS | string,
    parentGroupId: Key
  ): Promise<ConditionGroupPropsWithId | undefined> => {
    let error: Error | undefined
    let finalVal: ConditionGroupPropsWithId | undefined = curCondition

    setCurCondition(prev => {
      if (prev === undefined) {
        // root group node
        prev = { type: 'group', id: groupId, operator, items: [] }
        finalVal = prev
        return { ...prev }
      }
      finalVal = prev
      const parentGroup = findTargetGroup(parentGroupId, prev)
      if (parentGroup?.items !== undefined) {
        parentGroup.items = [
          ...parentGroup.items,
          {
            type: 'group',
            id: groupId,
            operator,
            items: []
          }
        ]

        return { ...prev }
      } else {
        error = new Error(`Can't find parent condition group: ${parentGroupId}`)
      }

      return prev
    })

    if (error !== undefined) {
      return await Promise.reject(error)
    } else {
      return await Promise.resolve(finalVal)
    }
  })

  /**
   * Delete condition group
   * @param {Key} groupId    the condition group's id
   * @returns 
   */
  const delConditionGroup = useMemoizedFn(async (groupId: Key): Promise<ConditionGroupPropsWithId | undefined> => {
    let error: Error | undefined
    let finalVal: ConditionGroupPropsWithId | undefined = curCondition

    setCurCondition(prev => {
      if (prev === undefined) {
        // nothing to delete
        return prev
      }
      finalVal = prev
      if (prev.id === groupId) {
        // delete root group
        clearAll?.()
        return undefined
      }
      const parent = findParentGroup(groupId, prev)
      const targetIndex = parent?.items?.findIndex(child => child.type === 'group' && child.id === groupId) ?? -1
      if (parent?.items !== undefined && targetIndex >= 0) {
        parent.items = [...parent.items.slice(0, targetIndex), ...parent.items.slice(targetIndex + 1)]
        return { ...prev }
      } else {
        error = new Error(`Can't find condition group: ${groupId}`)
      }
      return prev
    })

    if (error !== undefined) {
      return await Promise.reject(error)
    } else {
      return await Promise.resolve(finalVal)
    }
  })

  const onFinishRootGroup = (condition?: ConditionGroupPropsWithId): void => {
    if (condition === undefined) {
      clearAll?.()
    }
  }

  useEffect(() => {
    if (curCondition === undefined) return
    onChange?.(curCondition)
  }, [curCondition])

  useEffect(() => {
    if (value === undefined) {
      setCurCondition(undefined)
      return
    }
    const converted = convertConditonsTree(value, 0)
    const equals = isEquals(converted, curCondition)
    if (!equals) {
      setCurCondition(converted)
    }
  }, [value])


  return (
    <QueryConditionContext.Provider value={{
      fieldList,
      editable,
      expandable,
      nested,
      operatorOptionFixed,
      layout,
      size,
      addConditionItem,
      delConditionItem,
      addConditionGroup,
      delConditionGroup,
    }}>
      {
        curCondition === undefined
          ? editable
            ? <EditableConditionGroupBox
              seq={0} parentId={'0'} cancelEditing={onFinishRootGroup}
            />
            : <div className={`${clsPrefix}-empty`}>{'<Empty>'}</div>
          : <ConditionGroupBox {...curCondition} defaultExpanded={defaultExpanded} />
      }
    </QueryConditionContext.Provider>
  )
}

QueryConditionGroupEditor.displayName = 'QueryConditionGroupEditor'
export default React.memo(QueryConditionGroupEditor)
