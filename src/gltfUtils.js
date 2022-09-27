
import PrimitiveRenderInfo from './webglUtils'


const TYPED_ARRAYS = {
    '5120': Int8Array,    
    '5121': Uint8Array,   
    '5122': Int16Array,   
    '5123': Uint16Array,  
    '5124': Int32Array,   
    '5125': Uint32Array,  
    '5126': Float32Array, 
}
const NUM_COMPONENTS = {
    'SCALAR' : 1,
    'VEC2' : 2,
    'VEC3' : 3,
    'VEC4' : 4,
    'MAT2': 4,
  'MAT3': 9,
  'MAT4': 16,
}
const LOCATIONS = {
    'POSITION' : 0,
    'NORMAL' : 1,
    'WEIGHTS_0' : 2,
    'JOINTS_0' : 3,
    'TEXCOORD_0' : 4,
}







const ArrayDataFromGltf = (gltf, buffers) =>{
    const {bufferViews, accessors, meshes} = gltf
    const attribDataFromAccessor = (accessor) =>{
        const bufferView = bufferViews[accessor.bufferView]
        const {count, componentType, type} = accessor
        const byteOffset = accessor.byteOffset || 0
        const {byteLength, target} = bufferView
        const stride = bufferView.byteStride || 0
        const bufferByteOffset = bufferView.byteOffset||0
        const buffer = buffers[bufferView.buffer]
        const size = TYPED_ARRAYS[componentType].BYTES_PER_ELEMENT
    
        return {
            data : new Uint8Array(buffer, bufferView.byteOffset || 0, byteLength),
            numComponents : NUM_COMPONENTS[type],
            stride ,
            byteLength,
            location : null,
            count,
            type : componentType,
            offset : accessor.byteOffset  || 0,
            componentType : accessor.componentType
        }
    }
    const _meshes = meshes.map(mesh =>({
        primitives : mesh.primitives.map(_primitive =>{
            
            const primitive = {
                attributes : {},
                mode : _primitive.mode
            }
            if(_primitive.hasOwnProperty('indices')){
                const indicesInfo = attribDataFromAccessor(accessors[_primitive.indices])
                primitive.indices = indicesInfo.data
                primitive.numElements = indicesInfo.count
                primitive.componentType = indicesInfo.componentType
            }
            Object.keys(_primitive.attributes).forEach(attribName =>{
                const attribute = _primitive.attributes[attribName]
                primitive.attributes[attribName] = attribDataFromAccessor(accessors[attribute])
                //if(attribName === 'JOINTS_0') _primitive.attributes[attribName].data = new Uint32Array(_primitive.attributes[attribName].data)
                primitive.attributes[attribName].location = LOCATIONS[attribName]
            })
            return primitive
        }),
        name : mesh.name
    })
    )
    const data = {meshes : _meshes}
    if(gltf.skins){
        data.skins = gltf.skins.map(skin =>{
            return {
                joints : [...skin.joints],
                inverseBindMatrices : attribDataFromAccessor(accessors[skin.inverseBindMatrices]).data
            }
        })
    }
    else{
        data.skins = []
    }
    return data
}




const PrimitiveRenderInfoFromArrayData = (arrayData) =>({
    skins : arrayData.skins, meshes : arrayData.meshes.map(mesh =>
        ({
            name : mesh.name,
            PrimitiveRenderInfos : mesh.primitives.map(primitive => new PrimitiveRenderInfo(primitive))
        })
        )
    
})
const MeshDataFromGLTF = (gltf, buffers) =>{
    const {bufferViews, accessors, meshes} = gltf
    const _meshes = []
    const MeshData = {
        nodes : JSON.parse(JSON.stringify(gltf.nodes))
    }
    

    meshes.forEach(mesh =>{
        const _mesh = {
            primitives : [],
            name : mesh.name
        }
        const primitives = [{
            attributes : {}
        }]
        mesh.primitives.forEach(primitive =>{
            const _primitive = {attributes : {}}
            if(primitive.hasOwnProperty('indices')){
                const indicesInfo = attribDataFromAccessor(accessors[primitive.indices])
                _primitive.indices = indicesInfo.data
                _primitive.numElements = indicesInfo.count
                _primitive.componentType = indicesInfo.componentType
                
            }
            const attributes = primitive.attributes
            Object.keys(attributes).forEach(attribName =>{
                if(attribName === 'TEXCOORD_0')return
                if(attribName === 'TANGENT')return
                const attribute = attributes[attribName]
                _primitive.attributes[attribName] = attribDataFromAccessor(accessors[attribute])
                //if(attribName === 'JOINTS_0') _primitive.attributes[attribName].data = new Uint32Array(_primitive.attributes[attribName].data)
                _primitive.attributes[attribName].location = LOCATIONS[attribName]
            })
            _mesh.primitives.push(_primitive)
            
        })
        _mesh._primitives = _mesh.primitives.map(primitive => new PrimitiveRenderInfo(primitive))
        _meshes.push(_mesh)
    })
    if(gltf.skins){
        MeshData.skins = gltf.skins.map(skin =>{
            return {
                joints : [...skin.joints],
                inverseBindMatrices : attribDataFromAccessor(accessors[skin.inverseBindMatrices]).data
            }
        })
    }
    MeshData.meshes = _meshes
    return MeshData
}


export {MeshDataFromGLTF, ArrayDataFromGltf, PrimitiveRenderInfoFromArrayData}