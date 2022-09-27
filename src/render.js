
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
    const {vao, buffersInfo} = renderInfo
    const {gl} = this 
    if(renderCache.lastUsedProgramInfo != renderInfo.programInfo){
      renderCache.lastUsedProgramInfo = renderInfo.programInfo
      gl.useProgram(renderCache.lastUsedProgramInfo.program)
    }
    const u_matrix = m4.multiply(viewProjectionMatrix, uniforms.u_matrix)
    renderCache.lastUsedProgramInfo.setUniforms({...uniforms, u_matrix})
    if(vao)gl.bindVertexArray(vao)
    if(!buffersInfo.indices){
      //console.log(buffersInfo)
      gl.drawArrays(buffersInfo.mode, buffersInfo.offset, buffersInfo.numElements)
      return
    }
    gl.drawElements(buffersInfo.mode, buffersInfo.numElements, buffersInfo.elementType, 0)
  
  }
  drawInstanced(renderInfo, uniforms, cameraMatrix, numInstances){
    const viewProjectionMatrix = this.getViewProjectionMatrix(cameraMatrix)
    const {gl} = this 
    const {vao, buffersInfo} = renderInfo
    if(renderCache.lastUsedProgramInfo != renderInfo.programInfo){
      renderCache.lastUsedProgramInfo = renderInfo.programInfo
      gl.useProgram(renderCache.lastUsedProgramInfo.program)
    }
    const u_matrix = m4.multiply(viewProjectionMatrix, uniforms.u_matrix)
    renderCache.lastUsedProgramInfo.setUniforms({...uniforms, u_matrix})
    gl.bindVertexArray(vao)
    if(!buffersInfo.indices){
      //console.log(buffersInfo)
      gl.drawArraysInstanced(buffersInfo.mode, buffersInfo.offset, buffersInfo.numElements, numInstances)
      return
    }
    gl.drawElementsInstanced(buffersInfo.mode, buffersInfo.numElements, gl.UNSIGNED_SHORT, 0, numInstances)
  }
}
export default Drawer

