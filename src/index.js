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

import {BufferInfo, DynamicBufferInfo} from './render/buffersInfo'
import {PrimitiveRenderInfoFromArrayData, ArrayDataFromGltf} from './render/gltfUtils'
import { MeshRenderer, SkinnedMeshRenderer } from './render/mesh';
import {createBoxGeometry} from './render/primitives'
import PrimitiveRenderInfo from './render/webglUtils'
import { getGLTypeForTypedArray, ProgramInfo, expandedTypedArray} from './render/programInfo';
import Drawer from './render/render';




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

