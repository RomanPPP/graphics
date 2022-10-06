const props = {
    'MAT4' : {
        stride : 64,
        byteLength : 64,
        type : 0x1406,
        numAttributes : 4,
        numComponents : 4,
    }
}
const getAttributePropsByType = (type) => props[type]
export default getAttributePropsByType