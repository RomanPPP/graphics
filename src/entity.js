import {Node, TRS } from 'math'
import { m4 } from 'math'
import {MeshRenderer, SkinnedMeshRenderer} from './mesh.js'
import Skin from './skin'



class Entity extends Node{
    static makeEntity(description, rootNodeNdx){
        const nodes = description.nodes
        const rootNode = nodes[rootNodeNdx]
        const makeNode = (nodeDescription, ndx) => {
            
            const trs = new TRS(
                nodeDescription.translation || [0,0,0],
                nodeDescription.rotation || [0,0,0,0],
                nodeDescription.scale || [1,1,1]
                )
            
            const node = new Entity(description.name, trs,  ndx)
    
            if(description.mesh != undefined){
               node.meshNdx = nodeDescription.mesh
            }
            if(description.skin != undefined){
                node.skinNdx = nodeDescription.skin
            }
            
            if(nodeDescription.children){
                nodeDescription.children.forEach(childNdx =>{
                    const child = makeNode(nodes[childNdx], childNdx)
                    child.setParent(node)
                })
            }
            return node
        }
        const entity = makeNode(rootNode)
        entity.traverse(node =>{
            if(node.meshNdx != undefined){
                const mesh = gltf.meshes[node.meshNdx]
                if(node.skinNdx != undefined){
                    const joints = gltf.skins[node.skinNdx].joints.map(entity.find.bind(entity))
                    const inverseBindMatrixData = gltf.skins[node.skinNdx].inverseBindMatrices
                    const skin = new Skin(joints, inverseBindMatrixData)
                    node.render = new SkinnedMeshRenderer(mesh._primitives, skin)
                    entity.objectsToDraw.push(node)
                }
                else{
                    node.render = new MeshRenderer(mesh._primitives)
                    entity.objectsToDraw.push(node)
                }
            }
        })        
        return entity
    }
    constructor(name, trs, ndx){
        super(name, trs)
        this.ndx = ndx
        this.physics = null
        this.meshNdx = null
        this.skinNdx = null
        this.objectsToDraw = []
    }
    updateWorldMatrix(parentWorldMatrix){
        if(!parentWorldMatrix){
            this.worldMatrix = this.physics.collider.getM4()
           
            this.children.forEach(child => child.updateWorldMatrix(this.worldMatrix))
            return
        }
        let matrix = this.trs.getMatrix()
        matrix = m4.multiply(parentWorldMatrix, matrix);
        this.originMatrix = new Float32Array([...matrix])
        this.worldMatrix = matrix
        if(this.physics){
            this.updateCollider()
        }
        
        this.children.forEach((child) => {
            child.updateWorldMatrix(matrix);
        })
    }
    updateCollider(){
        this.physics.collider.pos = [this.worldMatrix[12], this.worldMatrix[13], this.worldMatrix[14]]
        
        this.physics.collider.setRmatrix(m4.m4Tom3(this.worldMatrix))
    }
    updateByColliders(parentWorldMatrix = m4.identity()){
        if(this.physics){
            this.worldMatrix = this.physics.collider.getM4()
            this.children.forEach(child => child.updateByColliders(this.worldMatrix))
            return
        }
        this.worldMatrix = m4.multiply(parentWorldMatrix, this.trs.getMatrix())
        this.children.forEach((child) => {
            child.updateByColliders(this.worldMatrix);
        })
    }
    updateObjectsToDraw(){
        const iter = (node) =>{
            if(node.mesh)
                this.objectsToDraw.push(node)
                node.children.forEach(iter)
        }
        iter(this)
    }
    traverse(fn){
        fn(this)
        this.children.forEach(child => child.traverse(fn))
    }
    find(ndx){
        let result = null
        const iter = (nodes)=>{
            
            for(let node of nodes){
                if(node.ndx === ndx) result = node
                else iter(node.children)
            }
        }
        iter([this])
        return result
    }
    findByName(name){
        let result = null
        const iter = (nodes)=>{
            
            for(let node of nodes){
                if(node.name === name) result = node
                else iter(node.children)
            }
        }
        iter([this])
        return result
    }
    rotate(angle){
        this.trs.rotation[3] +=angle
        this.trs.rotation = quaternion.normalize(this.trs.rotation)
    }
    setColliders(scheme){
        Object.keys(scheme).forEach(nodeName=>{
            const node = this.findByName(nodeName)
            if(!node) return
            node.physics = scheme[nodeName]()
        })
    }
    scaleX(factor){
        this.trs.scale[0] *= factor
        if(this.physics) this.physics.collider.scaleX(factor)
        this.children.forEach(child => {
            if(child.physics) child.physics.collider.scaleX(factor)
        })
    }
    scaleY(factor){
        this.trs.scale[1] *= factor
        if(this.physics) this.physics.collider.scaleY(factor)
        this.children.forEach(child => child.scaleY(factor))
    }
    scaleZ(factor){
        this.trs.scale[2] *= factor
        if(this.physics) this.physics.collider.scaleZ(factor)
        this.children.forEach(child => child.scaleZ(factor))
    }
}


export default Entity