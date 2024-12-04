



import { PNGOptions } from 'pngjs';

import { BitBuffer } from "../core/bit-buffer";
import { BitMatrix } from "../core/bit-matrix";

type ModeType = "Alphanumeric" | "Byte" | "Kanji" | "Numeric";
export interface DataMode {
  id?: ModeType;
  bit: number;
  ccBits?: number[];
}

export type ErrorCorrectionLevelBit = {
    bit: number;
  };

export type MaskPatternType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ErrorCorrectionLevelString = "L" | "M" | "Q" | "H" | "low" | "medium" | "quartile" | "high";

export type ErrorCorrectionLevel = ErrorCorrectionLevelBit | ErrorCorrectionLevelString;

export type Segment = SegmentInterface | SegmentInterface<Uint8Array>;

export interface SegmentInterface<T = string> {
  data: T;
  index?: number;
  mode: DataMode | string;
  length: number;
  getBitsLength?(): number;
  getLength?(): number;
  write?(bitBuffer: BitBuffer): void;
}

export type RendererType = "canvas" | "svg" | "terminal" | "txt" | "utf8" | "png";

export type QRexOptions = {
  /** Output type */
  type?: RendererType;
  /** QR Code version */
  version?: number;
  /** Error correction level */
  errorCorrectionLevel?: ErrorCorrectionLevel;
  /** Mask pattern */
  maskPattern?: MaskPatternType;
  toSJISFunc?: (text: string) => number;
};




  

export type QrContent = string;

// export type QRData = {
//   modules: BitMatrix;
//   version?: number;
//   errorCorrectionLevel?: ErrorCorrectionLevelBit;
//   maskPattern?: MaskPatternType;
//   segments?: Segment[];
// };


// Unified types and interfaces for QR rendering

export interface QRData {
    modules: {
      size: number;
      data: boolean[] | boolean[][]; // Union to cover both 1D and 2D boolean arrays
    };
  }
  
  export interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
    hex: string;
  }
  
  export interface ColorOptions {
    dark?: string; // Hex color for dark areas
    light?: string; // Hex color for light areas
  }
  
  export interface Color {
    hex: string;
    a: number; // Alpha channel
  }
  
  export interface RendererOptions {
    quality?: number; // Specific to PNG rendering or other formats
     // Allow additional renderer-specific options
  }
  
  export interface RenderOptions extends QRexOptions {
    margin?: number; // Margin around the QR code
    width?: number; // Fixed width of the QR code
    scale?: number; // Scale factor for rendering
    // type?: string; // Type of output (e.g., 'png', 'svg')
    small?: boolean; // Whether to render in small mode
    inverse?: boolean; // Inverted rendering mode
    
     
    rendererOpts?: PNGOptions | { quality?: number };
    [key:string]: any;
  } 

// color?: {
//     dark: Color | ColorOptions;
//     light: Color | ColorOptions
// }



  
  // Callback type
  export type Callback = (err: Error | NodeJS.ErrnoException | null, output?: string | null) => void;
  

