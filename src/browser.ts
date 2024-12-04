import canPromise from "./can-promise.js";
import { create as qrCodeCreate } from "./core/qrcode.js";
import {  RendererCanvas } from "./renderer/canvas.js";
import { RendererSvgTag } from "./renderer/svg-tag.js";
import { Callback, QRData, QRexOptions, RendererOptions, RenderOptions } from "./types/qrex.type.js";

export class QRexBrowser {
  private readonly rendererCanvas = new RendererCanvas()
  private readonly svgtagRenderer = new RendererSvgTag()
private renderCanvas = (renderFunc:any, canvas?:any, text?:any, opts?:any, cb?:any) => {
  const args = []; // Move the arguments directly canvas, text, opts, cb
  if (canvas){
    args.push(canvas)
  }
  if (text){
    args.push(text)
  }
  if (opts){
    args.push(opts)
  }
  if(cb)
  {
    args.push(cb)
  }
  const argsNum = args.length;
  console.log(args,"this is args")
  const isLastArgCb = typeof args[argsNum-1] === "function";
  console.log(isLastArgCb)
  if (!isLastArgCb && !canPromise()) {
    throw new Error("Callback required as last argument");
  }

  // Handle cases where the callback is passed
  if (isLastArgCb) {
    if (argsNum < 2) {
      throw new Error("Too few arguments provided");
    }

    if (argsNum === 2) {
      cb = text;
      text = canvas;
      canvas = opts = undefined;
    } else if (argsNum === 3) {
      if (canvas?.getContext && typeof cb === "undefined") {
        cb = opts;
        opts = undefined;
      } else {
        cb = opts;
        opts = text;
        text = canvas;
        canvas = undefined;
      }
    }
  } else {
    console.log("hello error")
    if (argsNum < 1) {
      throw new Error("Too few arguments provided");
    }
    console.log("hello error 2",argsNum)
    if (argsNum === 1) {
      text = canvas;
      canvas = opts = undefined;
    } else if (argsNum === 2 && !canvas?.getContext) {
      
      opts = text;
      text = canvas;
      canvas = undefined;
    }
  
    return new Promise((resolve, reject) => {
      try {
        console.log("in the promise part",text,opts)
        const data = this.create(text as string, opts as QRexOptions);
        
        resolve(renderFunc(data, canvas, opts));
      } catch (e) {
        reject(e);
      }
    });
  }

  try {
    // console.log("hello text",text)
    // console.log("hello opts",opts)
    console.log("about ",text)
    const data = this.create(text as string, opts as QRexOptions);
    console.log("thisis data",data)
    cb(null, renderFunc(data, canvas, opts));
  } catch (e) {
    cb(e);
  }
}

public create = qrCodeCreate;

public toCanvas = this.renderCanvas.bind(null, this.rendererCanvas.render);
public toDataURL = this.renderCanvas.bind(null, this.rendererCanvas.renderToDataURL);

public toCanvasString = this.renderCanvas.bind(null, (data:QRData, _:any, opts:RendererOptions) =>
  this.svgtagRenderer.render(data, opts),
);
}