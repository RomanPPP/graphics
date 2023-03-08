import IGLWrapper from "../models/IGLWrapper";
import IProgramInfo from "../models/IProgramInfo";
import GLcontextWrapper from "./GLWrapper";

function createUniformSetters(
  gl: WebGL2RenderingContext,
  program: WebGLProgram
) {
  const createTextureSetter = (
    program: WebGLProgram,
    uniformInfo: WebGLActiveInfo
  ) => {
    const location = gl.getUniformLocation(program, uniformInfo.name);

    return (texBlockNum: number) => {
      gl.uniform1i(location, texBlockNum);
    };
  };
  function createUniformSetter(
    program: WebGLProgram,
    uniformInfo: WebGLActiveInfo
  ) {
    const location = gl.getUniformLocation(program, uniformInfo.name);

    const type = uniformInfo.type;

    const isArray =
      uniformInfo.size > 1 && uniformInfo.name.substr(-3) === "[0]";

    if (type === gl.FLOAT && isArray) {
      return function (v: number[]) {
        gl.uniform1fv(location, v);
      };
    }
    if (type === gl.FLOAT) {
      return function (v: number) {
        gl.uniform1f(location, v);
      };
    }
    if (type === gl.FLOAT_VEC2) {
      return function (v: Iterable<number>) {
        gl.uniform2fv(location, v);
      };
    }
    if (type === gl.FLOAT_VEC3) {
      return function (v: Iterable<number>) {
        gl.uniform3fv(location, v);
      };
    }
    if (type === gl.FLOAT_VEC4) {
      return function (v: Iterable<number>) {
        gl.uniform4fv(location, v);
      };
    }
    if (type === gl.INT && isArray) {
      return function (v: Iterable<number>) {
        gl.uniform1iv(location, v);
      };
    }
    if (type === gl.INT) {
      return function (v: number) {
        gl.uniform1i(location, v);
      };
    }
    if (type === gl.INT_VEC2) {
      return function (v: Iterable<number>) {
        gl.uniform2iv(location, v);
      };
    }
    if (type === gl.INT_VEC3) {
      return function (v: Iterable<number>) {
        gl.uniform3iv(location, v);
      };
    }
    if (type === gl.INT_VEC4) {
      return function (v: Iterable<number>) {
        gl.uniform4iv(location, v);
      };
    }
    if (type === gl.BOOL) {
      return function (v: Iterable<number>) {
        gl.uniform1iv(location, v);
      };
    }
    if (type === gl.BOOL_VEC2) {
      return function (v: Iterable<number>) {
        gl.uniform2iv(location, v);
      };
    }
    if (type === gl.BOOL_VEC3) {
      return function (v: Iterable<number>) {
        gl.uniform3iv(location, v);
      };
    }
    if (type === gl.BOOL_VEC4) {
      return function (v: Iterable<number>) {
        gl.uniform4iv(location, v);
      };
    }
    if (type === gl.FLOAT_MAT2) {
      return function (v: Iterable<number>) {
        gl.uniformMatrix2fv(location, false, v);
      };
    }
    if (type === gl.FLOAT_MAT3) {
      return function (v: Iterable<number>) {
        gl.uniformMatrix3fv(location, false, v);
      };
    }
    if (type === gl.FLOAT_MAT4) {
      return function (v: Iterable<number>) {
        gl.uniformMatrix4fv(location, false, v);
      };
    }
  }
  const uniformSetters: { [id: string]: (arg: Object) => void } = {};
  const textureSetters: { [id: string]: (arg: Object) => void } = {};
  const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  for (let ii = 0; ii < numUniforms; ++ii) {
    const uniformInfo = gl.getActiveUniform(program, ii);
    if (!uniformInfo) {
      break;
    }
    let name = uniformInfo.name;
    if (uniformInfo.type === gl.SAMPLER_2D) {
      textureSetters[name] = createTextureSetter(program, uniformInfo);
      continue;
    }

    if (name.substr(-3) === "[0]") {
      name = name.substr(0, name.length - 3);
    }
    if (uniformInfo.size > 1) {
      for (let i = 0; i < uniformInfo.size; i++) {
        const obj = {
          size: uniformInfo.size,
          type: uniformInfo.type,
          name: name + `[${i}]`,
        };
        uniformSetters[name + `[${i}]`] = createUniformSetter(program, obj);
      }
    } else {
      const setter = createUniformSetter(program, uniformInfo);
      uniformSetters[name] = setter;
    }
  }
  return { uniformSetters, textureSetters };
}

class ProgramInfo implements IProgramInfo{
  vertexShaderSource: string;
  fragmentShaderSource: string;
  uniformSetters: { [id: string]: (arg: Object) => void };
  textureSetters: { [id: string]: (arg: Object) => void };
  fragmentShader: WebGLShader;
  vertexShader: WebGLShader;
  program: WebGLProgram;
  glWrapper: IGLWrapper;
  gl: WebGL2RenderingContext;

  constructor(
    glWrapper: GLcontextWrapper,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;

    this.uniformSetters = null;
    this.textureSetters = null;
    this.vertexShader = null;
    this.fragmentShader = null;
    this.program = null;
    this.glWrapper = glWrapper;
  }

  createUniformSetters() {
    const { glWrapper, program } = this;
    const { gl } = glWrapper;
    const { uniformSetters, textureSetters } = createUniformSetters(
      gl,
      program
    );
    this.textureSetters = textureSetters;
    this.uniformSetters = uniformSetters;
    return this;
  }
  compileShaders() {
    const { glWrapper, fragmentShaderSource, vertexShaderSource } = this;
    const { gl } = glWrapper;
    this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(this.vertexShader, vertexShaderSource);
    gl.compileShader(this.vertexShader);
    if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(this.vertexShader));
    }

    this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(this.fragmentShader, fragmentShaderSource);
    gl.compileShader(this.fragmentShader);
    if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(this.fragmentShader));
    }

    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(this.program));
    }
    return this;
  }
  setUniforms(uniforms: { [key: string]: Iterable<number> | number }) {
    const { uniformSetters, glWrapper } = this;
    glWrapper.useProgramInfo(this);
    Object.keys(uniforms).forEach((name) => {
      const setter = uniformSetters[name];
      if (setter) setter(uniforms[name]);
    });
    return this;
  }
  setTextureUniformUnit(name: string, unit: number) {
    const { textureSetters, glWrapper } = this;
    glWrapper.useProgramInfo(this);
    const setter = textureSetters[name];
    if (setter) setter(unit);
    return this;
  }
}

export { ProgramInfo };
