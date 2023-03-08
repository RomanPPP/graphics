import {
  FLOAT,
  FLOAT_MAT2,
  FLOAT_MAT3,
  FLOAT_MAT4,
  FLOAT_VEC2,
  INT,
  TYPED_ARRAYS,
  FLOAT_VEC3,
  FLOAT_VEC4,
  UNSIGNED_INT,
  UNSIGNED_INT_VEC2,
  UNSIGNED_INT_VEC3,
  UNSIGNED_INT_VEC4,
  INT_VEC2,
  INT_VEC3,
  INT_VEC4,
  BOOL,
  BOOL_VEC2,
  BOOL_VEC3,
  BOOL_VEC4,
} from "./enums";

import IBufferAttributeInfo from "../models/IBufferAttribute";

const typeInfo: {
  [key: number]: { size: number; rows: number; cols: number };
} = {
  [FLOAT_MAT4]: { size: 64, rows: 4, cols: 4 },
  [FLOAT_MAT2]: { size: 32, rows: 2, cols: 2 },
  [FLOAT_MAT3]: { size: 48, rows: 3, cols: 3 },
};

const floatAttribSetter = ({
  numComponents,
  type,
  location,
  stride,
  offset,
  buffer,
  gl,
  divisor,
  normalize,
}: IBufferAttributeInfo) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(
    location,
    numComponents,
    type || gl.FLOAT,
    normalize || false,
    stride || 0,
    offset || 0
  );

  gl.vertexAttribDivisor(location, divisor || 0);
};

const matAttribSetter = ({
  numComponents,
  type,
  location,
  offset,
  buffer,
  gl,
  divisor,
  normalize,
  attributeType,
}: IBufferAttributeInfo) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const stride = typeInfo[attributeType].size;
  const count = typeInfo[attributeType].rows;
  const rowOffset = stride / count;
  for (let i = 0; i < count; i++) {
    gl.enableVertexAttribArray(location + i);
    gl.vertexAttribPointer(
      location,
      numComponents,
      type || gl.FLOAT,
      normalize || false,
      stride || 0,
      offset + rowOffset * i
    );
    gl.vertexAttribDivisor(location + i, divisor || 0);
  }
};

const intAttribSetter = ({
  numComponents,
  type,
  location,
  stride,
  offset,
  buffer,
  gl,
  divisor,
}: IBufferAttributeInfo) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  gl.enableVertexAttribArray(location);
  gl.vertexAttribIPointer(
    location,
    numComponents,
    type || gl.INT,
    stride || 0,
    offset || 0
  );

  gl.vertexAttribDivisor(location, divisor || 0);
};

const attribTypeMap: {
  [id: number]: (BufferAttribute: IBufferAttributeInfo) => void;
} = {};

attribTypeMap[INT] = intAttribSetter;
attribTypeMap[FLOAT] = floatAttribSetter;
attribTypeMap[FLOAT_VEC2] = floatAttribSetter;
attribTypeMap[FLOAT_VEC3] = floatAttribSetter;
attribTypeMap[FLOAT_VEC4] = floatAttribSetter;
attribTypeMap[FLOAT_MAT2] = matAttribSetter;
attribTypeMap[FLOAT_MAT3] = matAttribSetter;
attribTypeMap[FLOAT_MAT4] = matAttribSetter;
attribTypeMap[UNSIGNED_INT] = intAttribSetter;
attribTypeMap[UNSIGNED_INT_VEC2] = intAttribSetter;
attribTypeMap[UNSIGNED_INT_VEC3] = intAttribSetter;
attribTypeMap[UNSIGNED_INT_VEC3] = intAttribSetter;
attribTypeMap[UNSIGNED_INT_VEC4] = intAttribSetter;
attribTypeMap[INT_VEC2] = intAttribSetter;
attribTypeMap[INT_VEC3] = intAttribSetter;
attribTypeMap[INT_VEC4] = intAttribSetter;
attribTypeMap[BOOL] = intAttribSetter;
attribTypeMap[BOOL_VEC2] = intAttribSetter;
attribTypeMap[BOOL_VEC3] = intAttribSetter;
attribTypeMap[BOOL_VEC4] = intAttribSetter;

class BufferAttributeInfo implements IBufferAttributeInfo {
  gl: WebGL2RenderingContext;
  buffer: WebGLBuffer;
  stride?: GLenum;
  numComponents: number;
  offset?: GLenum;
  type?: GLenum;
  location: GLenum;
  divisor?: GLuint;
  normalize?: boolean;
  attributeType: GLenum;
  constructor(gl: WebGL2RenderingContext, {
    
    stride,
    type,
    offset,
    location,
    numComponents,
    attributeType,
    divisor
  }: {
    
    stride?: GLuint;
    numComponents: GLuint;
    offset?: GLint;
    type?: GLenum;
    location: GLuint;
    divisor?: GLint;
    attributeType: GLenum;
  }) {
    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.stride = stride
    this.numComponents = numComponents;
    this.attributeType = attributeType;
    this.offset = offset
    this.type = type;
    this.location = location;
    this.divisor = divisor;
  }
  setAttribute() {
    const { attributeType } = this;
    const setter = attribTypeMap[attributeType];
    setter(this);
  }
  bufferData(data: BufferSource | ArrayBufferView, usage: GLenum = 0x88e4) {
    const { gl, buffer } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
  }
  allocBuffer(byteLength: GLint, usage: GLenum = 0x88e4) {
    const { gl, buffer } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, byteLength, usage);
  }
  bufferSubData(data: BufferSource | ArrayBufferView, offset: GLint = 0) {
    const { gl, buffer } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
  }
}

export { BufferAttributeInfo };
