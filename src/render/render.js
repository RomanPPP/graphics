
import {m4} from 'math'


  
 
    function degToRad(d) {
        return d * Math.PI / 180;
    }
    var fieldOfViewRadians = degToRad(90);

const renderCache = {
    lastUsedProgramInfo : null,
    lastUsedBufferInfo : null
}


const render = (gl, renderInfo, uniforms,  cameraMatrix) => {
  const viewMatrix = m4.inverse(cameraMatrix)
  const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)
  if(renderCache.lastUsedProgramInfo != renderInfo.programInfo){
    renderCache.lastUsedProgramInfo = renderInfo.programInfo
    gl.useProgram(renderCache.lastUsedProgramInfo.program)
  }
  const u_matrix = m4.multiply(viewProjectionMatrix, uniforms.u_matrix)
  renderCache.lastUsedProgramInfo.setUniforms({...uniforms, u_matrix})
  gl.bindVertexArray(renderInfo.vao)
  
  gl.drawElements(renderInfo.buffersInfo.type, renderInfo.buffersInfo.numElements, renderInfo.buffersInfo.elementType, 0)
}

const renderInstances = (gl, renderInfo, uniforms, cameraMatrix, numInstances) =>{
  const viewMatrix = m4.inverse(cameraMatrix)
  const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)
  if(renderCache.lastUsedProgramInfo != renderInfo.programInfo){
    renderCache.lastUsedProgramInfo = renderInfo.programInfo
    gl.useProgram(renderCache.lastUsedProgramInfo.program)
  }
  const u_matrix = m4.multiply(viewProjectionMatrix, uniforms.u_matrix)
  renderCache.lastUsedProgramInfo.setUniforms({...uniforms, u_matrix})
  gl.bindVertexArray(renderInfo.vao)
 
  gl.drawElementsInstanced(renderInfo.buffersInfo.type, renderInfo.buffersInfo.numElements, gl.UNSIGNED_SHORT, 0, numInstances)
  
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
  draw(renderInfo, uniforms,  cameraMatrix){
    const {gl, projectionMatrix} = this
    const viewMatrix = m4.inverse(cameraMatrix)
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)
    if(renderCache.lastUsedProgramInfo != renderInfo.programInfo){
      renderCache.lastUsedProgramInfo = renderInfo.programInfo
      gl.useProgram(renderCache.lastUsedProgramInfo.program)
    }
    const u_matrix = m4.multiply(viewProjectionMatrix, uniforms.u_matrix)
    renderCache.lastUsedProgramInfo.setUniforms({...uniforms, u_matrix})
    gl.bindVertexArray(renderInfo.vao)
    
    gl.drawElements(renderInfo.buffersInfo.type, renderInfo.buffersInfo.numElements, renderInfo.buffersInfo.elementType, 0)
  
  }
  drawInstanced(renderInfo, uniforms, cameraMatrix, numInstances){
    const {gl, projectionMatrix} = this
    const viewMatrix = m4.inverse(cameraMatrix)
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)
    if(renderCache.lastUsedProgramInfo != renderInfo.programInfo){
      renderCache.lastUsedProgramInfo = renderInfo.programInfo
      gl.useProgram(renderCache.lastUsedProgramInfo.program)
    }
    const u_matrix = m4.multiply(viewProjectionMatrix, uniforms.u_matrix)
    renderCache.lastUsedProgramInfo.setUniforms({...uniforms, u_matrix})
    gl.bindVertexArray(renderInfo.vao)
  
    gl.drawElementsInstanced(renderInfo.buffersInfo.type, renderInfo.buffersInfo.numElements, gl.UNSIGNED_SHORT, 0, numInstances)
  
  }
}
export default Drawer

