import * as small from "./terminal/terminal-small.js";
import * as big from "./terminal/terminal.js";
// interface QRData {
//   modules: {
//     size: number;
//     data: boolean[]; // or the appropriate type for your QR data
//   };
// }
// // Define the RenderOptions type
// interface RenderOptions {
//   small?: boolean;
//   inverse?: boolean;
//   [key: string]: any; // Add additional options as needed
// }
// type Callback = (err: Error | null, output: string | null) => void;
//why qr data is not working i thing there is a type difference between small and big
export function render(qrData, options, cb) {
    if (options === null || options === void 0 ? void 0 : options.small) {
        return small.render(qrData, options, cb);
    }
    return big.render(qrData, options, cb);
}
