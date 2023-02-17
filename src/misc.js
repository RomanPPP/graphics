function getGLTypeForTypedArray(gl, typedArray) {
    if (typedArray instanceof Int8Array) {
      return gl.BYTE;
    } // eslint-disable-line
    if (typedArray instanceof Uint8Array) {
      return gl.UNSIGNED_BYTE;
    } // eslint-disable-line
    if (typedArray instanceof Uint8ClampedArray) {
      return gl.UNSIGNED_BYTE;
    } // eslint-disable-line
    if (typedArray instanceof Int16Array) {
      return gl.SHORT;
    } // eslint-disable-line
    if (typedArray instanceof Uint16Array) {
      return gl.UNSIGNED_SHORT;
    } // eslint-disable-line
    if (typedArray instanceof Int32Array) {
      return gl.INT;
    } // eslint-disable-line
    if (typedArray instanceof Uint32Array) {
      return gl.UNSIGNED_INT;
    } // eslint-disable-line
    if (typedArray instanceof Float32Array) {
      return gl.FLOAT;
    } // eslint-disable-line
    return false;
  }
  function expandedTypedArray(array) {
    let cursor = 0;
    array.push = function () {
      for (let ii = 0; ii < arguments.length; ++ii) {
        const value = arguments[ii];
  
        if (
          value instanceof Array ||
          (value.buffer && value.buffer instanceof ArrayBuffer)
        ) {
          for (let jj = 0; jj < value.length; ++jj) {
            array[cursor++] = value[jj];
          }
        } else {
          array[cursor++] = value;
        }
      }
    };
  
    return array;
  }
export {expandedTypedArray, getGLTypeForTypedArray}