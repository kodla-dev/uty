/**
  Type and Value Checks
  --------------------------------------------------------------------------------------------------
  It gives information about variables, constants, and the system environment.
  --------------------------------------------------------------------------------------------------
*/

/**
 * Checks if the value is an array.
 * @param {*} value - Check the value.
 * @returns {boolean} Returns true for arrays, false otherwise.
 */
export function isArray(value) {
  return Array.isArray(value);
}
