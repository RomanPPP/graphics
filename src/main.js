import {m4} from 'math'
const cPos = [0,0,5]
const cRot = [0,0,0]
const controls = {
    ArrowDown : ()=> cRot[0] -= 0.1 ,
    ArrowUp : () => cRot[0] += 0.1 ,
    ArrowLeft : () => cRot[1] += 0.1,
    ArrowRight : () => cRot[1] -=0.1 ,
    w : () => {
        const delta = m4.transformPoint(m4.xRotate(m4.yRotation(cRot[1]), cRot[0]),[0,0,-1])
        cPos[0] += delta[0]
        cPos[1] += delta[1]
        cPos[2] += delta[2]
        
    } ,
    s : () => {
        const delta = m4.transformPoint(m4.xRotate(m4.yRotation(cRot[1]), cRot[0]),[0,0,1])
        cPos[0] += delta[0]
        cPos[1] += delta[1]
        cPos[2] += delta[2]
        
    } ,
    a : () => {
        const delta = m4.transformPoint(m4.xRotate(m4.yRotation(cRot[1]), cRot[0]),[-1,0,0])
        cPos[0] += delta[0]
        cPos[1] += delta[1]
        cPos[2] += delta[2]
        
    } ,
    d : () => {
        const delta = m4.transformPoint(m4.xRotate(m4.yRotation(cRot[1]), cRot[0]),[1,0,0])
        cPos[0] += delta[0]
        cPos[1] += delta[1]
        cPos[2] += delta[2]
        
    }
}
const mouseControls = {
    lastX : 0,
    lastY : 0,
    mousemove : function(e){
        
        const deltaX = e.offsetX - this.lastX 
        this.lastX = e.offsetX
        const deltaY = e.offsetY -  this.lastY
        this.lastY = e.offsetY
        
        cRot[1] -= deltaX*0.005
        cRot[0] -= deltaY*0.005
    }
}
document.onkeydown = e =>{
    if(!controls[e.key]) return
    controls[e.key]()
}
document.onmousedown = (e) =>{
    mouseControls.lastY = e.offsetY
    mouseControls.lastX = e.offsetX
    document.onmousemove = mouseControls.mousemove.bind(mouseControls)
    document.onmouseup = ()=>{
       
        document.onmousemove = null
    }
}
let cameraMatrix = m4.translation(...cPos)
cameraMatrix = m4.yRotate(cameraMatrix, cRot[1])
cameraMatrix = m4.xRotate(cameraMatrix, cRot[0])


import { ArrayDataFromGltf, PrimitiveRenderInfoFromArrayData, getGlContext, resizeCanvasToDisplaySize, ProgramInfo, MeshRenderer, Drawer, createBoxGeometry } from '.'
import {vert, frag} from './render/shaders/defaultShader'

const gl = getGlContext()
resizeCanvasToDisplaySize(gl.canvas, 1)


const drawer = new Drawer()
drawer.setContext(gl)
const programInfo = new ProgramInfo(vert, frag)
programInfo.compileShaders(gl).createUniformSetters()
const data = createBoxGeometry()
const arrayData = ArrayDataFromGltf(data.gltf, data.binaryBuffers)
const primitives = PrimitiveRenderInfoFromArrayData(arrayData)

const primitive = primitives.meshes[0].PrimitiveRenderInfos[0]

primitive.setContext(gl).setDrawer(drawer).setProgramInfo(programInfo).bindBuffers()



const uniforms = { u_lightWorldPosition : [0,5,0], u_ambientLight : [1,0.2,0.3,1]}
console.log(gl)
const loop = ()=>{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)
    
    cameraMatrix = m4.translation(...cPos)
    cameraMatrix = m4.yRotate(cameraMatrix, cRot[1])
    cameraMatrix = m4.xRotate(cameraMatrix, cRot[0])
    primitive.draw({...uniforms, u_matrix : m4.identity(), u_color : [1,0,1,1]}, cameraMatrix)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    requestAnimationFrame(loop)
}
loop()