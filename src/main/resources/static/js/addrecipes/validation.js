/**
 * Checks input's validity and returns the appropriate error message per the
 * passed errorMap.
 * @param errorMap A map of ValidityStates types to error messages. See
 *
 * @param input An input element that supports 'validity' property.
 * @returns {string} The error message or empty string if none defined in map.
 */
export function getValidityMessage(errorMap, input) {
  let errorMsg = '';
  Object.keys(errorMap).forEach((errorType) => {
    if (input.validity[errorType]) {
      errorMsg = errorMap[errorType];
    }
  });
  return errorMsg;
}

/**
 * Enum of ValidityState values, see:
 * https://developer.mozilla.org/en-US/docs/Web/API/ValidityState.
 */
export const ValidityStates = {
  BAD_INPUT: 'badInput',
  PATTERN_MISMATCH: 'patternMismatch',
  RANGE_OVERFLOW: 'rangeOverflow',
  RANGE_UNDERFLOW: 'rangeUnderflow',
  STEP_MISMATCH: 'stepMismatch',
  TOO_LONG: 'tooLong',
  TOO_SHORT: 'tooShort',
  TYPE_MISMATCH: 'typeMismatch',
  VALUE_MISSING: 'valueMissing'
};
