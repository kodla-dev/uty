/**
  String Tools
  --------------------------------------------------------------------------------------------------
  Tools for easy string manipulation and formatting.
  --------------------------------------------------------------------------------------------------
*/

import { dot, each, includes, join, map, merge, some } from './collect.js';
import { RAW_EMPTY, RAW_WHITESPACE } from './define.js';
import { pipe } from './index.js';
import { isArray, isString, isUndefined } from './is.js';
import { length } from './math.js';

/**
 * Converts the given string to lowercase, optionally using a specified locale.
 *
 * @param {string|undefined} locale - The locale to use for the conversion (optional).
 * @param {string|undefined} collect - The string to convert to lowercase.
 * @returns {string|function} The lowercase string or a function awaiting the string.
 */
export function lower(locale, collect) {
  if (isUndefined(collect)) {
    if (isString(locale)) return lower(void 0, locale);
    return collect => lower(locale, collect);
  }

  if (!isUndefined(locale)) {
    return collect.toLocaleLowerCase(locale);
  } else {
    return collect.toLowerCase();
  }
}

/**
 * Removes punctuation characters from a string.
 *
 * @param {string|undefined} collect - The string from which to remove punctuation.
 * @returns {string|function} The string without punctuation, or a function awaiting the string.
 */
export function removePunct(collect) {
  if (isUndefined(collect)) return collect => removePunct(collect);

  // Regular expression to match punctuation characters
  const punctRgx = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]/g;

  // Replace punctuation characters with an empty string
  return collect.replace(punctRgx, RAW_EMPTY);
}

/**
 * Extracts a substring from a given string or strings within a collection.
 *
 * @param {number} start - The starting index of the substring.
 * @param {number|undefined} end - The ending index of the substring (optional).
 * @param {string|Array|string} collect - The string or collection to extract substrings from.
 * @returns {string|function} The extracted substring or a function awaiting the collection.
 */
export function sub(start = 1, end, collect) {
  if (isUndefined(collect)) {
    if (isString(end)) return sub(start, void 0, end);
    if (isString(start)) return sub(1, void 0, start);
    if (isUndefined(end)) return collect => sub(start, void 0, collect);
    return collect => sub(start, end, collect);
  }

  if (end) return collect.substring(start, end);
  return collect.substring(start);
}

/**
 * Replaces placeholders in a string with values from an object or tree.
 *
 * @param {string|Object} str - The string with placeholders (e.g., "{key}").
 * @param {Array<string>|undefined} [holders] - A list of opening and closing delimiters for placeholders.
 * @param {Object|undefined} [collect] - The object containing replacement values.
 * @returns {string|Function} - The string with placeholders replaced by corresponding values.
 */
export function supplant(str, holders, collect) {
  if (isUndefined(collect)) {
    if (!isString(str)) return collect => supplant(collect, holders, str);
    if (isUndefined(holders)) return collect => supplant(str, void 0, collect);
    if (isArray(holders)) return collect => supplant(str, holders, collect);
    return supplant(str, void 0, holders);
  }

  const rgx = holders ? new RegExp(`\\${holders[0]}(.*?)\\${holders[1]}`, 'g') : /{(.*?)}/g;
  return str.replace(rgx, (_, key) => dot(key, collect) || '');
}

/**
 * Converts the first character of a string to uppercase, considering locale if provided.
 *
 * @param {string|undefined} locale - The locale to use for uppercasing the first character.
 * @param {string|undefined} collect - The string to convert.
 * @returns {string|function} The string with the first character in uppercase, or a function awaiting the string.
 */
export function ucfirst(locale, collect) {
  if (isUndefined(collect)) {
    if (isString(locale)) return ucfirst(void 0, locale);
    return collect => ucfirst(locale, collect);
  }

  return upper(locale, sub(0, 1, collect)) + sub(1, collect);
}

/**
 * Converts the first character of each word in a string to uppercase, considering locale if provided.
 *
 * @param {string|undefined} locale - The locale to use for uppercasing characters.
 * @param {string|undefined} collect - The string to convert.
 * @returns {string|function} The string with each word's first character in uppercase, or a function awaiting the string.
 */
