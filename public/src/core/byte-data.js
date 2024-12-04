import Mode from "./mode.js";
export class ByteData {
    constructor(data) {
        var _a, _b;
        this.mode = Mode.BYTE;
        if (typeof data === "string") {
            this.data = new TextEncoder().encode(data);
        }
        else {
            this.data = new Uint8Array(data);
        }
        this.length = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    }
    static getBitsLength(length) {
        return length * 8;
    }
    getLength() {
        return this.data.length;
    }
    write(bitBuffer) {
        for (let i = 0, l = this.data.length; i < l; i++) {
            bitBuffer.put(this.data[i], 8);
        }
    }
    getBitsLength() {
        return ByteData.getBitsLength(this.data.length);
    }
}
// ByteData.prototype.getBitsLength = function getBitsLength() {
//   return ByteData.getBitsLength(this.data.length);
// };
