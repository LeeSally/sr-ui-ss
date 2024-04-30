import { __awaiter, __generator, __extends, __spreadArray, __assign } from '../../../../../node_modules/tslib/tslib.js';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { createContext, useContext, useState, useEffect, useMemo, createElement, useRef } from 'react';
import { Space, Button, Select, Checkbox, Input, Tooltip, Row, Col, Dropdown, Empty, Badge, Popconfirm, Descriptions, Typography, Tag, Divider, Table, List } from 'antd';
import { EditOutlined, SearchOutlined, ForkOutlined, PartitionOutlined, CarryOutOutlined, CaretRightOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, WarningOutlined, TagOutlined, TagsOutlined, DownOutlined, InboxOutlined, PlusOutlined, PlusCircleOutlined, QuestionCircleOutlined, SaveOutlined, UpOutlined, UserOutlined, SubnodeOutlined } from '@ant-design/icons';
import 'dayjs';
import axios from 'axios';
import { useMemoizedFn, useBoolean, useToggle } from 'ahooks';

/**
 * Concatenate a list of css class names into a string, delimited by space
 * 将一组 css class 样式类名拼合到字符串, 以空格分隔
 * @param {string | string[]} classList  a list of css class names  一组 css 样式类名
 * @param {string[]} rest
 * @returns {string}   a string of classnames delimited by space   以空格分隔的 class 样式类名字符串
 */
var classNames = function (classList) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    if (typeof classList === 'string') {
        if ((rest === null || rest === void 0 ? void 0 : rest.length) > 0) {
            return "".concat(classList, " ").concat(rest === null || rest === void 0 ? void 0 : rest.filter(function (item) { return (item === null || item === void 0 ? void 0 : item.length) > 0; }).join(' '));
        }
        else {
            return classList;
        }
    }
    else if (classList instanceof Array) {
        return classList.join(' ');
    }
    else {
        return '';
    }
};

/**
 * Compare two values by strng, judge if they are equal or not (optional for ignore case or trim)
 * 比较两个字符值，判断是否相等 (可选忽略大小写、或切除空格)
 * @param {*} val1    value1  输入值1
 * @param {*} val2    value2  输入值2
 * @param {StrEqualOptions} option  the option for comparasion  比较选项
 * @returns {boolean}  true/false
 */
var isStrEquals = function (val1, val2, option) {
    var _a, _b;
    if (option === void 0) { option = { ignoreCase: false, trim: true }; }
    var str1 = String(val1);
    var str2 = String(val2);
    if ((_a = option === null || option === void 0 ? void 0 : option.ignoreCase) !== null && _a !== void 0 ? _a : false) {
        str1 = str1.toUpperCase();
        str2 = str2.toUpperCase();
    }
    if ((_b = option === null || option === void 0 ? void 0 : option.trim) !== null && _b !== void 0 ? _b : false) {
        str1 = str1.trim();
        str2 = str2.trim();
    }
    return str1 === str2;
};

/**
 * Compare two object values, judge if they are equal or not (deep copy)
 * 比较两个对象值，判断是否相等 (深拷贝)
 * @param {*} val1   输入值1
 * @param {*} val2   输入值2
 * @returns {boolean}  true/false
 */
var isObjEquals = function (val1, val2) {
    var diffKeys = [];
    if (val1 instanceof Array && val2 instanceof Array) {
        if (val1.length !== val2.length)
            return false;
        val1.map(function (itm, index) {
            if (!isEquals(val1[index], val2 === null || val2 === void 0 ? void 0 : val2[index])) {
                diffKeys.push(index);
            }
            return index;
        });
    }
    else {
        var val1Keys = Object.keys(val1);
        var val2Keys = Object.keys(val2);
        if (val1Keys.length !== val2Keys.length)
            return false;
        val1Keys.map(function (key) {
            if (!isEquals(val1[key], val2 === null || val2 === void 0 ? void 0 : val2[key])) {
                diffKeys.push(key);
            }
            return key;
        });
    }
    return diffKeys.length === 0;
};
/**
 * Judge two values equals (deep copy)
 * 判断两个值是否相等 (深拷贝遍历)
 * @param {*} val1  value1  输入值1
 * @param {*} val2  value2  输入值2
 * @param {boolean} typeEquals    strictly judge data type equals  严格比较数据类型
 * @returns {boolean}    true/false
 */
