
import PrimitiveRenderer from './PrimitiveRenderer'
import { MeshRenderer } from './MeshRenderer'
import {AttributeSetter, BufferController} from './BufferAttribute'
import { NUM_COMPONENTS, TYPED_ARRAYS, LOCATIONS } from './enums'

 
const ArrayDataFromGltf = (gltf, buffers) =>{
    const {bufferViews, accessors, meshes, nodes} = gltf
    const attribDataFromAccessor = (accessor) =>{
        const bufferView = bufferViews[accessor.bufferView]
        const {count, componentType, type} = accessor
        const byteOffset = accessor.byteOffset || 0
        const {byteLength, target} = bufferView
        const stride = bufferView.byteStride || 0
        const bufferViewByteOffset = bufferView.byteOffset||0
        const buffer = buffers[bufferView.buffer]
        
        return {
            data : new Uint8Array(buffer, bufferViewByteOffset, byteLength),
            numComponents : NUM_COMPONENTS[type],
            stride ,
            byteLength,
            location : null,
            count,
            type : componentType,
            offset : byteOffset  || 0,
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
    
    
    return _meshes.map(mesh =>
        {
                const primitives =  mesh.primitives.map(primitive => new PrimitiveRenderer(primitive))
                const name = mesh.name
                
                return new MeshRenderer({primitives, name})
        })
    
}

const PrimitiveRenderInfoFromArrayData = (meshes) => meshes.map(mesh =>
    {
            const primitives =  mesh.primitives.map(primitive => new PrimitiveRenderer(primitive))
            const name = mesh.name
            return new MeshRenderer({name, primitives})
    })

const EntityDataFromGltf = (gltf, buffers) => PrimitiveRenderInfoFromArrayData(ArrayDataFromGltf(gltf, buffers))


class GLTF{
    constructor(gltf, binaryBuffers){
        const {nodes, meshes, skins} = gltf
        this.nodes = nodes
        this.meshes = ArrayDataFromGltf(gltf, binaryBuffers)
    }
}
export { ArrayDataFromGltf, PrimitiveRenderInfoFromArrayData, EntityDataFromGltf, GLTF}