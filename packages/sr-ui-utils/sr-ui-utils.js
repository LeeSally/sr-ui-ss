import dayjs from 'dayjs';
import axios from 'axios';

/**
 * Concatenate a list of css class names into a string, delimited by space
 * 将一组 css class 样式类名拼合到字符串, 以空格分隔
 * @param {string | string[]} classList  a list of css class names  一组 css 样式类名
 * @param {string[]} rest
 * @returns {string}   a string of classnames delimited by space   以空格分隔的 class 样式类名字符串
 */
var classNames = function classNames(classList) {
  if (typeof classList === 'string') {
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }
    if ((rest === null || rest === void 0 ? void 0 : rest.length) > 0) {
      return "".concat(classList, " ").concat(rest === null || rest === void 0 ? void 0 : rest.filter(function (item) {
        return (item === null || item === void 0 ? void 0 : item.length) > 0;
      }).join(' '));
    } else {
      return classList;
    }
  } else if (classList instanceof Array) {
    return classList.join(' ');
  } else {
    return '';
  }
};

/**
 * Debounce function
 * 防抖函数
 * @param {number} delay     delay time                        延迟时间
 * @param {Function} fn      the raw function to be debouced   目标原函数
 * @returns {Function}       the debounced function            防抖处理后的函数
 */
function debounce(delay, fn) {
  if (fn === undefined) {
    return function () {};
  }
  var timer;
  return function (args) {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      fn(args);
      clearTimeout(timer);
      timer = undefined;
    }, delay);
  };
}

/**
 * Judge if a value is empty (null, undefined, "")
 * 判断一个值是否为空
 * @param {*} val  the input target value   输入目标值
 * @returns {boolean} true/false
 */
