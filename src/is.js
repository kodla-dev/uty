/**
  Type and Value Checks
  --------------------------------------------------------------------------------------------------
  It gives information about variables, constants, and the system environment.
  --------------------------------------------------------------------------------------------------
*/

import { keys } from './collect.js';
import {
  MAX_SAFE_INTEGER,
  RAW_ASYNC,
  RAW_ASYNC_FUNCTION,
  RAW_BOOLEAN,
  RAW_CLASS,
  RAW_FUNCTION,
  RAW_NAN,
  RAW_NULL,
  RAW_NUMBER,
  RAW_OBJECT,
  RAW_PROMISE,
  RAW_STRING,
  RAW_SYMBOL,
  RAW_UNDEFINED,
} from './define.js';
import { size } from './math.js';
import { toStringify } from './to.js';

/**
 * Checks if the value is an array.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, unknown[] | Readonly<unknown[]>>}
 * Returns true for arrays, false otherwise.
 */
export function isArray(value) {
  return Array.isArray(value);
}

/**
 * Checks if the value is similar to an array.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, import('./type.js').ArrayLikeLiteral>}
 * Returns true if the value is array-like, false otherwise.
 */
export function isArrayLike(value) {
  if (isArray(value)) return true;
  const len = !!value && value.length;
  return (
    (!isNil(value) &&
      !isFunction(value) &&
      isNumber(len) &&
      len > -1 &&
      len % 1 === 0 &&
      len <= MAX_SAFE_INTEGER) ||
    isString(value)
  );
}

/**
 * Checks if the value is an asynchronous function.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, import('./type.js').AsyncArrow>}
 * Returns true for asynchronous functions, false otherwise.
 */
export function isAsync(value) {
  return isFunction(value) && value.constructor.name === RAW_ASYNC_FUNCTION;
}

/**
 * Checks if the value is an asynchronous iterable.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, AsyncIterator<K>>}
 * Returns true for asynchronous iterables, false otherwise.
 */
export function isAsyncIterable(value) {
  return isFunction(value?.[Symbol.asyncIterator]);
}

/**
 * Checks if the value is boolean.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, boolean>}
 * Returns true for booleans, false otherwise.
 */
export function isBoolean(value) {
  return typeof value === RAW_BOOLEAN;
}

/**
 * Checks if the value is a class.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, import('./type.js').ClassLiteral>}
 * Returns true for classes, false otherwise.
 */
export function isClass(value) {
  return isFunction(value) && /^\s*class\s+/.test(value.toString());
}

/**
 * Checks if the system is a client.
 * @returns {boolean} True in client-side environment, false otherwise.
 */
export function isClient() {
  return typeof window === RAW_OBJECT;
}

/**
 * Checks if the value is a collection. We use the term 'collection' for both arrays and objects.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, import('./type.js').$collect>}
 * Returns true for arrays or objects, false for everything else.
 */
export function isCollect(value) {
  return isArray(value) || isObject(value);
}

/**
 * Checks if the value is a Comment.
 * @template K
 * @param {K} value Check the value.
 * @returns {value is import('./type.js').Include<K, Comment>}
 * True if the value is a Comment node, otherwise false.
 */
export function isComment(value) {
  return value instanceof Comment;
}

/**
 * Checks if the value is a date.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, Date>}
 * Returns true for Date, false otherwise.
 */
export function isDate(value) {
  return value instanceof Date;
}

/**
 * Checks if a number is divisible by another number.
 * @param {number} value - Check the value.
 * @param {number} number - The number to divide by.
 * @returns {boolean} True if value is divisible by number, otherwise false.
 */
export function isDivisible(value, number) {
  return value % number === 0;
}

/**
 * Checks if a value is an Element.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, Element>}
 * Returns true if the value is an Element object, otherwise false.
 */
export function isElement(value) {
  return value instanceof Element;
}

/**
 * Checks if a value is empty.
 * @template K
 * @param {K} value - Check the value.
 * @returns {K extends Promise<infer D> ? Promise<boolean> : boolean}
 * Returns true if the value is empty, false otherwise.
 */
