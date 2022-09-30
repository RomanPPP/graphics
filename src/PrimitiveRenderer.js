

import {createIndicesBuffer,BufferAttribDescriptor, DynamicBufferAttribDescriptor} from './buffersInfo'
import { ELEMENT_SIZE } from './enums'


const attribTypeProps = {
    'MAT4' : {
        stride : 64,
        byteLength : 64,
        type : 0x1406,
        numAttributes : 4,
        numComponents : 4,
    }
}
class PrimitiveRenderer{
    constructor(primitive){
        const { mode, numElements, offset} = primitive
        this.vao = null
        this.geometryBuffers = {}
        this.buffers = null
        this.dynamicBuffers = null
        this.programInfo = null
        this.primitive = primitive
        this.gl = null
        this.drawer = null
        this.mode = mode
        this.offset = offset
        this.numElements = numElements
    }
    setContext(gl){
        this.gl = gl
        return this
    }
    setDrawer(drawer){
        this.drawer = drawer
        return this
    }
    setProgramInfo(programInfo){
        this.programInfo = programInfo
        return this
    }
    bindGeometryBuffers(){
        const gl = this.gl
        const {attributes, indices, mode, numElements, offset} = this.primitive
        
        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)
        Object.keys(attributes).forEach(attributeName => {

            const bufferDesc = new BufferAttribDescriptor(gl, attributes[attributeName])
            this.geometryBuffers[attributeName] = bufferDesc
            bufferDesc.setAttributes()
            bufferDesc.bufferData(attributes[attributeName].data)
        })
        if(indices) this.geometryBuffers.indices = createIndicesBuffer(gl, indices)
        gl.bindVertexArray(null)
        return this
    }
    setBufferAttribData(name, type, numElements, location){
        const {gl, vao} = this
        const attribProps = attribTypeProps[type]
   
        const attributeProps = {...attribProps,  location}
        const bufferDesc = new BufferAttribDescriptor(gl, attributeProps)
        this.buffers = {...this.buffers,
             [name] : bufferDesc}
        
        bufferDesc.bufferData(null, numElements * attribProps.byteLength)
      
        return this
    }
    setDynamicBufferAttribData(name, type, numElements, location){
        const {gl, vao} = this
        const attribProps = attribTypeProps[type]
        const attributeProps = {...attribProps, byteLength : numElements * attribProps.byteLength, location}
        const bufferDesc = new DynamicBufferAttribDescriptor(gl, attributeProps)
        this.buffers = {...this.buffers,
             [name] : bufferDesc}
       
        return this
    }
    setAttributes(name, divisor){
        const bufferDesc = this.buffers[name]
        this.gl.bindVertexArray(this.vao)
        bufferDesc.setAttributes(divisor)
        this.gl.bindVertexArray(null)
        return this
    }
    bufferData(bufferName, data, byteLength){
        const bufferDesc = this.buffers[bufferName]
        bufferDesc.bufferData(data, byteLength)
        return this
    }
    bufferSubData(bufferName, data, offset){
        const bufferDesc = this.buffers[bufferName]
        bufferDesc.bufferSubData(data, offset)
        return this
    }
    draw( uniforms, cameraMatrix){
        
        this.drawer.draw(this, uniforms, cameraMatrix)
        return this
    }
    
    drawInstanced( uniforms, cameraMatrix, numInstances){
        
        this.drawer.drawInstanced( this, uniforms, cameraMatrix, numInstances)
        return this
    }
}

export default PrimitiveRenderer