var isEmpty = function isEmpty(val) {
  var _val$length;
  return val === undefined || val === null || typeof val === 'string' && ((_val$length = val === null || val === void 0 ? void 0 : val.length) !== null && _val$length !== void 0 ? _val$length : 0) === 0;
};

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function (t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function (t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw new Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(typeof e + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function (e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function () {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw new Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function (t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

/**
 * Convert any value to string
 * 将任意值转成字符串
 * @param {*} obj   the raw value   原始值
 * @returns {string} the outputed string value  处理后的字符串值
 */
var toString = function toString(obj) {
  if (obj === null) return '';
  switch (_typeof(obj)) {
    case 'object':
      if (typeof obj.toString === 'string') {
        return obj.toString;
      } else {
        return Object.keys(obj).map(function (key) {
          return "".concat(key, ":").concat(String(obj[key]));
        }).join(' ');
      }
    case 'number':
    case 'string':
    case 'boolean':
    case 'bigint':
    case 'symbol':
      return obj.toString();
    case 'undefined':
      return '';
  }
  return String(obj);
};

/**
 * Copy text value into clipboard
 * 将文本内容拷贝到剪切板
 * @param {string} text   the target text value   目标文本值
 * @returns {void} null
 */
var copyToClipboard = function copyToClipboard(text) {
  var _navigator;
  if (((_navigator = navigator) === null || _navigator === void 0 || (_navigator = _navigator.clipboard) === null || _navigator === void 0 ? void 0 : _navigator.writeText) !== undefined) {
    navigator.clipboard.writeText(text).then(function () {}, function () {});
  } else {
    var txtarea = document.createElement('textarea');
    txtarea.style.position = 'absolute';
    txtarea.style.left = '-100px';
    txtarea.style.width = '100px';
    document.body.appendChild(txtarea);
    try {
      var encoded = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#39;').replace(/\/'/g, '&#x2F;');
      txtarea.value = encoded;
      txtarea.innerHTML = encoded;
      txtarea.select();
      document.execCommand('copy');
    } catch (error) {
      console.error('Fail to copy', error);
    } finally {
      document.body.removeChild(txtarea);
    }
  }
};

/**
 * Find parent HTML DOM element
 * 查找指定父 DOM 元素
 * @param {HTMLElement | null} dom  child DOM element           子 DOM 元素
 * @param {string} nodeName   node name of target parent DOM    目标父 DOM 元素节点名
 * @param {string} className  class name of target DOM          目标父 DOM 元素的 css class 样式类名
 * @returns {HTMLElement | undefined}
 */
var findParentDOM = function findParentDOM(dom, nodeName, className) {
  if (isEmpty(dom)) return undefined;
  if ((dom === null || dom === void 0 ? void 0 : dom.nodeName) === nodeName && (className !== undefined ? dom === null || dom === void 0 ? void 0 : dom.className.includes(className) : true)) {
    return dom;
  }
  if ((dom === null || dom === void 0 ? void 0 : dom.parentElement) instanceof HTMLElement) {
    return findParentDOM(dom === null || dom === void 0 ? void 0 : dom.parentElement, nodeName, className);
  }
  return undefined;
};

/**
 * Get accumulated offset left distance of one DOM element
 * 计算指定 DOM 元素的距左侧累计偏移量
 * @param {HTMLElement | null} dom           The target DOM element    目标 DOM 元素
 * @param {HTMLElement | null} stopParent    The parent DOM element which cause stop when encountered    父 DOM 元素, 停止计算
 * @param {number} accu                      accumulated left distance value    当前左侧距离累计偏移量
 * @returns {number}
 */
var getOffsetLeft = function getOffsetLeft(dom) {
  var stopParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var accu = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (dom === null) return accu;
  if ((dom === null || dom === void 0 ? void 0 : dom.parentElement) !== stopParent) {
    return getOffsetLeft(dom === null || dom === void 0 ? void 0 : dom.parentElement, stopParent, dom.offsetLeft + accu);
  } else {
    return (dom === null || dom === void 0 ? void 0 : dom.offsetLeft) + accu;
  }
};

/**
 * Get accumulated offset top distance of one DOM element
 * 计算指定 DOM 元素的距顶部累计偏移量
 * @param {HTMLElement | null} dom     The target DOM element    目标 DOM 元素
 * @param {number} accu                accumulated top size      当前顶部距离累计偏移量
 * @returns {number}
 */
var getOffsetTop = function getOffsetTop(dom) {
  var accu = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (dom === null) return accu;
  if ((dom === null || dom === void 0 ? void 0 : dom.parentElement) !== null) {
    return getOffsetTop(dom === null || dom === void 0 ? void 0 : dom.parentElement, dom.offsetTop + accu);
  } else {
    return (dom === null || dom === void 0 ? void 0 : dom.offsetTop) + accu;
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
var isStrEquals = function isStrEquals(val1, val2) {
  var _option$ignoreCase, _option$trim;
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    ignoreCase: false,
    trim: true
  };
  var str1 = String(val1);
  var str2 = String(val2);
  if ((_option$ignoreCase = option === null || option === void 0 ? void 0 : option.ignoreCase) !== null && _option$ignoreCase !== void 0 ? _option$ignoreCase : false) {
    str1 = str1.toUpperCase();
    str2 = str2.toUpperCase();
  }
  if ((_option$trim = option === null || option === void 0 ? void 0 : option.trim) !== null && _option$trim !== void 0 ? _option$trim : false) {
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
var isObjEquals = function isObjEquals(val1, val2) {
  var diffKeys = [];
  if (val1 instanceof Array && val2 instanceof Array) {
    if (val1.length !== val2.length) return false;
    val1.map(function (itm, index) {
      if (!isEquals(val1[index], val2 === null || val2 === void 0 ? void 0 : val2[index])) {
        diffKeys.push(index);
      }
      return index;
    });
  } else {
    var val1Keys = Object.keys(val1);
    var val2Keys = Object.keys(val2);
    if (val1Keys.length !== val2Keys.length) return false;
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
var isEquals = function isEquals(val1, val2) {
  var typeEquals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (typeEquals && _typeof(val1) !== _typeof(val2)) return false;
  var isEqual = false;
  switch (_typeof(val1)) {
    case 'string':
      isEqual = isStrEquals(val1, val2);
      break;
    case 'number':
      if (Number.isNaN(val1) && Number.isNaN(val2)) {
        isEqual = true;
      } else {
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
      } else {
        isEqual = isObjEquals(val1, val2);
      }
      break;
  }
  return isEqual;
};

var NUM = {
  K: 1000,
  // 千
  M: 1000000,
  // 百万
  B: 1000000000 // 十亿
};

/**
 * Trim number by thousand digit
 * @param { number | string } value 
 * @returns 
 */
var trimThousandth = function trimThousandth(value) {
  if (!value) return '0.0';
  if (typeof value === 'number' && value === 0) return '0';
  var num = Number(value);
  if (typeof num != 'number' || isNaN(num)) {
    // 无效数值
    return value.toString();
  }
  var numStr = num.toString();
  var intNum = Math.floor(num); // integer part value 获取整数部分数值
  var fracNum = num - intNum; // fractional part valuie 获取小数部分数值

  var intStr = intNum.toString(); // string of integer part value 整数部分字符串
  var fracStr = fracNum.toString().substring(2); // string of fractional part valuie 小数部分字符串

  if (numStr.includes('e')) {
    // Scientific notation   科学计数法处理

    // base and exponent   获得 底数、指数
    var _numStr$split = numStr.split('e'),
      _numStr$split2 = _slicedToArray(_numStr$split, 2),
      baseStr = _numStr$split2[0],
      expStr = _numStr$split2[1];
    var expNum = Number(expStr); // 指数

    // base: integer part + fractional part
    // 底数: 整数部分 + 小数部分
    var _baseStr$split = baseStr.split('.'),
      _baseStr$split2 = _slicedToArray(_baseStr$split, 2),
      baseIntStr = _baseStr$split2[0],
      _baseStr$split2$ = _baseStr$split2[1],
      baseFracStr = _baseStr$split2$ === void 0 ? '' : _baseStr$split2$;
    if (expNum > 0) {
      // exponent > 0: decimal point move right
      // 指数 > 0, 小数点 右移 >>
      if (expNum > baseFracStr.length) {
        // exponent > digit count of base's fractional: pad with 0 at trailing digits
        // 指数 > 底数的小数位数: 尾部补0
        numStr = "".concat(baseIntStr).concat(baseFracStr).concat('0'.repeat(expNum - baseFracStr.length));
        numStr = intStr;
        fracStr = '';
      } else {
        // exponent < digit count of base's fractional: decimal point move right
        // 指数 < 底数的小数位数: 小数点向右移
        intStr = "".concat(baseIntStr).concat(baseFracStr.substring(0, expNum));
        fracStr = baseFracStr.substring(expNum);
        numStr = "".concat(intStr, ".").concat(fracStr);
      }
    } else {
      // exponent < 0: decimal point move left
      // 指数 < 0, 小数点 左移 <<
      if (expNum > baseIntStr.length) {
        // exponent > digit count of base's integer part: pad with 0 at heading digits
        // 指数 > 底数的整数位数: 头部补0
        intStr = "0";
        fracStr = "".concat('0'.repeat(expNum - baseIntStr.length)).concat(baseIntStr).concat(baseFracStr);
        numStr = "0.".concat(fracStr);
      } else {
        // exponent < digit count of base's integer part: decimal point move right
        // 指数 < 底数的整数位数: 小数点向右移
        intStr = baseIntStr.substring(0, expNum);
        fracStr = "".concat(baseIntStr.substring(expNum)).concat(baseFracStr);
        numStr = "".concat(intStr, ".").concat(fracStr);
      }
    }
  } else {
    if (numStr.indexOf('.')) {
      // integer part string + fractional part string
      // 整数部分 + 小数部分字符串
      var _numStr$split3 = numStr.split('.');
      var _numStr$split4 = _slicedToArray(_numStr$split3, 2);
      intStr = _numStr$split4[0];
      var _numStr$split4$ = _numStr$split4[1];
      fracStr = _numStr$split4$ === void 0 ? '' : _numStr$split4$;
    } else {
      intNum = Math.floor(num); // 整数部分数值
      intStr = intNum.toString(); // 整数部分字符串
      fracStr = '';
    }
  }
  var str = '';

  // 1) handle with integer part
  // 1) 整数部分处理
  var intLen = intStr.length;
  if (intLen > 3) {
    var count = Math.floor(intLen / 3);
    var first = intLen % 3;
    if (first) {
      str = "".concat(intStr.substring(0, first), ",");
    }
    for (var i = 0; i < count; i++) {
      var start = first + i * 3;
      str += intStr.substring(start, start + 3);
      if (i < count - 1) {
        str += ",";
      }
    }
  } else {
    str = intStr;
  }

  // 2) handle with fractional part
  // 2) 小数部分处理
  var fracLen = fracStr.length;
  if (fracLen) {
    str += ".";
  }
  if (fracLen > 3) {
    var _count = Math.floor(fracLen / 3);
    for (var _i = 0; _i < _count; _i++) {
      var _start = _i * 3;
      str += fracStr.substring(_start, _start + 3);
      if (_i < _count - 1 || fracStr.length % 3) {
        str += ",";
      }
    }

    // trailing part  末尾部分
    if (fracStr.length % 3) {
      str += "".concat(fracStr.substring(_count * 3, fracStr.length));
    }
  } else {
    str += fracStr;
  }
  return str;
};

/**
 * Trim and format Big number
 * 格式化大数值
 * @param {number} val: raw number value 原始数值
 * @returns {string}
 */
var formatBigNum = function formatBigNum(val) {
  if (typeof val !== 'number' || isNaN(val)) return '';
  var num = Number(val);
  var res = num.toString();
  if (num >= NUM.B * 10) {
    // 十亿 > 10b ：不保留小数
    var temp = (num / NUM.B).toFixed(0);
    res = "".concat(trimThousandth(temp), "b");
  } else if (num >= NUM.B) {
    // 亿 1.00b ~ 9.99b ：保留 2 位小数
    res = "".concat((num / NUM.B).toFixed(2), "b");
  } else if (num >= NUM.M * 10) {
    // 千万 10,000,000 ~ 99,999,999 (10.0m ~ 99.9m)：保留 1 位小数
    res = "".concat((num / NUM.M).toFixed(1), "m");
  } else if (num >= NUM.M) {
    // 百万 1,000,000 ~ 9,999,999 (1.00m ~ 9.99m)：保留 2 位小数
    res = "".concat((num / NUM.M).toFixed(2), "m");
  } else if (num >= NUM.K * 100) {
    // 十万 100,000 ~ 999,999 (100k ~ 999.9k)：保留 0-1 位小数
    var _temp = num / NUM.K;
    res = "".concat(_temp.toFixed(_temp - Math.floor(_temp) > 0 ? 1 : 0), "k");
  } else if (num >= NUM.K * 10) {
    // 万 10,000 ~ 99,999 (10k ~ 99.9k)：保留 1 位小数
    var _temp2 = num / NUM.K;
    res = "".concat(_temp2.toFixed(1), "k");
  } else if (num >= NUM.K) {
    // 千 1000 ~ 9,999 (1k ~ 9.99k)：保留 2 位小数
    var _temp3 = num / NUM.K;
    res = "".concat(_temp3.toFixed(2), "k");
  } else if (num >= 100) {
    // 百 100 ~ 999: 保留0-1位小数
    res = "".concat(num.toFixed(num - Math.floor(num) > 0 ? 1 : 0));
  } else if (num >= 10) {
    // 十 10.0 ~ 99.9: 保留 1 位小数
    res = num.toFixed(1);
  } else if (num >= 1) {
    // 个 1.00 ~ 9.99: 保留2位小数
    res = num.toFixed(2);
  } else if (num >= 0.1) {
    // 0.100 ~ 0.999: 保留3位数
    res = num.toFixed(3);
  } else if (num > 0.01) {
    // 0.0100 ~ 0.9999: 保留4位数
    res = num.toFixed(4);
  } else {
    res = trimThousandth(num.toFixed(6));
  }
  return res;
};

// ---------------------------
var K_BYTE = 1024;
var M_BYTE = K_BYTE * K_BYTE;
var G_BYTE = M_BYTE * K_BYTE;
var T_BYTE = G_BYTE * K_BYTE;

/**
 * Format a memo bytes number to display as "KB MB GB" etc. (e.g. file size )
 * 格式化处理存储字节数, 显示成 "KB MB GB" 等 (如 文件大小)
 * @param {number} size   the bytes size   存储大小字节数
 * @returns {string} 
 */
var formatMemoBytes = function formatMemoBytes(size) {
  if (!size) return '0 bytes';
  if (size < K_BYTE) {
    return "".concat(size.toFixed(2), " bytes");
  } else if (size < M_BYTE) {
    return "".concat((size / K_BYTE).toFixed(2), " KB");
  } else if (size < G_BYTE) {
    return "".concat((size / M_BYTE).toFixed(2), " MB");
  } else if (size < T_BYTE) {
    return "".concat((size / G_BYTE).toFixed(2), " GB");
  } else {
    return "".concat((size / T_BYTE).toFixed(2), " TB");
  }
};

/**
 * Format a number, delimited by commas at every thousand digits
 * 格式化数值, 在千分位处用逗号分隔
 * @param {number | string} num   raw number value   原始数值
 * @returns {string}
 */
var formatWithCommas = function formatWithCommas(num) {
  if (num === undefined) return '--';
  var numStr = num.toString().split('.');
  var intPart = numStr[0];
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(intPart)) intPart = intPart.replace(pattern, '$1,$2');
  return numStr.length === 2 ? "".concat(intPart, ".").concat(numStr[1]) : intPart;
};

/**
 * Get random numbers: specify total count of numbers, randomly select numbers in a specify rate, 
 * 生成随机数字，指定数值总个数，随机选取特定比例的数值下标
 * @param {number} dataCount    total count of numbers    数值总数
 * @param {number} rate         the rate of random selected   随机选取的指定比例
 * @returns {number[]}
 */
var getRandomNums = function getRandomNums(dataCount, rate) {
  var randoms = [];
  var i = 0;
  while (i < Math.round(dataCount * rate)) {
    var num = Math.floor(Math.random() * dataCount);
    if (!randoms.includes(num)) {
      // skip duplicated number
      randoms.push(num);
      i++;
    }
  }
  return randoms;
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
  F: 15
};
for (var i = 0; i < 10; i++) {
  HEX_VAL_MAP[i.toString()] = i;
}

/**
 * Convert a hexadecimal number to a decimal number
 * 将十六进制数转换为十进制数值
 * @param {string} value  the raw hexadecimal number    十六进制原始数值
 * @returns {number}  the converted decimal number      转换后的数值
 */
var convertHexToDecimal = function convertHexToDecimal(value) {
  var index = 0;
  var sum = 0;
  while (index <= value.length - 1) {
    var digit = value.slice(value.length - (index + 1), value.length - index);
    sum += HEX_VAL_MAP[digit.toUpperCase()] * Math.pow(16, index);
    index++;
  }
  return sum;
};

/**
 * Format date time stamp   格式化日期时间戳
 * @param {number} time         the raw time stamp value   原始时间戳数值
 * @param {string} formatStr    format template string     格式化模板字符
 * @param {boolean} showHMS     whether show time (hours, mins, secs)   是否显示时间 (时分秒)
 * @returns {string}
 */
var formatDateTime = function formatDateTime(time, formatStr, showHMS) {
  if (time !== undefined && time !== 0) {
    return formatStr !== undefined ? dayjs(time).format(formatStr) : dayjs(time).format(showHMS === true ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD');
  }
  return dayjs().format(formatStr !== null && formatStr !== void 0 ? formatStr : 'YYYY-MM-DD HH:mm:ss');
};

/**
 * Format a time period value (seconds number) 
 * 格式化显示时间长度 (秒数)
 * @param {number} seconds   the raw seconds number  原始秒数 
 * @returns {string}
 */
var formatSeconds = function formatSeconds(seconds) {
  var str;
  var mins = 0;
  var hrs = 0;
  str = "".concat(seconds.toString(), " sec");
  if (seconds >= 3600) {
    mins = Math.floor(seconds / 60);
    seconds = seconds % 60;
    str = "".concat(mins.toString(), "m ").concat(seconds.toString(), "s");
  } else if (seconds >= 60) {
    hrs = Math.floor(seconds / 3600);
    mins = Math.floor(seconds % 3600 / 60);
    seconds = seconds % 3600 % 60;
    str = "".concat(hrs > 0 ? "".concat(hrs.toString(), "h") : '', " ").concat(mins > 0 ? "".concat(mins.toString(), "m") : '', " ").concat(seconds.toString(), "s");
  }
  return str;
};

/**
 * Get and format time period between two time points   
 * 计算两个时间点间的时长, 并格式化输出
 * @param {string | number} startTime    the start time point      开始时间点
 * @param {string | number} endTime      the end time point         结束时间点
 * @returns {string}
 */
var getTimePeriod = function getTimePeriod(startTime, endTime) {
  if (startTime === undefined || endTime === undefined) {
    return '--';
  }
  return formatSeconds(dayjs(endTime).diff(startTime, 'seconds'));
};

/**
 * Download a CSV string as a CSV file
 * 将 CSV 字符串输出下载 CSV 文件
 * @param {string} data     the input CSV string           输入 CSV 字符串
 * @param {string} fileName  the output CSV file's name    下载 CSV 文件名
 */
var downloadFile = function downloadFile(data, fileName) {
  var el = document.createElement('a');
  el.href = 'data:text/csv; charset=utf-8, ' + encodeURIComponent(data);
  el.download = fileName;
  el.style.display = 'none';
  el.target = '_blank';
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};

/**
 * Convert a JSON object to CSV string, and download as a CSV file
 * 将 JSON 对象转换成 CSV 字符串 (逗号分隔字符串)，并以 CSV 文件格式下载
 * @param {{key: string, value: string}[]} fields    title header's fields      标题字段头
 * @param {Record<string, any>[]} data               the raw JSON data          原始 JSON 对象
 * @param {string} fileName                          outputed CSV file's name   输出的 CSV 文件名
 * @param {string} delimiter                         the delimiter character, default is comma    分隔字符, 默认为逗号
 * @returns {void}
 */
var downloadCSV = function downloadCSV(fields, data, fileName) {
  var delimiter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ',';
  var dataArr = [fields.map(function (field) {
    return field.title;
  })].concat(_toConsumableArray(data.map(function (record) {
    var arr = [];
    fields.forEach(function (field) {
      var _record$field$key;
      var value = (_record$field$key = record === null || record === void 0 ? void 0 : record[field.key]) !== null && _record$field$key !== void 0 ? _record$field$key : '';
      if (value !== null && value !== void 0 && value.toString().includes(delimiter)) arr.push("\"".concat(value === null || value === void 0 ? void 0 : value.toString().replace(/"/g, '\''), "\""));else arr.push(value);
    });
    return arr;
  })));
  var csv = '';
  dataArr.forEach(function (row) {
    csv += row.map(function (cell) {
      return String(cell).replace(/\n/g, '\\n').replace(/[\t\r]/g, ' ');
    }).join(delimiter);
    csv += '\n';
  });
  downloadFile(csv, fileName);
};

/**
 * Download a file from a remote url
 * 从远程 URL 下载一个文件
 * @param {string} url        the target URL             远程目标 URL 地址
 * @param {string} filename   the downlaod file's name   生成的下载文件文件名
 */
var downloadUrl = function downloadUrl(url) {
  var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var el = document.createElement('a');
  el.href = url;
  el.style.display = 'none';
  el.target = '_blank';
  if (filename.length > 0) {
    el.download = filename;
  }
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};

var service = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 60000
});
service.interceptors.request.use(function (config) {
  if (config.headers !== undefined) {
    config.headers = {};
  }
  return Promise.resolve(config);
}, /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(error) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return Promise.reject(error);
        case 2:
          return _context.abrupt("return", _context.sent);
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
service.interceptors.response.use(function (response) {
  var res = response.data;
  if (res.code !== 0) {
    console.warn('Unexpected response', response.data);
  }
  return response;
}, /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(err) {
    var response, statusCode;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!(err.code === 'ERR_CANCELED')) {
            _context2.next = 3;
            break;
          }
          console.warn(err);
          return _context2.abrupt("return");
        case 3:
          response = err.response;
          statusCode = Number(response === null || response === void 0 ? void 0 : response.status);
          if (!(statusCode >= 500)) {
            _context2.next = 9;
            break;
          }
          console.error('HTTP 50X ERROR', response === null || response === void 0 ? void 0 : response.statusText, response === null || response === void 0 ? void 0 : response.data);
          _context2.next = 15;
          break;
        case 9:
          if (!(statusCode >= 400)) {
            _context2.next = 13;
            break;
          }
          console.warn('HTTP 40X ERROR', response === null || response === void 0 ? void 0 : response.statusText, response === null || response === void 0 ? void 0 : response.data);
          _context2.next = 15;
          break;
        case 13:
          console.error('ERROR', err.name, err.message, response);
          return _context2.abrupt("return", Promise.reject(err));
        case 15:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());

/**
 * A basic "Queue" data structure
 * 基础队列数据结构
 */
/**
 * A basic "Queue" data structure
 * 基础队列数据结构
 */
var Queue = /*#__PURE__*/function () {
  function Queue(max) {
    _classCallCheck(this, Queue);
    _defineProperty(this, "_queue", []);
    _defineProperty(this, "_max", -1);
    this._max = max !== null && max !== void 0 ? max : -1;
  }

  /**
   * Queue is empty or not
   * 队列是否为空
   * @returns {boolean}
   */
  _createClass(Queue, [{
    key: "isEmpty",
    value: function isEmpty() {
      return this._queue.length === 0;
    }

    /**
     * Queue is full or not
     * 队列是否已满
     * @returns {boolean}
     */
  }, {
    key: "isFull",
    value: function isFull() {
      return this._max > 0 && this._queue.length >= this._max;
    }

    /**
     * Enter an element into queue
     * 将元素入队
     * @param {T} item 
     * @returns 
     */
  }, {
    key: "enqueue",
    value: function enqueue(item) {
      if (this.isFull()) {
        console.warn('[Queue]: the queue is full.');
        return false;
      }
      this._queue.push(item);
      return true;
    }

    /**
     * Drop out the element from queue
     * 出队
     * @returns {T}
     */
  }, {
    key: "dequeue",
    value: function dequeue() {
      if (this.isEmpty()) {
        console.warn('[Queue]: the queue is empty.');
        return undefined;
      }
      var firstItem = this._queue.shift();
      return firstItem;
    }

    /**
     * The queue's length
     * 队列长度
     */
  }, {
    key: "size",
    get: function get() {
      return this._queue.length;
    }

    /**
     * The front element of queue
     * 队首元素
     */
  }, {
    key: "front",
    get: function get() {
      if (this.isEmpty()) {
        console.warn('[Queue]: the queue is empty.');
        return undefined;
      }
      return this._queue[0];
    }

    /**
     * The rear element of queue
     * 队尾元素
     */
  }, {
    key: "rear",
    get: function get() {
      if (this.isEmpty()) {
        console.warn('[Queue]: the queue is empty.');
        return undefined;
      }
      return this._queue[this.size - 1];
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._queue.map(function (item) {
        item.destroy();
      });
    }
  }]);
  return Queue;
}();

/**
 * The parameters to pass in "postMessage" / "onMessage" of the Worker 
 * Worker 对象  "postMessage" / "onMessage" 的传入参数定义
 */
/**
 * A wrapped object of Worker 
 * Worker 线程包装对象
 */
/**
 * A wrapped object of Worker 
 * Worker 线程包装对象
 */
var WorkerItem = /*#__PURE__*/function () {
  function WorkerItem(_ref) {
    var index = _ref.index,
      scriptPath = _ref.scriptPath;
    _classCallCheck(this, WorkerItem);
    _defineProperty(this, "_running", false);
    this._worker = new Worker(scriptPath);
    this._index = index;
  }
  _createClass(WorkerItem, [{
    key: "run",
    value: function () {
      var _run = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(args) {
        var _this = this;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return new Promise(function (resolve, reject) {
                var onMsgFn = args.onMsgFn,
                  argsPostMsg = args.argsPostMsg;
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
                } catch (error) {
                  console.error('[WorkerItem::run]', error);
                }
                _this._running = false;
              });
            case 2:
              return _context.abrupt("return", _context.sent);
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function run(_x) {
        return _run.apply(this, arguments);
      }
      return run;
    }()
  }, {
    key: "running",
    get: function get() {
      return this._running;
    }
  }, {
    key: "index",
    get: function get() {
      return this._index;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._worker.terminate();
    }
  }]);
  return WorkerItem;
}();

var WorkerTaskStatus = /*#__PURE__*/function (WorkerTaskStatus) {
  WorkerTaskStatus[WorkerTaskStatus["NOT_START"] = 0] = "NOT_START";
  WorkerTaskStatus[WorkerTaskStatus["RUNNING"] = 1] = "RUNNING";
  WorkerTaskStatus[WorkerTaskStatus["FINISH"] = 2] = "FINISH";
  WorkerTaskStatus[WorkerTaskStatus["ERROR"] = 3] = "ERROR";
  WorkerTaskStatus[WorkerTaskStatus["DEAD"] = 4] = "DEAD";
  return WorkerTaskStatus;
}({});
var WorkerTask = /*#__PURE__*/function () {
  function WorkerTask(_ref) {
    var id = _ref.id,
      argsPostMsg = _ref.argsPostMsg;
    _classCallCheck(this, WorkerTask);
    this._argsPostMsg = argsPostMsg;
    this._id = id;
    this._status = WorkerTaskStatus.NOT_START;
  }
  _createClass(WorkerTask, [{
    key: "status",
    get: function get() {
      return this._status;
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    }
  }, {
    key: "run",
    value: function () {
      var _run = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref2) {
        var _this = this;
        var workerItem, onMessageFn;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              workerItem = _ref2.workerItem, onMessageFn = _ref2.onMessageFn;
              _context.next = 3;
              return new Promise(function (resolve, reject) {
                _this._status = WorkerTaskStatus.RUNNING;
                setTimeout(function () {
                  workerItem.run({
                    onMsgFn: onMessageFn,
                    argsPostMsg: _this._argsPostMsg
                  }).then(function () {
                    _this._status = WorkerTaskStatus.FINISH;
                    resolve(workerItem);
                  })["catch"](function (err) {
                    console.error('[WokerTask::run]', _this._id, _this._argsPostMsg, err);
                    _this._status = WorkerTaskStatus.ERROR;
                    reject(err);
                  });
                });
              });
            case 3:
              return _context.abrupt("return", _context.sent);
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function run(_x) {
        return _run.apply(this, arguments);
      }
      return run;
    }()
  }, {
    key: "destroy",
    value: function destroy() {
      this._status = WorkerTaskStatus.DEAD;
    }
  }]);
  return WorkerTask;
}();

/**
 * A basic worker pool
 * worker 基础线程池
 */
var WorkerPoolBase = /*#__PURE__*/function () {
  function WorkerPoolBase(_ref) {
    var scriptPath = _ref.scriptPath,
      size = _ref.size;
    _classCallCheck(this, WorkerPoolBase);
    _defineProperty(this, "_pool", []);
    _defineProperty(this, "_stopping", false);
    this._taskQueue = new Queue();

    // create pool
    for (var i = 0; i < size; i++) {
      var workerItem = new WorkerItem({
        index: i,
        scriptPath: scriptPath
      });
      this._pool.push(workerItem);
    }
  }

  /**
   * Add task item  加入任务
   * @param {AddTaskArgs<PostMsgArgs>} 
   */
  _createClass(WorkerPoolBase, [{
    key: "addTask",
    value: function addTask(_ref2) {
      var _this$_taskQueue$enqu;
      var argsPostMsg = _ref2.argsPostMsg;
      var taskId = "".concat(new Date().valueOf(), "_").concat(this._taskQueue.size);
      var task = new WorkerTask({
        id: taskId,
        argsPostMsg: argsPostMsg
      });
      if ((_this$_taskQueue$enqu = !this._taskQueue.enqueue(task)) !== null && _this$_taskQueue$enqu !== void 0 ? _this$_taskQueue$enqu : false) {
        console.warn('[WorkerPool::addTask] Fail to add task', task);
        return;
      }
      this.run();
    }
  }, {
    key: "stop",
    value: function stop() {
      this._stopping = true;
    }
  }, {
    key: "onMessageFn",
    value: function onMessageFn(ev) {
      // to be impletemented by inheritor
      console.log(ev);
    }

    /**
     * Run the next task in the worker item
     * 在 worker 对象中执行下一个任务
     * @param { WorkerItemProps<PostMsgArgs>} workerItem 
     * @returns {Promise<any>}
     */
  }, {
    key: "runNextTask",
    value: function () {
      var _runNextTask = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(workerItem) {
        var _this = this;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return new Promise(function (resolve, reject) {
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
                task.run({
                  workerItem: workerItem,
                  onMessageFn: _this.onMessageFn
                }).then(function () {
                  _this.runNextTask(workerItem).then(function () {}, function (err) {
                    throw err;
                  });
                  resolve("[WorkerPool::runNextTask] Finish task \"".concat(task.id, "\""));
                }, function (err) {
                  console.error('[WorkerPool::runNextTask]', err);
                  reject(err);
                });
              });
            case 2:
              return _context.abrupt("return", _context.sent);
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function runNextTask(_x) {
        return _runNextTask.apply(this, arguments);
      }
      return runNextTask;
    }()
    /**
     * Run the worker pool
     * 运行线程池
     * @returns 
     */
  }, {
    key: "run",
    value: function () {
      var _run = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var _this2 = this;
        var idlePoolItems, _loop, i;
        return _regeneratorRuntime().wrap(function _callee2$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              idlePoolItems = this._pool.filter(function (itm) {
                return !itm.running;
              });
              if (!(idlePoolItems.length === 0)) {
                _context3.next = 4;
                break;
              }
              console.warn('[WorkerPool::run] NO idle poolitem');
              return _context3.abrupt("return");
            case 4:
              _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop(i) {
                return _regeneratorRuntime().wrap(function _loop$(_context2) {
                  while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                      _this2.runNextTask(idlePoolItems[i]).then(function () {}, function (err) {
                        console.error('[WorkerPool::run]', idlePoolItems[i], err);
                      });
                    case 1:
                    case "end":
                      return _context2.stop();
                  }
                }, _loop);
              });
              i = 0;
            case 6:
              if (!(i < idlePoolItems.length)) {
                _context3.next = 11;
                break;
              }
              return _context3.delegateYield(_loop(i), "t0", 8);
            case 8:
              i++;
              _context3.next = 6;
              break;
            case 11:
            case "end":
              return _context3.stop();
          }
        }, _callee2, this);
      }));
      function run() {
        return _run.apply(this, arguments);
      }
      return run;
    }()
    /**
     * The count of worker in running
     * 正在运行的 worker 对象个数
     */
  }, {
    key: "runningCount",
    get: function get() {
      return this._pool.filter(function (itm) {
        return itm.running;
      }).length;
    }
  }, {
    key: "isStopping",
    get: function get() {
      return this._stopping;
    }
  }, {
    key: "dequeueTask",
    value: function dequeueTask() {
      return this._taskQueue.dequeue();
    }
  }, {
    key: "enqueueTask",
    value: function enqueueTask(task) {
      this._taskQueue.enqueue(task);
    }
  }, {
    key: "taskCount",
    get: function get() {
      return this._taskQueue.size;
    }

    /**
     * Destroy 销毁
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this._stopping = true;

      // worker pool
      this._pool.map(function (itm) {
        itm.destroy();
        return null;
      });
      this._pool = [];

      // task queue
      this._taskQueue.destroy();
    }
  }]);
  return WorkerPoolBase;
}();

/**
 * A worker pool, pass onMessage function
 * worker 线程池实例
 */
var WorkerPoolOnMsg = /*#__PURE__*/function (_WorkerBasePool) {
  _inherits(WorkerPoolOnMsg, _WorkerBasePool);
  var _super = _createSuper(WorkerPoolOnMsg);
  function WorkerPoolOnMsg(args) {
    var _this;
    _classCallCheck(this, WorkerPoolOnMsg);
    _this = _super.call(this, args);
    _this._onMessageFn = args.onMessageFn;
    return _this;
  }
  _createClass(WorkerPoolOnMsg, [{
    key: "onMessageFn",
    value: function onMessageFn(ev) {
      this._onMessageFn(ev);
    }
  }]);
  return WorkerPoolOnMsg;
}(WorkerPoolBase);

var WorkerTaskOnMsgCreator = /*#__PURE__*/function (_WorkerTask) {
  _inherits(WorkerTaskOnMsgCreator, _WorkerTask);
  var _super = _createSuper(WorkerTaskOnMsgCreator);
  function WorkerTaskOnMsgCreator(args) {
    var _this;
    _classCallCheck(this, WorkerTaskOnMsgCreator);
    _this = _super.call(this, args);
    var argsOnMsgCreator = args.argsOnMsgCreator;
    _this._argsOnMsgCreator = argsOnMsgCreator;
    return _this;
  }
  _createClass(WorkerTaskOnMsgCreator, [{
    key: "OnMsgCreatorArgs",
    get: function get() {
      return this._argsOnMsgCreator;
    }
  }]);
  return WorkerTaskOnMsgCreator;
}(WorkerTask);

/**
 * A worker pool, pass onMessage creator factory function
 * worker 线程池, onMessage 生成工厂函数
 */
var WorkerPoolOnMsgCreator = /*#__PURE__*/function (_WorkerBasePool) {
  _inherits(WorkerPoolOnMsgCreator, _WorkerBasePool);
  var _super = _createSuper(WorkerPoolOnMsgCreator);
  function WorkerPoolOnMsgCreator(args) {
    var _this;
    _classCallCheck(this, WorkerPoolOnMsgCreator);
    _this = _super.call(this, args);
    _this._onMsgFnCreator = args.onMsgFnCreator;
    return _this;
  }

  /**
   * Add task item  加入任务
   * @param {AddTaskArgs<PostMsgArgs>} 
   */
  _createClass(WorkerPoolOnMsgCreator, [{
    key: "addTask",
    value: function addTask(_ref) {
      var argsPostMsg = _ref.argsPostMsg,
        argsOnMsgCreator = _ref.argsOnMsgCreator;
      var taskId = "".concat(new Date().valueOf(), "_").concat(this.taskCount);
      var task = new WorkerTaskOnMsgCreator({
        id: taskId,
        argsPostMsg: argsPostMsg,
        argsOnMsgCreator: argsOnMsgCreator
      });
      this.enqueueTask(task);
    }

    /**
     * Run the next task in the worker item
     * 在 worker 对象中执行下一个任务
     * @param { WorkerItemProps<PostMsgArgs>} workerItem 
     * @returns {Promise<any>}
     */
  }, {
    key: "runNextTask",
    value: function () {
      var _runNextTask = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(workerItem) {
        var _this2 = this;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return new Promise(function (resolve, reject) {
                if (_this2.isStopping) {
                  console.warn('[WorkerPool::runNextTask] Worker Pool is stopping...');
                  reject(new Error('[WorkerPool::runNextTask] Worker Pool is stopping...'));
                  return;
                }
                var task = _this2.dequeueTask();
                if (task === undefined) {
                  resolve('[WorkerPool::runNextTask] Tasks in queue all finished');
                  return;
                }
                var onMessageFn = _this2._onMsgFnCreator(task.OnMsgCreatorArgs);
                task.run({
                  workerItem: workerItem,
                  onMessageFn: onMessageFn
                }).then(function () {
                  _this2.runNextTask(workerItem).then(function () {}, function (err) {
                    throw err;
                  });
                  resolve("[WorkerPool::runNextTask] Finish task \"".concat(task.id, "\""));
                }, function (err) {
                  console.error('[WorkerPool::runNextTask]', err);
                  reject(err);
                });
              });
            case 2:
              return _context.abrupt("return", _context.sent);
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function runNextTask(_x) {
        return _runNextTask.apply(this, arguments);
      }
      return runNextTask;
    }()
  }]);
  return WorkerPoolOnMsgCreator;
}(WorkerPoolBase);

export { WorkerPoolOnMsg, WorkerPoolOnMsgCreator, classNames, convertHexToDecimal, copyToClipboard, debounce, downloadCSV, downloadFile, downloadUrl, findParentDOM, formatBigNum, formatDateTime, formatMemoBytes, formatSeconds, formatWithCommas, getOffsetLeft, getOffsetTop, getRandomNums, getTimePeriod, isEmpty, isEquals, isStrEquals, service as request, toString };
