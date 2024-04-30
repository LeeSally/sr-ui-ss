import { __awaiter, __generator, __extends, __spreadArray, __assign } from '../../../../../node_modules/tslib/tslib.js';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { Space, Button, Select, Input, Dropdown, Badge, Popconfirm, Descriptions, Typography, Tag, Divider, Table, List } from 'antd';
import { EditOutlined, SearchOutlined, ForkOutlined, PartitionOutlined, CarryOutOutlined, CaretRightOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, WarningOutlined, TagOutlined, TagsOutlined, DownOutlined, InboxOutlined, PlusOutlined, PlusCircleOutlined, QuestionCircleOutlined, SaveOutlined, UpOutlined, UserOutlined, SubnodeOutlined } from '@ant-design/icons';
import { useMemoizedFn, useBoolean, useToggle } from 'ahooks';

import { classNames, isEquals } from 'sr-ui-utils'
import { QueryConditionItemListEditor, QueryConditionSelector } from './sr-ui-antd-query-condition'


var PIPELINE_NODE;
(function (PIPELINE_NODE) {
    var _a, _b, _c, _d;
    /**
     * Pipeline node's type
     */
    var Type;
    (function (Type) {
        Type["TRIGGER"] = "trigger";
        Type["IF"] = "if";
        Type["SWITCH"] = "switch";
        Type["TASK"] = "task";
    })(Type = PIPELINE_NODE.Type || (PIPELINE_NODE.Type = {}));
    var PresetTaskKey;
    (function (PresetTaskKey) {
        PresetTaskKey["UPDATE_FIELDS"] = "update";
        PresetTaskKey["BROWSE_MCH"] = "mch";
    })(PresetTaskKey = PIPELINE_NODE.PresetTaskKey || (PIPELINE_NODE.PresetTaskKey = {}));
    PIPELINE_NODE.PRESET_TASK_DEFS = (_a = {},
        _a[PresetTaskKey.UPDATE_FIELDS] = {
            nodeType: Type.TASK,
            nodeName: 'Task',
            taskKey: PresetTaskKey.UPDATE_FIELDS,
            taskName: 'Update Fields'
        },
        _a[PresetTaskKey.BROWSE_MCH] = {
            nodeType: Type.TASK,
            nodeName: 'Task',
            taskKey: PresetTaskKey.BROWSE_MCH,
            taskName: 'Browse MCH'
        },
        _a);
    PIPELINE_NODE.PRESET_TASK_STYLES = (_b = {},
        _b[PresetTaskKey.UPDATE_FIELDS] = {
            icon: jsx(EditOutlined, {}),
            color: 'success'
        },
        _b[PresetTaskKey.BROWSE_MCH] = {
            icon: jsx(SearchOutlined, {}),
            color: 'default'
        },
        _b);
    PIPELINE_NODE.DEFS = (_c = {},
        _c[Type.IF] = {
            nodeType: Type.IF,
            nodeName: 'If',
        },
        _c[Type.SWITCH] = {
            nodeType: Type.SWITCH,
            nodeName: 'Switch',
        },
        _c[Type.TASK] = {
            nodeType: Type.TASK,
            nodeName: 'Task',
        },
        _c[Type.TRIGGER] = {
            nodeType: Type.TRIGGER,
            nodeName: 'Trigger',
        },
        _c);
    PIPELINE_NODE.STYLES = (_d = {},
        _d[Type.IF] = {
            icon: jsx(ForkOutlined, {}),
            color: 'warning'
        },
        _d[Type.SWITCH] = {
            icon: jsx(PartitionOutlined, {}),
            color: 'warning'
        },
        _d[Type.TASK] = {
            icon: jsx(CarryOutOutlined, {}),
            color: 'success'
        },
        _d[Type.TRIGGER] = {
            icon: jsx(CaretRightOutlined, {}),
            color: 'danger'
        },
        _d);
})(PIPELINE_NODE || (PIPELINE_NODE = {}));

var pipelineCtxDefaultVal = {};
var PipelineContext = createContext(pipelineCtxDefaultVal);

/**
   * Clone object using JSON.parse method
   * @param {any} raw
   */
var cloneObject = function (raw) {
    if (raw === undefined)
        return;
    try {
        var clonedObj = JSON.parse(JSON.stringify(raw));
        return clonedObj;
    }
    catch (error) {
        console.error('[Error] JSON parse', raw, error);
        return;
    }
};

/**
 * Traverse Pipeline If node
 * @param {PipelineNodeWithNext.If} ifNode
 * @param {[number, number]} start         coordinate of this node's start position
 * @param idx
 * @returns
 */
var traverseIfNode = function (ifNode, start, idx) {
    var _a, _b, _c, _d, _e;
    var trueNode = ifNode.trueNext === undefined
        ? undefined
        : traverseNode(ifNode.trueNext, [start[0] + 1, start[1]], __spreadArray(__spreadArray([], idx, true), [0], false));
    var falseNode = ifNode.falseNext === undefined
        ? undefined
        : traverseNode(ifNode.falseNext, [start[0] + 1, ((_a = trueNode === null || trueNode === void 0 ? void 0 : trueNode.gridPos.end[1]) !== null && _a !== void 0 ? _a : start[1]) + 1], __spreadArray(__spreadArray([], idx, true), [1], false));
    return (__assign(__assign({}, ifNode), { gridPos: {
            chainIdx: idx,
            start: start,
            end: [
                Math.max((_b = trueNode === null || trueNode === void 0 ? void 0 : trueNode.gridPos.end[0]) !== null && _b !== void 0 ? _b : start[0], (_c = falseNode === null || falseNode === void 0 ? void 0 : falseNode.gridPos.end[0]) !== null && _c !== void 0 ? _c : start[0]),
                Math.max((_d = trueNode === null || trueNode === void 0 ? void 0 : trueNode.gridPos.end[1]) !== null && _d !== void 0 ? _d : start[1], (_e = falseNode === null || falseNode === void 0 ? void 0 : falseNode.gridPos.end[1]) !== null && _e !== void 0 ? _e : start[1]),
            ],
        }, trueNext: trueNode, falseNext: falseNode }));
};
/**
 * Traverse Pipeline Switch Node
 * @param {PipelineNodeWithNext.Switch} node
 * @param {[number, number]} start         coordinate of this node's start position
 * @param {number[]} idx
 * @returns
 */
var traverseSwitchNode = function (node, start, idx) {
    var _a;
    var caseNexts = [];
    var prevPos = [start[0], start[1] - 1];
    var maxEnd = [start[0], start[1]];
    (_a = node.caseGroups) === null || _a === void 0 ? void 0 : _a.map(function (cases, index) {
        var _a, _b, _c, _d, _e;
        var caseNext = (_a = node.caseNexts) === null || _a === void 0 ? void 0 : _a[index];
        if (caseNext === undefined)
            return undefined;
        var caseNode = traverseNode(caseNext, [start[0] + 1, prevPos[1] + 1], __spreadArray(__spreadArray([], idx, true), [index], false));
        if (caseNode !== undefined) {
            caseNexts.push(caseNode);
        }
        if ((caseNode === null || caseNode === void 0 ? void 0 : caseNode.gridPos.end) !== undefined) {
            if (((_b = caseNode.gridPos.end) === null || _b === void 0 ? void 0 : _b[0]) > maxEnd[0]) {
                maxEnd[0] = (_c = caseNode === null || caseNode === void 0 ? void 0 : caseNode.gridPos.end) === null || _c === void 0 ? void 0 : _c[0];
            }
            if (((_d = caseNode.gridPos.end) === null || _d === void 0 ? void 0 : _d[1]) > maxEnd[1]) {
                maxEnd[1] = (_e = caseNode === null || caseNode === void 0 ? void 0 : caseNode.gridPos.end) === null || _e === void 0 ? void 0 : _e[1];
            }
        }
        prevPos = [start[0] + 1, prevPos[1] + 1];
        return index;
    });
    return (__assign(__assign({}, node), { gridPos: {
            chainIdx: idx,
            start: start,
            end: maxEnd,
        }, caseNexts: caseNexts }));
};
/**
 * Traverse Pipeline Task node
 * @param {PipelineNodeWithNext.Tasks} node
 * @param {[number, number]} start
 * @param {number[]} idx
 * @returns
 */
var traverseTaskNode = function (node, start, idx) {
    var _a, _b;
    var nextWithPos = node.next === undefined
        ? undefined
        : traverseNode(node.next, [start[0] + 1, start[1]], __spreadArray(__spreadArray([], idx, true), [0], false));
    return __assign(__assign({}, node), { next: nextWithPos, gridPos: {
            start: start,
            end: (_b = (_a = nextWithPos === null || nextWithPos === void 0 ? void 0 : nextWithPos.gridPos.end) !== null && _a !== void 0 ? _a : nextWithPos === null || nextWithPos === void 0 ? void 0 : nextWithPos.gridPos.start) !== null && _b !== void 0 ? _b : start,
            chainIdx: idx
        } });
};
/**
 * Traverse Pipeline Trigger Node
 * @param {PipelineNodeWithNext.Trigger} node
 * @param {[number, number]} start
 * @param {number[]} idx
 * @returns
 */
