
import { Callback, QRData, RenderOptions } from "../types/qrex.type.js";
import { TerminalSmall } from "./terminal/terminal-small.js";
import { TerminalBig } from "./terminal/terminal-big.js";




export class RendererTerminal {
  public render = (qrData:QRData, options:RenderOptions, cb:Callback) => {
    const terminalBig = new TerminalBig();
    const terminalSmall = new TerminalSmall();
  if (options?.small) {
    
    return terminalSmall.render(qrData, options, cb);
  }
  
  return terminalBig.render(qrData, options, cb);
  }
}