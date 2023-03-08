import IArrayData from "./IArrayData";
import IProgramInfo from "./IProgramInfo";
import IBufferAttributeInfo from "./IBufferAttribute";
import IDrawer from "./IDrawer";
export default interface IPrimitiveRenderer {
  bufferAttribs: { [id: string]: IBufferAttributeInfo };
  programInfo: IProgramInfo;
  gl: WebGL2RenderingContext;
  drawer: IDrawer;
  mode: number;
  offset: number;
  numElements: number;
  VAO: WebGLVertexArrayObject;
  componentType: number;
  indices: WebGLBuffer;
  draw(
    uniforms: { [name: string]: number | Iterable<number> },
    cameraMatrix: Iterable<number>
  ): void;
  drawInstanced(
    uniforms: { [name: string]: number | Iterable<number> },
    cameraMatrix: Iterable<number>,
    numInstances: GLuint
  ): void;
}
