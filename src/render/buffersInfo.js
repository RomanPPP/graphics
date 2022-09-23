


const {getGLTypeForTypedArray} = require('./programm')

const createIndicesBuffer = indices =>{
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
    return buffer
}

class BufferInfo{
    constructor(info, buffer){ 
        this.buffer = gl.createBuffer() 
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)    
        gl.bufferData(gl.ARRAY_BUFFER, info.data  , 35044) 
        
         
        this.stride = info.stride || 0 
        this.numComponents =  info.numComponents
        this.numAttributes = info.numAttributes || 1
        this.offset = info.offset || 0
        this.type = info.type
        this.drawType = info.drawType
        this.byteLength = info.byteLength || info.data.byteLength
        this.location = info.location
    }
    
}
class DynamicBufferInfo {
    constructor(info){
        
       
        this.buffer = gl.createBuffer() 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)    
       
        gl.bufferData(gl.ARRAY_BUFFER, info.data || info.byteLength , gl.DYNAMIC_DRAW)
      
        this.stride = info.stride || 0 
        this.numComponents =  info.numComponents
        this.numAttributes = info.numAttributes || 1
        this.offset = info.offset || 0
        this.type = info.type || getGLTypeForTypedArray(gl, info.data)
        this.drawType = info.drawType
        this.byteLength = info.byteLength || info.data.byteLength
        this.location = info.location

    }
    update(data){
     
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
        gl.bufferSubData(gl.ARRAY_BUFFER,0, data)
     
    }
}

module.exports = {BufferInfo, DynamicBufferInfo, createIndicesBuffer} 