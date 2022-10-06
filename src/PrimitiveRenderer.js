

import {createIndicesBuffer,BufferAttribute, DynamicBufferAttribDescriptor, BufferController, AttributeSetter} from './BufferAttribute'
import { ELEMENT_SIZE } from './enums'
import { getGLTypeForTypedArray } from './programInfo'
import getAttributePropsByType from './attribTypeProps'


class PrimitiveRenderer{
    constructor(arrayData){
        this.buffers = {}
        this.programInfo = null
        this.gl = null
        this.drawer = null
        this.mode = null
        this.offset = null
        this.numElements = null
        this.vao = null
        this.componentType = null
        this.arrayData = arrayData
    }
    setContext(gl){
        this.gl = gl
        return this
    }
    createGeometryBuffers(){
        const {arrayData, gl} = this
        const {attributes, indices, componentType, numElements, mode} = arrayData
        this.numElements = numElements
        this.mode = mode
        if(componentType) this.componentType = componentType
        Object.keys(attributes).forEach(attributeName => {
            const {stride, type, offset, location, numComponents, numAttributes, data, size} = attributes[attributeName]
            const bufferAttributeDescriptor = new BufferAttribute(gl, {stride, type, offset, location, numAttributes, numComponents, size})
            bufferAttributeDescriptor.bufferData(data)
            this.buffers = {...this.buffers, [attributeName] : bufferAttributeDescriptor}
        })
        if(indices){
            const indicesBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
            this.indices = indicesBuffer
        }
        return this
    }
    setAttributes(){
        const gl = this.gl
        const vao = gl.createVertexArray()
        this.gl.bindVertexArray(vao)
        for(const attrib in this.buffers){
            const bufferAttributeDescriptor = this.buffers[attrib]
            bufferAttributeDescriptor.setAttribute()
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices)
        this.gl.bindVertexArray(null)
        this.vao = vao
        
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
    createBufferAttribData(name, type, params){
        const {gl} = this
        const attribProps = getAttributePropsByType(type)
        const attributeProps = {...attribProps,  ...params}
        const bufferAttribData = new BufferAttribute(gl, attributeProps)
        this.buffers = {...this.buffers,
             [name] : bufferAttribData}
        return this
    }
    setBufferAttribData(name, bufferAttribData){
        this.buffers = {...this.buffers,
             [name] : bufferAttribData}
        return this
    }
    setOwnAttribute(name, divisor){
        const bufferAttribData = this.buffers[name]
        this.gl.bindVertexArray(this.vao)
        bufferAttribData.setAttribute(divisor)
        this.gl.bindVertexArray(null)
        return this
    }
    setAttribute(bufferAttribData){
        this.gl.bindVertexArray(this.vao)
        bufferAttribData.setAttribute()
        this.gl.bindVertexArray(null)
        return this
    }
    bufferData(bufferName, data, byteLength, usage){
        const bufferAttribData = this.buffers[bufferName]
        bufferAttribData.bufferData(data, byteLength, usage)
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
        this.drawer.drawInstanced(this, uniforms, cameraMatrix, numInstances)
        return this
    }
}

export default PrimitiveRenderer