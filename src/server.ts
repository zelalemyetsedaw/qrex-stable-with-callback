
import { RenderOptions,QRData, Callback, SegmentInterface } from './types/qrex.type';

import canPromise from "./can-promise.js";
import * as QRCode from "./core/qrcode.js";

// import * as Utf8Renderer from "./renderer/utf8.js";
// import * as TerminalRenderer from "./renderer/terminal.js";
// import * as SvgRenderer from "./renderer/svg.js";
// import { toCanvas } from "./browser.js";
import { Writable } from 'stream';
import { RendererPng } from './renderer/png';
import { RendererUtf8 } from './renderer/utf8';
import { RendererTerminal } from './renderer/terminal';
import { RendererSvg } from './renderer/svg';
import { QRexBrowser } from './browser';
interface paramsType{
  opts: RenderOptions;
  cb: Callback
}
export class QRexServer {
  private PngRenderer = new RendererPng()
  private Utf8Renderer = new RendererUtf8()
  private TerminalRenderer = new RendererTerminal()
  private SvgRenderer = new RendererSvg()
  private qrexBrowser = new QRexBrowser()
  public toCanvas = this.qrexBrowser.toCanvas
private checkParams = (text:any, opts:any, cb:any) => {
  if (typeof text === "undefined") {
    throw new Error("String required as first argument");
  }

  if (typeof cb === "undefined") {
    cb = opts;
    opts = {};
  }

  if (typeof cb !== "function") {
    if (!canPromise()) {
      throw new Error("Callback required as last argument");
    } else {
      opts = cb || {};
      cb = null;
    }
  }

  return {
    opts: opts,
    cb: cb,
  };
}

private getTypeFromFilename = (path:string) => {
  return path.slice(((path.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

private getRendererFromType = (type:string) => {
  switch (type) {
    case "svg":
      return this.SvgRenderer;

    case "txt":
    case "utf8":
      return this.Utf8Renderer;

    case "png":
    case "image/png":
    default:
      return this.PngRenderer;
  }
}

private getStringRendererFromType = (type:string) => {
  switch (type) {
    case "svg":
      return this.SvgRenderer;

    case "terminal":
      
      return this.TerminalRenderer;

    case "utf8":
    default:
      return this.Utf8Renderer;
  }
}

// the above function are accepting dynamic data i should make change to this way of passing dynamic data other wise it is difficult to change them into typescript

private render = (renderFunc:any, text:string|SegmentInterface[], params:paramsType) => {
  if (!params.cb) {
    return new Promise((resolve, reject) => {
      try {
        const data = QRCode.create(text, params.opts);
        return renderFunc(data, params.opts, (err:any, data:any) =>
          err ? reject(err) : resolve(data),
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  try {
    const data = QRCode.create(text, params.opts);
    return renderFunc(data, params.opts, params.cb);
  } catch (e:any) {
    params.cb(e);
  }
}

public create = QRCode.create;

// export const toCanvas = require("./browser").toCanvas;




public toString = (text:string, opts:RenderOptions, cb:Callback) => {
  const params = this.checkParams(text, opts, cb);
  const type = params.opts ? params.opts.type : undefined;
  const renderer = this.getStringRendererFromType(type);
  
  return this.render(renderer.render, text, params);
}

public toDataURL = (text:string, opts:RenderOptions, cb:Callback) => {
  const params = this.checkParams(text, opts, cb);
  const renderer = this.getRendererFromType(params.opts.type);
  return this.render((renderer as any).renderToDataURL , text, params);
}

public  toBuffer = (text:string, opts:RenderOptions, cb:Callback) => {
  const params = this.checkParams(text, opts, cb);
  const renderer = this.getRendererFromType(params.opts.type);
  return this.render((renderer as any).renderToBuffer, text, params);
}

public toFile = (path:string, text:string|SegmentInterface[], opts:RenderOptions, cb:Callback) => {
  
  if (
    typeof path !== "string" ||
    !(typeof text === "string" || typeof text === "object")
  ) {
    throw new Error("Invalid argument");
  }

  if ( !cb && !opts && !canPromise()) {
    throw new Error("Too few arguments provided");
  }
//arguments.length < 3
  const params = this.checkParams(text, opts, cb);
  const type = params.opts.type || this.getTypeFromFilename(path);
  const renderer = this.getRendererFromType(type);
  
  const renderToFile = renderer.renderToFile.bind(null, path);

  return this.render(renderToFile, text, params);
}

public toFileStream = (stream:Writable, text:string, opts:RenderOptions) => {
  if (!opts && !text) {
    throw new Error("Too few arguments provided");
  }
  //arguments.length < 2 && 
  const params = this.checkParams(text, opts, stream.emit.bind(stream, "error"));
  const renderer = this.getRendererFromType("png"); // Only png support for now
  
  const renderToFileStream = (renderer as any).renderToFileStream.bind(null, stream);
  this.render(renderToFileStream, text, params);
}
}