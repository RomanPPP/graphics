import { BufferAttributeInfo } from "./BufferAttribute";

import IDrawer from "../models/IDrawer";

import IArrayData from "../models/IArrayData";
import IBufferAttributeInfo from "../models/IBufferAttribute";
import IPrimitiveRenderer from "../models/IPrimitiveRenderer";
import IProgramInfo from "../models/IProgramInfo";
import Drawer from "./Drawer";
import { ProgramInfo } from "./ProgramInfo";
class PrimitiveRenderer implements IPrimitiveRenderer {
  bufferAttribs: { [id: string]: IBufferAttributeInfo };
  programInfo: IProgramInfo;
  gl: WebGL2RenderingContext;
  drawer: IDrawer;
  mode: GLuint;
  offset: GLint;
  numElements: GLuint;
  VAO: WebGLVertexArrayObject;
  componentType: GLenum;
  indices: WebGLBuffer;

  constructor(gl: WebGL2RenderingContext) {
    this.bufferAttribs = {};
    this.programInfo = null;
    this.gl = gl;
    this.drawer = null;
    this.mode = null;
    this.offset = null;
    this.numElements = null;
    this.VAO = null;
    this.componentType = null;
  }
  setContext(gl: WebGL2RenderingContext) {
    this.gl = gl;
    return this;
  }

  createVAO() {
    if (this.VAO) return this;
    this.VAO = this.gl.createVertexArray();
    return this;
  }
  setMode(mode: GLuint) {
    this.mode = mode;
    return this;
  }
  setIndices(arrayBuffer: Uint16Array) {
    const { gl, VAO } = this;

    gl.bindVertexArray(VAO);
    this.numElements = arrayBuffer.byteLength / 2;
    const indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrayBuffer, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    this.indices = indicesBuffer;
    return this;
  }
  createGeometryBuffers(arrayData: IArrayData) {
    const { gl } = this;

    const { attributes, indices, componentType, numElements, mode } = arrayData;
    this.numElements = numElements;
    this.mode = mode;
    this.componentType = componentType || 5123;

    if (attributes) {
      (Object.keys(attributes) as Array<keyof typeof attributes>).forEach(
        (attributeName) => {
          const attribProps = attributes[attributeName];
          const bufferAttributeInfo = new BufferAttributeInfo(gl, attribProps);
          bufferAttributeInfo.bufferData(attribProps.data);
          this.bufferAttribs[attributeName] = bufferAttributeInfo;
        }
      );
    }
    if (indices) {
      const indicesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
      this.indices = indicesBuffer;
    }
    return this;
  }
  setAttributes() {
    const { gl } = this;

    gl.bindVertexArray(this.VAO);
    for (const attrib in this.bufferAttribs) {
      const bufferAttributeInfo = this.bufferAttribs[attrib];
      bufferAttributeInfo.setAttribute();
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    gl.bindVertexArray(null);

    return this;
  }
  setDrawer(drawer: IDrawer) {
    this.drawer = drawer;
    return this;
  }
  setProgramInfo(programInfo: IProgramInfo) {
    this.programInfo = programInfo;
    return this;
  }
  createBufferAttribData({
    attribName,
    location,
    stride,
    numComponents,
    offset,
    type,
    divisor,
    attributeType,
  }: {
    attribName: string;
    location: GLuint;
    stride?: GLuint;
    numComponents: GLuint;
    offset?: GLint;
    type?: GLenum;
    divisor?: GLint;
    attributeType: GLenum;
  }) {
    const { gl } = this;

    const bufferAttribInfo = new BufferAttributeInfo(gl, {
      location,
      stride,
      numComponents,
      offset,
      type,
      divisor,
      attributeType,
    });
    this.bufferAttribs[attribName] = bufferAttribInfo;
    return this;
  }
  /*
  setBufferAttribData(name, bufferAttribData) {
    this.buffers = { ...this.buffers, [name]: bufferAttribData };
    return this;
  }
  */
  setAttribute(attribName: string) {
    const { gl } = this;
    const bufferAttribData = this.bufferAttribs[attribName];
    gl.bindVertexArray(this.VAO);
    bufferAttribData.setAttribute();
    gl.bindVertexArray(null);
    return this;
  }
  /*
  _setAttribute(bufferAttribData) {
    const { gl } = this;
    gl.bindVertexArray(this.vao);
    bufferAttribData.setAttribute();
    gl.bindVertexArray(null);
    return this;
  }
  */
  bufferData(attribName: string, data: BufferSource, usage?: GLenum) {
    const bufferAttribInfo = this.bufferAttribs[attribName];
    bufferAttribInfo.bufferData(data, usage);
    return this;
  }
  bufferSubData(attribName: string, data: BufferSource, offset: GLuint) {
    const bufferAttribInfo = this.bufferAttribs[attribName];
    bufferAttribInfo.bufferSubData(data, offset);
    return this;
  }
  allocBuffer(attribName: string, byteLength: GLuint, usage?: GLenum) {
    const bufferAttribInfo = this.bufferAttribs[attribName];
    bufferAttribInfo.allocBuffer(byteLength, usage);
    return this;
  }
  draw(uniforms : {[name : string] : number | Iterable<number>}, cameraMatrix : Iterable<number>) {
    this.drawer.draw(this, uniforms, cameraMatrix);
    return this;
  }
  drawInstanced(uniforms : {[name : string] : number | Iterable<number>}, cameraMatrix : Iterable<number>, numInstances : GLuint) {
    this.drawer.drawInstanced(this, uniforms, cameraMatrix, numInstances);
    return this;
  }
}

export default PrimitiveRenderer;
