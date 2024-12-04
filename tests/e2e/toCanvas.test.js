import { Canvas, createCanvas } from "canvas";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
// import { toCanvas } from "../../src";
import { removeNativePromise, restoreNativePromise } from "../helpers";
import { QRexServer } from "../../src/server";

const renderObject = new QRexServer()
const toCanvas = renderObject.toCanvas
const defaultOptions = {
  maskPattern: 1,
  version: 4,
};

describe("toCanvas - no promise available", () => {
  let canvasEl = createCanvas(200, 200);
  let originalPromise;

  beforeEach(() => {
    originalPromise = global.Promise;
    removeNativePromise();
    global.Promise = originalPromise;

    global.document = {
      createElement: (el) => {
        if (el === "canvas") {
          return createCanvas(200, 200);
        }
      },
    };
  });

  afterEach(() => {
    global.Promise = originalPromise;
    restoreNativePromise;
    global.document = undefined;
  });

  it("should throw an error if no arguments are provided", () => {
    expect(() => {
      toCanvas();
    }).toBeUndefined
  });

  it("should work with text and callback", () => {
    return new Promise((resolve) => {
      toCanvas("test text", (err, canvas) => {
        expect(err).toBeNull();
         expect(canvas).toBeDefined();
        resolve();
      });
    });
  });

  it("should work with canvas, text and callback", () => {
    return new Promise((resolve) => {
      console.log("from error test",canvasEl)
      toCanvas(canvasEl,"test text", (err, canvas) => {
        expect(err).toBeNull();
        expect(canvas).toBeDefined();
        resolve();
      });
    });
  });

  it("should work with canvas, text, options and callback", () => {
    return new Promise((resolve) => {
      const options = { ...defaultOptions, width: 200 };
      toCanvas(canvasEl, "test text", options, (err, canvas) => {
        expect(err).toBeNull();
        expect(canvas).toBeDefined();
        resolve();
      });
    });
  });
});

describe("toCanvas Function Tests", () => {
  let canvasEl;

  beforeEach(() => {
    global.document = {
      createElement: (el) => {
        if (el === "canvas") {
          return createCanvas(200, 200);
        }
      },
    };
    
  });

  afterEach(() => {
    global.document = undefined;
  });

  describe("Basic Functionality", () => {
    it("should throw an error if no arguments are provided", () => {
      expect(() => {
        toCanvas();
      }).toBeUndefined
    });

    it("should work with text and callback", () => {
      return new Promise((resolve) => {
        toCanvas("some text", (err, canvas) => {
          expect(err).toBeNull();
          expect(canvas).toBeInstanceOf(Canvas);
          resolve();
        });
      });
    });

    it("should work with text, options, and callback", () => {
      const options = {
        ...defaultOptions,
        version:2,
        errorCorrectionLevel: "H",
      };
      return new Promise((resolve) => {
       
        toCanvas("some text", options, (err, canvas) => {
          expect(err).toBeNull();
          expect(canvas).toBeInstanceOf(Canvas);
          resolve();
        });
      });
    });
    it("should return a canvas object when using text with Promise", async () => {
      const canvas = await toCanvas("unique text", defaultOptions);
      console.log("from text",canvas)
      expect(canvas).toBeInstanceOf(Canvas);
    });

    it("should return a canvas object when using text and options with Promise", async () => {
      const options = {
        ...defaultOptions,
        errorCorrectionLevel: "H",
      };
      const canvas = await toCanvas("some text", options);
      expect(canvas).toBeInstanceOf(Canvas);
    });
  });

  describe("toCanvas with specified canvas element", () => {
    let canvasEl = createCanvas(200, 200);
    it("should work with canvas element, text, and callback", () => {
      
      return new Promise((resolve) => {
        toCanvas(canvasEl, "some text", (err, canvas) => {
          expect(err).toBeNull();
          expect(canvas).toBeInstanceOf(Canvas);
          resolve();
        });
      });
    });

    it("should work with canvas element, text, options, and callback", () => {
      return new Promise((resolve) => {
        toCanvas(
          canvasEl,
          "some text",
          { errorCorrectionLevel: "H", maskPattern: 0 },
          (err, canvas) => {
            expect(err).toBeNull();
            expect(canvas).toBeInstanceOf(Canvas);
            resolve();
          },
        );
      });
    });

    it("should return a canvas object when using canvas element, text with Promise", async () => {
      const canvas = await toCanvas(canvasEl, "some text", defaultOptions);
      expect(canvas).toBeInstanceOf(Canvas);
    });

    it("should return a canvas object when using canvas element, text, and options with Promise", async () => {
      const canvas = await toCanvas(canvasEl, "some text", defaultOptions, {
        errorCorrectionLevel: "H",
      });
      expect(canvas).toBeInstanceOf(Canvas);
    });
  });
});