var traverseTriggerNode = function (node, start, idx) {
    var _a, _b;
    if (node.next === undefined)
        return undefined;
    var nextWithPos = traverseNode(node.next, [start[0] + 1, start[1]], __spreadArray(__spreadArray([], idx, true), [0], false));
    return __assign(__assign({}, node), { next: nextWithPos, gridPos: {
            start: start,
            end: (_b = (_a = nextWithPos === null || nextWithPos === void 0 ? void 0 : nextWithPos.gridPos.end) !== null && _a !== void 0 ? _a : nextWithPos === null || nextWithPos === void 0 ? void 0 : nextWithPos.gridPos.start) !== null && _b !== void 0 ? _b : start,
            chainIdx: idx
        } });
};
var traverseNode = function (node, start, idx) {
    switch (node.nodeType) {
        case PIPELINE_NODE.Type.IF:
            return traverseIfNode(node, start, idx);
        case PIPELINE_NODE.Type.SWITCH:
            return traverseSwitchNode(node, start, idx);
        case PIPELINE_NODE.Type.TASK:
            return traverseTaskNode(node, start, idx);
    }
};
var findRawNode = function (targetIndex, curNode, curNodeIndex) {
    var _a, _b, _c;
    if (isEquals(targetIndex, curNodeIndex)) {
        return curNode;
    }
    if (curNodeIndex.length < targetIndex.length) {
        var diffLen = curNodeIndex.filter(function (num, index) { return targetIndex[index] !== num; }).length;
        if (diffLen > 0)
            return;
        var found = void 0;
        switch (curNode.nodeType) {
            case PIPELINE_NODE.Type.IF:
                if (curNode.trueNext !== undefined) {
                    found = findRawNode(targetIndex, curNode.trueNext, __spreadArray(__spreadArray([], curNodeIndex, true), [0], false));
                }
                if (found === undefined && curNode.falseNext !== undefined) {
                    found = findRawNode(targetIndex, curNode.falseNext, __spreadArray(__spreadArray([], curNodeIndex, true), [1], false));
                }
                break;
            case PIPELINE_NODE.Type.SWITCH:
                for (var i = 0; i < ((_b = (_a = curNode === null || curNode === void 0 ? void 0 : curNode.caseNexts) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0); i++) {
                    var caseNext = (_c = curNode === null || curNode === void 0 ? void 0 : curNode.caseNexts) === null || _c === void 0 ? void 0 : _c[i];
                    if (caseNext !== undefined) {
                        found = findRawNode(targetIndex, caseNext, __spreadArray(__spreadArray([], curNodeIndex, true), [i], false));
                    }
                    if (found !== undefined) {
                        break;
                    }
                }
                break;
            case PIPELINE_NODE.Type.TASK:
            case PIPELINE_NODE.Type.TRIGGER:
                if (curNode.next !== undefined) {
                    found = findRawNode(targetIndex, curNode.next, __spreadArray(__spreadArray([], curNodeIndex, true), [0], false));
                }
                break;
        }
        return found;
    }
};

/**
 * Hook to add (insert) pipeline node
 * @returns
 */
var usePipelineNodeAdd = function (trigger, onChange) {
    var customTaskDefs = useContext(PipelineContext).customTaskDefs;
    var _a = useState(), addingNode = _a[0], setAddingNode = _a[1];
    /**
     * Set node type of newing node
     * @param {PIPELINE_NODE.Type} nodeType
     * @param {string} taskKey
     * @returns
     */
    var onAddingNode = useMemoizedFn(function (nodeType, taskKey) { return function (e) {
        setAddingNode(function (prev) {
            if ((prev === null || prev === void 0 ? void 0 : prev.parent) === undefined || nodeType === undefined)
                return prev;
            return __assign(__assign({}, prev), { nodeType: nodeType, taskKey: taskKey });
        });
    }; });
    /**
     * Set parent node of newing node
     * @param {PipelineNodeWithPos.All} parent
     * @returns
     */
    var onAddingParent = useMemoizedFn(function (parent) { return function (opened) {
        if (!opened)
            return;
        setAddingNode({ parent: parent });
    }; });
    /**
     * Insert Node after a target parent node
     */
    useEffect(function () {
        if ((addingNode === null || addingNode === void 0 ? void 0 : addingNode.parent) === undefined || addingNode.nodeType === undefined)
            return;
        var newTrigger = cloneObject(trigger);
        if (newTrigger === undefined)
            return;
        var parentIndex = addingNode.parent.gridPos.chainIdx;
        var rawParent = findRawNode(parentIndex, newTrigger, [0]);
        if (rawParent === undefined) {
            console.error('[Error]: Cannot find parent node', parentIndex, newTrigger);
            return;
        }
        // ------- 
        // 1) newing node
        var newIfNode = __assign({}, PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.IF]);
        var newSwitchNode = __assign({}, PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.SWITCH]);
        var presetTaskKey = addingNode.taskKey;
        var newPresetTaskNode;
        var newCustomTaskNode;
        if (Object.values(PIPELINE_NODE.PresetTaskKey).includes(presetTaskKey)) {
            // a) Preset task
            newPresetTaskNode = __assign({}, PIPELINE_NODE.PRESET_TASK_DEFS[presetTaskKey]);
        }
        else {
            // b) Custom task
            var customTaskKey_1 = addingNode.taskKey;
            var customTaskDef = customTaskDefs === null || customTaskDefs === void 0 ? void 0 : customTaskDefs.find(function (def) { return def.taskKey === customTaskKey_1; });
            newCustomTaskNode = __assign({}, customTaskDef);
        }
        // ---------------------------
        // 2) Insert NEW node to target parent node
        // can only insert before: TRIGGER / TASK node
        if (addingNode.parent.nodeType === PIPELINE_NODE.Type.TRIGGER) {
            // 2.1) Parent Node = TRIGGER
            var rawParentTrigger = rawParent;
            if (addingNode.nodeType === PIPELINE_NODE.Type.IF) {
                // 2.1.1) new node = IF
                newIfNode.trueNext = rawParentTrigger.next;
                rawParentTrigger.next = newIfNode;
            }
            else if (addingNode.nodeType === PIPELINE_NODE.Type.SWITCH) {
                // 2.1.2) new node = SWITCH
                newSwitchNode.caseGroups = [['0']];
                newSwitchNode.caseNexts = [
                    rawParentTrigger.next
                ];
                rawParentTrigger.next = newSwitchNode;
            }
            else if (addingNode.nodeType === PIPELINE_NODE.Type.TASK) {
                // 2.1.3) new node = TASK
                if (newPresetTaskNode !== undefined) {
                    // a) preset task
                    newPresetTaskNode.next = rawParentTrigger.next;
                    rawParentTrigger.next = newPresetTaskNode;
                }
                else if (newCustomTaskNode !== undefined) {
                    // b) custom task
                    newCustomTaskNode.next = rawParentTrigger.next;
                    rawParentTrigger.next = newCustomTaskNode;
                }
            }
        }
        else if (addingNode.parent.nodeType === PIPELINE_NODE.Type.TASK) {
            // 2.2) Parent Node = TASK
            var rawParentTask = rawParent;
            if (addingNode.nodeType === PIPELINE_NODE.Type.IF) {
                // 2.2.1) new node = IF
                newIfNode.trueNext = rawParentTask.next;
                rawParentTask.next = newIfNode;
            }
            else if (addingNode.nodeType === PIPELINE_NODE.Type.SWITCH) {
                // 2.2.2) new node = SWITCH
                newSwitchNode.caseGroups = [['0']];
                newSwitchNode.caseNexts = [rawParentTask.next];
                rawParentTask.next = newSwitchNode;
            }
            else if (addingNode.nodeType === PIPELINE_NODE.Type.TASK) {
                // 2.2.3) new node = TASK
                if (newPresetTaskNode !== undefined) {
                    // a) preset task
                    newPresetTaskNode.next = rawParentTask.next;
                    rawParentTask.next = newPresetTaskNode;
                }
                else if (newCustomTaskNode !== undefined) {
                    // b) custom task
                    newCustomTaskNode.next = rawParentTask.next;
                    rawParentTask.next = newCustomTaskNode;
                }
            }
        }
        setAddingNode(undefined);
        onChange === null || onChange === void 0 ? void 0 : onChange(newTrigger);
    }, [addingNode, trigger]);
    return {
        addingNode: addingNode,
        onAddingNode: onAddingNode,
        onAddingParent: onAddingParent,
    };
};

var usePipelineNodeEdit = function (trigger, onChange) {
    var _a = useState(), editingNodeIndex = _a[0], setEditingNodeIndex = _a[1];
    var _b = useState(), editingTrigger = _b[0], setEditingTrigger = _b[1];
    /**
     * Start edit node
     * @param {PipelineNodeWithPos.All} node
     */
    var onEditNode = useMemoizedFn(function (node) {
        setEditingNodeIndex(node.gridPos.chainIdx);
    });
    var preChange = function () {
        var newTrigger = cloneObject(trigger);
        if (newTrigger === undefined)
            return {};
        if (editingNodeIndex === undefined)
            return { newTrigger: newTrigger };
        var rawNode = findRawNode(editingNodeIndex, newTrigger, [0]);
        return { newTrigger: newTrigger, rawNode: rawNode };
    };
    /**
     * Change If node
     * @param {PipelineNodeWithNext.If} ifNode
     */
    var changeIfNode = function (ifNode) {
        var _a = preChange(), newTrigger = _a.newTrigger, rawNode = _a.rawNode;
        if (newTrigger === undefined || rawNode === undefined)
            return;
        var rawIf = rawNode;
        rawIf.judgeCondition = ifNode === null || ifNode === void 0 ? void 0 : ifNode.judgeCondition;
        rawIf.trueNext = ifNode === null || ifNode === void 0 ? void 0 : ifNode.trueNext;
        rawIf.falseNext = ifNode === null || ifNode === void 0 ? void 0 : ifNode.falseNext;
        setEditingTrigger === null || setEditingTrigger === void 0 ? void 0 : setEditingTrigger(newTrigger);
    };
    /**
     * Change Trigger node
     * @param {PipelineNodeWithNext.Trigger} triggerNode
     */
    var changeTriggerNode = function (triggerNode) {
        var _a = preChange(), newTrigger = _a.newTrigger, rawNode = _a.rawNode;
        if (newTrigger === undefined || rawNode === undefined)
            return;
        var rawTrigger = rawNode;
        rawTrigger.condition = triggerNode === null || triggerNode === void 0 ? void 0 : triggerNode.condition;
        setEditingTrigger === null || setEditingTrigger === void 0 ? void 0 : setEditingTrigger(newTrigger);
    };
    /**
     * Change Switch node
     * @param {PipelineNodeWithNext.Switch} triggerNode
     */
    var changeSwitchNode = function (switchNode) {
        var _a = preChange(), newTrigger = _a.newTrigger, rawNode = _a.rawNode;
        if (newTrigger === undefined || rawNode === undefined)
            return;
        var rawSwitch = rawNode;
        rawSwitch.judgeField = switchNode === null || switchNode === void 0 ? void 0 : switchNode.judgeField;
        rawSwitch.caseGroups = switchNode === null || switchNode === void 0 ? void 0 : switchNode.caseGroups;
        rawSwitch.caseNexts = switchNode === null || switchNode === void 0 ? void 0 : switchNode.caseNexts;
        setEditingTrigger === null || setEditingTrigger === void 0 ? void 0 : setEditingTrigger(newTrigger);
    };
    var saveEditing = function () {
        if (editingTrigger === undefined)
            return;
        onChange === null || onChange === void 0 ? void 0 : onChange(editingTrigger);
        cancelEditing();
    };
    var cancelEditing = function () {
        setEditingTrigger(undefined);
        setEditingNodeIndex(undefined);
    };
    var editingNode = useMemo(function () {
        var curTrigger = (editingTrigger !== null && editingTrigger !== void 0 ? editingTrigger : trigger);
        if (editingNodeIndex === undefined || curTrigger === undefined)
            return;
        var rawNode = findRawNode(editingNodeIndex, curTrigger, [0]);
        return rawNode;
    }, [editingNodeIndex, editingTrigger, trigger]);
    var isEditing = function (node) {
        return isEquals(editingNodeIndex, node === null || node === void 0 ? void 0 : node.gridPos.chainIdx);
    };
    var changed = useMemo(function () {
        if (editingNodeIndex === undefined || trigger === undefined || editingTrigger === undefined)
            return false;
        findRawNode(editingNodeIndex, trigger, [0]);
        findRawNode(editingNodeIndex, editingTrigger, [0]);
        return true;
        // console.log(rawNode, newNode, isEquals(rawNode, newNode))
        // return !isEquals(rawNode, newNode)
    }, [editingTrigger]);
    return {
        editingTrigger: editingTrigger,
        editingNode: editingNode,
        onEditNode: onEditNode,
        isEditing: isEditing,
        changed: changed,
        changeIfNode: changeIfNode,
        changeTriggerNode: changeTriggerNode,
        changeSwitchNode: changeSwitchNode,
        saveEditing: saveEditing,
        cancelEditing: cancelEditing
    };
};

/**
 * Hook to delete pipeline node
 * @returns
 */
