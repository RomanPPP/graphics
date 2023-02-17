import { TextureInfo } from "./TextureInfo";
import PrimitiveRenderer from "./PrimitiveRenderer";
import { MeshRenderer } from "./MeshRenderer";
import Drawer from "./Drawer";
import { ProgramInfo } from "./ProgramInfo";


const requestCORSIfNotSameOrigin = (img, url) =>{
  if ((new URL(url, window.location.href)).origin !== window.location.origin) {
    img.crossOrigin = "";
  }
}

export default class GLcontextWrapper {
  constructor(canvas_id) {
    const canvas = document.querySelector(`#${canvas_id}`);
    const gl = canvas.getContext("webgl2");

    if (!gl) {
      throw new Error("No webgl!");
    }
    this.gl = gl;
    this.textures = {};
    this.renderCache = {
      lastUsedProgramInfo: null,
    };
    this.programs = {};


    const self = this;
    this.PrimitiveRenderer = class extends PrimitiveRenderer {
      constructor(arrayData) {
        super(gl, arrayData);
      }
    };

    this.Drawer = class extends Drawer {
      constructor() {
        super(self);
      }
    };

    this.ProgramInfo = class extends ProgramInfo {
      constructor(vs, fs) {
        super(self, vs, fs);
      }
    };
    this.TextureInfo = class extends TextureInfo{
      constructor(numFaceX, numFaceY){
        super(gl, numFaceX, numFaceY)
      }
    }
  }
  getLastUsedProgramInfo() {
    return this.renderCache.lastUsedProgramInfo;
  }
  setLastUsedProgram(programInfo) {
    this.renderCache.lastUsedProgramInfo = programInfo;
    return this;
  }
  useProgramInfo(programInfo) {
    if (programInfo != this.getLastUsedProgramInfo()) {
      this.gl.useProgram(programInfo.program);
      this.setLastUsedProgram(programInfo);
    }
    return this;
  }
  resizeCanvasToDisplaySize(multiplier = 1) {
    const canvas = this.gl.canvas;
    const width = (canvas.clientWidth * multiplier) | 0;
    const height = (canvas.clientHeight * multiplier) | 0;

    canvas.width = width;
    canvas.height = height;

    return this;
  }
  resizeCanvas(width, height) {
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

  createTextureFromImage(image, name) {
    const { gl } = this;
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 255])
    );
    this.textures[name] = texture;
  }
  createTextureFromURL(url, name, cb){
    const {gl} = this
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var img = new Image();
    img.addEventListener('load', function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
    });
    requestCORSIfNotSameOrigin(img, url);
    img.src = url;
    this.textures[name] = texture
    return texture
  }
  setTextureUnit(textureName, unitNum) {
    const texture = this.textures[textureName];
    if (!texture) throw new Error("No such texture!");
    gl.activeTexture(gl.TEXTURE0 + unitNum);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    return this;
  }
}