export function isEmpty(value) {
  if (isNil(value)) return true;
  if (isArrayLike(value)) return !size(value);
  if (isObject(value)) {
    for (const i in value) return false;
    return !size(value);
  }
  const type = isType(value);
  if (type === RAW_OBJECT) {
    for (const i in value) return false;
    return !size(value);
  }
  if (type === RAW_SYMBOL) {
    const desc = Object(value).description;
    if (isUndefined(desc)) return true;
    return !size(desc);
  }
  if (isPromise(value)) return value.then(v => isEmpty(v));
  return isPrimitive(value) || !size(value);
}

/**
 * Checks if two values are equal.
 * @template K
 * @template D
 * @param {K} test1 - First value to compare.
 * @param {D} test2 - Second value to compare.
 * @returns {K extends Promise<infer L1> ?
 *          D extends Promise<infer L2> ?
 *          Promise<boolean> : boolean :
 *          D extends Promise<infer L2> ?
 *          boolean : boolean}
 * Returns true if the values are equal, false otherwise.
 */
export function isEqual(test1, test2) {
  if (test1 === test2) return true;
  if (typeof test1 !== typeof test2 || test1 !== Object(test1) || !test1 || !test2) return false;
  if (isArray(test1) && isArray(test2)) {
    const len = size(test1);
    if (len !== size(test2)) return false;

    for (let i = 0; i < len; i++) {
      if (!isEqual(test1[i], test2[i])) return false;
    }

    return true;
  }
  if (isObject(test1) && isObject(test2)) {
    const test1Keys = keys(test1);
    const len = size(test1Keys);
    if (len !== size(keys(test2))) return false;
    for (let i = 0; i < len; i++) {
      const key = test1Keys[i];
      // prettier-ignore
      if (!(
        Object.prototype.hasOwnProperty.call(test2, key) &&
        isEqual(test1[key], test2[key])
        )) return false;
    }
    return true;
  }
  return toStringify(test1) === toStringify(test2);
}

/**
 * Checks if the value is an error.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, Error>}
 * Returns true if the value is an Error, false otherwise.
 */
export function isError(value) {
  return value instanceof Error;
}

/**
 * Checks if the number is even.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, number>}
 * Returns true for even numbers, false for odd.
 */
export function isEven(value) {
  if (!isNumber(value)) return false;
  return value % 2 === 0;
}

/**
 * Checks if a value is false.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, false>}
 * Returns true if value is false, otherwise false.
 */
export function isFalse(value) {
  return value === false;
}

/**
 * Checks if a value is falsy.
 * @param {*} value - Check the value.
 * @returns {boolean} Returns true if value is falsy, otherwise false.
 */
export function isFalsy(value) {
  return !value;
}

/**
 * Checks if the value is a floating-point number.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, number>}
 * Returns true for floating-point numbers, false otherwise.
 */
export function isFloat(value) {
  return isNumber(value) && !isInteger(value);
}

/**
 * Checks if the value is a function.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, CallableFunction>}
 * Returns true if the value is a function, false otherwise.
 */
export function isFunction(value) {
  return typeof value === RAW_FUNCTION;
}

/**
 * Checks if the value is an integer.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, number>}
 * Returns true for integers, false otherwise.
 */
export function isInteger(value) {
  return Number.isInteger(value);
}

/**
 * Checks if the collection can be iterated.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, Iterator<K>>}
 * Returns true if value is iterable, false otherwise.
 */
export function isIterable(value) {
  return isFunction(value?.[Symbol.iterator]);
}

/**
 * Checks if the value is a key in the source.
 * @param {string|number} key - Check the key.
 * @param {object} source - Source object.
 * @returns {boolean} Return true if the key is a property; otherwise, false.
 */
export function isKey(key, source) {
  if (!isObject(source) || !isString(key) || !isNumber(key)) {
    return false;
  }

  return !isUndefined(source[key]);
}

/**
 * Checks if localStorage is supported.
 * @returns {boolean} Returns true if localStorage is available.
 */
export function isLocalStorage() {
  return isClient() && Boolean(window.localStorage);
}

/**
 * Checks for NaN.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, number>}
 * Returns true for NaN, false otherwise.
 */
export function isNaN(value) {
  return Number.isNaN(value);
}

/**
 * Checks if the value is null or undefined.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, null | undefined>}
 * Returns true if the value is null or undefined, false otherwise.
 */
