import { TextureInfo } from "./TextureInfo";
import PrimitiveRenderer from "./PrimitiveRenderer";
import { MeshRenderer } from "./MeshRenderer";
import Drawer from "./Drawer";
import { ProgramInfo } from "./ProgramInfo";
import IProgramInfo from "../models/IProgramInfo";
import IArrayData from "../models/IArrayData";
import IGLWrapper from "../models/IGLWrapper";

export default class GLWrapper implements IGLWrapper{
  gl: WebGL2RenderingContext;

  lastUsedProgramInfo: IProgramInfo;
  programs: { [name: string]: IProgramInfo };

  constructor(gl: WebGL2RenderingContext) {
    if (!gl) {
      throw new Error("No webgl!");
    }
    this.gl = gl;
    

    this.programs = {};
  }
  ProgramInfo  = (()=> {
    const self = this;
    return class extends ProgramInfo{
      constructor(vertexShaderSource: string, fragmentShaderSource: string) {
        super(self, vertexShaderSource, fragmentShaderSource);
      }
    };
   
  })();
  PrimitiveRenderer = (() => {
    const self = this;
    return class extends PrimitiveRenderer {
      static fromArrayData(arrayData: IArrayData) {
        const primitiveRenderer = new PrimitiveRenderer(self.gl);
        primitiveRenderer
          .createVAO()
          .createGeometryBuffers(arrayData)
          .setAttributes();
        return primitiveRenderer;
      }
      constructor() {
        super(self.gl);
      }
    };
  })();
  Drawer = (() => {
    const self = this;
    return class extends Drawer {
      
      constructor() {
        super(self);
      }
    };
  })();
  TextureInfo = (() => {
    const self = this;
    return class extends TextureInfo {
      constructor() {
        super(self.gl);
      }
    };
  })();
  /*
  getLastUsedProgramInfo() {
    return this.renderCache.lastUsedProgramInfo;
  }
  setLastUsedProgram(programInfo) {
    this.renderCache.lastUsedProgramInfo = programInfo;
    return this;
  }
  */
  useProgramInfo(programInfo: IProgramInfo) {
    if (programInfo != this.lastUsedProgramInfo) {
      this.gl.useProgram(programInfo.program);
      this.lastUsedProgramInfo = programInfo;
    }
    return this;
  }
  resizeCanvasToDisplaySize(multiplier = 1) {
    const canvas = this.gl.canvas as HTMLCanvasElement;
    const width = (canvas.clientWidth * multiplier) | 0;
    const height = (canvas.clientHeight * multiplier) | 0;

    canvas.width = width;
    canvas.height = height;

    return this;
  }
  resizeCanvas(width: number, height: number) {
    const canvas = this.gl.canvas;
    canvas.width = width;
    canvas.height = height;
    return this;
  }
  setViewport() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    return this;
  }
  getContext() {
    return this.gl;
  }
}
