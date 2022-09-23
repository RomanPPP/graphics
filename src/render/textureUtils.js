const ctx = document.createElement("canvas").getContext("2d")

const setCanvasSize = (width, height) =>{
    ctx.canvas.width  = width
    ctx.canvas.height = height
}
  
const makeTexture = () => {
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    return tex
  }
const makeStripeTexture =  options => {
    options = options || {}
    var width  = options.width  || 2
    var height = options.height || 2
    var color1 = options.color1 || "rgba(0,0,0,0.1)"
    var color2 = options.color2 || "rgba(0,1,1,0.5)"
  
    setCanvasSize(width, height);
  
    ctx.fillStyle = color1 
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = color2 
    ctx.fillRect(0, 0, width, height / 2)
  
    return makeTexture()
}

const makeTextureFromSvgXml = (xml, options = {}) =>{
    const img = document.createElement('img')
    var svg64 = btoa(xml)
    var b64Start = 'data:image/svg+xml;base64,'
    var image64 = b64Start + svg64
    img.src = image64

    
    const width  = options.width  || 100
    const height = options.height || 100
    const x = options.x || 0
    const y = options.y || 0
    setCanvasSize(width, height)
    
    ctx.drawImage(img, x, y, width, height)
    ctx.fillStyle = "rgba(0,0,0,0.1)"
    ctx.fillRect(0, 0, width, height )
    return makeTexture()
}
const setTextureUnits = (textureInfos) => textureInfos.forEach(info =>{
    gl.activeTexture(gl.TEXTURE0 + info.texUnitNum);
    gl.bindTexture(gl.TEXTURE_2D, info.texture);
})

module.exports = {makeStripeTexture, makeTextureFromSvgXml, setTextureUnits}