export function isNil(value) {
  return isUndefined(value) || isNull(value);
}

/**
 * Checks if a value is a Node.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, Node>}
 * Returns true if the value is a Node object, otherwise false.
 */
export function isNode(value) {
  return value instanceof Node;
}

/**
 * Checks for null value.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, null>}
 * Returns true if null, false otherwise.
 */
export function isNull(value) {
  return value === null;
}

/**
 * Checks if the value is a number.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, number>}
 * Returns true for numbers, false for other values.
 */
export function isNumber(value) {
  return typeof value === RAW_NUMBER;
}

/**
 * Checks if the value is a real object.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, import('./type.js').$object>}
 * Returns true for objects, false for everything else.
 */
export function isObject(value) {
  return !!value && typeof value === RAW_OBJECT && value.constructor === Object;
}

/**
 * Checks if the value is an object.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, object>}
 * Returns true for objects, false for everything else.
 */
export function isObjects(value) {
  return typeof value === RAW_OBJECT || isFunction(value);
}

/**
 * Checks if the number is odd.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, number>}
 * Returns true for odd numbers, false for even.
 */
export function isOdd(value) {
  if (!isNumber(value)) return false;
  return value % 2 === 1;
}

/**
 * Checks if a value is a basic type.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, import('./type.js').Primitive>}
 * Returns true for primitives, false otherwise.
 */
export function isPrimitive(value) {
  return Object(value) !== value;
}

/**
 * Checks if the value is a promise.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, Promise<unknown>>}
 * Returns true if the value is a promise, false otherwise.
 */
export function isPromise(value) {
  if (value instanceof Promise) return true;
  return !isNil(value) && isFunction(value.then);
}

/**
 * Checks if the value is a regular expression.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, RegExp>}
 * Returns true for regular expressions, false otherwise.
 */
export function isRegExp(value) {
  return value instanceof RegExp || Object.prototype.toString.call(value) === '[object RegExp]';
}

/**
 * Checks if the code is running on a server.
 * @returns {boolean} True in a server environment, false otherwise.
 */
export function isServer() {
  return typeof window === RAW_UNDEFINED;
}

/**
 * Checks if the value is a string.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, string>}
 * Returns true for strings, false otherwise.
 */
export function isString(value) {
  return typeof value === RAW_STRING || value instanceof String;
}

/**
 * Checks if the value is a symbol.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, symbol>}
 * Returns true for symbols, false for other values.
 */
export function isSymbol(value) {
  return typeof value === RAW_SYMBOL;
}

/**
 * Checks if the value is an instance of Text.
 * @template K
 * @param {K} value Check the value.
 * @returns {value is import('./type.js').Include<K, Text>}
 * True if the value is a Text node, otherwise false.
 */
export function isText(value) {
  return value instanceof Text;
}

/**
 * Checks if a value is true.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, true>}
 * Returns true if value is true, false otherwise.
 */
export function isTrue(value) {
  return value === true;
}

/**
 * Checks if a value is truthy.
 * @param {*} value - Check the value.
 * @returns {boolean} Returns true if the value is truthy, false otherwise.
 */
export function isTruthy(value) {
  return !!value;
}

/**
 * Determines the real type.
 * @template K
 * @param {K} value - The value whose data type is being taken.
 * @returns {string} - The data type of the value.
 */
export function isType(value) {
  if (isNull(value)) {
    return RAW_NULL;
  } else if (isUndefined(value)) {
    return RAW_UNDEFINED;
  } else if (isNaN(value)) {
    return RAW_NAN;
  } else if (isAsync(value)) {
    return RAW_ASYNC;
  } else if (isPromise(value)) {
    return RAW_PROMISE;
  } else if (isClass(value)) {
    return RAW_CLASS;
  }
  const type = Object.prototype.toString.call(value).slice(8, -1);
  return type.charAt(0).toLowerCase() + type.slice(1);
}

/**
 * Checks if the value is undefined.
 * @template K
 * @param {K} value - Check the value.
 * @returns {value is import('./type.js').Include<K, undefined>}
 * Returns true if undefined, false otherwise.
 */
export function isUndefined(value) {
  return typeof value === RAW_UNDEFINED;
}
