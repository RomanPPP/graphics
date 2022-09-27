

import {createIndicesBuffer, BufferInfo, DynamicBufferInfo} from './buffersInfo'


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
const buffersInfoFromPrimitive = (gl, primitive) =>{
    const buffersInfo = {attributes : {}}
    const attributes = primitive.attributes || {}
    Object.keys(attributes).forEach(attributeName => {
            buffersInfo.attributes[attributeName] = new BufferInfo(gl, primitive.attributes[attributeName])
            setAttributes(gl, buffersInfo.attributes[attributeName])
        })
    if(primitive.indices) buffersInfo.indices = createIndicesBuffer(gl, primitive.indices)
    else buffersInfo.indices = null
    buffersInfo.numElements = primitive.numElements || primitive.indices.length
        
    buffersInfo.mode = primitive.mode 
    buffersInfo.elementType = primitive.componentType
    buffersInfo.offset = primitive.offset 
    
    return buffersInfo
    
}
const attribTypeProps = {
    'MAT4' : {
        
    }
}
class PrimitiveRenderInfo{
    constructor(primitive){
        this.vao = null
        this.buffersInfo = null
        this.programInfo = null
        this.primitive = primitive
        this.gl = null
        this.drawer = null
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
    bindPrimitiveBuffers(){
        const gl = this.gl
        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)
        if(this.primitive){
           
            
            this.buffersInfo = buffersInfoFromPrimitive(gl, this.primitive)
           
        }
        gl.bindVertexArray(null)
        console.log(this)
        return this
    }
    bindInstancingBuffer( maxNumInstances = 10){
        const gl = this.gl
        if(!this.vao) throw new Error('No vao!')
        
        this.instancingBuffersInfo = {
            i_matrix : new DynamicBufferInfo(gl, {
                stride : 64,
                byteLength : 64 * maxNumInstances,
                type : gl.FLOAT,
                numAttributes : 4,
                numComponents : 4,
                location : 5
            }, this.vao)
        }
        gl.bindVertexArray(this.vao)
        setAttributes(gl, this.instancingBuffersInfo.i_matrix, 1)
        gl.bindVertexArray(null)
        return this
    }
    bindBuffer(name, type, location)
    draw( uniforms, cameraMatrix){
        const gl = this.gl
        this.drawer.draw(this, uniforms, cameraMatrix)
        return this
    }
    setInstancingData(data){
        const gl = this.gl
        gl.bindVertexArray(this.vao)
        this.instancingBuffersInfo.i_matrix.update(data)
        gl.bindVertexArray(null)
        return this
    }
    drawInstanced( uniforms, cameraMatrix, numInstances){
        
        this.drawer.drawInstanced( this, uniforms, cameraMatrix, numInstances)
        return this
    }
}

export default PrimitiveRenderInfo