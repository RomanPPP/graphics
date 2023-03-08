import IWebGLWrapper from "./IGLWrapper";
import IPrimitiveRenderer from "./IPrimitiveRenderer";

export default interface IDrawer {
  context: IWebGLWrapper;
  projectionMatrix: ArrayLike<number>;
  draw(
    primitiveRenderer: IPrimitiveRenderer,
    uniforms: { [id: string]: Iterable<number> | number },
    cameraMatrix: Iterable<Number>
  ): void;
  drawInstanced(
    primitiveRenderer: IPrimitiveRenderer,
    uniforms: { [id: string]: Iterable<number> | number },
    cameraMatrix: Iterable<Number>,
    numInstances: GLuint
  ): void;
}
