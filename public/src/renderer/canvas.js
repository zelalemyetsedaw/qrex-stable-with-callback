import * as Utils from "./utils.js";
// interface RenderOptions {
//   type?: string;
//   rendererOpts?: { quality?: number };
//   [key: string]: any;
// }
// interface QRData {
//   modules: {
//     size: number;
//   };
// }
function clearCanvas(ctx, canvas, size) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // @ts-ignore
    if (!canvas.style)
        canvas.style = {};
    canvas.height = size;
    canvas.width = size;
    canvas.style.height = `${size}px`;
    canvas.style.width = `${size}px`;
}
function getCanvasElement() {
    try {
        return document.createElement("canvas");
    }
    catch (e) {
        throw new Error("You need to specify a canvas element");
    }
}
export function render(qrData, canvas, options) {
    let opts = options;
    let canvasEl = canvas;
    if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = undefined;
    }
    if (!canvas) {
        canvasEl = getCanvasElement();
    }
    opts = Utils.getOptions(opts);
    const size = Utils.getImageWidth(qrData.modules.size, opts);
    const ctx = canvasEl === null || canvasEl === void 0 ? void 0 : canvasEl.getContext("2d");
    const image = ctx.createImageData(size, size);
    Utils.qrToImageData(image.data, qrData, opts);
    if (canvasEl)
        clearCanvas(ctx, canvasEl, size);
    ctx.putImageData(image, 0, 0);
    return canvasEl;
}
export function renderToDataURL(qrData, canvas, options) {
    let opts = options;
    if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = undefined;
    }
    if (!opts)
        opts = {};
    const canvasEl = render(qrData, canvas, opts);
    const type = opts.type || "image/png";
    const rendererOpts = opts.rendererOpts || {};
    return canvasEl === null || canvasEl === void 0 ? void 0 : canvasEl.toDataURL(type, rendererOpts.quality);
}
