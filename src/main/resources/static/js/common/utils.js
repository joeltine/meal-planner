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
 * Returns if passed object is a valid Date object.
 */
export function isValidDate(d) {
  if (Object.prototype.toString.call(d) === "[object Date]") {
    if (Number.isNaN(d.getTime())) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

/**
 * Tries to determine type of passed value. Returns simple string indicator of
 * detected type.
 * @returns {"undefined"|"plainObject"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"|"date"}
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
  } else if (Object.prototype.toString.call(value) === "[object Date]") {
    return 'date';
  } else {
    return typeof value;
  }
}

/**
 * Tries to convert string val to the given expectedType. If it is a Date or
 * just doesn't support the expectedType, it will return the original string.
 */
export function tryToConvertStringToType(val, expectedType) {
  if (val == null) {
    return val;
  }
  let convertedVal = val;
  if (expectedType === 'number') {
    convertedVal = Number(val);
    if (Number.isNaN(convertedVal)) {
      return null;
    }
  } else if (expectedType === 'array' || expectedType === 'plainObject') {
    try {
      convertedVal = JSON.parse(val);
    } catch (e) {
      return null;
    }
  } else if (expectedType === 'date') {
    if (!isValidDate(new Date(val))) {
      return null;
    }
    // Note, we purposely keep date as a string in its current form to send
    // back to server.
  }
  return convertedVal;
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