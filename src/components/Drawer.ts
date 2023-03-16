import { m4, mat3, mat4 } from "romanpppmath";
import IGLWrapper from "../models/IGLWrapper";
import IPrimitiveRenderer from "../models/IPrimitiveRenderer";
const degToRad = (d : number) : number => (d * Math.PI) / 180;

const fieldOfViewRadians = degToRad(90);

class Drawer {
  context: IGLWrapper;
  projectionMatrix: mat4;
  static create3dProjectionMatrix(
    zNear: number,
    zFar: number,
    clientWidth : number,
    clientHeight : number
  ): mat4{
   
    const aspect = clientWidth / clientHeight;
    return m4.perspective(
      fieldOfViewRadians,
      aspect,
      zNear,
      zFar
    );
  }

  constructor(context: IGLWrapper) {
    this.context = context;
    this.projectionMatrix = null;
  }

  setContext(glContextWrapper: IGLWrapper) {
    this.context = glContextWrapper;
    return this;
  }

  draw(
    primitiveRenderer: IPrimitiveRenderer,
    uniforms: { [id: string]: Iterable<number> | number | mat4 | mat3, u_matrix : mat4 },
    cameraMatrix: mat4
  ) {
    const {
      VAO,
      mode,
      offset,
      numElements,
      indices,
      programInfo,
      componentType,
    } = primitiveRenderer;

    const { projectionMatrix } = this;
    const { gl } = this.context;
    const viewMatrix = m4.inverse(cameraMatrix);
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    const u_worldViewProjection = m4.multiply(
      viewProjectionMatrix,
      uniforms.u_matrix
    );

    this.context.useProgramInfo(programInfo);
    this.context
      .lastUsedProgramInfo
      .setUniforms({ ...uniforms, u_worldViewProjection });
    gl.bindVertexArray(VAO);

    if (!indices) {
     
      gl.drawArrays(mode, offset, numElements);
      return;
    }
    gl.drawElements(mode, numElements, componentType, offset);
  }

  drawInstanced(
    primitiveRenderer: IPrimitiveRenderer,
    uniforms : { [id: string]: Iterable<number> | number | mat4 | mat3, u_matrix : mat4 },
    cameraMatrix: mat4,
    numInstances: GLuint
  ) {
    const {
      VAO,
      mode,
      offset,
      numElements,
      indices,
      programInfo,
      componentType,
    } = primitiveRenderer;
    const { projectionMatrix } = this;
    const { gl } = this.context;
    const viewMatrix = m4.inverse(cameraMatrix);
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    const worldViewProjection = m4.multiply(
      viewProjectionMatrix,
      uniforms.u_matrix
    );
    const worldMatrix = uniforms.u_matrix;
    this.context.useProgramInfo(programInfo);
    this.context.
    lastUsedProgramInfo
      .setUniforms({ ...uniforms, worldMatrix, worldViewProjection });
    gl.bindVertexArray(VAO);

    if (!indices) {
      gl.drawArraysInstanced(mode, offset, numElements, numInstances);
      return;
    }
    
    gl.drawElementsInstanced(
      mode,
      numElements,
      gl.UNSIGNED_SHORT,
      offset,
      numInstances
    );
  }
}
export default Drawer;