var usePipelineNodeDel = function (trigger, onChange, endEdit) {
    /**
     * Delete one node, parent node of it will link to its next nodes chain
     * @param node
     * @returns
     */
    var onDeleteNode = function (node) {
        var _a;
        var newTrigger = cloneObject(trigger);
        if (newTrigger === undefined)
            return;
        var nodeIndex = node.gridPos.chainIdx;
        var parentIndex = nodeIndex.slice(0, nodeIndex.length - 1);
        var rawParent = findRawNode(parentIndex, newTrigger, [0]);
        if (rawParent === undefined)
            return;
        var branchNexts = [];
        if (node.nodeType === PIPELINE_NODE.Type.IF || node.nodeType === PIPELINE_NODE.Type.SWITCH) {
            //  New Node = Branch (IF / SWITCH)
            switch (node.nodeType) {
                case PIPELINE_NODE.Type.IF:
                    [node.trueNext, node.falseNext].map(function (branch) {
                        if (branch !== undefined)
                            branchNexts.push(branch);
                        return branch;
                    });
                    break;
                case PIPELINE_NODE.Type.SWITCH:
                    branchNexts = node.caseNexts;
                    break;
            }
        }
        if (rawParent.nodeType === PIPELINE_NODE.Type.TASK || rawParent.nodeType === PIPELINE_NODE.Type.TRIGGER) {
            // 1. Parent Node = Task / Trigger
            if (node.nodeType === PIPELINE_NODE.Type.TASK) {
                // 1.1) New Node = Task
                rawParent.next = node.next;
            }
            else if (node.nodeType === PIPELINE_NODE.Type.IF || node.nodeType === PIPELINE_NODE.Type.SWITCH) {
                // 1.2) New Node = Branch (IF / SWITCH)
                switch (branchNexts.length) {
                    case 0:
                        rawParent.next = undefined;
                        break;
                    case 1:
                        rawParent.next = branchNexts[0];
                        break;
                    default: console.warn('Only keep one branch node, remove unneeded nodes first', node);
                }
            }
        }
        else if (rawParent.nodeType === PIPELINE_NODE.Type.IF) {
            // 2. Parent Node = IF
            // [0]: True branch,   [1]: False branch
            var branchSeq = node.gridPos.chainIdx[node.gridPos.chainIdx.length - 1];
            var targetBranchKey = branchSeq === 0 ? 'trueNext' : 'falseNext';
            if (node.nodeType === PIPELINE_NODE.Type.TASK) {
                // 2.1) New Node = TASK
                rawParent[targetBranchKey] = node.next;
            }
            else if (node.nodeType === PIPELINE_NODE.Type.IF || node.nodeType === PIPELINE_NODE.Type.SWITCH) {
                // 2.2) New Node = Branch (IF / SWITCH)
                switch (branchNexts.length) {
                    case 0:
                        rawParent[targetBranchKey] = undefined;
                        break;
                    case 1:
                        rawParent[targetBranchKey] = branchNexts[0];
                        break;
                    default: console.warn('Only keep one branch node, remove unneeded nodes first', node);
                }
            }
        }
        else if (rawParent.nodeType === PIPELINE_NODE.Type.SWITCH) {
            // 3. Parent Node = SWITCH
            var branchSeq = node.gridPos.chainIdx[node.gridPos.chainIdx.length - 1];
            if (((_a = rawParent.caseNexts) === null || _a === void 0 ? void 0 : _a[branchSeq]) === undefined) {
                if (rawParent.caseNexts === undefined) {
                    rawParent.caseNexts = [];
                }
                rawParent.caseNexts[branchSeq] = undefined;
            }
            if (node.nodeType === PIPELINE_NODE.Type.TASK) {
                // 3.1) New Node = TASK
                rawParent.caseNexts[branchSeq] = node.next;
            }
            else if (node.nodeType === PIPELINE_NODE.Type.IF || node.nodeType === PIPELINE_NODE.Type.SWITCH) {
                // 3.2) New Node = Branch (IF / SWITCH)
                switch (branchNexts.length) {
                    case 0:
                        rawParent.caseNexts[branchSeq] = undefined;
                        break;
                    case 1:
                        rawParent.caseNexts[branchSeq] = branchNexts[0];
                        break;
                    default: console.warn('Only keep one branch node, remove unneeded nodes first', node);
                }
            }
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(newTrigger);
        endEdit === null || endEdit === void 0 ? void 0 : endEdit();
    };
    return {
        onDeleteNode: onDeleteNode,
    };
};

var usePipelineEditor = function (trigger, onChange) {
    var editHook = usePipelineNodeEdit(trigger, onChange);
    var delHook = usePipelineNodeDel(trigger, onChange, editHook.cancelEditing);
    var addHook = usePipelineNodeAdd(trigger, onChange);
    return __assign(__assign(__assign({}, addHook), editHook), delHook);
};

var useNewNextNode = function () {
    var _a, _b;
    var _c = useState(), activeNextKey = _c[0], setActiveNextKey = _c[1];
    var _d = useState(), newingNexts = _d[0], setNewingNexts = _d[1];
    var customTaskDefs = useContext(PipelineContext).customTaskDefs;
    /**
     * Set newing next node key:
     * @param {string | number | boolean} nextKey
     * @returns
     */
    var onNewingNextKey = useMemoizedFn(function (nextKey) { return function () {
        setActiveNextKey(nextKey);
        setNewingNexts(function (prev) {
            if (prev === undefined)
                prev = [];
            var target = prev.find(function (item) { return item.nextKey === nextKey; });
            if (target === undefined) {
                prev.push({
                    nextKey: nextKey
                });
            }
            else {
                target.nextKey = nextKey;
            }
            return __spreadArray([], prev, true);
        });
    }; });
    /**
     * Set newing next node type
     * @param {PIPELINE_NODE.Type} nodeType
     * @param {string} taskKey
     * @returns
     */
    var onNewingNextNode = useMemoizedFn(function (nodeType, taskKey) { return function (e) {
        if (activeNextKey === undefined)
            return;
        setNewingNexts(function (prev) {
            if (prev === undefined)
                prev = [];
            var target = prev.find(function (item) { return item.nextKey === activeNextKey; });
            if (target === undefined) {
                prev.push({
                    nextKey: activeNextKey,
                    nodeType: nodeType,
                    taskKey: taskKey
                });
            }
            else {
                target.nodeType = nodeType;
                target.taskKey = taskKey;
            }
            return __spreadArray([], prev, true);
        });
    }; });
    var nextNodeItems = __spreadArray(__spreadArray([], Object.values(PIPELINE_NODE.Type).map(function (nodeKey) {
        var nodeType = nodeKey;
        return ({
            key: nodeType,
            label: PIPELINE_NODE.DEFS[nodeType].nodeName,
            icon: PIPELINE_NODE.STYLES[nodeType].icon,
            onClick: onNewingNextNode(nodeType)
        });
    }).filter(function (item) { return ![PIPELINE_NODE.Type.TASK, PIPELINE_NODE.Type.TRIGGER].includes(item.key); }), true), [
        {
            type: 'divider'
        },
        {
            key: 'preset-task',
            label: 'Preset Task',
            icon: (_a = PIPELINE_NODE.STYLES[PIPELINE_NODE.Type.TASK]) === null || _a === void 0 ? void 0 : _a.icon,
            children: __spreadArray([], Object.values(PIPELINE_NODE.PresetTaskKey).map(function (taskKey) {
                var _a;
                var nodeTaskType = taskKey;
                var nodeDef = PIPELINE_NODE.PRESET_TASK_DEFS[taskKey];
                return ({
                    key: "".concat((_a = nodeDef.nodeType) !== null && _a !== void 0 ? _a : PIPELINE_NODE.Type.TASK, "-").concat(nodeTaskType),
                    label: nodeDef.taskName,
                    icon: PIPELINE_NODE.PRESET_TASK_STYLES[nodeTaskType].icon,
                    onClick: onNewingNextNode(PIPELINE_NODE.Type.TASK, nodeTaskType)
                });
            }), true)
        },
        {
            key: 'custom-task',
            label: 'Custom Task',
            icon: (_b = PIPELINE_NODE.STYLES[PIPELINE_NODE.Type.TASK]) === null || _b === void 0 ? void 0 : _b.icon,
            children: __spreadArray([], (customTaskDefs !== null && customTaskDefs !== void 0 ? customTaskDefs : []).map(function (task) { return ({
                key: "".concat(PIPELINE_NODE.Type.TASK, "-").concat(task.taskKey),
                label: task.taskName,
                onClick: onNewingNextNode(PIPELINE_NODE.Type.TASK, task.taskKey)
            }); }), true)
        }
    ], false);
    var endNewing = useMemoizedFn(function () {
        setNewingNexts(undefined);
    });
    return {
        nextNodeItems: nextNodeItems,
        newingNexts: newingNexts,
        onNewingNextKey: onNewingNextKey,
        endNewing: endNewing
    };
};

var useNodeTypeInfo = function (nodeType, taskKey) {
    var customTaskDefs = useContext(PipelineContext).customTaskDefs;
    var nodeTypeDef = useMemo(function () { return (nodeType !== undefined
        ? PIPELINE_NODE.DEFS[nodeType]
        : undefined); }, [nodeType]);
    var nodeTypeStyle = useMemo(function () {
        if (nodeType === PIPELINE_NODE.Type.TASK) {
            var presetTaskKey = taskKey;
            if (Object.values(PIPELINE_NODE.PresetTaskKey).includes(presetTaskKey)) {
                // preset task
                return PIPELINE_NODE.PRESET_TASK_STYLES[presetTaskKey];
            }
        }
        var defaultStyle = {
            color: 'success',
            icon: jsx(CarryOutOutlined, {})
        };
        return nodeType === undefined ? defaultStyle : PIPELINE_NODE.STYLES[nodeType];
    }, [nodeType, taskKey]);
    var taskDef = useMemo(function () {
        if (nodeType !== PIPELINE_NODE.Type.TASK)
            return;
        var custom = customTaskDefs === null || customTaskDefs === void 0 ? void 0 : customTaskDefs.find(function (def) { return def.taskKey === taskKey; });
        if (custom !== undefined)
            return custom;
        var presetTaskKey = taskKey;
        if (Object.values(PIPELINE_NODE.PresetTaskKey).includes(presetTaskKey)) {
            return PIPELINE_NODE.PRESET_TASK_DEFS[presetTaskKey];
        }
    }, [nodeType, taskKey]);
    return {
        nodeTypeDef: nodeTypeDef,
        nodeTypeStyle: nodeTypeStyle,
        taskDef: taskDef
    };
};


var globalClsPrefix = 'srui-antd';

var stringfyCondition = function (cond) {
    var _a;
    if (cond.type === 'group') {
        var child = (_a = cond === null || cond === void 0 ? void 0 : cond.items) === null || _a === void 0 ? void 0 : _a.map(function (item) {
            return stringfyCondition(item);
        });
        return "(".concat(child === null || child === void 0 ? void 0 : child.join(" ".concat(cond.operator, " ")), ")");
    }
    else if (cond.type === 'item') {
        return "[".concat(cond.field.name, "] ").concat(cond.operator, " \"").concat(String(cond.value), "\"");
    }
    return '';
};

var clsPrefix = "".concat(globalClsPrefix, "-pipeline");

/**
 * Pipeline's base node
 * @param props
 * @returns
 */
var PipelineBaseNode = function (props) {
    var label = props.label, icon = props.icon, abstract = props.abstract, desc = props.desc, _a = props.color, color = _a === void 0 ? 'default' : _a, children = props.children, _b = props.editable, editable = _b === void 0 ? false : _b, _c = props.editing, editing = _c === void 0 ? false : _c, startEdit = props.startEdit, endEdit = props.endEdit, _d = props.changed, changed = _d === void 0 ? false : _d, onSave = props.onSave, onDel = props.onDel;
    var _e = useToggle(false), expanded = _e[0], _f = _e[1], toggleExpand = _f.toggle, setExpand = _f.set;
    useEffect(function () {
        if (editing) {
            setExpand(true);
        }
    }, [editing]);
    return (jsxs("div", __assign({ className: classNames("".concat(clsPrefix, "-node-base"), editing ? 'editing' : '', color) }, { children: [jsxs("div", __assign({ className: classNames("".concat(clsPrefix, "-node-base-label"), expanded ? '' : 'up') }, { children: [jsx("span", __assign({ className: classNames("".concat(clsPrefix, "-node-base-label-icon-box"), color) }, { children: icon !== null && icon !== void 0 ? icon : jsx(QuestionCircleOutlined, {}) })), jsx("span", __assign({ className: "".concat(clsPrefix, "-node-base-label-title") }, { children: jsxs("span", __assign({ className: "".concat(clsPrefix, "-node-base-label-title-inner") }, { children: [jsx("span", __assign({ className: "".concat(clsPrefix, "-node-base-label-title-inner-name"), title: label }, { children: label })), jsx("span", __assign({ className: classNames("".concat(clsPrefix, "-node-base-label-title-inner-btn-edit"), !editable ? 'hide' : '', editing ? 'editing' : '') }, { children: editing
                                        ? jsxs(Space, __assign({ size: 3 }, { children: [jsx(Button, { type: 'link', size: 'small', icon: jsx(Badge, __assign({ dot: true, size: 'small', count: changed ? 1 : 0 }, { children: jsx(SaveOutlined, {}) })), onClick: onSave, title: 'Save Change', disabled: !changed }), jsx(Button, { type: 'link', size: 'small', icon: jsx(CloseOutlined, {}), onClick: endEdit, title: 'Cancel Change' })] }))
                                        : jsxs(Space, __assign({ size: 3 }, { children: [jsx(Button, { type: 'link', size: 'small', icon: jsx(EditOutlined, {}), onClick: startEdit }), onDel !== undefined
                                                    ? jsx(Popconfirm, __assign({ placement: 'topLeft', title: 'Confirm to delete?', onConfirm: onDel, okText: 'Yes, Delete!', okButtonProps: { danger: true }, cancelText: 'No', cancelButtonProps: { type: 'link' } }, { children: jsx(Button, { type: 'link', size: 'small', icon: jsx(DeleteOutlined, {}), danger: true }) }))
                                                    : null] })) }))] })) })), jsx("a", __assign({ className: "".concat(clsPrefix, "-node-base-label-btn-expand"), onClick: toggleExpand }, { children: expanded ? jsx(UpOutlined, {}) : jsx(DownOutlined, {}) }))] })), abstract !== undefined
                ? jsx("div", __assign({ className: classNames("".concat(clsPrefix, "-node-base-desc"), expanded ? 'expand' : '') }, { children: abstract }))
                : null, desc !== undefined && expanded
                ? jsx("div", __assign({ className: classNames("".concat(clsPrefix, "-node-base-desc"), expanded ? 'expand' : '') }, { children: jsxs(Space, { children: [jsx(UserOutlined, {}), desc] }) }))
                : null, expanded
                ? jsx("div", __assign({ className: "".concat(clsPrefix, "-node-base-detail-box") }, { children: children }))
                : null] })));
};

var PipelineTriggerNode = function (props) {
    var _a;
    var node = props.node, _b = props.editable, editable = _b === void 0 ? false : _b, _c = props.editing, editing = _c === void 0 ? false : _c, changed = props.changed, onEdit = props.onEdit, cancelEditing = props.cancelEditing;
    var readableFields = useContext(PipelineContext).readableFields;
    var _d = useNodeTypeInfo(PIPELINE_NODE.Type.TRIGGER), nodeTypeDef = _d.nodeTypeDef, nodeTypeStyle = _d.nodeTypeStyle;
    var onEditNode = useMemoizedFn(function () {
        onEdit === null || onEdit === void 0 ? void 0 : onEdit(node);
    });
    var abstractDesc = useMemo(function () {
        return node.condition === undefined
            ? '<Blank>'
            : stringfyCondition(node.condition);
    }, []);
    return (jsx(PipelineBaseNode, __assign({ label: (_a = nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeName) !== null && _a !== void 0 ? _a : 'Trigger' }, nodeTypeStyle, { abstract: abstractDesc, desc: node.desc, editable: editable, editing: editing, startEdit: onEditNode, endEdit: cancelEditing, changed: changed }, { children: jsx(QueryConditionSelector, { fieldList: readableFields !== null && readableFields !== void 0 ? readableFields : [], value: node.condition, nested: true, operatorOptionFixed: true, layout: 'vertical', size: 'small', defaultExpanded: true }) })));
};

var PipelineTriggerNodeEditor = function (props) {
    var node = props.node, onChange = props.onChange;
    var readableFields = useContext(PipelineContext).readableFields;
    var changeCondition = function (cond) {
        var newTrigger = __assign(__assign({}, node), { condition: cond });
        onChange === null || onChange === void 0 ? void 0 : onChange(newTrigger);
    };
    return (jsx(Descriptions, __assign({ column: 1, layout: 'vertical', size: 'small', contentStyle: { marginBottom: 24, display: 'block' } }, { children: jsx(Descriptions.Item, __assign({ label: 'Condition' }, { children: jsx(QueryConditionSelector, { fieldList: readableFields !== null && readableFields !== void 0 ? readableFields : [], value: node.condition, onChange: changeCondition, editable: true, nested: true, operatorOptionFixed: true, layout: 'vertical', defaultExpanded: true }) })) })));
};

var PipelineNextNodeBtn = function (props) {
    var _a, _b, _c, _d, _e, _f;
    var title = props.title, newing = props.newing, _g = props.editing, editing = _g === void 0 ? false : _g, curNode = props.curNode, nextNodeItems = props.nextNodeItems, onNewingNextKey = props.onNewingNextKey;
    var _h = useNodeTypeInfo((_a = (newing !== null && newing !== void 0 ? newing : curNode)) === null || _a === void 0 ? void 0 : _a.nodeType, (_b = newing === null || newing === void 0 ? void 0 : newing.taskKey) !== null && _b !== void 0 ? _b : ((curNode === null || curNode === void 0 ? void 0 : curNode.nodeType) === PIPELINE_NODE.Type.TASK ? curNode.taskKey : undefined)), nodeTypeDef = _h.nodeTypeDef, taskDef = _h.taskDef;
    return (jsx(Fragment, { children: editing
            ? jsx(Dropdown, __assign({ menu: { items: nextNodeItems }, placement: 'bottomLeft', arrow: true, trigger: ['click'], onOpenChange: onNewingNextKey, disabled: curNode !== undefined || !editing }, { children: jsx(Button, __assign({ title: title, size: 'small', type: curNode !== undefined ? 'link' : 'default', icon: jsx(Badge, __assign({ dot: true, size: 'small', count: (newing === null || newing === void 0 ? void 0 : newing.nodeType) !== undefined ? 1 : 0 }, { children: jsx(SubnodeOutlined, {}) })) }, { children: jsxs(Space, __assign({ size: 3 }, { children: [title, jsxs(Typography.Text, __assign({ code: true, type: nodeTypeDef !== undefined ? 'success' : 'secondary' }, { children: [(_c = nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeName) !== null && _c !== void 0 ? _c : '<Blank>', (nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeType) === PIPELINE_NODE.Type.TASK ? ": ".concat((_d = taskDef === null || taskDef === void 0 ? void 0 : taskDef.taskName) !== null && _d !== void 0 ? _d : 'Task') : ''] }))] })) })) }))
            : jsxs(Space, __assign({ size: 6, title: title }, { children: [jsx(SubnodeOutlined, {}), jsx(Typography.Text, { children: title }), curNode !== undefined
                        ? jsxs(Typography.Text, __assign({ code: true, type: nodeTypeDef !== undefined ? 'success' : 'secondary' }, { children: [(_e = nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeName) !== null && _e !== void 0 ? _e : 'Unkown', (nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeType) === PIPELINE_NODE.Type.TASK ? ": ".concat((_f = taskDef === null || taskDef === void 0 ? void 0 : taskDef.taskName) !== null && _f !== void 0 ? _f : 'Task') : ''] }))
                        : jsx(Typography.Text, __assign({ code: true, type: 'secondary' }, { children: "<Blank>" }))] })) }));
};

var PipelineIfNode = function (props) {
    var _a;
    var node = props.node, _b = props.editable, editable = _b === void 0 ? false : _b, _c = props.editing, editing = _c === void 0 ? false : _c, changed = props.changed, onEdit = props.onEdit, saveEditing = props.saveEditing, cancelEditing = props.cancelEditing, onDel = props.onDel;
    var readableFields = useContext(PipelineContext).readableFields;
    var _d = useNodeTypeInfo(PIPELINE_NODE.Type.IF), nodeTypeDef = _d.nodeTypeDef, nodeTypeStyle = _d.nodeTypeStyle;
    var onEditNode = useMemoizedFn(function () {
        onEdit === null || onEdit === void 0 ? void 0 : onEdit(node);
    });
    var onDelNode = useMemoizedFn(function () {
        onDel === null || onDel === void 0 ? void 0 : onDel(node);
    });
    var abstractDesc = useMemo(function () {
        return node.judgeCondition === undefined ? '<Blank>' : stringfyCondition(node.judgeCondition);
    }, [node.judgeCondition]);
    return (jsxs(PipelineBaseNode, __assign({ label: (_a = nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeName) !== null && _a !== void 0 ? _a : 'If' }, nodeTypeStyle, { desc: node.desc, abstract: abstractDesc, editable: editable, editing: editing, startEdit: onEditNode, endEdit: cancelEditing, changed: changed, onSave: saveEditing, onDel: onDelNode }, { children: [jsx(QueryConditionSelector, { fieldList: readableFields !== null && readableFields !== void 0 ? readableFields : [], value: node.judgeCondition, nested: true, operatorOptionFixed: true, layout: 'vertical', size: 'small', defaultExpanded: true, expandable: true }), jsxs(Space, __assign({ direction: 'vertical' }, { children: [jsx(PipelineNextNodeBtn, { title: 'True', curNode: node.trueNext }), jsx(PipelineNextNodeBtn, { title: 'False', curNode: node.falseNext })] }))] })));
};

var PipelineIfNodeEditor = function (props) {
    var node = props.node, onChange = props.onChange;
    var _a = useContext(PipelineContext), readableFields = _a.readableFields, customTaskDefs = _a.customTaskDefs;
    var _b = useNewNextNode(), nextNodeItems = _b.nextNodeItems, newingNexts = _b.newingNexts, onNewingNextKey = _b.onNewingNextKey;
    var changeCondition = function (cond) {
        var newIf = __assign(__assign({}, node), { judgeCondition: cond });
        onChange === null || onChange === void 0 ? void 0 : onChange(newIf);
    };
    useEffect(function () {
        newingNexts === null || newingNexts === void 0 ? void 0 : newingNexts.map(function (branch) {
            var nextKey = branch.nextKey, nodeType = branch.nodeType, taskKey = branch.taskKey;
            var newNextNode;
            switch (nodeType) {
                case PIPELINE_NODE.Type.IF:
                    newNextNode = __assign({}, PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.IF]);
                    break;
                case PIPELINE_NODE.Type.SWITCH:
                    newNextNode = __assign({}, PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.SWITCH]);
                    break;
                case PIPELINE_NODE.Type.TASK:
                    if (Object.values(PIPELINE_NODE.PresetTaskKey).includes(taskKey)) {
                        // preset task node
                        newNextNode = __assign(__assign({}, PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.TASK]), PIPELINE_NODE.PRESET_TASK_DEFS[taskKey]);
                    }
                    else {
                        // custom task node
                        var customTaskDef = customTaskDefs === null || customTaskDefs === void 0 ? void 0 : customTaskDefs.find(function (def) { return def.taskKey === taskKey; });
                        if (customTaskDef !== undefined) {
                            newNextNode = __assign({}, customTaskDef);
                        }
                    }
                    break;
            }
            var newIf = __assign({}, node);
            newIf[nextKey ? 'trueNext' : 'falseNext'] = newNextNode;
            onChange === null || onChange === void 0 ? void 0 : onChange(newIf);
            return nextKey;
        });
    }, [newingNexts]);
    return (jsx(Fragment, { children: jsxs(Descriptions, __assign({ column: 1, layout: 'vertical', size: 'small', contentStyle: { marginBottom: 24, display: 'block' } }, { children: [jsx(Descriptions.Item, __assign({ label: 'If Condition' }, { children: jsx(QueryConditionSelector, { fieldList: readableFields !== null && readableFields !== void 0 ? readableFields : [], value: node.judgeCondition, onChange: changeCondition, editable: true, nested: true, operatorOptionFixed: true, defaultExpanded: true, layout: 'vertical' }) })), jsx(Descriptions.Item, __assign({ label: 'True Branch' }, { children: jsx(PipelineNextNodeBtn, { curNode: node.trueNext, nextNodeItems: nextNodeItems, newing: newingNexts === null || newingNexts === void 0 ? void 0 : newingNexts.find(function (node) { return node.nextKey === true; }), editing: true, onNewingNextKey: onNewingNextKey(true) }) })), jsx(Descriptions.Item, __assign({ label: 'False Branch' }, { children: jsx(PipelineNextNodeBtn, { curNode: node.falseNext, nextNodeItems: nextNodeItems, newing: newingNexts === null || newingNexts === void 0 ? void 0 : newingNexts.find(function (node) { return node.nextKey === false; }), editing: true, onNewingNextKey: onNewingNextKey(false) }) }))] })) }));
};

