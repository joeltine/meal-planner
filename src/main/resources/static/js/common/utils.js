/**
 * Shared utilities for all meal planner app.
 */

/**
 * Returns if a given array contains the given substring. Only works for
 * arrays containing only numbers and/or strings. Case-insensitive.
 */
export function arrayContainsSubstring(array, string) {
  for (let i = 0; i < array.length; i++) {
    if (String(array[i]).toLowerCase().includes(string.toLowerCase())) {
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

export const Types = {
  STRING: 'string',
  NUMBER: 'number',
  ARRAY: 'array',
  PLAIN_OBJECT: 'plainObject',
  DATE: 'date'
};

/**
 * Tries to determine type of passed value. Returns simple string indicator of
 * detected type.
 * @returns {"undefined"|"plainObject"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"|"date"}
 */
export function getType(value) {
  if (Object.prototype.toString.call(value) === '[object String]') {
    return Types.STRING;
  } else if (Object.prototype.toString.call(value) === '[object Number]') {
    return Types.NUMBER;
  } else if (Array.isArray(value)) {
    return Types.ARRAY;
  } else if ($.isPlainObject(value)) {
    return Types.PLAIN_OBJECT;
  } else if (Object.prototype.toString.call(value) === "[object Date]") {
    return Types.DATE;
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
  if (expectedType === Types.NUMBER) {
    convertedVal = Number(val);
    if (Number.isNaN(convertedVal)) {
      return null;
    }
  } else if (expectedType === Types.ARRAY) {
    try {
      convertedVal = JSON.parse(val);
      if (!$.isArray(convertedVal)) {
        return null;
      }
    } catch (e) {
      return null;
    }
  } else if (expectedType === Types.PLAIN_OBJECT) {
    try {
      convertedVal = JSON.parse(val);
      if (!$.isPlainObject(convertedVal)) {
        return null;
      }
    } catch (e) {
      return null;
    }
  } else if (expectedType === Types.DATE) {
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