var isEquals = function (val1, val2, typeEquals) {
    if (typeEquals === void 0) { typeEquals = true; }
    if (typeEquals && typeof val1 !== typeof val2)
        return false;
    var isEqual = false;
    switch (typeof val1) {
        case 'string':
            isEqual = isStrEquals(val1, val2);
            break;
        case 'number':
            if (Number.isNaN(val1) && Number.isNaN(val2)) {
                isEqual = true;
            }
            else {
                isEqual = Number(val1) === Number(val2);
            }
            break;
        case 'boolean':
            isEqual = Boolean(val1) === Boolean(val2);
            break;
        case 'undefined':
            isEqual = val2 === undefined;
            break;
        case 'object':
            if (val1 === null || val2 === null) {
                isEqual = val1 === null && val2 === null;
            }
            else {
                isEqual = isObjEquals(val1, val2);
            }
            break;
    }
    return isEqual;
};

/**
 * 十六进制字符对应数值映射
 */
var HEX_VAL_MAP = {
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
};
for (var i = 0; i < 10; i++) {
    HEX_VAL_MAP[i.toString()] = i;
}

var service = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 60000,
});
service.interceptors.request.use(function (config) {
    if (config.headers !== undefined) {
        config.headers = {};
    }
    return Promise.resolve(config);
}, function (error) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.reject(error)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
service.interceptors.response.use(function (response) {
    var res = response.data;
    if (res.code !== 0) {
        console.warn('Unexpected response', response.data);
    }
    return response;
}, function (err) { return __awaiter(void 0, void 0, void 0, function () {
    var response, statusCode;
    return __generator(this, function (_a) {
        if (err.code === 'ERR_CANCELED') {
            console.warn(err);
            return [2 /*return*/];
        }
        response = err.response;
        statusCode = Number(response === null || response === void 0 ? void 0 : response.status);
        if (statusCode >= 500) {
            console.error('HTTP 50X ERROR', response === null || response === void 0 ? void 0 : response.statusText, response === null || response === void 0 ? void 0 : response.data);
        }
        else if (statusCode >= 400) {
            console.warn('HTTP 40X ERROR', response === null || response === void 0 ? void 0 : response.statusText, response === null || response === void 0 ? void 0 : response.data);
        }
        else {
            console.error('ERROR', err.name, err.message, response);
            return [2 /*return*/, Promise.reject(err)];
        }
        return [2 /*return*/];
    });
}); });

/**
 * A basic "Queue" data structure
 * 基础队列数据结构
 */
var Queue = /** @class */ (function () {
    function Queue(max) {
        this._queue = [];
        this._max = -1;
        this._max = max !== null && max !== void 0 ? max : -1;
    }
    /**
     * Queue is empty or not
     * 队列是否为空
     * @returns {boolean}
     */
    Queue.prototype.isEmpty = function () {
        return this._queue.length === 0;
    };
    /**
     * Queue is full or not
     * 队列是否已满
     * @returns {boolean}
     */
    Queue.prototype.isFull = function () {
        return this._max > 0 && this._queue.length >= this._max;
    };
    /**
     * Enter an element into queue
     * 将元素入队
     * @param {T} item
     * @returns
     */
    Queue.prototype.enqueue = function (item) {
        if (this.isFull()) {
            console.warn('[Queue]: the queue is full.');
            return false;
        }
        this._queue.push(item);
        return true;
    };
    /**
     * Drop out the element from queue
     * 出队
     * @returns {T}
     */
    Queue.prototype.dequeue = function () {
        if (this.isEmpty()) {
            console.warn('[Queue]: the queue is empty.');
            return undefined;
        }
        var firstItem = this._queue.shift();
        return firstItem;
    };
    Object.defineProperty(Queue.prototype, "size", {
        /**
         * The queue's length
         * 队列长度
         */
        get: function () {
            return this._queue.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "front", {
        /**
         * The front element of queue
         * 队首元素
         */
        get: function () {
            if (this.isEmpty()) {
                console.warn('[Queue]: the queue is empty.');
                return undefined;
            }
            return this._queue[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "rear", {
        /**
         * The rear element of queue
         * 队尾元素
         */
        get: function () {
            if (this.isEmpty()) {
                console.warn('[Queue]: the queue is empty.');
                return undefined;
            }
            return this._queue[this.size - 1];
        },
        enumerable: false,
        configurable: true
    });
    Queue.prototype.destroy = function () {
        this._queue.map(function (item) {
            item.destroy();
        });
    };
    return Queue;
}());

/**
 * A wrapped object of Worker
 * Worker 线程包装对象
 */
var WorkerItem = /** @class */ (function () {
    function WorkerItem(_a) {
        var index = _a.index, scriptPath = _a.scriptPath;
        this._running = false;
        this._worker = new Worker(scriptPath);
        this._index = index;
    }
    WorkerItem.prototype.run = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var onMsgFn = args.onMsgFn, argsPostMsg = args.argsPostMsg;
                            _this._running = true;
                            _this._worker.onmessage = function (ev) {
                                onMsgFn(ev);
                                _this._running = false;
                                resolve(_this._index);
                            };
                            _this._worker.onerror = function (err) {
                                console.error('[WorkerItem::run]', err);
                                _this._running = false;
                                reject(err);
                            };
                            try {
                                _this._worker.postMessage(argsPostMsg);
                            }
                            catch (error) {
                                console.error('[WorkerItem::run]', error);
                            }
                            _this._running = false;
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Object.defineProperty(WorkerItem.prototype, "running", {
        get: function () {
            return this._running;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkerItem.prototype, "index", {
        get: function () {
            return this._index;
        },
        enumerable: false,
        configurable: true
    });
    WorkerItem.prototype.destroy = function () {
        this._worker.terminate();
    };
    return WorkerItem;
}());

var WorkerTaskStatus;
(function (WorkerTaskStatus) {
    WorkerTaskStatus[WorkerTaskStatus["NOT_START"] = 0] = "NOT_START";
    WorkerTaskStatus[WorkerTaskStatus["RUNNING"] = 1] = "RUNNING";
    WorkerTaskStatus[WorkerTaskStatus["FINISH"] = 2] = "FINISH";
    WorkerTaskStatus[WorkerTaskStatus["ERROR"] = 3] = "ERROR";
    WorkerTaskStatus[WorkerTaskStatus["DEAD"] = 4] = "DEAD";
})(WorkerTaskStatus || (WorkerTaskStatus = {}));
var WorkerTask = /** @class */ (function () {
    function WorkerTask(_a) {
        var id = _a.id, argsPostMsg = _a.argsPostMsg;
        this._argsPostMsg = argsPostMsg;
        this._id = id;
        this._status = WorkerTaskStatus.NOT_START;
    }
    Object.defineProperty(WorkerTask.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkerTask.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    WorkerTask.prototype.run = function (_a) {
        var workerItem = _a.workerItem, onMessageFn = _a.onMessageFn;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            _this._status = WorkerTaskStatus.RUNNING;
                            setTimeout(function () {
                                workerItem.run({ onMsgFn: onMessageFn, argsPostMsg: _this._argsPostMsg }).then(function () {
                                    _this._status = WorkerTaskStatus.FINISH;
                                    resolve(workerItem);
                                }).catch(function (err) {
                                    console.error('[WokerTask::run]', _this._id, _this._argsPostMsg, err);
                                    _this._status = WorkerTaskStatus.ERROR;
                                    reject(err);
                                });
                            });
                        })];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    WorkerTask.prototype.destroy = function () {
        this._status = WorkerTaskStatus.DEAD;
    };
    return WorkerTask;
}());

/**
 * A basic worker pool
 * worker 基础线程池
 */
var WorkerPoolBase = /** @class */ (function () {
    function WorkerPoolBase(_a) {
        var scriptPath = _a.scriptPath, size = _a.size;
        this._pool = [];
        this._stopping = false;
        this._taskQueue = new Queue();
        // create pool
        for (var i = 0; i < size; i++) {
            var workerItem = new WorkerItem({ index: i, scriptPath: scriptPath });
            this._pool.push(workerItem);
        }
    }
    /**
     * Add task item  加入任务
     * @param {AddTaskArgs<PostMsgArgs>}
     */
    WorkerPoolBase.prototype.addTask = function (_a) {
        var _b;
        var argsPostMsg = _a.argsPostMsg;
        var taskId = "".concat(new Date().valueOf(), "_").concat(this._taskQueue.size);
        var task = new WorkerTask({ id: taskId, argsPostMsg: argsPostMsg });
        if ((_b = !this._taskQueue.enqueue(task)) !== null && _b !== void 0 ? _b : false) {
            console.warn('[WorkerPool::addTask] Fail to add task', task);
            return;
        }
        this.run();
    };
    WorkerPoolBase.prototype.stop = function () {
        this._stopping = true;
    };
    WorkerPoolBase.prototype.onMessageFn = function (ev) {
        // to be impletemented by inheritor
        console.log(ev);
    };
    /**
     * Run the next task in the worker item
     * 在 worker 对象中执行下一个任务
     * @param { WorkerItemProps<PostMsgArgs>} workerItem
     * @returns {Promise<any>}
     */
    WorkerPoolBase.prototype.runNextTask = function (workerItem) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            if (_this._stopping) {
                                console.warn('[WorkerPool::runNextTask] Worker Pool is stopping...');
                                reject(new Error('[WorkerPool::runNextTask] Worker Pool is stopping...'));
                                return;
                            }
                            var task = _this.dequeueTask();
                            if (task === undefined) {
                                resolve('[WorkerPool::runNextTask] Tasks in queue all finished');
                                return;
                            }
                            task.run({ workerItem: workerItem, onMessageFn: _this.onMessageFn }).then(function () {
                                _this.runNextTask(workerItem).then(function () { }, function (err) { throw err; });
                                resolve("[WorkerPool::runNextTask] Finish task \"".concat(task.id, "\""));
                            }, function (err) {
                                console.error('[WorkerPool::runNextTask]', err);
                                reject(err);
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Run the worker pool
     * 运行线程池
     * @returns
     */
    WorkerPoolBase.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var idlePoolItems, _loop_1, this_1, i;
            return __generator(this, function (_a) {
                idlePoolItems = this._pool.filter(function (itm) { return !itm.running; });
                if (idlePoolItems.length === 0) {
                    console.warn('[WorkerPool::run] NO idle poolitem');
                    return [2 /*return*/];
                }
                _loop_1 = function (i) {
                    this_1.runNextTask(idlePoolItems[i]).then(function () { }, function (err) {
                        console.error('[WorkerPool::run]', idlePoolItems[i], err);
                    });
                };
                this_1 = this;
                for (i = 0; i < idlePoolItems.length; i++) {
                    _loop_1(i);
                }
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(WorkerPoolBase.prototype, "runningCount", {
        /**
         * The count of worker in running
         * 正在运行的 worker 对象个数
         */
        get: function () {
            return this._pool.filter(function (itm) { return itm.running; }).length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkerPoolBase.prototype, "isStopping", {
        get: function () {
            return this._stopping;
        },
        enumerable: false,
        configurable: true
    });
    WorkerPoolBase.prototype.dequeueTask = function () {
        return this._taskQueue.dequeue();
    };
    WorkerPoolBase.prototype.enqueueTask = function (task) {
        this._taskQueue.enqueue(task);
    };
    Object.defineProperty(WorkerPoolBase.prototype, "taskCount", {
        get: function () {
            return this._taskQueue.size;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Destroy 销毁
     */
    WorkerPoolBase.prototype.destroy = function () {
        this._stopping = true;
        // worker pool
        this._pool.map(function (itm) {
            itm.destroy();
            return null;
        });
        this._pool = [];
        // task queue
        this._taskQueue.destroy();
    };
    return WorkerPoolBase;
}());

/**
 * A worker pool, pass onMessage function
 * worker 线程池实例
 */
/** @class */ ((function (_super) {
    __extends(WorkerPoolOnMsg, _super);
    function WorkerPoolOnMsg(args) {
        var _this = _super.call(this, args) || this;
        _this._onMessageFn = args.onMessageFn;
        return _this;
    }
    WorkerPoolOnMsg.prototype.onMessageFn = function (ev) {
        this._onMessageFn(ev);
    };
    return WorkerPoolOnMsg;
})(WorkerPoolBase));

var WorkerTaskOnMsgCreator = /** @class */ (function (_super) {
    __extends(WorkerTaskOnMsgCreator, _super);
    function WorkerTaskOnMsgCreator(args) {
        var _this = _super.call(this, args) || this;
        var argsOnMsgCreator = args.argsOnMsgCreator;
        _this._argsOnMsgCreator = argsOnMsgCreator;
        return _this;
    }
    Object.defineProperty(WorkerTaskOnMsgCreator.prototype, "OnMsgCreatorArgs", {
        get: function () {
            return this._argsOnMsgCreator;
        },
        enumerable: false,
        configurable: true
    });
    return WorkerTaskOnMsgCreator;
}(WorkerTask));

/**
 * A worker pool, pass onMessage creator factory function
 * worker 线程池, onMessage 生成工厂函数
 */
/** @class */ ((function (_super) {
    __extends(WorkerPoolOnMsgCreator, _super);
    function WorkerPoolOnMsgCreator(args) {
        var _this = _super.call(this, args) || this;
        _this._onMsgFnCreator = args.onMsgFnCreator;
        return _this;
    }
    /**
     * Add task item  加入任务
     * @param {AddTaskArgs<PostMsgArgs>}
     */
    WorkerPoolOnMsgCreator.prototype.addTask = function (_a) {
        var argsPostMsg = _a.argsPostMsg, argsOnMsgCreator = _a.argsOnMsgCreator;
        var taskId = "".concat(new Date().valueOf(), "_").concat(this.taskCount);
        var task = new WorkerTaskOnMsgCreator({ id: taskId, argsPostMsg: argsPostMsg, argsOnMsgCreator: argsOnMsgCreator });
        this.enqueueTask(task);
    };
    /**
     * Run the next task in the worker item
     * 在 worker 对象中执行下一个任务
     * @param { WorkerItemProps<PostMsgArgs>} workerItem
     * @returns {Promise<any>}
     */
    WorkerPoolOnMsgCreator.prototype.runNextTask = function (workerItem) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            if (_this.isStopping) {
                                console.warn('[WorkerPool::runNextTask] Worker Pool is stopping...');
                                reject(new Error('[WorkerPool::runNextTask] Worker Pool is stopping...'));
                                return;
                            }
                            var task = _this.dequeueTask();
                            if (task === undefined) {
                                resolve('[WorkerPool::runNextTask] Tasks in queue all finished');
                                return;
                            }
                            var onMessageFn = _this._onMsgFnCreator(task.OnMsgCreatorArgs);
                            task.run({ workerItem: workerItem, onMessageFn: onMessageFn }).then(function () {
                                _this.runNextTask(workerItem).then(function () { }, function (err) { throw err; });
                                resolve("[WorkerPool::runNextTask] Finish task \"".concat(task.id, "\""));
                            }, function (err) {
                                console.error('[WorkerPool::runNextTask]', err);
                                reject(err);
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return WorkerPoolOnMsgCreator;
})(WorkerPoolBase));

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
            var custom = customTaskDefs === null || customTaskDefs === void 0 ? void 0 : customTaskDefs.find(function (def) { return def.taskKey === taskKey; });
            if ((custom === null || custom === void 0 ? void 0 : custom.color) !== undefined) {
                return {
                    color: custom === null || custom === void 0 ? void 0 : custom.color,
                    icon: jsx(CarryOutOutlined, {})
                };
            }
        }
        var defaultStyle = {
            color: 'success',
            icon: jsx(CarryOutOutlined, {})
        };
        return nodeType === undefined ? defaultStyle : PIPELINE_NODE.STYLES[nodeType];
    }, [nodeType, taskKey, customTaskDefs]);
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
        return { nodeType: nodeType, taskKey: taskKey };
    }, [nodeType, taskKey]);
    return {
        nodeTypeDef: nodeTypeDef,
        nodeTypeStyle: nodeTypeStyle,
        taskDef: taskDef
    };
};

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
    return (jsx(PipelineBaseNode, __assign({ label: (nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeType) === PIPELINE_NODE.Type.TASK
            ? (_b = (_a = taskDef === null || taskDef === void 0 ? void 0 : taskDef.taskName) !== null && _a !== void 0 ? _a : taskDef === null || taskDef === void 0 ? void 0 : taskDef.taskKey) !== null && _b !== void 0 ? _b : 'Task'
            : nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeName }, nodeTypeStyle, { abstract: abstractDesc, desc: node.desc, editable: editable, editing: editing, startEdit: onEditNode, endEdit: cancelEditing, onDel: onDelNode, changed: changed })));
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
    var _a, _b, _c;
    var pipelineDef = props.pipelineDef, _d = props.loading, loading = _d === void 0 ? false : _d;
    var _e = useState(), curTrigger = _e[0], setCurTrigger = _e[1];
    var changeTrigger = function (trigger) {
        setCurTrigger(trigger);
    };
    var pipelineEditor = usePipelineEditor(curTrigger, changeTrigger);
    var editingNode = pipelineEditor.editingNode, changed = pipelineEditor.changed, cancelEditing = pipelineEditor.cancelEditing, saveEditing = pipelineEditor.saveEditing, changeIfNode = pipelineEditor.changeIfNode, changeTriggerNode = pipelineEditor.changeTriggerNode, changeSwitchNode = pipelineEditor.changeSwitchNode;
    var _f = useNodeTypeInfo(editingNode === null || editingNode === void 0 ? void 0 : editingNode.nodeType, (editingNode === null || editingNode === void 0 ? void 0 : editingNode.nodeType) === PIPELINE_NODE.Type.TASK ? editingNode.taskKey : undefined), nodeTypeDef = _f.nodeTypeDef, nodeTypeStyle = _f.nodeTypeStyle, taskDef = _f.taskDef;
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
                                    ? "".concat((_b = nodeTypeDef.nodeName) !== null && _b !== void 0 ? _b : 'Task', " - ").concat((_c = taskDef === null || taskDef === void 0 ? void 0 : taskDef.taskName) !== null && _c !== void 0 ? _c : taskDef === null || taskDef === void 0 ? void 0 : taskDef.taskKey)
                                    : nodeTypeDef === null || nodeTypeDef === void 0 ? void 0 : nodeTypeDef.nodeName }))] })), (editingNode === null || editingNode === void 0 ? void 0 : editingNode.desc) !== undefined
                        ? jsx("div", __assign({ className: "".concat(clsPrefix, "-editor-node-detail-pane-desc") }, { children: editingNode.desc }))
                        : null, jsx("div", __assign({ className: "".concat(clsPrefix, "-editor-node-detail-pane-body") }, { children: nodeEditDetailPane })), jsx("footer", __assign({ className: "".concat(clsPrefix, "-editor-node-detail-pane-footer") }, { children: jsxs(Space, { children: [jsx(Button, __assign({ type: 'primary', icon: jsx(SaveOutlined, {}), onClick: saveEditing, disabled: !changed }, { children: "Save" })), jsx(Button, __assign({ type: 'link', onClick: cancelEditing }, { children: "Cancel" }))] }) }))] }))] })));
};

export { PipelineCanvas$1 as PipelineCanvas, PipelineEditor };