var PipelineSwitchNode = function (props) {
    var _a, _b, _c;
    var node = props.node, _d = props.editable, editable = _d === void 0 ? false : _d, _e = props.editing, editing = _e === void 0 ? false : _e, changed = props.changed, cancelEditing = props.cancelEditing, onEdit = props.onEdit, saveEditing = props.saveEditing, onDel = props.onDel;
    var _f = useNodeTypeInfo(PIPELINE_NODE.Type.SWITCH), nodeTypeDef = _f.nodeTypeDef, nodeTypeStyle = _f.nodeTypeStyle;
    var onEditNode = useMemoizedFn(function () {
        onEdit === null || onEdit === void 0 ? void 0 : onEdit(node);
    });
    var onDelNode = useMemoizedFn(function () {
        onDel === null || onDel === void 0 ? void 0 : onDel(node);
    });
    var abstractDesc = useMemo(function () {
        var _a, _b, _c, _d, _e, _f;
        if (node.judgeField === undefined && (node.caseGroups === undefined || node.caseGroups.length === 0)) {
            return '<Blank>';
        }
        var caseList = (_a = node === null || node === void 0 ? void 0 : node.caseGroups) === null || _a === void 0 ? void 0 : _a.map(function (caseKeys) { return caseKeys.join(', '); });
        return "[".concat(String((_e = (_c = (_b = node.judgeField) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : (_d = node.judgeField) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : 'Unkown'), "] = ").concat((_f = caseList === null || caseList === void 0 ? void 0 : caseList.join(' / ')) !== null && _f !== void 0 ? _f : '');
    }, [node.judgeField, node.caseGroups]);
    return (jsx(PipelineBaseNode, __assign({ label: (_a = nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeName) !== null && _a !== void 0 ? _a : 'Switch' }, nodeTypeStyle, { abstract: abstractDesc, desc: node.desc, editable: editable, editing: editing, startEdit: onEditNode, endEdit: cancelEditing, onSave: saveEditing, onDel: onDelNode, changed: changed }, { children: jsxs(Descriptions, __assign({ column: 1, size: 'small' }, { children: [jsx(Descriptions.Item, __assign({ label: 'Field' }, { children: (_b = node.judgeField) === null || _b === void 0 ? void 0 : _b.name })), jsx(Descriptions.Item, __assign({ label: 'Cases' }, { children: jsx(Space, __assign({ size: 16, direction: 'vertical' }, { children: (_c = node === null || node === void 0 ? void 0 : node.caseGroups) === null || _c === void 0 ? void 0 : _c.map(function (caseKeys, index) { return (jsx("div", { children: caseKeys.map(function (caseKey) { return jsx(Tag, { children: caseKey }, caseKey); }) }, index)); }) })) }))] })) })));
};

var PipelineSwitchNodeEditor = function (props) {
    var _a;
    var node = props.node, onChange = props.onChange;
    var _b = useContext(PipelineContext), readableFields = _b.readableFields, customTaskDefs = _b.customTaskDefs;
    var _c = useBoolean(false), newingCase = _c[0], _d = _c[1], openNewCase = _d.setTrue, closeNewCase = _d.setFalse;
    var _e = useState(), activeNewCaseGroupIndex = _e[0], setActiveNewCaseGroupId = _e[1];
    var _f = useState(), newCaseVal = _f[0], setNewCaseVal = _f[1];
    var _g = useNewNextNode(), nextNodeItems = _g.nextNodeItems, newingNexts = _g.newingNexts, onNewingNextKey = _g.onNewingNextKey;
    var changeField = function (fieldId) {
        var field = readableFields === null || readableFields === void 0 ? void 0 : readableFields.find(function (field) { return field.id === fieldId; });
        var newSwitch = __assign(__assign({}, node), { judgeField: field });
        onChange === null || onChange === void 0 ? void 0 : onChange(newSwitch);
    };
    useEffect(function () {
        newingNexts === null || newingNexts === void 0 ? void 0 : newingNexts.map(function (next) {
            var nextKey = next.nextKey, nodeType = next.nodeType, taskKey = next.taskKey;
            var newNextNode;
            switch (nodeType) {
                case PIPELINE_NODE.Type.IF:
                    newNextNode = __assign({}, PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.IF]);
                    break;
                case PIPELINE_NODE.Type.SWITCH:
                    newNextNode = __assign({}, PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.SWITCH]);
                    break;
                case PIPELINE_NODE.Type.TASK:
                    if (Object.values(PIPELINE_NODE.PresetTaskKey).includes(taskKey)) {
                        // preset task node
                        newNextNode = __assign(__assign({}, PIPELINE_NODE.DEFS[PIPELINE_NODE.Type.TASK]), PIPELINE_NODE.PRESET_TASK_DEFS[taskKey]);
                    }
                    else {
                        // custom task node
                        var customTaskDef = customTaskDefs === null || customTaskDefs === void 0 ? void 0 : customTaskDefs.find(function (def) { return def.taskKey === taskKey; });
                        if (customTaskDef !== undefined) {
                            newNextNode = __assign({}, customTaskDef);
                        }
                    }
                    break;
            }
            var newSwitch = __assign({}, node);
            if ((newSwitch === null || newSwitch === void 0 ? void 0 : newSwitch.caseNexts) === undefined) {
                newSwitch.caseNexts = [];
            }
            newSwitch.caseNexts[nextKey] = newNextNode;
            onChange === null || onChange === void 0 ? void 0 : onChange(newSwitch);
            return nextKey;
        });
    }, [newingNexts]);
    var onDelCase = function (groupIndex, caseIndex) { return function () {
        var _a, _b;
        var newCaseGroups = __spreadArray([], (_a = node === null || node === void 0 ? void 0 : node.caseGroups) !== null && _a !== void 0 ? _a : [], true);
        var newCaseNexts = __spreadArray([], (_b = node === null || node === void 0 ? void 0 : node.caseNexts) !== null && _b !== void 0 ? _b : [], true);
        newCaseGroups[groupIndex].splice(caseIndex, 1);
        if (newCaseGroups[groupIndex].length === 0) {
            newCaseGroups.splice(groupIndex, 1);
            newCaseNexts === null || newCaseNexts === void 0 ? void 0 : newCaseNexts.splice(groupIndex, 1);
        }
        var newSwitch = __assign(__assign({}, node), { caseGroups: newCaseGroups, caseNexts: newCaseNexts });
        onChange === null || onChange === void 0 ? void 0 : onChange(newSwitch);
    }; };
    var onAddingCase = function (index) { return function () {
        setActiveNewCaseGroupId(index);
        openNewCase();
    }; };
    var onChangeNewCaseVal = function (ele) {
        setNewCaseVal(ele.target.value);
    };
    var confirmNewCaseVal = function () {
        var _a;
        if (activeNewCaseGroupIndex === undefined || newCaseVal === undefined)
            return;
        var newCaseGroups = __spreadArray([], (_a = node === null || node === void 0 ? void 0 : node.caseGroups) !== null && _a !== void 0 ? _a : [], true);
        newCaseGroups[activeNewCaseGroupIndex].push(newCaseVal);
        var newSwitch = __assign(__assign({}, node), { caseGroups: newCaseGroups });
        onChange === null || onChange === void 0 ? void 0 : onChange(newSwitch);
        setNewCaseVal(undefined);
        setActiveNewCaseGroupId(undefined);
        closeNewCase();
    };
    var onAddCaseGroup = function () {
        var _a;
        var newCaseGroups = __spreadArray([], (_a = node === null || node === void 0 ? void 0 : node.caseGroups) !== null && _a !== void 0 ? _a : [], true);
        newCaseGroups.push([]);
        var newSwitch = __assign(__assign({}, node), { caseGroups: newCaseGroups });
        onChange === null || onChange === void 0 ? void 0 : onChange(newSwitch);
    };
    return (jsx(Fragment, { children: jsxs(Descriptions, __assign({ column: 1, layout: 'vertical', size: 'small', contentStyle: { marginBottom: 16, display: 'block' } }, { children: [jsx(Descriptions.Item, __assign({ label: 'Judge Field' }, { children: jsx(Select, { options: readableFields === null || readableFields === void 0 ? void 0 : readableFields.map(function (field) { return ({
                            value: field.id,
                            label: field.name
                        }); }), value: node.judgeField.id, style: { width: 160 }, onChange: changeField }) })), jsxs(Descriptions.Item, __assign({ label: 'Cases' }, { children: [(_a = node.caseGroups) === null || _a === void 0 ? void 0 : _a.map(function (cases, index) {
                            var _a;
                            return (jsxs("div", { children: [jsxs(Space, __assign({ direction: 'vertical' }, { children: [jsxs("div", { children: [cases === null || cases === void 0 ? void 0 : cases.map(function (item, seq) { return jsx(Tag, __assign({ closable: true, onClose: onDelCase(index, seq) }, { children: item }), item); }), newingCase && activeNewCaseGroupIndex === index
                                                        ? jsx(Input, { type: 'text', size: 'small', style: { maxWidth: 100 }, onChange: onChangeNewCaseVal, onBlur: confirmNewCaseVal, onPressEnter: confirmNewCaseVal, allowClear: true })
                                                        : jsx(Button, { type: 'dashed', onClick: onAddingCase(index), icon: jsx(PlusOutlined, {}), size: 'small' })] }), jsx(PipelineNextNodeBtn, { curNode: (_a = node.caseNexts) === null || _a === void 0 ? void 0 : _a[index], nextNodeItems: nextNodeItems, newing: newingNexts === null || newingNexts === void 0 ? void 0 : newingNexts.find(function (node) { return node.nextKey === index; }), editing: true, onNewingNextKey: onNewingNextKey(index) })] })), jsx(Divider, {})] }, index));
                        }), jsx(Button, __assign({ type: 'dashed', icon: jsx(PlusOutlined, {}), block: true, onClick: onAddCaseGroup }, { children: "Add Case" }))] }))] })) }));
};

