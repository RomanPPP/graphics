

function getGLTypeForTypedArray(gl, typedArray) {
    if (typedArray instanceof Int8Array)         { return gl.BYTE }           // eslint-disable-line
    if (typedArray instanceof Uint8Array)        { return gl.UNSIGNED_BYTE }  // eslint-disable-line
    if (typedArray instanceof Uint8ClampedArray) { return gl.UNSIGNED_BYTE }  // eslint-disable-line
    if (typedArray instanceof Int16Array)        { return gl.SHORT }          // eslint-disable-line
    if (typedArray instanceof Uint16Array)       { return gl.UNSIGNED_SHORT } // eslint-disable-line
    if (typedArray instanceof Int32Array)        { return gl.INT }            // eslint-disable-line
    if (typedArray instanceof Uint32Array)       { return gl.UNSIGNED_INT }   // eslint-disable-line
    if (typedArray instanceof Float32Array)      { return gl.FLOAT }          // eslint-disable-line
    return false
  }
function expandedTypedArray(array){
   
    let cursor = 0
    array.push = function(){
        for (let ii = 0; ii < arguments.length; ++ii) {
          const value = arguments[ii];
          
          if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
            for (let jj = 0; jj < value.length; ++jj) {
              array[cursor++] = value[jj];
            }
          } else {
            array[cursor++] = value;
          }
        }
        
      }
      
      return array
  }

function createUniformSetters(gl, program){
    const createTextureSetter = (program, uniformInfo)=>{
        const location = gl.getUniformLocation(program, uniformInfo.name)
       
        return (texBlockNum) => {
            

            gl.uniform1i(location, texBlockNum)
        }
        
        
    }
    function createUniformSetter(program, uniformInfo) {
    
        const location = gl.getUniformLocation(program, uniformInfo.name)
     
        const type = uniformInfo.type

        const isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]')
        
        if (type === gl.FLOAT && isArray) {
        return function(v) {
            gl.uniform1fv(location, v)
        }
        }
        if (type === gl.FLOAT) {
        return function(v) {
            gl.uniform1f(location, v)
        }
        }
        if (type === gl.FLOAT_VEC2) {
        return function(v) {
            gl.uniform2fv(location, v)
        }
        }
        if (type === gl.FLOAT_VEC3) {
        return function(v) {
            gl.uniform3fv(location, v)
        }
        }
        if (type === gl.FLOAT_VEC4) {
        return function(v) {
            gl.uniform4fv(location, v)
        }
        }
        if (type === gl.INT && isArray) {
        return function(v) {
            gl.uniform1iv(location, v)
        }
        }
        if (type === gl.INT) {
        return function(v) {
            gl.uniform1i(location, v)
        }
        }
        if (type === gl.INT_VEC2) {
        return function(v) {
            gl.uniform2iv(location, v)
        }
        }
        if (type === gl.INT_VEC3) {
        return function(v) {
            gl.uniform3iv(location, v)
        }
        }
        if (type === gl.INT_VEC4) {
        return function(v) {
            gl.uniform4iv(location, v)
        }
        }
        if (type === gl.BOOL) {
        return function(v) {
            gl.uniform1iv(location, v)
        }
        }
        if (type === gl.BOOL_VEC2) {
        return function(v) {
            gl.uniform2iv(location, v)
        }
        }
        if (type === gl.BOOL_VEC3) {
        return function(v) {
            gl.uniform3iv(location, v)
        }
        }
        if (type === gl.BOOL_VEC4) {
        return function(v) {
            gl.uniform4iv(location, v)
        }
        }
        if (type === gl.FLOAT_MAT2) {
        return function(v) {
            gl.uniformMatrix2fv(location, false, v)
        }
        }
        if (type === gl.FLOAT_MAT3) {
        return function(v) {
            gl.uniformMatrix3fv(location, false, v);
        }
        }
        if (type === gl.FLOAT_MAT4) {
        return function(v) {
            gl.uniformMatrix4fv(location, false, v)
        }
        }
        
    }
    const uniformSetters = {}
    const textureSetters = {}
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
    
    for (let ii = 0; ii < numUniforms; ++ii) {
      const uniformInfo = gl.getActiveUniform(program, ii)
      if (!uniformInfo) {
        break
      }
      let name = uniformInfo.name
      if(uniformInfo.type === gl.SAMPLER_2D){
        textureSetters[name] = createTextureSetter(program, uniformInfo)
        continue
      }
      
      
      if (name.substr(-3) === '[0]') {
        name = name.substr(0, name.length - 3)
      }
      if(uniformInfo.size > 1){
        for(let i = 0; i < uniformInfo.size; i++){
          const obj = {size : uniformInfo.size, type : uniformInfo.type, name : name + `[${i}]`}
          uniformSetters[name + `[${i}]`] = createUniformSetter(program, obj )
        }
      }
      else{
        const setter = createUniformSetter(program, uniformInfo)
        uniformSetters[name] = setter
      }
      
    }
    return {uniformSetters, textureSetters}
}

class ProgramInfo{
    constructor(vs, fs){
        
        this.vs = vs
        this.fs = fs
        this.VAO = null
        this.uniformSetters = null
        this.vertexShader = null
        this.fragmentShader = null
        this.program = null
        this.gl = null
      
    }
    setContext(glContextWrapper){
        this.context = glContextWrapper
        return this
    }
    createUniformSetters(){
        const {gl} = this.context
        const {uniformSetters, textureSetters} = createUniformSetters(gl, this.program)
        this.textureSetters = textureSetters
        this.uniformSetters = uniformSetters
        return this
    }
    compileShaders(){
        const {gl} = this.context
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(this.vertexShader, this.vs)
        gl.compileShader(this.vertexShader)
        if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(this.vertexShader))
        }

        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(this.fragmentShader, this.fs)
        gl.compileShader(this.fragmentShader)
        if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(this.fragmentShader))
        }
        

        this.program = gl.createProgram()
        gl.attachShader(this.program, this.vertexShader)
        gl.attachShader(this.program, this.fragmentShader)
        gl.linkProgram(this.program)
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(this.program))
        }
        return this
    }
    setUniforms(uniforms){
        this.context.useProgramInfo(this)
        Object.keys(uniforms).forEach(name=>{
            const setter = this.uniformSetters[name]
            if(setter) setter(uniforms[name])
        })
        return this
    }
    setTextureUniformUnit(name, unit){
        this.context.useProgramInfo(this)
        const setter = this.textureSetters[name]
        if(setter) setter(unit)
        return this
    }
}


export {
    expandedTypedArray, ProgramInfo, getGLTypeForTypedArray
}