/**
 * Tagify (v 4.9.8) - tags input component
 * By Yair Even-Or
 * Don't sell this code. (c)
 * https://github.com/yairEO/tagify
 */

(function(factory) {
    typeof define === 'function' && define.amd ? define(factory) :
        factory();
}((function() {
    'use strict';

    // 1. String.prototype.trim polyfill
    if (!"".trim) String.prototype.trim = function() {
        return this.replace(/^[\s﻿]+|[\s﻿]+$/g, '');
    };

    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function(predicate) {
                if (this == null) throw new TypeError('"this" is null or not defined');
                var o = Object(this),
                    len = o.length >>> 0;

                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                var thisArg = arguments[1],
                    k = 0;

                while (k < len) {
                    var kValue = o[k];

                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }

                    k++;
                }

                return -1;
            },
            configurable: true,
            writable: true
        });
    }

    if (!Array.prototype.includes) {
        Array.prototype.includes = function(search) {
            return !!~this.indexOf(search);
        };
    }

    // Production steps of ECMA-262, Edition 5, 15.4.4.17
    // Reference: http://es5.github.io/#x15.4.4.17
    if (!Array.prototype.some) {
        Array.prototype.some = function(fun, thisArg) {

            if (this == null) {
                throw new TypeError('Array.prototype.some called on null or undefined');
            }

            if (typeof fun !== 'function') {
                throw new TypeError();
            }

            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(thisArg, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
            if (typeof start !== 'number') start = 0;
            if (start + search.length > this.length) return false;
            else return this.indexOf(search, start) !== -1;
        };
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
    //
    if (typeof Object.assign != 'function') {
        // Must be writable: true, enumerable: false, configurable: true
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) {
                // .length of function is 2
                if (target == null) {
                    // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) {
                        // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }

                return to;
            },
            writable: true,
            configurable: true
        });
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
    function CustomEventPolyfill(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEventPolyfill.prototype = window.Event.prototype;

    if (typeof window.CustomEvent !== "function") {
        window.CustomEvent = CustomEventPolyfill;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            if (!document.documentElement.contains(el)) return null;

            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);

            return null;
        };
    }

    // Avoid transformation text to link ie contentEditable mode
    // https://stackoverflow.com/q/7556007/104380
    document.execCommand("AutoUrlDetect", false, false);

    /*
     * classList.js: Cross-browser full element.classList implementation.
     * 1.2.20171210
     *
     * By Eli Grey, http://eligrey.com
     * License: Dedicated to the public domain.
     *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
     */

    /*global self, document, DOMException */

    /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */
    if ("document" in self) {
        // Full polyfill for browsers with no classList support
        // Including IE < Edge missing SVGElement.classList
        if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {
            (function(view) {

                if (!('Element' in view)) return;

                var classListProp = "classList",
                    protoProp = "prototype",
                    elemCtrProto = view.Element[protoProp],
                    objCtr = Object,
                    strTrim = String[protoProp].trim || function() {
                        return this.replace(/^\s+|\s+$/g, "");
                    },
                    arrIndexOf = Array[protoProp].indexOf || function(item) {
                        var i = 0,
                            len = this.length;

                        for (; i < len; i++) {
                            if (i in this && this[i] === item) {
                                return i;
                            }
                        }

                        return -1;
                    } // Vendors: please allow content code to instantiate DOMExceptions
                    ,
                    DOMEx = function(type, message) {
                        this.name = type;
                        this.code = DOMException[type];
                        this.message = message;
                    },
                    checkTokenAndGetIndex = function(classList, token) {
                        if (token === "") {
                            throw new DOMEx("SYNTAX_ERR", "The token must not be empty.");
                        }

                        if (/\s/.test(token)) {
                            throw new DOMEx("INVALID_CHARACTER_ERR", "The token must not contain space characters.");
                        }

                        return arrIndexOf.call(classList, token);
                    },
                    ClassList = function(elem) {
                        var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
                            classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                            i = 0,
                            len = classes.length;

                        for (; i < len; i++) {
                            this.push(classes[i]);
                        }

                        this._updateClassName = function() {
                            elem.setAttribute("class", this.toString());
                        };
                    },
                    classListProto = ClassList[protoProp] = [],
                    classListGetter = function() {
                        return new ClassList(this);
                    }; // Most DOMException implementations don't allow calling DOMException's toString()
                // on non-DOMExceptions. Error's toString() is sufficient here.


                DOMEx[protoProp] = Error[protoProp];

                classListProto.item = function(i) {
                    return this[i] || null;
                };

                classListProto.contains = function(token) {
                    return ~checkTokenAndGetIndex(this, token + "");
                };

                classListProto.add = function() {
                    var tokens = arguments,
                        i = 0,
                        l = tokens.length,
                        token,
                        updated = false;

                    do {
                        token = tokens[i] + "";

                        if (!~checkTokenAndGetIndex(this, token)) {
                            this.push(token);
                            updated = true;
                        }
                    } while (++i < l);

                    if (updated) {
                        this._updateClassName();
                    }
                };

                classListProto.remove = function() {
                    var tokens = arguments,
                        i = 0,
                        l = tokens.length,
                        token,
                        updated = false,
                        index;

                    do {
                        token = tokens[i] + "";
                        index = checkTokenAndGetIndex(this, token);

                        while (~index) {
                            this.splice(index, 1);
                            updated = true;
                            index = checkTokenAndGetIndex(this, token);
                        }
                    } while (++i < l);

                    if (updated) {
                        this._updateClassName();
                    }
                };

                classListProto.toggle = function(token, force) {
                    var result = this.contains(token),
                        method = result ? force !== true && "remove" : force !== false && "add";

                    if (method) {
                        this[method](token);
                    }

                    if (force === true || force === false) {
                        return force;
                    } else {
                        return !result;
                    }
                };

                classListProto.replace = function(token, replacement_token) {
                    var index = checkTokenAndGetIndex(token + "");

                    if (~index) {
                        this.splice(index, 1, replacement_token);

                        this._updateClassName();
                    }
                };

                classListProto.toString = function() {
                    return this.join(" ");
                };

                if (objCtr.defineProperty) {
                    var classListPropDesc = {
                        get: classListGetter,
                        enumerable: true,
                        configurable: true
                    };

                    try {
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    } catch (ex) {
                        // IE 8 doesn't support enumerable:true
                        // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
                        // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
                        if (ex.number === undefined || ex.number === -0x7FF5EC54) {
                            classListPropDesc.enumerable = false;
                            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                        }
                    }
                } else if (objCtr[protoProp].__defineGetter__) {
                    elemCtrProto.__defineGetter__(classListProp, classListGetter);
                }
            })(self);
        } // There is full or partial native classList support, so just check if we need
        // to normalize the add/remove and toggle APIs.


        (function() {

            var testElement = document.createElement("_");
            testElement.classList.add("c1", "c2"); // Polyfill for IE 10/11 and Firefox <26, where classList.add and
            // classList.remove exist but support only one argument at a time.

            if (!testElement.classList.contains("c2")) {
                var createMethod = function(method) {
                    var original = DOMTokenList.prototype[method];

                    DOMTokenList.prototype[method] = function(token) {
                        var i,
                            len = arguments.length;

                        for (i = 0; i < len; i++) {
                            token = arguments[i];
                            original.call(this, token);
                        }
                    };
                };

                createMethod('add');
                createMethod('remove');
            }

            testElement.classList.toggle("c3", false); // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
            // support the second argument.

            if (testElement.classList.contains("c3")) {
                var _toggle = DOMTokenList.prototype.toggle;

                DOMTokenList.prototype.toggle = function(token, force) {
                    if (1 in arguments && !this.contains(token) === !force) {
                        return force;
                    } else {
                        return _toggle.call(this, token);
                    }
                };
            } // replace() polyfill


            if (!("replace" in document.createElement("_").classList)) {
                DOMTokenList.prototype.replace = function(token, replacement_token) {
                    var tokens = this.toString().split(" "),
                        index = tokens.indexOf(token + "");

                    if (~index) {
                        tokens = tokens.slice(index);
                        this.remove.apply(this, tokens);
                        this.add(replacement_token);
                        this.add.apply(this, tokens.slice(1));
                    }
                };
            }

            testElement = null;
        })();
    }

    // https://github.com/taylorhakes/promise-polyfill
    (function(global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define(factory) : factory();
    })(undefined, function() {
        /**
         * @this {Promise}
         */

        function finallyConstructor(callback) {
            var constructor = this.constructor;
            return this.then(function(value) {
                // @ts-ignore
                return constructor.resolve(callback()).then(function() {
                    return value;
                });
            }, function(reason) {
                // @ts-ignore
                return constructor.resolve(callback()).then(function() {
                    // @ts-ignore
                    return constructor.reject(reason);
                });
            });
        }

        function allSettled(arr) {
            var P = this;
            return new P(function(resolve, reject) {
                if (!(arr && typeof arr.length !== 'undefined')) {
                    return reject(new TypeError(typeof arr + ' ' + arr + ' is not iterable(cannot read property Symbol(Symbol.iterator))'));
                }

                var args = Array.prototype.slice.call(arr);
                if (args.length === 0) return resolve([]);
                var remaining = args.length;

                function res(i, val) {
                    if (val && (typeof val === 'object' || typeof val === 'function')) {
                        var then = val.then;

                        if (typeof then === 'function') {
                            then.call(val, function(val) {
                                res(i, val);
                            }, function(e) {
                                args[i] = {
                                    status: 'rejected',
                                    reason: e
                                };

                                if (--remaining === 0) {
                                    resolve(args);
                                }
                            });
                            return;
                        }
                    }

                    args[i] = {
                        status: 'fulfilled',
                        value: val
                    };

                    if (--remaining === 0) {
                        resolve(args);
                    }
                }

                for (var i = 0; i < args.length; i++) {
                    res(i, args[i]);
                }
            });
        } // Store setTimeout reference so promise-polyfill will be unaffected by
        // other code modifying setTimeout (like sinon.useFakeTimers())


        var setTimeoutFunc = setTimeout;

        function isArray(x) {
            return Boolean(x && typeof x.length !== 'undefined');
        }

        function noop() {} // Polyfill for Function.prototype.bind


        function bind(fn, thisArg) {
            return function() {
                fn.apply(thisArg, arguments);
            };
        }
        /**
         * @constructor
         * @param {Function} fn
         */


        function Promise(fn) {
            if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
            if (typeof fn !== 'function') throw new TypeError('not a function');
            /** @type {!number} */

            this._state = 0;
            /** @type {!boolean} */

            this._handled = false;
            /** @type {Promise|undefined} */

            this._value = undefined;
            /** @type {!Array<!Function>} */

            this._deferreds = [];
            doResolve(fn, this);
        }

        function handle(self, deferred) {
            while (self._state === 3) {
                self = self._value;
            }

            if (self._state === 0) {
                self._deferreds.push(deferred);

                return;
            }

            self._handled = true;

            Promise._immediateFn(function() {
                var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;

                if (cb === null) {
                    (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                    return;
                }

                var ret;

                try {
                    ret = cb(self._value);
                } catch (e) {
                    reject(deferred.promise, e);
                    return;
                }

                resolve(deferred.promise, ret);
            });
        }

        function resolve(self, newValue) {
            try {
                // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
                if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');

                if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                    var then = newValue.then;

                    if (newValue instanceof Promise) {
                        self._state = 3;
                        self._value = newValue;
                        finale(self);
                        return;
                    } else if (typeof then === 'function') {
                        doResolve(bind(then, newValue), self);
                        return;
                    }
                }

                self._state = 1;
                self._value = newValue;
                finale(self);
            } catch (e) {
                reject(self, e);
            }
        }

        function reject(self, newValue) {
            self._state = 2;
            self._value = newValue;
            finale(self);
        }

        function finale(self) {
            if (self._state === 2 && self._deferreds.length === 0) {
                Promise._immediateFn(function() {
                    if (!self._handled) {
                        Promise._unhandledRejectionFn(self._value);
                    }
                });
            }

            for (var i = 0, len = self._deferreds.length; i < len; i++) {
                handle(self, self._deferreds[i]);
            }

            self._deferreds = null;
        }
        /**
         * @constructor
         */


        function Handler(onFulfilled, onRejected, promise) {
            this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
            this.onRejected = typeof onRejected === 'function' ? onRejected : null;
            this.promise = promise;
        }
        /**
         * Take a potentially misbehaving resolver function and make sure
         * onFulfilled and onRejected are only called once.
         *
         * Makes no guarantees about asynchrony.
         */


        function doResolve(fn, self) {
            var done = false;

            try {
                fn(function(value) {
                    if (done) return;
                    done = true;
                    resolve(self, value);
                }, function(reason) {
                    if (done) return;
                    done = true;
                    reject(self, reason);
                });
            } catch (ex) {
                if (done) return;
                done = true;
                reject(self, ex);
            }
        }

        Promise.prototype['catch'] = function(onRejected) {
            return this.then(null, onRejected);
        };

        Promise.prototype.then = function(onFulfilled, onRejected) {
            // @ts-ignore
            var prom = new this.constructor(noop);
            handle(this, new Handler(onFulfilled, onRejected, prom));
            return prom;
        };

        Promise.prototype['finally'] = finallyConstructor;

        Promise.all = function(arr) {
            return new Promise(function(resolve, reject) {
                if (!isArray(arr)) {
                    return reject(new TypeError('Promise.all accepts an array'));
                }

                var args = Array.prototype.slice.call(arr);
                if (args.length === 0) return resolve([]);
                var remaining = args.length;

                function res(i, val) {
                    try {
                        if (val && (typeof val === 'object' || typeof val === 'function')) {
                            var then = val.then;

                            if (typeof then === 'function') {
                                then.call(val, function(val) {
                                    res(i, val);
                                }, reject);
                                return;
                            }
                        }

                        args[i] = val;

                        if (--remaining === 0) {
                            resolve(args);
                        }
                    } catch (ex) {
                        reject(ex);
                    }
                }

                for (var i = 0; i < args.length; i++) {
                    res(i, args[i]);
                }
            });
        };

        Promise.allSettled = allSettled;

        Promise.resolve = function(value) {
            if (value && typeof value === 'object' && value.constructor === Promise) {
                return value;
            }

            return new Promise(function(resolve) {
                resolve(value);
            });
        };

        Promise.reject = function(value) {
            return new Promise(function(resolve, reject) {
                reject(value);
            });
        };

        Promise.race = function(arr) {
            return new Promise(function(resolve, reject) {
                if (!isArray(arr)) {
                    return reject(new TypeError('Promise.race accepts an array'));
                }

                for (var i = 0, len = arr.length; i < len; i++) {
                    Promise.resolve(arr[i]).then(resolve, reject);
                }
            });
        }; // Use polyfill for setImmediate for performance gains


        Promise._immediateFn = // @ts-ignore
            typeof setImmediate === 'function' && function(fn) {
                // @ts-ignore
                setImmediate(fn);
            } || function(fn) {
                setTimeoutFunc(fn, 0);
            };

        Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
            if (typeof console !== 'undefined' && console) {
                console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
            }
        };
        /** @suppress {undefinedVars} */


        var globalNS = function() {
            // the only reliable means to get the global object is
            // `Function('return this')()`
            // However, this causes CSP violations in Chrome apps.
            if (typeof self !== 'undefined') {
                return self;
            }

            if (typeof window !== 'undefined') {
                return window;
            }

            if (typeof global !== 'undefined') {
                return global;
            }

            throw new Error('unable to locate global object');
        }(); // Expose the polyfill if Promise is undefined or set to a
        // non-function value. The latter can be due to a named HTMLElement
        // being exposed by browsers for legacy reasons.
        // https://github.com/taylorhakes/promise-polyfill/issues/114


        if (typeof globalNS['Promise'] !== 'function') {
            globalNS['Promise'] = Promise;
        } else if (!globalNS.Promise.prototype['finally']) {
            globalNS.Promise.prototype['finally'] = finallyConstructor;
        } else if (!globalNS.Promise.allSettled) {
            globalNS.Promise.allSettled = allSettled;
        }
    });

})));