var PipelineCustomTaskNode = function (props) {
    var _a, _b;
    var node = props.node, _c = props.editable, editable = _c === void 0 ? false : _c, _d = props.editing, editing = _d === void 0 ? false : _d, changed = props.changed, onEdit = props.onEdit, cancelEditing = props.cancelEditing, onDel = props.onDel;
    var _e = useNodeTypeInfo(PIPELINE_NODE.Type.TASK, node.taskKey), nodeTypeDef = _e.nodeTypeDef, nodeTypeStyle = _e.nodeTypeStyle, taskDef = _e.taskDef;
    var onEditNode = useMemoizedFn(function () {
        onEdit === null || onEdit === void 0 ? void 0 : onEdit(node);
    });
    var onDelNode = useMemoizedFn(function () {
        onDel === null || onDel === void 0 ? void 0 : onDel(node);
    });
    var abstractDesc = useMemo(function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = node.params) === null || _a === void 0 ? void 0 : _a.map(function (para) { return "[".concat(para.name, "]"); }).join(', ')) !== null && _b !== void 0 ? _b : node.desc) !== null && _c !== void 0 ? _c : '<Blank>';
    }, [node.params, node.desc]);
    return (jsx(PipelineBaseNode, __assign({ label: (_b = (_a = taskDef === null || taskDef === void 0 ? void 0 : taskDef.taskName) !== null && _a !== void 0 ? _a : nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeName) !== null && _b !== void 0 ? _b : 'Task' }, nodeTypeStyle, { abstract: abstractDesc, desc: node.desc, editable: editable, editing: editing, startEdit: onEditNode, endEdit: cancelEditing, onDel: onDelNode, changed: changed })));
};

