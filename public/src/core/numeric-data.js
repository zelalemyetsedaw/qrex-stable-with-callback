import { NUMERIC } from "./mode.js";
// Assume BitBuffer is properly typed and available for import.
class NumericData {
    constructor(data) {
        var _a, _b;
        this.mode = NUMERIC;
        this.data = data.toString();
        this.length = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    }
    /**
     * Get the number of bits required to encode a given length of numeric data.
     *
     * @param length - The length of the numeric data.
     * @returns The number of bits required.
     */
    static getBitsLength(length) {
        return (10 * Math.floor(length / 3) +
            (length % 3 ? (length % 3) * 3 + 1 : 0));
    }
    /**
     * Get the length of the numeric data.
     *
     * @returns The length of the data string.
     */
    getLength() {
        return this.data.length;
    }
    /**
     * Get the number of bits required to encode this instance's numeric data.
     *
     * @returns The number of bits required.
     */
    getBitsLength() {
        return NumericData.getBitsLength(this.data.length);
    }
    /**
     * Write the numeric data into the given bit buffer.
     *
     * @param bitBuffer - The bit buffer to write to.
     */
    write(bitBuffer) {
        let i;
        let group;
        let value;
        // Divide the input data string into groups of three digits.
        // Convert each group to its 10-bit binary equivalent.
        for (i = 0; i + 3 <= this.data.length; i += 3) {
            group = this.data.slice(i, i + 3);
            value = Number.parseInt(group, 10);
            bitBuffer.put(value, 10);
        }
        // Handle remaining digits (1 or 2 digits).
        const remainingNum = this.data.length - i;
        if (remainingNum > 0) {
            group = this.data.substr(i);
            value = Number.parseInt(group, 10);
            bitBuffer.put(value, remainingNum * 3 + 1);
        }
    }
}
export default NumericData;
