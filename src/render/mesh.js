
class MeshRenderer{
    constructor(meshData){
        this.primitives = meshData.PrimitiveRenderInfos
        this.name = {meshData}
        this.vao = null
    }
    bindBuffers(){
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].bindBuffers()
        }
    }
    draw(uniforms, cameraMatrix){
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].draw(uniforms, cameraMatrix)
        }
    }
    drawInstanced(uniforms, cameraMatrix, numInstances){
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].drawInstanced(uniforms, cameraMatrix, numInstances)
        }
    }
    bindInstancingBuffer(){
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].bindInstancingBuffer()
        }
    }
    setInstancingData(data){
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].setInstancingData(data)
        }
    }
}
class SkinnedMeshRenderer{
    constructor(primitives, skin){
        this.primitives = primitives
        this.skin = skin
    }
    draw(uniforms, cameraMatrix){
        this.skin.update(uniforms.u_matrix)
        const _uniforms = {u_jointTexture: this.skin.jointTexture,
            u_numJoints: this.skin.joints.length, ...uniforms}
        for(let i = 0, n = this.primitives.length; i < n; i++){
            this.primitives[i].draw(_uniforms, cameraMatrix)
        }
    }
}
module.exports = {MeshRenderer, SkinnedMeshRenderer}