var PipelineTaskNodeEditor = function (props) {
    var node = props.node;
    var customTaskDefs = useContext(PipelineContext).customTaskDefs;
    var paramTableCols = [
        {
            dataIndex: 'id',
            title: 'ID',
            width: 80
        },
        {
            dataIndex: 'name',
            title: 'Name',
            width: 120
        },
        {
            dataIndex: 'dataType',
            title: 'Data Type',
            width: 60
        },
    ];
    var customTaskDef = useMemo(function () {
        return customTaskDefs === null || customTaskDefs === void 0 ? void 0 : customTaskDefs.find(function (def) { return def.taskKey === node.taskKey; });
    }, [node, customTaskDefs]);
    return (jsx(Descriptions, __assign({ column: 1, layout: 'vertical', size: 'small', contentStyle: { marginBottom: 24, display: 'block' } }, { children: customTaskDef !== undefined
            ? jsx(Descriptions.Item, __assign({ label: 'Task Parameters' }, { children: jsx(Table, { columns: paramTableCols, dataSource: customTaskDef.params, rowKey: 'id', size: 'small' }) }))
            : null })));
};

var PipelineMCHTaskNode = function (props) {
    var _a;
    var node = props.node, _b = props.editable, editable = _b === void 0 ? false : _b, editing = props.editing, changed = props.changed, cancelEditing = props.cancelEditing, onEdit = props.onEdit, onDel = props.onDel;
    var _c = useNodeTypeInfo(PIPELINE_NODE.Type.TASK, node.taskKey), nodeTypeStyle = _c.nodeTypeStyle, taskDef = _c.taskDef;
    var onEditNode = useMemoizedFn(function () {
        onEdit === null || onEdit === void 0 ? void 0 : onEdit(node);
    });
    var onDelNode = useMemoizedFn(function () {
        onDel === null || onDel === void 0 ? void 0 : onDel(node);
    });
    var abstractDesc = useMemo(function () {
        if (node.browseList === undefined || node.browseList.length === 0)
            return '<Blank>';
        return node.browseList.map(function (item) { return "[".concat(item.transCode, "]: ").concat(item.fields.map(function (field) { return field.name; }).join(', ')); }).join(', ');
    }, [node.browseList]);
    return (jsx(PipelineBaseNode, __assign({ label: (_a = taskDef === null || taskDef === void 0 ? void 0 : taskDef.taskName) !== null && _a !== void 0 ? _a : 'MCH browse task' }, nodeTypeStyle, { abstract: abstractDesc, desc: node.desc, editable: editable, editing: editing, changed: changed, startEdit: onEditNode, endEdit: cancelEditing, onDel: onDelNode }, { children: jsx(List, { dataSource: node.browseList, renderItem: function (item, index) {
                var _a, _b, _c, _d, _e;
                return (jsx(List.Item, { children: jsx(List.Item.Meta, { title: item.transCode, description: jsxs(Descriptions, __assign({ column: 1, size: 'small', labelStyle: { width: 42 } }, { children: [jsx(Descriptions.Item, __assign({ label: 'Input' }, { children: (_c = Object.keys((_b = (_a = item.default) === null || _a === void 0 ? void 0 : _a.input) !== null && _b !== void 0 ? _b : {})) === null || _c === void 0 ? void 0 : _c.map(function (fieldId) {
                                        var _a, _b, _c;
                                        return jsxs(Tag, { children: [(_a = item.fields.find(function (field) { return field.id === fieldId; })) === null || _a === void 0 ? void 0 : _a.name, "=", (_c = (_b = item.default) === null || _b === void 0 ? void 0 : _b.input) === null || _c === void 0 ? void 0 : _c[fieldId]] }, fieldId);
                                    }) })), jsx(Descriptions.Item, __assign({ label: 'Output' }, { children: (_e = (_d = item.default) === null || _d === void 0 ? void 0 : _d.output) === null || _e === void 0 ? void 0 : _e.map(function (fieldId) {
                                        var _a;
                                        return jsx(Tag, { children: (_a = item.fields.find(function (field) { return field.id === fieldId; })) === null || _a === void 0 ? void 0 : _a.name }, fieldId);
                                    }) }))] })) }) }));
            } }) })));
};

var PipelineUpdateTaskNode = function (props) {
    var _a;
    var node = props.node, _b = props.editable, editable = _b === void 0 ? false : _b, editing = props.editing, changed = props.changed, cancelEditing = props.cancelEditing, onEdit = props.onEdit, onDel = props.onDel;
    var writableFields = useContext(PipelineContext).writableFields;
    useMemo(function () {
        var _a;
        return (_a = node.fields) === null || _a === void 0 ? void 0 : _a.map(function (field) { return ({
            type: 'item',
            field: field,
            value: field.defaultValue,
            operator: RELATIONAL_OPERATORS.EQUAL_TO
        }); });
    }, [writableFields, node.fields]);
    var _c = useNodeTypeInfo(PIPELINE_NODE.Type.TASK, node.taskKey), nodeTypeStyle = _c.nodeTypeStyle, taskDef = _c.taskDef;
    var onEditNode = useMemoizedFn(function () {
        onEdit === null || onEdit === void 0 ? void 0 : onEdit(node);
    });
    var onDelNode = useMemoizedFn(function () {
        onDel === null || onDel === void 0 ? void 0 : onDel(node);
    });
    var abstractDesc = useMemo(function () {
        var _a, _b;
        return (_b = (_a = node.fields) === null || _a === void 0 ? void 0 : _a.map(function (field) { var _a; return "[".concat((_a = field.name) !== null && _a !== void 0 ? _a : field.id, "]"); }).join(', ')) !== null && _b !== void 0 ? _b : '<Blank>';
    }, [node.fields]);
    return (jsx(PipelineBaseNode, __assign({ label: (_a = taskDef === null || taskDef === void 0 ? void 0 : taskDef.taskName) !== null && _a !== void 0 ? _a : 'Update Fields Task' }, nodeTypeStyle, { abstract: abstractDesc, desc: node.desc, editable: editable, editing: editing, changed: changed, startEdit: onEditNode, endEdit: cancelEditing, onDel: onDelNode }, { children: jsx(QueryConditionItemListEditor, { fieldList: writableFields, value: node.fields, size: 'small' }) })));
};

var useGridLine = function (trigger) {
    var _a = useState([[]]), grid = _a[0], setGrid = _a[1];
    var _b = useState(), wrappedTrigger = _b[0], setWrappedTrigger = _b[1];
    var _c = useState([[[]]]), flowLines = _c[0], setFlowLines = _c[1];
    useEffect(function () {
        if (trigger === undefined)
            return;
        var wrappedNode = traverseTriggerNode(trigger, [0, 0], [0]);
        setWrappedTrigger(wrappedNode);
    }, [trigger]);
    useEffect(function () {
        if (wrappedTrigger === undefined)
            return;
        var matrix = [[]];
        drawNodeToGrid(wrappedTrigger, matrix);
        setGrid(matrix);
    }, [wrappedTrigger]);
    /**
     * Put pipeline node into grid
     * @param {PipelineNodeWithPos.Nexts | PipelineNodeWithPos.Trigger} node     the pipeline node to be added
     * @param {PipelineNodeWithPos.All[][]} matrix                  the matrix of grid cells
     * @returns
     */
    var drawNodeToGrid = function (node, matrix) {
        if (node === undefined || matrix === undefined)
            return;
        // put current node into grid
        var _a = node.gridPos.start, startX = _a[0], startY = _a[1];
        if (matrix[startX] === undefined) {
            matrix[startX] = [];
        }
        matrix[startX][startY] = node;
        // next node
        switch (node.nodeType) {
            case PIPELINE_NODE.Type.IF:
                drawNodeToGrid(node === null || node === void 0 ? void 0 : node.trueNext, matrix);
                drawNodeToGrid(node === null || node === void 0 ? void 0 : node.falseNext, matrix);
                break;
            case PIPELINE_NODE.Type.SWITCH:
                node.caseNexts.map(function (caseNext, index) {
                    drawNodeToGrid(caseNext, matrix);
                    return index;
                });
                break;
            case PIPELINE_NODE.Type.TASK:
            case PIPELINE_NODE.Type.TRIGGER:
                drawNodeToGrid(node === null || node === void 0 ? void 0 : node.next, matrix);
                break;
        }
    };
    /**
     * Add end point to start point
     * @param {FlowLineMatrix} lines         the collection of connection lines
     * @param {[number, number]} startPt     the coordination ([x, y]) of start point
     * @param {[number, number]} endPt       the coordination ([x, y]) of end point
     * @param {Omit<FlowLineProps, 'pos'>} other    other affilicate elements of the connection line between start point and end point
     * @returns
     */
    var addEndPt = function (lines, startPt, endPt, other) {
        if (endPt === undefined)
            return;
        var startX = startPt[0], startY = startPt[1];
        if (lines[startX][startY].findIndex(function (pt) { return pt.pos[0] === endPt[0] && pt.pos[1] === endPt[1]; }) === -1) {
            lines[startX][startY].push(__assign({ pos: endPt }, other));
        }
    };
    /**
     * Update flow connection lines between pipeline nodes
     * @param {PipelineNodeWithPos.All} node
     * @returns
     */
    var updateFlowLine = function (node) {
        if (node === undefined)
            return;
        setFlowLines(function (prev) {
            var _a, _b, _c, _d;
            // current => next
            var _e = node === null || node === void 0 ? void 0 : node.gridPos.start, currentX = _e[0], currentY = _e[1];
            if (prev[currentX] === undefined || currentY === 0) {
                // prev[currentX] === undefined: assign new array
                // currenY === 0:  clear when create node is the first element
                prev[currentX] = [];
            }
            prev[currentX][currentY] = [];
            switch (node.nodeType) {
                case PIPELINE_NODE.Type.IF:
                    addEndPt(prev, [currentX, currentY], (_a = node.trueNext) === null || _a === void 0 ? void 0 : _a.gridPos.start, { tag: { text: 'True', color: 'green' } });
                    addEndPt(prev, [currentX, currentY], (_b = node.falseNext) === null || _b === void 0 ? void 0 : _b.gridPos.start, { tag: { text: 'False', color: 'red' } });
                    break;
                case PIPELINE_NODE.Type.SWITCH:
                    (_c = node.caseGroups) === null || _c === void 0 ? void 0 : _c.map(function (caseKeys, index) {
                        var caseNext = node.caseNexts[index];
                        var caseKeysStr = caseKeys.join(', ');
                        addEndPt(prev, [currentX, currentY], caseNext === null || caseNext === void 0 ? void 0 : caseNext.gridPos.start, { tag: { text: caseKeysStr } });
                        return caseNext === null || caseNext === void 0 ? void 0 : caseNext.gridPos.start;
                    });
                    break;
                case PIPELINE_NODE.Type.TASK:
                case PIPELINE_NODE.Type.TRIGGER:
                    addEndPt(prev, [currentX, currentY], (_d = node.next) === null || _d === void 0 ? void 0 : _d.gridPos.start);
                    break;
            }
            return __spreadArray([], prev, true);
        });
    };
    useEffect(function () {
        grid.map(function (stage, xIndex) {
            stage.map(function (cell, yIndex) {
                updateFlowLine(cell);
                return yIndex;
            });
            return xIndex;
        });
    }, [grid]);
    return { wrappedTrigger: wrappedTrigger, grid: grid, flowLines: flowLines };
};