export function ucwords(locale, collect) {
  if (isUndefined(collect)) {
    if (isString(locale)) return ucwords(void 0, locale);
    return collect => ucwords(locale, collect);
  }

  return pipe(
    collect,
    lower(locale),
    words,
    map(letter => ucfirst(locale, letter)),
    join(RAW_WHITESPACE)
  );
}

/**
 * Converts the given string to uppercase, optionally using a specified locale.
 *
 * @param {string|undefined} locale - The locale to use for the conversion (optional).
 * @param {string|undefined} collect - The string to convert to uppercase.
 * @returns {string|function} The uppercase string or a function awaiting the string.
 */
export function upper(locale, collect) {
  if (isUndefined(collect)) {
    if (isString(locale)) return upper(void 0, locale);
    return collect => upper(locale, collect);
  }

  if (!isUndefined(locale)) {
    return collect.toLocaleUpperCase(locale);
  } else {
    return collect.toUpperCase();
  }
}

/**
 * Checks text against options.
 *
 * This function checks if the text meets the specified criteria, such as length, case,
 * and character type. It returns an array of criteria that the text satisfies.
 *
 * @param {string} text - Text to validate.
 * @param {Object} [options] - An object with the validation options.
 * @param {number} [options.minimum] - The minimum length the text must have.
 * @param {number} [options.maximum] - The maximum length the text must have.
 * @param {number} [options.lowercase] - The minimum number of lowercase letters required in the text.
 * @param {number} [options.uppercase] - The minimum number of uppercase letters required in the text.
 * @param {number} [options.special] - The minimum number of special characters required in the text.
 * @param {number} [options.number] - The minimum number of numeric digits required in the text.
 * @param {Array<string>} [options.disable] - An array of forbidden words that cannot be part of the text
 * @param {Array<string>} [options.require] - An array of required words that must be present in the text.
 * @returns {Array<string>} An array of criteria that the text passes (e.g., ['minimum', 'lowercase', 'number']).
 */
export function validate(text, options = {}) {
  options = merge(options, {
    minimum: 0,
    maximum: Infinity,
    lowercase: 0,
    uppercase: 0,
    special: 0,
    number: 0,
    require: 0,
    disable: 0,
  });

  let used = [];
  const rgx = (a, b) => new RegExp(`(?:.*\\p{${a}}.*){${b}}.*`, 'u');
  const { minimum, maximum, lowercase, uppercase, special, number, disable } = options;

  const regexes = {
    lowercase: lowercase > 0 ? rgx('Ll', lowercase) : null,
    uppercase: uppercase > 0 ? rgx('Lu', uppercase) : null,
    special: special > 0 ? rgx('P', special) : null,
    number: number > 0 ? rgx('N', number) : null,
  };

  const len = length(text);
  if (len >= minimum) used.push('minimum');
  if (len <= maximum) used.push('maximum');

  each((key, value) => value && value.test(text) && used.push(key), regexes);

  if (options.require || disable) {
    const textLower = lower(text);
    const check = some(word => includes(lower(word), textLower));
    if (options.require && check(options.require)) used.push('require');
    if (disable && check(disable)) used.push('disable');
  }

  return used;
}

/**
 * Splits a string into an array of words, optionally removing punctuation.
 *
 * @param {number|undefined} punct - A flag indicating whether to remove punctuation (1 to remove, 0 to keep).
 * @param {string|undefined} collect - The string to split into words.
 * @returns {string[]|function} An array of words or a function awaiting the string.
 */
export function words(punct, collect) {
  if (isUndefined(collect)) {
    if (isString(punct)) return words(0, punct);
    return collect => words(punct, collect);
  }

  // Regular expression to match non-space sequences
  const nonSpaceRgx = /\S+/g;

  // If punct is truthy, remove punctuation and match non-space sequences
  if (punct) {
    return removePunct(collect).match(nonSpaceRgx) || [];
  } else {
    // Otherwise, match non-space sequences without removing punctuation
    return collect.match(nonSpaceRgx) || [];
  }
}
