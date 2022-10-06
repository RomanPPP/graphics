import {Node, TRS } from 'math'

class Entity extends Node{
    static makeEntity(entityDescription, rootNodeNdx){
        const {nodes, meshes} = entityDescription
        const rootNode = nodes[rootNodeNdx]
        const makeNode = (nodeDescription, ndx) => {
            const trs = new TRS(
                nodeDescription.translation || [0,0,0],
                nodeDescription.rotation || [0,0,0,0],
                nodeDescription.scale || [1,1,1]
            )
            const node = new Entity(nodeDescription.name, trs,  ndx)
            if(nodeDescription.mesh != undefined){
               node.renderer = meshes[nodeDescription.mesh]
            }
            if(nodeDescription.children){
                nodeDescription.children.forEach(childNdx =>{
                    const child = makeNode(nodes[childNdx], childNdx)
                    child.setParent(node)
                })
            }
            return node
        }
        return makeNode(rootNode, rootNodeNdx)
    }
    constructor(name, trs, ndx){
        super(name, trs)
        this.ndx = ndx
        this.physics = null
        this.skinNdx = null
        this.objectsToDraw = []
        this.renderer = null
    }
    updateObjectsToDraw(){
        const queue = [this]
        while(queue.length > 0){
            const node = queue.pop()
            console.log(node)
            if(node.renderer)  this.objectsToDraw.push(node)
            if(node.children) queue.push(...node.children)
        }
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
    render(uniforms, cameraMatrix){
        this.objectsToDraw.forEach(object =>{
            object.renderer.draw({...uniforms, u_matrix : object.worldMatrix}, cameraMatrix)
        })
    }
}


export default Entity