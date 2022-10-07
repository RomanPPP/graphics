
import getAttributePropsByType from './attribTypeProps'
import attribTypeProps from './attribTypeProps'
import {BufferAttribute} from './BufferAttribute'
class MeshRenderer{
    constructor({primitives, name}){
        this.primitives = primitives
        this.name = name
        this.context = null
        this.buffers = {}
    }
    setContext(glContextWrapper){
        this.context = glContextWrapper
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].setContext(glContextWrapper)
        }
        return this
    }
    setProgramInfo(programInfo){
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].setProgramInfo(programInfo)
        }
        return this
    }
    setDrawer(drawer){
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].setDrawer(drawer)
        }
        return this
    }
    draw(uniforms, cameraMatrix){
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].draw(uniforms, cameraMatrix)
        }
        return this
    }
    drawInstanced(uniforms, cameraMatrix, numInstances){
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].drawInstanced(uniforms, cameraMatrix, numInstances)
        }
        return this
    }
    createPrimitiveBuffers(){
        this.primitives.forEach(primitive => primitive.createGeometryBuffers())
        return this
    }
    createBufferAttribData(name, type, params){
        const {gl} = this.context
        const attribProps = getAttributePropsByType(type)
        const attributeProps = {...attribProps,  ...params}
        const bufferAttribData = new BufferAttribute(gl, attributeProps)
        this.buffers = {...this.buffers,
             [name] : bufferAttribData}
        return this
    }
    bufferData(bufferName, data, byteLength){
        const bufferAttributeDescriptor = this.buffers[bufferName]
        
        bufferAttributeDescriptor.bufferData(data, byteLength)
        return this
    }
    bufferSubData(bufferName, data, offset){
        const bufferAttributeDescriptor = this.buffers[bufferName]
        bufferAttributeDescriptor.bufferSubData(data, byteLength, offset)
        return this
    }
    setAttribute(name){
        const bufferAttribData = this.buffers[name]
        this.primitives.forEach(primitive => primitive.setAttribute(bufferAttribData))
        return this
    }
    setPrimitiveAttributes(){
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].setAttributes()
        }
        return this
    }
    
}
class SkinnedMeshRenderer{
    constructor(primitives, skin){
        this.primitives = primitives
        this.skin = skin
    }
    draw(uniforms, cameraMatrix){
        this.skin.update(uniforms.u_matrix)
        const _uniforms = {u_jointTexture: this.skin.jointTexture,
            u_numJoints: this.skin.joints.length, ...uniforms}
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].draw(_uniforms, cameraMatrix)
        }
    }
}
export {MeshRenderer, SkinnedMeshRenderer}