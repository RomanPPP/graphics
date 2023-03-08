export default interface IBufferAttributeInfo {
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
  setAttribute(): void;
  bufferData(data: BufferSource | ArrayBufferView, usage: GLenum): void;
  allocBuffer(byteLength: GLint, usage: GLenum): void;
  bufferSubData(data: BufferSource | ArrayBufferView, offset: GLint): void;
}