var PipelineSvgLayer = function (props) {
    var flowLines = props.flowLines, cellsSize = props.cellsSize, containerSize = props.containerSize;
    return (jsx("svg", __assign({ className: "".concat(clsPrefix, "-canvas-svg"), width: containerSize[0], height: containerSize[1], focusable: false }, { children: flowLines.map(function (stages, xIndex) { return (stages.map(function (ends, yIndex) {
            var _a;
            var startDomSize = (_a = cellsSize === null || cellsSize === void 0 ? void 0 : cellsSize[xIndex]) === null || _a === void 0 ? void 0 : _a[yIndex];
            if (startDomSize === undefined)
                return null;
            var startPt = [startDomSize.left + startDomSize.width, startDomSize.top + 26];
            return ends.map(function (end, endIndex) {
                var _a, _b, _c;
                var endDomSize = (_a = cellsSize === null || cellsSize === void 0 ? void 0 : cellsSize[end.pos[0]]) === null || _a === void 0 ? void 0 : _a[end.pos[1]];
                if (endDomSize === undefined)
                    return null;
                var endPt = [endDomSize.left, endDomSize.top + 26];
                var tagPos = [startPt[0] + (endPt[0] - startPt[0]) / 2, startPt[1] + (endPt[1] - startPt[1]) / 2];
                var tagTranslate = ['6px', '0px'];
                var intPts = [];
                var svgStr = "M".concat(startPt[0], " ").concat(startPt[1], " ");
                if (endPt[0] - startPt[0] === 0 || endPt[1] - startPt[1] === 0) {
                    svgStr += "L ".concat(endPt[0], " ").concat(endPt[1]);
                    if (endPt[0] - startPt[0] === 0) {
                        tagTranslate = ['6px', '8px'];
                    }
                    else if (endPt[1] - startPt[1] === 0) {
                        tagTranslate = ['6px', '-5px'];
                    }
                }
                else {
                    intPts.push([startPt[0] + (endPt[0] - startPt[0]) / 2, startPt[1]]);
                    intPts.push([startPt[0] + (endPt[0] - startPt[0]) / 2, endPt[1]]);
                    tagPos = [startPt[0] + (endPt[0] - startPt[0]) / 2, endPt[1]];
                    tagTranslate = ['6px', '-5px'];
                    svgStr += "L ".concat(intPts[0][0], " ").concat(intPts[0][1], " L ").concat(intPts[1][0], " ").concat(intPts[1][1], " L ").concat(endPt[0], " ").concat(endPt[1]);
                }
                return (jsxs("g", { children: [jsx("path", { d: svgStr, fill: 'transparent', stroke: '#ccc', strokeWidth: 2, strokeDasharray: '4,3' }), jsx("circle", { cx: startPt[0], cy: startPt[1], r: 5, fill: '#fff', stroke: '#999' }), jsx("circle", { cx: endPt[0], cy: endPt[1], r: 3, fill: '#666', stroke: 'transparent' }), intPts.map(function (pt) { return (jsx("circle", { cx: pt[0], cy: pt[1], r: 3, fill: '#fff', stroke: '#999' }, "".concat(pt[0], "-").concat(pt[1]))); }), end.tag !== undefined
                            ? jsx("text", __assign({ x: tagPos[0], y: tagPos[1], dx: tagTranslate[0], dy: tagTranslate[1], fill: (_b = end.tag.color) !== null && _b !== void 0 ? _b : '#999', fontSize: (_c = end.tag.size) !== null && _c !== void 0 ? _c : 12 }, { children: end.tag.text }))
                            : null] }, "".concat(xIndex, "-").concat(yIndex, "-").concat(endIndex)));
            });
        })); }) })));
};
PipelineSvgLayer.displayName = 'PipelineSvgLayer';
var SvgLayer = React.memo(PipelineSvgLayer);

var PlaceHolderCell = function (props) {
    var xIndex = props.xIndex, yIndex = props.yIndex;
    return (jsxs("div", __assign({ className: "".concat(clsPrefix, "-canvas-flex-box-stage-place-holder") }, { children: ["[", xIndex, ", ", yIndex, "]"] })));
};

var PipelineCanvas = function (props) {
    var _a, _b;
    var trigger = props.trigger, editor = props.editor, _c = props.layout, layout = _c === void 0 ? 'flex' : _c, _d = props.loading, loading = _d === void 0 ? false : _d;
    var _e = editor !== null && editor !== void 0 ? editor : {}, onAddingNode = _e.onAddingNode, onAddingParent = _e.onAddingParent, onEditNode = _e.onEditNode, isEditing = _e.isEditing, saveEditing = _e.saveEditing, cancelEditing = _e.cancelEditing, editingTrigger = _e.editingTrigger, changed = _e.changed, onDeleteNode = _e.onDeleteNode;
    var _f = useState([[]]), cellsSize = _f[0], setCellsSize = _f[1];
    var _g = useGridLine(editingTrigger !== null && editingTrigger !== void 0 ? editingTrigger : trigger), wrappedTrigger = _g.wrappedTrigger, grid = _g.grid, flowLines = _g.flowLines;
    var refGridBox = useRef(null);
    var refCellsObserver = useRef([]);
    var containerSize = useMemo(function () {
        var _a, _b, _c, _d;
        return [(_b = (_a = refGridBox.current) === null || _a === void 0 ? void 0 : _a.scrollWidth) !== null && _b !== void 0 ? _b : 0, (_d = (_c = refGridBox.current) === null || _c === void 0 ? void 0 : _c.scrollHeight) !== null && _d !== void 0 ? _d : 0];
    }, [refGridBox.current, cellsSize]);
    var customTaskDefs = useContext(PipelineContext).customTaskDefs;
    var dummyMatrix = useMemo(function () {
        var _a, _b;
        var width = (_a = wrappedTrigger === null || wrappedTrigger === void 0 ? void 0 : wrappedTrigger.gridPos.end[0]) !== null && _a !== void 0 ? _a : 0;
        var height = (_b = wrappedTrigger === null || wrappedTrigger === void 0 ? void 0 : wrappedTrigger.gridPos.end[1]) !== null && _b !== void 0 ? _b : 0;
        return Array(width + 1).fill(null).map(function (item) { return Array(height + 1).fill(null); });
    }, [wrappedTrigger]);
    /**
     * Add resize observer to each cell in grid box
     * @param {number} xIndex    x index of cell
     * @param {number} yIndex    y index of cell
     * @returns
     */
    var onRefCell = function (xIndex, yIndex) { return function (ele) {
        var _a;
        if (ele === null)
            return;
        var cellsObserver = refCellsObserver.current;
        if (cellsObserver.length === grid.length) {
            if (((_a = cellsObserver[xIndex]) === null || _a === void 0 ? void 0 : _a[yIndex]) !== undefined)
                return;
        }
        if (cellsObserver[xIndex] === undefined) {
            cellsObserver[xIndex] = [];
        }
        // 1) flex layout
        var resizeObserverFlex = new ResizeObserver(function () {
            setCellsSize(function (prev) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                if (prev[xIndex] === undefined) {
                    prev[xIndex] = [];
                }
                // 1) Height / top changed
                if (ele.offsetTop !== ((_a = prev[xIndex][yIndex]) === null || _a === void 0 ? void 0 : _a.top) ||
                    ele.offsetHeight !== ((_b = prev[xIndex][yIndex]) === null || _b === void 0 ? void 0 : _b.height)) {
                    var downsideBros = Array.prototype.slice.call((_d = (_c = ele.parentNode) === null || _c === void 0 ? void 0 : _c.children) !== null && _d !== void 0 ? _d : []);
                    downsideBros.map(function (bro, index) {
                        if (index > yIndex) {
                            prev[xIndex][index] = {
                                top: bro.offsetTop,
                                left: bro.offsetLeft,
                                width: bro.offsetWidth,
                                height: bro.offsetHeight
                            };
                        }
                        return index;
                    });
                }
                // 2) Width / left changed
                if (ele.offsetLeft !== ((_e = prev[xIndex][yIndex]) === null || _e === void 0 ? void 0 : _e.left) ||
                    ele.offsetWidth !== ((_f = prev[xIndex][yIndex]) === null || _f === void 0 ? void 0 : _f.width)) {
                    var stages = Array.prototype.slice.call((_j = (_h = (_g = ele.parentNode) === null || _g === void 0 ? void 0 : _g.parentNode) === null || _h === void 0 ? void 0 : _h.children) !== null && _j !== void 0 ? _j : []);
                    stages.map(function (stage, idx1) {
                        if (idx1 > xIndex) {
                            var cells = Array.prototype.slice.call(stage.children);
                            cells.map(function (cell, idx2) {
                                var _a;
                                if (((_a = prev[idx1]) === null || _a === void 0 ? void 0 : _a[idx2]) !== undefined) {
                                    prev[idx1][idx2] = {
                                        top: cell.offsetTop,
                                        left: cell.offsetLeft,
                                        width: cell.offsetWidth,
                                        height: cell.offsetHeight
                                    };
                                }
                                return idx2;
                            });
                        }
                        return idx1;
                    });
                }
                prev[xIndex][yIndex] = {
                    top: ele.offsetTop,
                    left: ele.offsetLeft,
                    width: ele.offsetWidth,
                    height: ele.offsetHeight
                };
                return __spreadArray([], prev, true);
            });
        });
        // 2) table layout
        var resizeObserverTbl = new ResizeObserver(function () {
            setCellsSize(function (prev) {
                if (prev[xIndex] === undefined) {
                    prev[xIndex] = [];
                }
                var newSize = {
                    top: ele.offsetTop,
                    left: ele.offsetLeft,
                    width: ele.offsetWidth,
                    height: ele.offsetHeight
                };
                prev[xIndex][yIndex] = newSize;
                prev.map(function (stages, cIndex) {
                    var accumLeft = prev.filter(function (item, index) { return index < cIndex; }).reduce(function (prev, cur) { return (prev + cur[0].width); }, 0);
                    stages.map(function (cell, rIndex) {
                        if (cIndex === xIndex) {
                            // same column (X axis): width / left
                            cell.width = newSize.width;
                            cell.left = newSize.left;
                        }
                        else if (cIndex > xIndex) {
                            // cells on the rightside (X axis): left recalculation
                            cell.left = accumLeft;
                        }
                        var accumTop = prev[0].filter(function (item, index) { return index < rIndex; }).reduce(function (prev, cur) { return (prev + cur.height + cur.top); }, 0);
                        if (rIndex === yIndex) {
                            // same row (Y axis): height / top
                            cell.height = newSize.height;
                            cell.top = newSize.top;
                        }
                        else if (rIndex > yIndex) {
                            // cells on the downside (Y axis): top recalculation
                            cell.top = accumTop;
                        }
                        return rIndex;
                    });
                    return cIndex;
                });
                return __spreadArray([], prev, true);
            });
        });
        // console.log('resize observer...', xIndex, yIndex, ele)
        switch (layout) {
            case 'flex':
                resizeObserverFlex.observe(ele);
                refCellsObserver.current[xIndex][yIndex] = resizeObserverFlex;
                break;
            case 'table':
                resizeObserverTbl.observe(ele);
                refCellsObserver.current[xIndex][yIndex] = resizeObserverTbl;
                break;
        }
    }; };
    useEffect(function () {
        if (refCellsObserver.current.length > grid.length) {
            refCellsObserver.current = refCellsObserver.current.slice(0, grid.length);
        }
        refCellsObserver.current.map(function (cells, index) {
            if (cells.length > grid[index].length) {
                refCellsObserver.current[index] = refCellsObserver.current[index].slice(0, grid[index].length);
            }
        });
    }, [grid, refCellsObserver.current]);
    var nextNodeItems = __spreadArray(__spreadArray([], Object.values(PIPELINE_NODE.Type).map(function (nodeKey) {
        var _a;
        var nodeType = nodeKey;
        return ({
            key: nodeKey,
            label: (_a = PIPELINE_NODE.DEFS[nodeType]) === null || _a === void 0 ? void 0 : _a.nodeName,
            icon: PIPELINE_NODE.STYLES[nodeType].icon,
            onClick: onAddingNode === null || onAddingNode === void 0 ? void 0 : onAddingNode(nodeType),
        });
    }).filter(function (item) { return item.key !== PIPELINE_NODE.Type.TASK && item.key !== PIPELINE_NODE.Type.TRIGGER; }), true), [
        {
            type: 'divider'
        },
        {
            key: 'preset-task',
            label: 'Preset Task',
            icon: (_a = PIPELINE_NODE.STYLES[PIPELINE_NODE.Type.TASK]) === null || _a === void 0 ? void 0 : _a.icon,
            children: __spreadArray([], Object.values(PIPELINE_NODE.PresetTaskKey).map(function (taskKey) {
                var _a;
                return ({
                    key: "".concat((_a = PIPELINE_NODE.Type.TASK) !== null && _a !== void 0 ? _a : 'task', "-").concat(taskKey),
                    label: PIPELINE_NODE.PRESET_TASK_DEFS[taskKey].taskName,
                    icon: PIPELINE_NODE.PRESET_TASK_STYLES[taskKey].icon,
                    onClick: onAddingNode === null || onAddingNode === void 0 ? void 0 : onAddingNode(PIPELINE_NODE.Type.TASK, taskKey)
                });
            }), true)
        },
        {
            key: 'custom-task',
            label: 'Custom Task',
            icon: (_b = PIPELINE_NODE.STYLES[PIPELINE_NODE.Type.TASK]) === null || _b === void 0 ? void 0 : _b.icon,
            children: __spreadArray([], (customTaskDefs !== null && customTaskDefs !== void 0 ? customTaskDefs : []).map(function (task) { return ({
                key: "".concat(PIPELINE_NODE.Type.TASK, "-").concat(String(task.taskKey)),
                label: task.taskName,
                onClick: onAddingNode === null || onAddingNode === void 0 ? void 0 : onAddingNode(PIPELINE_NODE.Type.TASK, task.taskKey)
            }); }), true)
        }
    ], false);
    var renderNode = function (node) {
        var comp;
        var editProps = {
            editable: editor !== undefined,
            editing: isEditing === null || isEditing === void 0 ? void 0 : isEditing(node),
            changed: changed,
            onEdit: onEditNode,
            onDel: onDeleteNode,
            saveEditing: saveEditing,
            cancelEditing: cancelEditing
        };
        switch (node === null || node === void 0 ? void 0 : node.nodeType) {
            case PIPELINE_NODE.Type.TRIGGER:
                comp = jsx(PipelineTriggerNode, __assign({ node: node }, editProps));
                break;
            case PIPELINE_NODE.Type.IF:
                comp = jsx(PipelineIfNode, __assign({ node: node }, editProps));
                break;
            case PIPELINE_NODE.Type.SWITCH:
                comp = jsx(PipelineSwitchNode, __assign({ node: node }, editProps));
                break;
            case PIPELINE_NODE.Type.TASK:
                switch (node.taskKey) {
                    case PIPELINE_NODE.PresetTaskKey.BROWSE_MCH:
                        comp = jsx(PipelineMCHTaskNode, __assign({ node: node }, editProps));
                        break;
                    case PIPELINE_NODE.PresetTaskKey.UPDATE_FIELDS:
                        comp = jsx(PipelineUpdateTaskNode, __assign({ node: node }, editProps));
                        break;
                    default:
                        comp = jsx(PipelineCustomTaskNode, __assign({ node: node }, editProps));
                        break;
                }
                break;
        }
        return comp;
    };
    return (jsxs("div", __assign({ className: "".concat(clsPrefix, "-canvas") }, { children: [loading ? 'loading...' : null, layout === 'flex'
                ? jsx("div", __assign({ className: "".concat(clsPrefix, "-canvas-flex-box"), ref: refGridBox }, { children: grid.map(function (stage, xIndex) { return (jsx("div", __assign({ className: "".concat(clsPrefix, "-canvas-flex-box-stage") }, { children: Array.from(stage).map(function (node, yIndex) {
                            var comp = renderNode(node);
                            if (comp !== undefined) {
                                return (jsxs("div", __assign({ className: "".concat(clsPrefix, "-canvas-flex-box-stage-cell"), ref: onRefCell(xIndex, yIndex) }, { children: [comp, editor === undefined || (node.nodeType === PIPELINE_NODE.Type.IF || node.nodeType === PIPELINE_NODE.Type.SWITCH)
                                            ? null
                                            : jsx(Dropdown, __assign({ menu: { items: nextNodeItems }, placement: 'bottomLeft', arrow: true, trigger: ['click'], onOpenChange: onAddingParent === null || onAddingParent === void 0 ? void 0 : onAddingParent(node) }, { children: jsx("a", __assign({ className: "".concat(clsPrefix, "-canvas-flex-box-stage-cell-add-btn") }, { children: jsx(PlusOutlined, {}) })) }))] }), yIndex));
                            }
                            else {
                                return (jsx("div", __assign({ className: "".concat(clsPrefix, "-canvas-flex-box-stage-cell") }, { children: jsx(PlaceHolderCell, { xIndex: xIndex, yIndex: yIndex }) }), yIndex));
                            }
                        }) }), xIndex)); }) }))
                : layout === 'table'
                    ? jsx("div", __assign({ ref: refGridBox }, { children: jsx("table", __assign({ className: "".concat(clsPrefix, "-canvas-table-box") }, { children: jsx("tbody", { children: dummyMatrix.map(function (row, yIndex) { return (jsx("tr", { children: row.map(function (col, xIndex) {
                                        var _a;
                                        var node = (_a = grid[xIndex]) === null || _a === void 0 ? void 0 : _a[yIndex];
                                        var comp = renderNode(node);
                                        return (jsx("td", __assign({ className: "".concat(clsPrefix, "-canvas-table-box-cell"), ref: xIndex === 0 || yIndex === 0 ? onRefCell(xIndex, yIndex) : undefined }, { children: comp !== undefined
                                                ? jsxs(Fragment, { children: [comp, editor === undefined || (node.nodeType === PIPELINE_NODE.Type.IF || node.nodeType === PIPELINE_NODE.Type.SWITCH)
                                                            ? null
                                                            : jsx(Dropdown, __assign({ menu: { items: nextNodeItems }, placement: 'bottomLeft', arrow: true, trigger: ['click'], onOpenChange: onAddingParent === null || onAddingParent === void 0 ? void 0 : onAddingParent(node) }, { children: jsx("a", __assign({ className: "".concat(clsPrefix, "-canvas-table-box-cell-add-btn") }, { children: jsx(PlusOutlined, {}) })) }))] })
                                                : null }), xIndex));
                                    }) }, yIndex)); }) }) })) }))
                    : null, jsx(SvgLayer, { flowLines: flowLines, cellsSize: cellsSize, containerSize: containerSize })] })));
};
PipelineCanvas.displayName = 'PipelineCanvas';
var PipelineCanvas$1 = React.memo(PipelineCanvas);

