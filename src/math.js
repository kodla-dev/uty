/**
  Mathematical Operations
  --------------------------------------------------------------------------------------------------
  Tools designed to facilitate mathematical operations.
  --------------------------------------------------------------------------------------------------
*/

import { every, filter, keys, map, pluck, reduce } from './collect.js';
import {
  isArray,
  isArrayLike,
  isCollect,
  isDivisible,
  isFunction,
  isNumber,
  isObject,
  isPromise,
  isString,
  isUndefined,
} from './is.js';

/**
 * Combines two values. Works with numbers, strings, and collections.
 * @param {number|string} a - The first value to add.
 * @param {number|string|Array} [b] - The second value to add or a collection to map.
 * @returns {Function|number|string|Array} The sum of the values, or a mapped collection.
 */
export function add(a, b) {
  if (isUndefined(b)) return b => add(a, b);
  if ((isNumber(a) && isNumber(b)) || (isString(a) && isString(b))) return a + b;
  if (isCollect(b)) return map(add(a), b);
}

/**
 * Calculates the average of a set of values. You can also average a specific key or the result
 * of a function applied to each element.
 *
 * @param {string|Function} [key] - The key to pluck or the function to map over the collection.
 * @param {Array} [collect] - The collection to average.
 * @returns {number} The average of the collection.
 */
export function avg(key, collect) {
  if (isUndefined(collect)) {
    if (isUndefined(key)) return collect => avg(collect);
    else if (isString(key) || isFunction(key)) return collect => avg(key, collect);
    return avg(void 0, key);
  }

  return sum(key, collect) / size(collect);
}

/**
 * Filters a collection to include only items divisible by a given number or numbers.
 *
 * @param {number|Array<number>} number - The number or array of numbers to check divisibility against.
 * @param {Array|Object} [collect] - The collection to filter.
 * @returns {Array|Object} The filtered collection.
 */
export function divisible(number, collect) {
  if (isUndefined(collect)) return collect => divisible(collect);
  if (isNumber(number) && isCollect(collect)) {
    return filter(item => isDivisible(item, number), collect);
  }
  if (isArray(number) && isCollect(collect)) {
    return filter(item => every(num => isDivisible(item, num), number), collect);
  }
}

/**
 * Returns the size of the specified collection.
 *
 * @param {*} [collect] - The collection to determine the size of.
 * @returns {number} Returns the size of the collection.
 */
export function size(collect) {
  if (isUndefined(collect)) return collect => size(collect);
  if (isArrayLike(collect)) return length(collect);
  if (isObject(collect)) return length(keys(collect));
  if (collect?.size) return collect.size;
  if (isPromise(collect)) return collect.then(c => size(c));
  return 0;
}

/**
 * Returns the length of an array or array-like object.
 *
 * @private
 * @param {Array|String} collect - The array or array-like object.
 * @returns {number} - Returns the length of the array or array-like object.
 */
export function length(collect) {
  return collect.length;
}

/**
 * Calculates the sum of a collection. Optionally sums the values of a specified key or the result
 * of a function applied to each element.
 *
 * @param {string|Function} [key] - The key to pluck or the function to map over the collection.
 * @param {Array} [collect] - The collection to sum.
 * @returns {number} The sum of the collection.
 */
export function sum(key, collect) {
  if (isUndefined(collect)) {
    if (isUndefined(key)) return collect => sum(collect);
    else if (isString(key) || isFunction(key)) return collect => sum(key, collect);
    return sum(void 0, key);
  }

  let total = 0;

  if (isArray(collect)) {
    // Sum the collection directly if no key is provided
    if (isUndefined(key)) total = reduce(add, collect);
    // Pluck the values of the specified key and sum them
    else if (isString(key)) total = sum(pluck(key, collect));
    // Map the function over the collection and sum the results
    else if (isFunction(key)) total = sum(map(key, collect));
  }

  // Return the sum with precision
  return parseFloat(total.toPrecision(12));
}
