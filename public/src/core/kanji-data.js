import Mode from "./mode.js";
import Utils from "./utils.js";
// const Utils = require("./utils.js");
export class KanjiData {
    constructor(data) {
        var _a, _b;
        this.mode = Mode.KANJI;
        this.data = data;
        this.length = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    }
    static getBitsLength(length) {
        return length * 13;
    }
    getLength() {
        return this.data.length;
    }
    write(bitBuffer) {
        let i;
        // In the Shift JIS system, Kanji characters are represented by a two byte combination.
        // These byte values are shifted from the JIS X 0208 values.
        // JIS X 0208 gives details of the shift coded representation.
        for (i = 0; i < this.data.length; i++) {
            let value = Utils.toSJIS(this.data[i]);
            // For characters with Shift JIS values from 0x8140 to 0x9FFC:
            if (value >= 0x8140 && value <= 0x9ffc) {
                // Subtract 0x8140 from Shift JIS value
                value -= 0x8140;
                // For characters with Shift JIS values from 0xE040 to 0xEBBF
            }
            else if (value >= 0xe040 && value <= 0xebbf) {
                // Subtract 0xC140 from Shift JIS value
                value -= 0xc140;
            }
            else {
                throw new Error(`Invalid SJIS character: ${this.data[i]}
Make sure your charset is UTF-8`);
            }
            // Multiply most significant byte of result by 0xC0
            // and add least significant byte to product
            value = ((value >>> 8) & 0xff) * 0xc0 + (value & 0xff);
            // Convert result to a 13-bit binary string
            bitBuffer.put(value, 13);
        }
    }
    /**
   * Returns the total bits required for the Kanji data.
   * @returns {number} - The total bits required.
   */
    getBitsLength() {
        return KanjiData.getBitsLength(this.data.length);
    }
}
// KanjiData.prototype.getBitsLength = function getBitsLength() {
//   return KanjiData.getBitsLength(this.data.length);
// };
