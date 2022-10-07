import {BufferInfo, DynamicBufferInfo} from './src/BufferAttribute'
import {PrimitiveRenderInfoFromArrayData, ArrayDataFromGltf, EntityDataFromGltf, GLTF} from './src/gltfUtils'
import { MeshRenderer, SkinnedMeshRenderer } from './src/MeshRenderer';
import {createBoxGeometry} from './src/primitives'
import PrimitiveRenderer from './src/PrimitiveRenderer'
import { getGLTypeForTypedArray, ProgramInfo, expandedTypedArray} from './src/programInfo';
import Drawer from './src/Drawer';
import { Texture, makeImgFromSvgXml, makeStripeImg, setTextureUnits} from './src/textureUtils';
import Entity from './src/entity';


const getGlContext = ()=>{
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.log('No webGl')
    }
    return gl
   
}
function resizeCanvasToDisplaySize(canvas, multiplier) {
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
  }
class GLcontextWrapper{
  constructor(canvas_id){
    const canvas = document.querySelector(`#${canvas_id}`);
    const gl = canvas.getContext("webgl2");
    
    if (!gl) {
      throw new Error('No webgl!')
    }
    this.gl = gl
    this.textures = {}
    this.renderCache = {
      lastUsedProgramInfo : null
    }
    this.programs = {

    }
  }
  getLastUsedProgramInfo(){
    return this.renderCache.lastUsedProgramInfo
  }
  setLastUsedProgram(programInfo){
    this.renderCache.lastUsedProgramInfo = programInfo
    return this
  }
  useProgramInfo(programInfo){
    if(programInfo != this.getLastUsedProgramInfo()){
      this.gl.useProgram(programInfo.program)
      this.setLastUsedProgram(programInfo)
    }
    return this
  }
  resizeCanvasToDisplaySize(multiplier = 1){
    const canvas = this.gl.canvas
    const width  = canvas.clientWidth  * multiplier | 0
    const height = canvas.clientHeight * multiplier | 0
    
    canvas.width  = width
    canvas.height = height
      return this
  }
  getContext(){
    return this.gl
  }
  createTexture(textureName){
    const texture = new Texture(this.gl)
    this.textures = {...this.textures, [textureName] : texture}
    return this
  }
  getTexture(textureName){
    return this.textures[textureName]
  }
  setTextureUnit(textureName, unitNum){
    const texture = this.getTexture(textureName).texture
    setTextureUnits(this.gl, texture, unitNum)
    return this
  }
}



export {
  GLTF, GLcontextWrapper,
  Texture, makeImgFromSvgXml, makeStripeImg, Entity,
    PrimitiveRenderer, EntityDataFromGltf,
    resizeCanvasToDisplaySize,
    getGlContext,
    PrimitiveRenderInfoFromArrayData, ArrayDataFromGltf,
    MeshRenderer, SkinnedMeshRenderer,
    createBoxGeometry, 
    ProgramInfo,
    Drawer
}

