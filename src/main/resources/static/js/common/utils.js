/**
 * Shared utilities for all meal planner app.
 */

/**
 * Returns if a given array contains the given substring. Only works for
 * arrays containing only numbers and/or strings.
 */
export function arrayContainsSubstring(array, string) {
  for (let i = 0; i < array.length; i++) {
    if (String(array[i]).includes(string)) {
      return true;
    }
  }
  return false;
}

/**
 * Tries to determine type of passed value. Returns simple string indicator of
 * detected type.
 * @returns {"undefined"|"plainObject"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"}
 */
export function getType(value) {
  if (Object.prototype.toString.call(value) === '[object String]') {
    return 'string';
  } else if (Object.prototype.toString.call(value) === '[object Number]') {
    return 'number';
  } else if ($.isArray(value)) {
    return 'array';
  } else if ($.isPlainObject(value)) {
    return 'plainObject';
  } else {
    return typeof value;
  }
}

/**
 * Returns debounced implementation of passed function using the given
 * timeout (milliseconds) between calls.
 */
export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}