import { __awaiter, __generator, __extends, __spreadArray, __assign } from '.tslib/';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { createContext, useContext, useState, useEffect, useMemo, createElement } from 'react';

import { Space, Button, Select, Checkbox, Input, Tooltip, Row, Col, Dropdown, Empty } from 'antd';

import { EditOutlined, DeleteOutlined, CheckOutlined, 
  CloseOutlined, WarningOutlined, TagOutlined, 
  TagsOutlined, DownOutlined, InboxOutlined, 
  PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';

import 'dayjs';
import { useMemoizedFn, useBoolean } from 'ahooks';
import { classNames, isEquals } from 'sr-ui-utils'


var QueryConditionContext = createContext({
    fieldList: []
});

var globalClsPrefix = 'srui-antd';

var clsPrefix$1 = "".concat(globalClsPrefix, "-query-condition");

/**
 * Relational Operators
 * 关系运算符
 */
var RELATIONAL_OPERATORS;
(function (RELATIONAL_OPERATORS) {
    RELATIONAL_OPERATORS["EQUAL_TO"] = "=";
    RELATIONAL_OPERATORS["CONTAIN"] = "contain";
    RELATIONAL_OPERATORS["GREATER_THAN"] = ">";
    RELATIONAL_OPERATORS["LESS_THAN"] = "<";
})(RELATIONAL_OPERATORS || (RELATIONAL_OPERATORS = {}));
/**
 * Logic Operators
 * 逻辑运算符
 */
var LOGIC_OPERATORS;
(function (LOGIC_OPERATORS) {
    LOGIC_OPERATORS["AND"] = "and";
    LOGIC_OPERATORS["OR"] = "or";
})(LOGIC_OPERATORS || (LOGIC_OPERATORS = {}));
/**
 * Data Type
 * 数据类型
 */
var DATA_TYPES;
(function (DATA_TYPES) {
    DATA_TYPES["NUM"] = "number";
    DATA_TYPES["STR"] = "string";
    DATA_TYPES["BOOL"] = "boolean";
    DATA_TYPES["LIST"] = "list";
})(DATA_TYPES || (DATA_TYPES = {}));

var _a, _b, _c;
var RelationalOperatorsConst = (_a = {},
    _a[RELATIONAL_OPERATORS.EQUAL_TO] = {
        name: 'equals',
        symbol: '='
    },
    _a[RELATIONAL_OPERATORS.CONTAIN] = {
        name: 'contains',
    },
    _a[RELATIONAL_OPERATORS.GREATER_THAN] = {
        name: 'greater than',
        symbol: '>'
    },
    _a[RELATIONAL_OPERATORS.LESS_THAN] = {
        name: 'less than',
        symbol: '<'
    },
    _a);
var LogicOperatorsConst = (_b = {},
    _b[LOGIC_OPERATORS.AND] = {
        name: 'AND',
        symbol: '&'
    },
    _b[LOGIC_OPERATORS.OR] = {
        name: 'OR',
        symbol: '|'
    },
    _b);
var DataTypeOperatorMap = (_c = {},
    _c[DATA_TYPES.STR] = [
        RELATIONAL_OPERATORS.CONTAIN,
        RELATIONAL_OPERATORS.EQUAL_TO
    ],
    _c[DATA_TYPES.NUM] = [
        RELATIONAL_OPERATORS.GREATER_THAN,
        RELATIONAL_OPERATORS.LESS_THAN,
        RELATIONAL_OPERATORS.EQUAL_TO
    ],
    _c[DATA_TYPES.BOOL] = [
        RELATIONAL_OPERATORS.EQUAL_TO
    ],
    _c[DATA_TYPES.LIST] = [
        RELATIONAL_OPERATORS.EQUAL_TO
    ],
    _c);

var ConditionItemBox = function (props) {
    var _a, _b, _c, _d;
    var field = props.field, operator = props.operator, value = props.value, openEdit = props.openEdit, delCondition = props.delCondition;
    var _e = useContext(QueryConditionContext), _f = _e.editable, editable = _f === void 0 ? false : _f, _g = _e.size, size = _g === void 0 ? 'default' : _g;
    var onDelete = useMemoizedFn(function () {
        delCondition === null || delCondition === void 0 ? void 0 : delCondition(field, operator, value).then(function () { }).catch(function (err) {
            console.error(err);
        });
    });
    return (jsxs("span", __assign({ className: classNames("".concat(clsPrefix$1, "-item"), size === 'small' ? 'small' : '') }, { children: [jsxs("span", __assign({ className: "".concat(clsPrefix$1, "-item-content") }, { children: [jsx("span", __assign({ className: "".concat(clsPrefix$1, "-item-content-name") }, { children: field === null || field === void 0 ? void 0 : field.name })), jsx("span", __assign({ className: "".concat(clsPrefix$1, "-item-content-operator") }, { children: operator !== undefined
                            ? ((_d = (_b = (_a = RelationalOperatorsConst[operator]) === null || _a === void 0 ? void 0 : _a.symbol) !== null && _b !== void 0 ? _b : (_c = RelationalOperatorsConst[operator]) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : operator)
                            : null })), jsx("span", __assign({ className: "".concat(clsPrefix$1, "-item-content-value") }, { children: (field === null || field === void 0 ? void 0 : field.dataType) === DATA_TYPES.STR
                            ? jsxs(Fragment, { children: ["\"", value, "\""] })
                            : (field === null || field === void 0 ? void 0 : field.dataType) === DATA_TYPES.BOOL
                                ? value === true ? 'True' : 'False'
                                : (field === null || field === void 0 ? void 0 : field.dataType) === DATA_TYPES.NUM ? Number(value) : value }))] })), jsx("span", __assign({ className: classNames("".concat(clsPrefix$1, "-item-btns"), editable ? '' : 'hide') }, { children: jsxs(Space, { children: [openEdit !== undefined
                            ? jsx(Button, { type: 'link', icon: jsx(EditOutlined, {}), size: 'small', onClick: openEdit, className: "".concat(clsPrefix$1, "-item-btns-btn") })
                            : null, jsx(Button, { type: 'link', danger: true, icon: jsx(DeleteOutlined, {}), size: 'small', onClick: onDelete, className: "".concat(clsPrefix$1, "-item-btns-btn") })] }) }))] })));
};
ConditionItemBox.displayName = 'ConditionItemBox';
var ConditionItemBox$1 = React.memo(ConditionItemBox);

var EditableConditionItemBox = function (props) {
    var onSave = props.onSave, cancelEdit = props.cancelEdit, disabledFields = props.disabledFields, defaultValue = props.defaultValue;
    var _a = useState(defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.field), currentField = _a[0], setCurrentField = _a[1];
    var _b = useState(defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.value), currentVal = _b[0], setCurerntVal = _b[1];
    var _c = useState(defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.operator), currentOperator = _c[0], setCurrentOperator = _c[1];
    var fieldList = useContext(QueryConditionContext).fieldList;
    var _d = useState(), addError = _d[0], setAddError = _d[1];
    var onSelectField = useMemoizedFn(function (fieldId) {
        var field = fieldList === null || fieldList === void 0 ? void 0 : fieldList.find(function (item) { return item.id === fieldId; });
        setCurrentField(field);
        setCurrentOperator((field === null || field === void 0 ? void 0 : field.dataType) !== undefined ? DataTypeOperatorMap[field.dataType][0] : undefined);
        setCurerntVal(undefined);
    });
    var changeStrValue = function (ev) {
        setCurerntVal(ev.target.value);
    };
    var changeBoolValue = function (ev) {
        setCurerntVal(ev.target.checked);
    };
    var onOK = function () {
        if (currentField === undefined || currentVal === undefined || currentOperator === undefined)
            return;
        var condItem = {
            type: 'item',
            field: currentField,
            operator: currentOperator,
            value: currentVal
        };
        onSave === null || onSave === void 0 ? void 0 : onSave(condItem).then(function () {
            setAddError(undefined);
            cancelEdit === null || cancelEdit === void 0 ? void 0 : cancelEdit();
        }).catch(function (err) {
            console.error('[Error] Fail to save condition item', condItem, err);
            setAddError(err);
        });
    };
    return (jsxs("span", __assign({ className: classNames("".concat(clsPrefix$1, "-edit-item")) }, { children: [jsxs("span", __assign({ className: "".concat(clsPrefix$1, "-edit-item-content") }, { children: [jsx("span", __assign({ className: "".concat(clsPrefix$1, "-edit-item-content-field") }, { children: jsx(Select, __assign({ size: 'small', onChange: onSelectField, style: { width: '100%' }, value: currentField === null || currentField === void 0 ? void 0 : currentField.id }, { children: fieldList === null || fieldList === void 0 ? void 0 : fieldList.map(function (field) { return (jsx(Select.Option, __assign({ value: field.id, disabled: disabledFields === null || disabledFields === void 0 ? void 0 : disabledFields.includes(field.id) }, { children: field.name }), field.id)); }) })) })), (currentField === null || currentField === void 0 ? void 0 : currentField.dataType) !== undefined && DataTypeOperatorMap[currentField.dataType].length === 1
                        ? DataTypeOperatorMap[currentField.dataType][0]
                        : jsx("span", __assign({ className: "".concat(clsPrefix$1, "-edit-item-content-operator") }, { children: jsx(Select, __assign({ size: 'small', disabled: currentField === undefined, onChange: setCurrentOperator, style: { width: '100% ' }, value: currentOperator }, { children: ((currentField === null || currentField === void 0 ? void 0 : currentField.dataType) !== undefined
                                    ? DataTypeOperatorMap[currentField.dataType]
                                    : Object.keys(RELATIONAL_OPERATORS)).map(function (opr) {
                                    var _a, _b, _c, _d;
                                    return (jsx(Select.Option, __assign({ value: opr }, { children: (_d = (_b = (_a = RelationalOperatorsConst[opr]) === null || _a === void 0 ? void 0 : _a.symbol) !== null && _b !== void 0 ? _b : (_c = RelationalOperatorsConst[opr]) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : opr }), opr));
                                }) })) })), jsx("span", __assign({ className: "".concat(clsPrefix$1, "-edit-item-content-value") }, { children: (currentField === null || currentField === void 0 ? void 0 : currentField.dataType) === DATA_TYPES.LIST
                            ? jsx(Select, __assign({ size: 'small', disabled: currentField === undefined, onChange: setCurerntVal, style: { width: '100% ' }, value: currentVal }, { children: currentField.listOptions.map(function (item) { return (jsx(Select.Option, __assign({ value: item }, { children: item }), item)); }) }))
                            : (currentField === null || currentField === void 0 ? void 0 : currentField.dataType) === DATA_TYPES.BOOL
                                ? jsx(Checkbox, __assign({ checked: currentVal, onChange: changeBoolValue, disabled: currentField === undefined }, { children: currentVal === true ? 'True' : 'False' }))
                                : jsx(Input, { size: 'small', disabled: currentField === undefined, value: currentVal, onChange: changeStrValue, allowClear: true, width: 100 }) }))] })), jsxs("span", __assign({ className: "".concat(clsPrefix$1, "-edit-item-btns") }, { children: [jsx(Button, { type: 'link', icon: jsx(CheckOutlined, {}), size: 'small', disabled: currentField === undefined || currentVal === undefined ||
                            (typeof currentVal === 'string' && currentVal.length === 0) ||
                            currentOperator === undefined, onClick: onOK, className: "".concat(clsPrefix$1, "-edit-item-btns-btn") }), jsx(Button, { type: 'link', icon: jsx(CloseOutlined, {}), size: 'small', onClick: cancelEdit, className: "".concat(clsPrefix$1, "-edit-item-btns-btn") })] })), addError !== undefined
                ? jsx("span", __assign({ className: "".concat(clsPrefix$1, "-edit-item-err-info") }, { children: jsx(Tooltip, __assign({ title: addError === null || addError === void 0 ? void 0 : addError.toString(), destroyTooltipOnHide: true }, { children: jsx(WarningOutlined, { style: { color: '@ffa940 ' } }) })) }))
                : null] })));
};

var EditableConditionGroupBox = function (props) {
    var parentId = props.parentId, seq = props.seq, cancelEditing = props.cancelEditing;
    var _a = useContext(QueryConditionContext), _b = _a.operatorOptionFixed, operatorOptionFixed = _b === void 0 ? false : _b, addConditionGroup = _a.addConditionGroup;
    var _c = useState(), operator = _c[0], setOperator = _c[1];
    var onOK = useMemoizedFn(function () {
        if (operator === undefined)
            return;
        var newId = "".concat(parentId, "-").concat(seq.toString());
        addConditionGroup === null || addConditionGroup === void 0 ? void 0 : addConditionGroup(newId, operator, parentId).then(function (condition) {
            cancelEditing === null || cancelEditing === void 0 ? void 0 : cancelEditing(condition);
        }).catch(function (err) {
            console.warn(err);
        });
    });
    var onEnterOperator = useMemoizedFn(function (ev) {
        setOperator(ev.target.value);
    });
    var onCancel = useMemoizedFn(function () {
        cancelEditing === null || cancelEditing === void 0 ? void 0 : cancelEditing();
    });
    return (jsx("div", __assign({ className: "".concat(clsPrefix$1, "-edit-group") }, { children: jsxs(Row, __assign({ gutter: [12, 3] }, { children: [jsx(Col, __assign({ flex: 1 }, { children: jsxs(Space, __assign({ size: 6 }, { children: ["Combination:", operatorOptionFixed
                                ? jsx(Select, __assign({ style: { width: 120 }, size: 'small', onChange: setOperator }, { children: Object.values(LOGIC_OPERATORS).map(function (opr) {
                                        var _a;
                                        return (jsx(Select.Option, __assign({ value: opr }, { children: (_a = LogicOperatorsConst[opr]) === null || _a === void 0 ? void 0 : _a.name }), opr));
                                    }) }))
                                : jsx(Input, { onChange: onEnterOperator, size: 'small' })] })) })), jsx(Col, __assign({ flex: 'none' }, { children: jsxs(Space, { children: [jsx(Button, { type: 'link', icon: jsx(CheckOutlined, {}), size: 'small', onClick: onOK, disabled: operator === undefined }), jsx(Button, { type: 'link', danger: true, icon: jsx(DeleteOutlined, {}), size: 'small', onClick: onCancel })] }) }))] })) })));
};
var EditableConditionGroupBox$1 = React.memo(EditableConditionGroupBox);

var ConditionGroupBox = function (props) {
    var _a, _b, _c;
    var id = props.id, operator = props.operator, items = props.items, _d = props.defaultExpanded, defaultExpanded = _d === void 0 ? false : _d;
    var _e = useContext(QueryConditionContext), _f = _e.editable, editable = _f === void 0 ? false : _f, _g = _e.nested, nested = _g === void 0 ? false : _g, _h = _e.layout, layout = _h === void 0 ? 'inline' : _h, _j = _e.size, size = _j === void 0 ? 'small' : _j, _k = _e.expandable, expandable = _k === void 0 ? false : _k, addConditionItem = _e.addConditionItem, delConditionItem = _e.delConditionItem, delConditionGroup = _e.delConditionGroup;
    var _l = useBoolean(expandable ? true : defaultExpanded), expanded = _l[0], toggleExpand = _l[1].toggle;
    var _m = useBoolean(false), newing = _m[0], _o = _m[1], openNew = _o.setTrue, closeNew = _o.setFalse;
    var _p = useState(), newType = _p[0], setNewType = _p[1];
    var disabledFields = useMemo(function () {
        if (operator === LOGIC_OPERATORS.OR)
            return undefined;
        var condsItems = items === null || items === void 0 ? void 0 : items.filter(function (item) { return item.type === 'item'; });
        return condsItems === null || condsItems === void 0 ? void 0 : condsItems.map(function (item) { return item.field.id; });
    }, [items]);
    var onAddCondition = useMemoizedFn(function (cond) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (addConditionItem === null || addConditionItem === void 0 ? void 0 : addConditionItem(id, cond.field, cond.operator, cond.value))];
                case 1:
                    if (!((_b = _c.sent()) !== null && _b !== void 0)) return [3 /*break*/, 2];
                    _a = _b;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, Promise.reject(new Error('method "addConditionItem" no set'))];
                case 3:
                    _a = _c.sent();
                    _c.label = 4;
                case 4: return [2 /*return*/, _a];
            }
        });
    }); });
    var onDelCondition = useMemoizedFn(function (field, operator, value) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (delConditionItem === null || delConditionItem === void 0 ? void 0 : delConditionItem(id, field, operator, value))];
                case 1:
                    if (!((_b = _c.sent()) !== null && _b !== void 0)) return [3 /*break*/, 2];
                    _a = _b;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, Promise.reject(new Error('method "onDelCondition" not set'))];
                case 3:
                    _a = _c.sent();
                    _c.label = 4;
                case 4: return [2 /*return*/, _a];
            }
        });
    }); });
    var onDelConditionGroup = useMemoizedFn(function () {
        delConditionGroup === null || delConditionGroup === void 0 ? void 0 : delConditionGroup(id).then(function () { }).catch(function (err) {
            console.warn('Fail to delete', err);
        });
    });
    var onNewCondition = useMemoizedFn(function (type) {
        setNewType(type);
        openNew();
    });
    var conditionTypeMenu = [
        {
            label: 'Condition Item',
            key: 'item',
            icon: jsx(TagOutlined, { className: "".concat(clsPrefix$1, "-group-menu-icon") }),
            onClick: function () {
                onNewCondition('item');
            }
        },
        {
            label: 'Condition Group',
            key: 'group',
            icon: jsx(TagsOutlined, { className: "".concat(clsPrefix$1, "-group-menu-icon") }),
            onClick: function () {
                onNewCondition('group');
            }
        }
    ];
    useEffect(function () {
        if (!expanded)
            closeNew();
    }, [expanded]);
    var renderConditionSumDesc = function (cond) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (cond.type === 'item') {
            return jsxs("span", __assign({ className: "".concat(clsPrefix$1, "-group-condition-desc-item") }, { children: [jsx("span", __assign({ className: "".concat(clsPrefix$1, "-group-condition-desc-item-field") }, { children: cond.field.name })), jsx("span", __assign({ className: "".concat(clsPrefix$1, "-group-condition-desc-operator") }, { children: (_d = (_b = (_a = RelationalOperatorsConst[cond.operator]) === null || _a === void 0 ? void 0 : _a.symbol) !== null && _b !== void 0 ? _b : (_c = RelationalOperatorsConst[cond.operator]) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : cond.operator })), jsxs("span", __assign({ className: "".concat(clsPrefix$1, "-group-condition-desc-item-value") }, { children: ["\"", cond.value, "\""] }))] }));
        }
        else {
            if (((_e = cond === null || cond === void 0 ? void 0 : cond.items) === null || _e === void 0 ? void 0 : _e.length) === 0) {
                return jsxs(Fragment, { children: [jsx("span", __assign({ className: "".concat(clsPrefix$1, "-group-condition-desc-root-operator") }, { children: (_g = (_f = LogicOperatorsConst[operator]) === null || _f === void 0 ? void 0 : _f.name) !== null && _g !== void 0 ? _g : operator })), jsx("span", __assign({ className: "".concat(clsPrefix$1, "-group-empty-box") }, { children: id }))] });
            }
            return (jsx(Fragment, { children: (_h = cond === null || cond === void 0 ? void 0 : cond.items) === null || _h === void 0 ? void 0 : _h.map(function (item, index) {
                    var _a, _b, _c, _d, _e, _f;
                    return jsxs(React.Fragment, { children: ["(", renderConditionSumDesc(item), ")", index < ((_b = (_a = cond === null || cond === void 0 ? void 0 : cond.items) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) - 1
                                ? jsx("span", __assign({ className: "".concat(clsPrefix$1, "-group-condition-desc-operator") }, { children: (_f = (_d = (_c = LogicOperatorsConst[cond.operator]) === null || _c === void 0 ? void 0 : _c.symbol) !== null && _d !== void 0 ? _d : (_e = LogicOperatorsConst[cond.operator]) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : cond.operator }))
                                : null] }, index);
                }) }));
        }
    };
    var summaryDesc = useMemo(function () { return renderConditionSumDesc({ type: 'group', operator: operator, items: items }); }, [operator, items]);
    return (jsxs("div", __assign({ className: classNames("".concat(clsPrefix$1, "-group"), expanded ? 'expanded' : '', size === 'small' ? 'small' : '') }, { children: [jsxs("div", __assign({ className: "".concat(clsPrefix$1, "-group-header-bar") }, { children: [jsx("span", __assign({ className: "".concat(clsPrefix$1, "-group-conditions-desc") }, { children: expanded
                            ? jsxs(Space, { children: [jsx("span", __assign({ className: "".concat(clsPrefix$1, "-group-conditions-desc-root-operator") }, { children: (_b = (_a = LogicOperatorsConst[operator]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : operator })), id] })
                            : summaryDesc })), jsx("span", __assign({ className: classNames("".concat(clsPrefix$1, "-group-header-bar-btns"), !expandable ? 'hide' : '') }, { children: jsx(Button, { type: 'text', size: 'small', icon: jsx(DownOutlined, { style: { fontSize: 10 }, rotate: expanded ? 180 : 0 }), onClick: toggleExpand }) }))] })), expanded
                ? jsxs(Fragment, { children: [jsx("div", __assign({ className: "".concat(clsPrefix$1, "-group-filter-list"), style: layout === 'vertical' ? { flexDirection: 'column' } : {} }, { children: items === null || items === void 0 ? void 0 : items.map(function (atom, index) { return (jsx(React.Fragment, { children: atom.type === 'item'
                                    ? jsx(ConditionItemBox$1, __assign({}, atom, { delCondition: onDelCondition }))
                                    : createElement(ConditionGroupBox, __assign({}, atom, { key: atom.id, defaultExpanded: defaultExpanded })) }, index)); }) })), (items === null || items === void 0 ? void 0 : items.length) === 0
                            ? jsx("span", __assign({ className: "".concat(clsPrefix$1, "-group-empty-box") }, { children: jsx(InboxOutlined, { className: 'icon' }) }))
                            : null, jsx("span", __assign({ className: classNames("".concat(clsPrefix$1, "-group-editing-wrap"), editable ? '' : 'hide') }, { children: newing
                                ? newType === 'item'
                                    ? jsx(EditableConditionItemBox, { cancelEdit: closeNew, onSave: onAddCondition, disabledFields: disabledFields })
                                    : jsx(EditableConditionGroupBox$1, { parentId: id, seq: ((_c = items === null || items === void 0 ? void 0 : items.length) !== null && _c !== void 0 ? _c : 0) + 1, cancelEditing: closeNew })
                                : jsxs(Space, __assign({ size: 16 }, { children: [nested
                                            ? jsx(Dropdown, __assign({ menu: { items: conditionTypeMenu } }, { children: jsx(Button, __assign({ icon: jsx(PlusOutlined, {}), size: 'small', type: 'link' }, { children: "Child" })) }))
                                            : jsx(Button, __assign({ icon: jsx(PlusCircleOutlined, {}), size: 'small', type: 'link', onClick: function () { onNewCondition('item'); } }, { children: "Child" })), jsx(Button, __assign({ icon: jsx(DeleteOutlined, {}), size: 'small', type: 'link', danger: true, onClick: onDelConditionGroup }, { children: "Delete" }))] })) }))] })
                : null] }), id));
};
ConditionGroupBox.displayName = 'ConditionGroupBox';
var ConditionGroupBox$1 = React.memo(ConditionGroupBox);

var QueryConditionGroupEditor = function (props) {
    var fieldList = props.fieldList, _a = props.editable, editable = _a === void 0 ? false : _a, _b = props.nested, nested = _b === void 0 ? false : _b, _c = props.layout, layout = _c === void 0 ? 'inline' : _c, _d = props.size, size = _d === void 0 ? 'default' : _d, _e = props.expandable, expandable = _e === void 0 ? false : _e, _f = props.operatorOptionFixed, operatorOptionFixed = _f === void 0 ? false : _f, _g = props.defaultExpanded, defaultExpanded = _g === void 0 ? false : _g, value = props.value, onChange = props.onChange, clearAll = props.clearAll;
    var _h = useState(), curCondition = _h[0], setCurCondition = _h[1];
    /**
     * Convert condition group tree to condition nodes with id
     * @param {ConditionGroupProps} conditions  condition group tree
     * @param {number} seq         sequence number of this node
     * @param {string} parentId    parent node's id
     */
    var convertConditonsTree = useMemoizedFn(function (condition, seq, parentId) {
        var _a;
        var nodeId = parentId === undefined ? '0' : "".concat(parentId, "-").concat(seq.toString());
        var node = __assign(__assign({}, condition), { id: nodeId, items: (_a = condition === null || condition === void 0 ? void 0 : condition.items) === null || _a === void 0 ? void 0 : _a.map(function (item, index) {
                if (item.type === 'item')
                    return item;
                return convertConditonsTree(item, index, nodeId);
            }) });
        return node;
    });
    /**
     * Find target condition group
     * @param {Key} groupId   target group's id
     * @param {ConditionGroupPropsWithId} group   group tree nodes
     * @returns
     */
    var findTargetGroup = useMemoizedFn(function (groupId, group) {
        var _a, _b, _c;
        if ((group === null || group === void 0 ? void 0 : group.id) === groupId) {
            return group;
        }
        for (var j = 0; j < ((_b = (_a = group === null || group === void 0 ? void 0 : group.items) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0); j++) {
            var child = (_c = group === null || group === void 0 ? void 0 : group.items) === null || _c === void 0 ? void 0 : _c[j];
            if ((child === null || child === void 0 ? void 0 : child.type) !== 'group')
                continue;
            var found = findTargetGroup(groupId, child);
            if (found !== undefined)
                return found;
        }
        return undefined;
    });
    /**
     * Find parent condition group
     * @param {Key} id    target condition item's id (condition item / condition group)
     * @param {ConditionGroupPropsWithId} group    group tree noddes
     * @returns
     */
    var findParentGroup = useMemoizedFn(function (id, group) {
        var _a;
        var groupItems = (_a = group === null || group === void 0 ? void 0 : group.items) === null || _a === void 0 ? void 0 : _a.filter(function (child) { return child.type === 'group'; });
        for (var i = 0; i < groupItems.length; i++) {
            var child = groupItems[i];
            if (child.id === id)
                return group;
            var found = findParentGroup(id, child);
            if (found !== undefined)
                return found;
        }
    });
    /**
     * Add one condition item
     * @param {Key} parentGroupId     parent condition group's id
     * @param {FieldProps} field      condition's field
     * @param {RELATIONAL_OPERATORS} operator      the operator of the condition
     * @param {any} value                       the value of the condition
     * @returns
     */
    var addConditionItem = useMemoizedFn(function (parentGroupId, field, operator, value) { return __awaiter(void 0, void 0, void 0, function () {
        var error, finalVal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    finalVal = curCondition;
                    setCurCondition(function (prev) {
                        var _a;
                        if (prev === undefined) {
                            return prev;
                        }
                        finalVal = prev;
                        var parentGroup = findTargetGroup(parentGroupId, prev);
                        var targetIndex = (_a = parentGroup === null || parentGroup === void 0 ? void 0 : parentGroup.items) === null || _a === void 0 ? void 0 : _a.findIndex(function (child) { return (child.type === 'item' && child.field.id === field.id && child.operator === operator && child.value === value); });
                        if ((targetIndex !== null && targetIndex !== void 0 ? targetIndex : -1) >= 0) {
                            error = new Error("Can't add duplicated item");
                            return prev;
                        }
                        if ((parentGroup === null || parentGroup === void 0 ? void 0 : parentGroup.items) !== undefined) {
                            parentGroup.items = __spreadArray(__spreadArray([], parentGroup === null || parentGroup === void 0 ? void 0 : parentGroup.items, true), [{ type: 'item', field: field, operator: operator, value: value }], false);
                            return __assign({}, prev);
                        }
                        return prev;
                    });
                    if (!(error !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.reject(error)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, Promise.resolve(finalVal)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
    /**
     * Delete one condition item
     * @param {Key} parentGroupId                parent condition group's id
     * @param {FieldProps} field                 the field of this condition item
     * @param {RELATIONAL_OPERATORS} operator    the operator of the condition
     * @param {any} value                        the value of the condition
     * @returns
     */
    var delConditionItem = useMemoizedFn(function (parentGroupId, field, operator, value) { return __awaiter(void 0, void 0, void 0, function () {
        var error, finalVal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    finalVal = curCondition;
                    setCurCondition(function (prev) {
                        var _a;
                        if (prev === undefined) {
                            // nothing to delete
                            return prev;
                        }
                        finalVal = prev;
                        var parentGroup = findTargetGroup(parentGroupId, prev);
                        var targetIndex = (_a = parentGroup === null || parentGroup === void 0 ? void 0 : parentGroup.items) === null || _a === void 0 ? void 0 : _a.findIndex(function (child) { return (child.type === 'item' && child.field.id === field.id && child.operator === operator && child.value === value); });
                        if ((parentGroup === null || parentGroup === void 0 ? void 0 : parentGroup.items) !== undefined && targetIndex !== undefined) {
                            parentGroup.items = __spreadArray(__spreadArray([], parentGroup.items.slice(0, targetIndex), true), parentGroup.items.slice(targetIndex + 1), true);
                            return __assign({}, prev);
                        }
                        else {
                            error = new Error("Can't find condition item in group ".concat(parentGroupId));
                        }
                        return prev;
                    });
                    if (!(error !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.reject(error)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, Promise.resolve(finalVal)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
    /**
     * Add condition group
     * @param {Key} groupId      new group's id
     * @param {LOGIC_OPERATORS} operator     the logic operator of this group
     * @param {Key} parentGroupId     parent group's id
     * @returns
     */
    var addConditionGroup = useMemoizedFn(function (groupId, operator, parentGroupId) { return __awaiter(void 0, void 0, void 0, function () {
        var error, finalVal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    finalVal = curCondition;
                    setCurCondition(function (prev) {
                        if (prev === undefined) {
                            // root group node
                            prev = { type: 'group', id: groupId, operator: operator, items: [] };
                            finalVal = prev;
                            return __assign({}, prev);
                        }
                        finalVal = prev;
                        var parentGroup = findTargetGroup(parentGroupId, prev);
                        if ((parentGroup === null || parentGroup === void 0 ? void 0 : parentGroup.items) !== undefined) {
                            parentGroup.items = __spreadArray(__spreadArray([], parentGroup.items, true), [
                                {
                                    type: 'group',
                                    id: groupId,
                                    operator: operator,
                                    items: []
                                }
                            ], false);
                            return __assign({}, prev);
                        }
                        else {
                            error = new Error("Can't find parent condition group: ".concat(parentGroupId));
                        }
                        return prev;
                    });
                    if (!(error !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.reject(error)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, Promise.resolve(finalVal)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
    /**
     * Delete condition group
     * @param {Key} groupId    the condition group's id
     * @returns
     */
    var delConditionGroup = useMemoizedFn(function (groupId) { return __awaiter(void 0, void 0, void 0, function () {
        var error, finalVal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    finalVal = curCondition;
                    setCurCondition(function (prev) {
                        var _a, _b;
                        if (prev === undefined) {
                            // nothing to delete
                            return prev;
                        }
                        finalVal = prev;
                        if (prev.id === groupId) {
                            // delete root group
                            clearAll === null || clearAll === void 0 ? void 0 : clearAll();
                            return undefined;
                        }
                        var parent = findParentGroup(groupId, prev);
                        var targetIndex = (_b = (_a = parent === null || parent === void 0 ? void 0 : parent.items) === null || _a === void 0 ? void 0 : _a.findIndex(function (child) { return child.type === 'group' && child.id === groupId; })) !== null && _b !== void 0 ? _b : -1;
                        if ((parent === null || parent === void 0 ? void 0 : parent.items) !== undefined && targetIndex >= 0) {
                            parent.items = __spreadArray(__spreadArray([], parent.items.slice(0, targetIndex), true), parent.items.slice(targetIndex + 1), true);
                            return __assign({}, prev);
                        }
                        else {
                            error = new Error("Can't find condition group: ".concat(groupId));
                        }
                        return prev;
                    });
                    if (!(error !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.reject(error)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, Promise.resolve(finalVal)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
    var onFinishRootGroup = function (condition) {
        if (condition === undefined) {
            clearAll === null || clearAll === void 0 ? void 0 : clearAll();
        }
    };
    useEffect(function () {
        if (curCondition === undefined)
            return;
        onChange === null || onChange === void 0 ? void 0 : onChange(curCondition);
    }, [curCondition]);
    useEffect(function () {
        if (value === undefined) {
            setCurCondition(undefined);
            return;
        }
        var converted = convertConditonsTree(value, 0);
        var equals = isEquals(converted, curCondition);
        if (!equals) {
            setCurCondition(converted);
        }
    }, [value]);
    return (jsx(QueryConditionContext.Provider, __assign({ value: {
            fieldList: fieldList,
            editable: editable,
            expandable: expandable,
            nested: nested,
            operatorOptionFixed: operatorOptionFixed,
            layout: layout,
            size: size,
            addConditionItem: addConditionItem,
            delConditionItem: delConditionItem,
            addConditionGroup: addConditionGroup,
            delConditionGroup: delConditionGroup,
        } }, { children: curCondition === undefined
            ? editable
                ? jsx(EditableConditionGroupBox$1, { seq: 0, parentId: '0', cancelEditing: onFinishRootGroup })
                : jsx("div", __assign({ className: "".concat(clsPrefix$1, "-empty") }, { children: '<Empty>' }))
            : jsx(ConditionGroupBox$1, __assign({}, curCondition, { defaultExpanded: defaultExpanded })) })));
};
QueryConditionGroupEditor.displayName = 'QueryConditionGroupEditor';
var QueryCondtionGroupEditor = React.memo(QueryConditionGroupEditor);

var QueryConditionItemEditor = function (props) {
    var fieldList = props.fieldList, _a = props.editable, editable = _a === void 0 ? false : _a, _b = props.defaultEditing, defaultEditing = _b === void 0 ? false : _b, _c = props.size, size = _c === void 0 ? 'default' : _c, value = props.value, onChange = props.onChange, clearAll = props.clearAll;
    var _d = useState(value), curCondition = _d[0], setCurCondition = _d[1];
    var _e = useBoolean(defaultEditing), editing = _e[0], _f = _e[1], openEdit = _f.setTrue, endEdit = _f.setFalse;
    var onSaveItem = function (cond) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onChange === null || onChange === void 0 ? void 0 : onChange(cond);
                    return [4 /*yield*/, Promise.resolve('ok')];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    var onDelete = function (field, operator, value) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setCurCondition(undefined);
            clearAll === null || clearAll === void 0 ? void 0 : clearAll();
            endEdit();
            return [2 /*return*/];
        });
    }); };
    useEffect(function () {
        setCurCondition(value);
    }, [value]);
    return (jsx(QueryConditionContext.Provider, __assign({ value: {
            fieldList: fieldList,
            editable: editable,
            size: size
        } }, { children: editing
            ? jsx(EditableConditionItemBox, { defaultValue: curCondition, onSave: onSaveItem, cancelEdit: endEdit })
            : curCondition === undefined
                ? jsx("div", __assign({ className: "".concat(clsPrefix$1, "-empty") }, { children: '<Empty>' }))
                : jsx(ConditionItemBox$1, __assign({}, curCondition, { delCondition: onDelete, openEdit: openEdit })) })));
};
QueryConditionItemEditor.displayName = 'QueryConditionItemEditor';
var QueryCondtionItemEditor = React.memo(QueryConditionItemEditor);

var QueryConditionSelector = function (props) {
    var fieldList = props.fieldList, _a = props.editable, editable = _a === void 0 ? false : _a, _b = props.nested, nested = _b === void 0 ? false : _b, _c = props.layout, layout = _c === void 0 ? 'inline' : _c, _d = props.size, size = _d === void 0 ? 'default' : _d, _e = props.expandable, expandable = _e === void 0 ? false : _e, _f = props.operatorOptionFixed, operatorOptionFixed = _f === void 0 ? false : _f, _g = props.defaultExpanded, defaultExpanded = _g === void 0 ? false : _g, value = props.value, onChange = props.onChange;
    var _h = useState(), newType = _h[0], setNewType = _h[1];
    var _j = useBoolean(false), newing = _j[0], _k = _j[1], openNew = _k.setTrue, closeNew = _k.setFalse;
    var onNewCondition = useMemoizedFn(function (type) { return function (e) {
        setNewType(type);
        openNew();
    }; });
    var addItemRoot = useMemoizedFn(function (cond) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onChange === null || onChange === void 0 ? void 0 : onChange(cond);
                    return [4 /*yield*/, Promise.resolve(cond)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
    var addConditionGroup = useMemoizedFn(function (groupId, operator, parentGroupId) { return __awaiter(void 0, void 0, void 0, function () {
        var group;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    group = {
                        type: 'group',
                        operator: operator,
                        items: [],
                        id: '0'
                    };
                    onChange === null || onChange === void 0 ? void 0 : onChange(group);
                    return [4 /*yield*/, Promise.resolve(group)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
    var clearAll = useMemoizedFn(function () {
        setNewType(undefined);
        onChange === null || onChange === void 0 ? void 0 : onChange(undefined);
    });
    return (jsx(QueryConditionContext.Provider, __assign({ value: {
            fieldList: fieldList,
            editable: editable,
            expandable: expandable,
            nested: nested,
            operatorOptionFixed: operatorOptionFixed,
            layout: layout,
            size: size,
            addConditionGroup: addConditionGroup
        } }, { children: newing
            ? newType === 'item'
                ? jsx(EditableConditionItemBox, { cancelEdit: closeNew, onSave: addItemRoot })
                : newType === 'group'
                    ? jsx(EditableConditionGroupBox$1, { parentId: '0', seq: 0, cancelEditing: closeNew })
                    : null
            : (value === null || value === void 0 ? void 0 : value.type) === 'group'
                ? jsx(QueryCondtionGroupEditor, { fieldList: fieldList, editable: editable, layout: layout, size: size, nested: nested, expandable: expandable, defaultExpanded: defaultExpanded, operatorOptionFixed: operatorOptionFixed, value: value, onChange: onChange, clearAll: clearAll })
                : (value === null || value === void 0 ? void 0 : value.type) === 'item'
                    ? jsx(QueryCondtionItemEditor, { fieldList: fieldList, defaultEditing: false, editable: editable, size: size, value: value, onChange: onChange, clearAll: clearAll })
                    : editable
                        ? jsxs(Space, { children: [jsx(Button, __assign({ type: 'link', icon: jsx(TagOutlined, {}), onClick: onNewCondition('item') }, { children: "Item" })), jsx(Button, __assign({ type: 'link', icon: jsx(TagsOutlined, {}), onClick: onNewCondition('group') }, { children: "Group" }))] })
                        : jsx("div", __assign({ className: "".concat(clsPrefix$1, "-empty") }, { children: '<Empty>' })) })));
};

var QueryConditionItemListEditor = function (props) {
    var fieldList = props.fieldList, _a = props.editable, editable = _a === void 0 ? false : _a, _b = props.size, size = _b === void 0 ? 'default' : _b, value = props.value, onChange = props.onChange;
    var _c = useBoolean(false), newing = _c[0], _d = _c[1], openNew = _d.setTrue, closeNew = _d.setFalse;
    /**
     * Append item to list
     * @param {ConditionItemProps} cond
     * @returns
     */
    var onAddItem = useMemoizedFn(function (cond) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onChange === null || onChange === void 0 ? void 0 : onChange(__spreadArray(__spreadArray([], (value !== null && value !== void 0 ? value : []), true), [cond], false));
                    return [4 /*yield*/, Promise.resolve(cond)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
    /**
     * Delete item from list
     * @param {number} index      index number of target item
     * @returns
     */
    var onDelItem = useMemoizedFn(function (index) { return function (field, operator, fieldValue) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (value === undefined || (value instanceof Array && value.length === 0))
                return [2 /*return*/];
            onChange === null || onChange === void 0 ? void 0 : onChange(__spreadArray(__spreadArray([], value.slice(0, index), true), value.slice(index + 1), true));
            return [2 /*return*/];
        });
    }); }; });
    return (jsx(QueryConditionContext.Provider, __assign({ value: {
            fieldList: fieldList,
            editable: editable,
            size: size
        } }, { children: jsxs("div", __assign({ className: "".concat(clsPrefix$1, "-item-list") }, { children: [value === null || value === void 0 ? void 0 : value.map(function (item, index) { return (jsx(ConditionItemBox$1, __assign({}, item, { delCondition: onDelItem(index) }), index)); }), value === undefined || value.length === 0
                    ? jsx(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE, description: 'No item' })
                    : null, editable
                    ? newing
                        ? jsx(EditableConditionItemBox, { onSave: onAddItem, cancelEdit: closeNew })
                        : jsx(Button, __assign({ type: 'dashed', block: true, size: size === 'small' ? 'small' : 'middle', onClick: openNew }, { children: jsx(PlusOutlined, { style: { fontSize: 12 } }) }))
                    : null] })) })));
};


export { QueryConditionSelector, QueryConditionItemListEditor }
