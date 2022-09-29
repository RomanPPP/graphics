
import {m4} from 'math'


  
 
    function degToRad(d) {
        return d * Math.PI / 180;
    }
    var fieldOfViewRadians = degToRad(90);

const renderCache = {
    lastUsedProgramInfo : null,
    lastUsedBufferInfo : null
}

class Drawer{
  constructor(){
    this.gl = null
    this.projectionMatrix = null
  }
  setContext(gl){
    this.gl = gl
    const zNear = 0.01
    const zFar = 2000
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
   
    this.projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)
  }
  getViewProjectionMatrix(cameraMatrix){
    const {gl, projectionMatrix} = this
    const viewMatrix = m4.inverse(cameraMatrix)
    return m4.multiply(projectionMatrix, viewMatrix)
  }
  draw(renderInfo, uniforms,  cameraMatrix){
    const viewProjectionMatrix = this.getViewProjectionMatrix(cameraMatrix)
    const {vao, mode, offset, numElements, geometryBuffers} = renderInfo
    const {gl} = this 
    if(renderCache.lastUsedProgramInfo != renderInfo.programInfo){
      renderCache.lastUsedProgramInfo = renderInfo.programInfo
      gl.useProgram(renderCache.lastUsedProgramInfo.program)
    }
    const worldViewProjection = m4.multiply(viewProjectionMatrix, uniforms.u_matrix)
    const worldMatrix = uniforms.u_matrix
    renderCache.lastUsedProgramInfo.setUniforms({...uniforms, worldMatrix, worldViewProjection})
    if(vao)gl.bindVertexArray(vao)
    if(!geometryBuffers.indices){
      //console.log(buffersInfo)
      gl.drawArrays(mode, offset, numElements)
      return
    }
    gl.drawElements(mode, numElements, elementType, 0)
  
  }
  drawInstanced(renderInfo, uniforms, cameraMatrix, numInstances){
    const viewProjectionMatrix = this.getViewProjectionMatrix(cameraMatrix)
    const {gl} = this 
    const {vao, mode, offset, numElements, geometryBuffers} = renderInfo
    if(renderCache.lastUsedProgramInfo != renderInfo.programInfo){
      renderCache.lastUsedProgramInfo = renderInfo.programInfo
      gl.useProgram(renderCache.lastUsedProgramInfo.program)
    }
    const worldViewProjection = m4.multiply(viewProjectionMatrix, uniforms.u_matrix)
    const worldMatrix = uniforms.u_matrix
    renderCache.lastUsedProgramInfo.setUniforms({...uniforms, worldViewProjection, worldMatrix})
    gl.bindVertexArray(vao)
    if(!geometryBuffers.indices){
      //console.log(buffersInfo)
      gl.drawArraysInstanced(mode, offset,numElements, numInstances)
      return
    }
    gl.drawElementsInstanced(mode, numElements, gl.UNSIGNED_SHORT, 0, numInstances)
  }
}
export default Drawer

