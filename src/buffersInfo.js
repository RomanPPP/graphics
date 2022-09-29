


import {getGLTypeForTypedArray} from './programInfo'

const createIndicesBuffer = (gl, indices) =>{
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
    return buffer
}
const floatAttribSetter = (gl, bufferInfo, divisor) =>{
    const {numComponents, type, buffer, location, numAttributes, stride, offset} = bufferInfo
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    for(let i = 0; i < numAttributes; i++){
        const _offset = 16 * i
        gl.enableVertexAttribArray(location + i)
        gl.vertexAttribPointer(location + i, numComponents, type, false, stride, offset + _offset)

        if(divisor != undefined)gl.vertexAttribDivisor(location + i, divisor);        
    }
}
const intAttribSetter = (gl, bufferInfo, divisor) =>{
    const {numComponents, type, buffer, location, numAttributes, stride, offset} = bufferInfo
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    for(let i = 0; i < numAttributes; i++){
        const _offset =  4 * numComponents * i
        gl.enableVertexAttribArray(location + i)
        gl.vertexAttribIPointer(location + i, numComponents, type, false, stride, offset + _offset) 
        if(divisor != undefined) gl.vertexAttribDivisor(location + i, divisor);        
    }
}
const attribTypeMap = {}
attribTypeMap[0x1400] = intAttribSetter
attribTypeMap[0x1406] = floatAttribSetter
attribTypeMap[0x1401] =  intAttribSetter
attribTypeMap[0x1404] = intAttribSetter
attribTypeMap[0x1405] =  intAttribSetter
attribTypeMap[0x1402] =  intAttribSetter
attribTypeMap[0x1403] =  intAttribSetter

const setAttributes = (gl, bufferInfo,  divisor) =>{
    const {type} = bufferInfo
    const setter = attribTypeMap[type]
    setter(gl, bufferInfo, divisor)
}

class BufferAttribDescriptor{
    constructor(gl, info){ 
        this.gl = gl 
        this.buffer = gl.createBuffer() 
        this.stride = info.stride || 0 
        this.numComponents =  info.numComponents
        this.numAttributes = info.numAttributes || 1
        this.offset = info.offset || 0
        this.type = info.type || getGLTypeForTypedArray(gl, info.data)
        this.location = info.location
    }
    setAttributes(divisor){
        const {type, gl } = this
        const setter = attribTypeMap[type]
        setter(gl, this, divisor)
    }
    bufferData(data, byteLength){
        const {gl, buffer} = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)    
        gl.bufferData(gl.ARRAY_BUFFER, data || byteLength , gl.STATIC_DRAW) 
    }
    bufferSubData(data, offset = 0){
        const {gl, buffer} = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, data)
    }
    
}
class DynamicBufferAttribDescriptor extends BufferAttribDescriptor {
    
    bufferData(data, byteLength){
        const {gl, buffer} = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)    
        gl.bufferData(gl.ARRAY_BUFFER, data || byteLength, gl.DYNAMIC_DRAW) 
    }
    
}

export {BufferAttribDescriptor, DynamicBufferAttribDescriptor, createIndicesBuffer} 