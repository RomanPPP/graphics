

const setCanvasSize = (ctx, width, height) =>{
    ctx.canvas.width  = width
    ctx.canvas.height = height
}
  

const makeTexture = (gl, ctx) => {
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex);
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas);
    return tex
  }
const makeStripeTexture =  (gl, options )=> {
    options = options || {}
    var width  = options.width  || 4
    var height = options.height || 4
    var color1 = options.color1 || "rgba(1,0,0,0.1)"
    var color2 = options.color2 || "rgba(1,1,1,0.5)"
    const ctx = document.createElement("canvas").getContext("2d")
    setCanvasSize(ctx, width, height);
  
    ctx.fillStyle = color1 
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = color2 
    ctx.fillRect(0, 0, width, height / 2)
  
    return makeTexture(gl, ctx)
}
const maketex =  (options )=> {
    options = options || {}
    var width  = options.width  || 4
    var height = options.height || 4
    var color1 = options.color1 || "rgba(1,0,0,0.1)"
    var color2 = options.color2 || "rgba(1,1,1,0.5)"
    const ctx = document.createElement("canvas").getContext("2d")
    setCanvasSize(ctx, width, height);
  
    ctx.fillStyle = color1 
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = color2 
    ctx.fillRect(0, 0, width, height / 2)
  
    return ctx.canvas
}
const makeTextureFromSvgXml = (gl, xml, options = {}) =>{
    const img = document.createElement('img')
    var svg64 = btoa(xml)
    var b64Start = 'data:image/svg+xml;base64,'
    var image64 = b64Start + svg64
    img.src = image64

    
    const width  = options.width  || 100
    const height = options.height || 100
    const x = options.x || 0
    const y = options.y || 0

    const ctx = document.createElement("canvas").getContext("2d")
    setCanvasSize(ctx, width, height)
    
    ctx.drawImage(img, x, y, width, height)
    ctx.fillStyle = "rgba(0,0,0,0.1)"
    ctx.fillRect(0, 0, width, height )
    return makeTexture(gl, ctx)
}
const setTextureUnits = (gl, texture, unitNum) => {
    gl.activeTexture(gl.TEXTURE0 + unitNum);
    gl.bindTexture(gl.TEXTURE_2D, texture);
}

class Texture{
    constructor(gl){
        this.texture = gl.createTexture()
        this.fromImage = image =>{
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            return this
        }
        this.getTexture = () => this.texture
        this.setTextureUnit = num =>{
            gl.activeTexture(gl.TEXTURE0 + num);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            return this
        }
    }
}
export {makeStripeTexture, makeTextureFromSvgXml, setTextureUnits, maketex, Texture}