var COLOR_MAP = {
    default: '#69b1ff',
    danger: '#ff4d4f',
    warning: '#ffc53d',
    success: '#95de64'
};
var PipelineEditor = function (props) {
    var _a, _b;
    var pipelineDef = props.pipelineDef, _c = props.loading, loading = _c === void 0 ? false : _c;
    var _d = useState(), curTrigger = _d[0], setCurTrigger = _d[1];
    var changeTrigger = function (trigger) {
        setCurTrigger(trigger);
    };
    var pipelineEditor = usePipelineEditor(curTrigger, changeTrigger);
    var editingNode = pipelineEditor.editingNode, changed = pipelineEditor.changed, cancelEditing = pipelineEditor.cancelEditing, saveEditing = pipelineEditor.saveEditing, changeIfNode = pipelineEditor.changeIfNode, changeTriggerNode = pipelineEditor.changeTriggerNode, changeSwitchNode = pipelineEditor.changeSwitchNode;
    var _e = useNodeTypeInfo(editingNode === null || editingNode === void 0 ? void 0 : editingNode.nodeType, (editingNode === null || editingNode === void 0 ? void 0 : editingNode.nodeType) === PIPELINE_NODE.Type.TASK ? editingNode.taskKey : undefined), nodeTypeDef = _e.nodeTypeDef, nodeTypeStyle = _e.nodeTypeStyle;
    useEffect(function () {
        setCurTrigger(pipelineDef === null || pipelineDef === void 0 ? void 0 : pipelineDef.trigger);
    }, [pipelineDef]);
    var nodeEditDetailPane = useMemo(function () {
        switch (editingNode === null || editingNode === void 0 ? void 0 : editingNode.nodeType) {
            case PIPELINE_NODE.Type.TRIGGER:
                return jsx(PipelineTriggerNodeEditor, { node: editingNode, onChange: changeTriggerNode });
            case PIPELINE_NODE.Type.IF:
                return jsx(PipelineIfNodeEditor, { node: editingNode, onChange: changeIfNode });
            case PIPELINE_NODE.Type.TASK:
                return jsx(PipelineTaskNodeEditor, { node: editingNode });
            case PIPELINE_NODE.Type.SWITCH:
                return jsx(PipelineSwitchNodeEditor, { node: editingNode, onChange: changeSwitchNode });
        }
    }, [editingNode]);
    return (jsxs("main", __assign({ className: "".concat(clsPrefix, "-editor") }, { children: [jsx("section", __assign({ className: "".concat(clsPrefix, "-editor-canvas-box") }, { children: jsx(PipelineCanvas$1, { trigger: curTrigger, loading: loading, editor: pipelineEditor }) })), jsxs("section", __assign({ className: classNames("".concat(clsPrefix, "-editor-node-detail-pane"), editingNode === undefined ? 'hide' : '') }, { children: [jsxs("header", __assign({ className: "".concat(clsPrefix, "-editor-node-detail-pane-label") }, { children: [jsx("div", { children: jsx("span", __assign({ className: "".concat(clsPrefix, "-editor-node-detail-pane-icon"), style: { backgroundColor: COLOR_MAP[(_a = nodeTypeStyle === null || nodeTypeStyle === void 0 ? void 0 : nodeTypeStyle.color) !== null && _a !== void 0 ? _a : 'default'] } }, { children: nodeTypeStyle === null || nodeTypeStyle === void 0 ? void 0 : nodeTypeStyle.icon })) }), jsx("h4", __assign({ className: "".concat(clsPrefix, "-editor-node-detail-pane-title") }, { children: (nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeType) === PIPELINE_NODE.Type.TASK
                                    ? "".concat((_b = nodeTypeDef.nodeName) !== null && _b !== void 0 ? _b : 'Task', " - ").concat(nodeTypeDef.taskName)
                                    : nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeName }))] })), (editingNode === null || editingNode === void 0 ? void 0 : editingNode.desc) !== undefined
                        ? jsx("div", __assign({ className: "".concat(clsPrefix, "-editor-node-detail-pane-desc") }, { children: editingNode.desc }))
                        : null, jsx("div", __assign({ className: "".concat(clsPrefix, "-editor-node-detail-pane-body") }, { children: nodeEditDetailPane })), jsx("footer", __assign({ className: "".concat(clsPrefix, "-editor-node-detail-pane-footer") }, { children: jsxs(Space, { children: [jsx(Button, __assign({ type: 'primary', icon: jsx(SaveOutlined, {}), onClick: saveEditing, disabled: !changed }, { children: "Save" })), jsx(Button, __assign({ type: 'link', onClick: cancelEditing }, { children: "Cancel" }))] }) }))] }))] })));
};

export { PipelineCanvas$1 as PipelineCanvas, PipelineEditor };
