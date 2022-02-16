/**
 * Some shared testing utilities.
 */

/**
 * Returns random integer within range.
 * @param range
 * @returns {number}
 */
export function randomInt(range) {
  return Math.floor(Math.random() * range);
}

/**
 * Returns random alpha-numeric string of given length.
 * @param length
 * @returns {string}
 */
export function randomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
      '0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomInt(characters.length));
  }
  return result;
}

/**
 * Generates random array of strings of random length within maxLength range.
 * @param maxLength
 * @returns {*[]}
 */
export function randomArray(maxLength) {
  const array = [];
  const length = randomInt(maxLength);
  for (let i = 0; i < length; i++) {
    array.push(randomString(10));
  }
  return array;
}

/**
 * Generates random object of string key/val pairs with random number of keys
 * with range maxKeys.
 * @param maxKeys
 * @returns {{}}
 */
export function randomObject(maxKeys) {
  const object = {};
  const length = randomInt(maxKeys);
  for (let i = 0; i < length; i++) {
    object[randomString(5)] = randomString(3);
  }
  return object;
}
