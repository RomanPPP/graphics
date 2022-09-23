
const m4 = require('../m4')
function resizeCanvasToDisplaySize(canvas, multiplier) {
  multiplier = multiplier || 1;
  const width  = canvas.clientWidth  * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;
  if (canvas.width !== width ||  canvas.height !== height) {
    canvas.width  = width;
    canvas.height = height;
    return true;
  }
  return false;
}

  
 
    function degToRad(d) {
        return d * Math.PI / 180;
    }
    var fieldOfViewRadians = degToRad(90);

const zNear = 0.01;
const zFar = 2000;
var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)

const renderCache = {
    lastUsedProgramInfo : null,
    lastUsedBufferInfo : null
}


const render = (renderInfo, uniforms,  cameraMatrix) => {
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

const renderInstances = (renderInfo, uniforms, cameraMatrix, numInstances) =>{
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

module.exports = { resizeCanvasToDisplaySize, render, renderInstances}

