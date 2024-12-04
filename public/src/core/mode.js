import { isValid as _isValid } from "./version-check.js";
import { testNumeric, testAlphanumeric, testKanji } from "./regex.js";
export const NUMERIC = {
    id: "Numeric",
    bit: 1 << 0,
    ccBits: [10, 12, 14],
};
export const ALPHANUMERIC = {
    id: "Alphanumeric",
    bit: 1 << 1,
    ccBits: [9, 11, 13],
};
export const BYTE = {
    id: "Byte",
    bit: 1 << 2,
    ccBits: [8, 16, 16],
};
export const KANJI = {
    id: "Kanji",
    bit: 1 << 3,
    ccBits: [8, 10, 12],
};
export const MIXED = {
    bit: -1,
};
/**
 * Returns the number of bits needed to store the data length
 * according to QR Code specifications.
 *
 * @param  {Mode}   mode    Data mode
 * @param  {Number} version QR Code version
 * @return {Number}         Number of bits
 */
export function getCharCountIndicator(mode, version) {
    if (!mode.ccBits)
        throw new Error(`Invalid mode: ${mode}`);
    if (!_isValid(version)) {
        throw new Error(`Invalid version: ${version}`);
    }
    if (version >= 1 && version < 10)
        return mode.ccBits[0];
    else if (version < 27)
        return mode.ccBits[1];
    return mode.ccBits[2];
}
/**
 * Returns the most efficient mode to store the specified data
 *
 * @param  {String} dataStr Input data string
 * @return {Mode}           Best mode
 */
export function getBestModeForData(dataStr) {
    if (testNumeric(dataStr))
        return NUMERIC;
    else if (testAlphanumeric(dataStr))
        return ALPHANUMERIC;
    else if (testKanji(dataStr))
        return KANJI;
    else
        return BYTE;
}
/**
 * Return mode name as string
 *
 * @param {Mode} mode Mode object
 * @returns {String}  Mode name
 */
export function toString(mode) {
    if (mode === null || mode === void 0 ? void 0 : mode.id)
        return mode.id;
    throw new Error("Invalid mode");
}
/**
 * Check if input param is a valid mode object
 *
 * @param   {Mode}    mode Mode object
 * @returns {Boolean} True if valid mode, false otherwise
 */
export function isValid(mode) {
    return !!(mode === null || mode === void 0 ? void 0 : mode.bit) && !!mode.ccBits;
}
/**
 * Get mode object from its name
 *
 * @param   {String} string Mode name
 * @returns {Mode}          Mode object
 */
function fromString(string) {
    if (typeof string !== "string") {
        throw new Error("Param is not a string");
    }
    const lcStr = string.toLowerCase();
    switch (lcStr) {
        case "numeric":
            return NUMERIC;
        case "alphanumeric":
            return ALPHANUMERIC;
        case "kanji":
            return KANJI;
        case "byte":
            return BYTE;
        default:
            throw new Error(`Unknown mode: ${string}`);
    }
}
/**
 * Returns mode from a value.
 * If value is not a valid mode, returns defaultValue
 *
 * @param  {Mode|String} value        Encoding mode
 * @param  {Mode}        defaultValue Fallback value
 * @return {Mode}                     Encoding mode
 */
export function from(value, defaultValue) {
    if (isValid(value)) {
        return value;
    }
    try {
        return fromString(value);
    }
    catch (e) {
        return defaultValue;
    }
}
const Mode = {
    NUMERIC,
    ALPHANUMERIC,
    BYTE,
    KANJI,
    MIXED,
    getCharCountIndicator,
    getBestModeForData,
    toString,
    isValid,
    fromString,
    from,
};
export default Mode;
