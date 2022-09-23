
const {LinedBoxGeometry, createBoxGeometry, axisLines} = require('./primitives')
const {ProgrammInfo} = require('./programm')
const {createIndicesBuffer, BufferInfo, DynamicBufferInfo} = require('./buffersInfo')

const linedBox = LinedBoxGeometry()
const box = createBoxGeometry()


const floatAttribSetter = (bufferInfo, divisor) =>{
    const {numComponents, type, buffer, location, numAttributes, stride, offset} = bufferInfo
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    for(let i = 0; i < numAttributes; i++){
        const _offset = 16 * i
        gl.enableVertexAttribArray(location + i)
        gl.vertexAttribPointer(location + i, numComponents, type, false, stride, offset + _offset)

        if(divisor != undefined)gl.vertexAttribDivisor(location + i, divisor);        
    }
}
const intAttribSetter = (bufferInfo, divisor) =>{
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
attribTypeMap[gl.BYTE] = intAttribSetter
attribTypeMap[gl.FLOAT] = floatAttribSetter
attribTypeMap[gl.UNSIGNED_BYTE] =  intAttribSetter
attribTypeMap[gl.INT] = intAttribSetter
attribTypeMap[gl.UNSIGNED_INT] =  intAttribSetter
attribTypeMap[gl.SHORT] =  intAttribSetter
attribTypeMap[gl.UNSIGNED_SHORT] =  intAttribSetter

const setAttributes = (bufferInfo,  divisor) =>{
    const {type} = bufferInfo
    const setter = attribTypeMap[type]
    setter(bufferInfo, divisor)
}
const buffersInfoFromPrimitive = (primitive) =>{
    const buffersInfo = {attributes : {}}
    
    Object.keys(primitive.attributes).forEach(attributeName => {
            buffersInfo.attributes[attributeName] = new BufferInfo(primitive.attributes[attributeName])
            setAttributes(buffersInfo.attributes[attributeName])
        })
    if(primitive.indices) buffersInfo.indices = createIndicesBuffer(primitive.indices)
    buffersInfo.numElements = primitive.numElements || primitive.indices.length
   
    buffersInfo.type = primitive.type || gl.TRIANGLES 
    buffersInfo.elementType = primitive.componentType
    return buffersInfo
    
}


const { render, renderInstances} = require('./render')
const defaultShaders = require('./shaders/defaultShader')
const defaultTextShaders = require('./shaders/textureShader')
const defaultProgram = new ProgrammInfo(defaultShaders.vert, defaultShaders.frag)
const defaultTextProgram = new ProgrammInfo(defaultTextShaders.vert, defaultTextShaders.frag)

class PrimitiveRenderInfo{
    constructor(primitive, programInfo){
        this.vao = null
        this.buffersInfo = null
        this.programInfo = programInfo || defaultProgram
        this.primitive = primitive
        
    }
    bindBuffers(){
        if(this.primitive){
            this.vao = gl.createVertexArray()
            gl.bindVertexArray(this.vao)
            this.buffersInfo = buffersInfoFromPrimitive(this.primitive)
            gl.bindVertexArray(null)
        }
        
    }
    bindInstancingBuffer(maxNumInstances = 10){
        if(!this.vao) throw new Error('No vao!')
        
        this.instancingBuffersInfo = {
            i_matrix : new DynamicBufferInfo({
                stride : 64,
                byteLength : 64 * maxNumInstances,
                type : gl.FLOAT,
                numAttributes : 4,
                numComponents : 4,
                location : 5
            }, this.vao)
        }
        gl.bindVertexArray(this.vao)
        setAttributes(this.instancingBuffersInfo.i_matrix, 1)
        gl.bindVertexArray(null)
    }
    draw(uniforms, cameraMatrix){
        render(this, uniforms, cameraMatrix)
    }
    setInstancingData(data){
        gl.bindVertexArray(this.vao)
        this.instancingBuffersInfo.i_matrix.update(data)
        gl.bindVertexArray(null)
    }
    drawInstanced(uniforms, cameraMatrix, numInstances){
        renderInstances(this, uniforms, cameraMatrix, numInstances)
    }
}

const instancingShader = require('./shaders/defaultInstanceShader')
const instancingProgramInfo = new ProgrammInfo(instancingShader.vert, instancingShader.frag)
class InstancedRenderInfo{
    constructor(geometry, maxNumInstances){
        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)
        this.buffersInfo = createBuffersInfo(geometry)
        this.instancingBuffersInfo = {
            i_matrix : new DynamicBufferInfo({
                bytesPerInstance : 64,
                byteLength : 64 * maxNumInstances,
                type : gl.FLOAT,
                numAttributes : 4,
                numComponents : 4,
                location : 2
            }, this.vao),
            numElements : this.buffersInfo.numElements
        }
        setAttributes(this.instancingBuffersInfo.i_matrix, 1)
        gl.bindVertexArray(null)
        this.programInfo = instancingProgramInfo
    }
    draw(uniforms, numInstances, cameraMatrix){
        renderFunc(this, uniforms,numInstances, cameraMatrix)
    }
}







module.exports = {PrimitiveRenderInfo}