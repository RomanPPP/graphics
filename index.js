const getGlContext = ()=>{
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.log('No webGl')
    }
    return gl
   
}
function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

import {BufferInfo, DynamicBufferInfo} from './src/buffersInfo'
import {PrimitiveRenderInfoFromArrayData, ArrayDataFromGltf} from './src/gltfUtils'
import { MeshRenderer, SkinnedMeshRenderer } from './src/mesh';
import {createBoxGeometry} from './src/primitives'
import PrimitiveRenderInfo from './src/webglUtils'
import { getGLTypeForTypedArray, ProgramInfo, expandedTypedArray} from './src/programInfo';
import Drawer from './src/render';




export {
    PrimitiveRenderInfo,
    resizeCanvasToDisplaySize,
    getGlContext,
    PrimitiveRenderInfoFromArrayData, ArrayDataFromGltf,
    MeshRenderer, SkinnedMeshRenderer,
    createBoxGeometry, 
    ProgramInfo,
    Drawer
}

