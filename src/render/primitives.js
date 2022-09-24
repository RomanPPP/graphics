import {expandedTypedArray} from  './programInfo.js'

const linedBoxIndices = new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0, // front
  0, 5, 5, 4, 4, 1, 1, 0, //bottom
  0, 4, 4, 7, 7, 3, 3, 0, //left
  1, 2, 2, 6, 6, 5, 5, 1, //right
  4, 5, 5, 6, 6, 7, 7, 4, // back
  2, 7, 7, 3, 3, 6, 6, 2 // top 
])

const CUBE_FACE_INDICES = [
    [3, 7, 5, 1], // right
    [6, 2, 0, 4], // left
    [6, 7, 3, 2], // ??
    [0, 1, 5, 4], // ??
    [7, 6, 4, 5], // front
    [2, 3, 1, 0], // back
  ];


function createBoxGeometry(_a = 1, _b = 1, _c = 1){
    const a = _a/2, b = _b/2, c = _c/2
    const cornerVertices = [
        [-a, -b, -c],
        [+a, -b, -c],
        [-a, +b, -c],
        [+a, +b, -c],
        [-a, -b, +c],
        [+a, -b, +c],
        [-a, +b, +c],
        [+a, +b, +c],
      ];
  
      const faceNormals = [
        [+1, +0, +0],
        [-1, +0, +0],
        [+0, +1, +0],
        [+0, -1, +0],
        [+0, +0, +1],
        [+0, +0, -1],
      ];
  
      const uvCoords = [
        [1, 0],
        [0, 0],
        [0, 1],
        [1, 1],
      ];
      const numVertices = 6 * 4
      const positions = expandedTypedArray(new Float32Array(numVertices * 3))
      const normals   = expandedTypedArray(new Float32Array(numVertices * 3))
      //const texCoords = webglUtils.createAugmentedTypedArray(2 , numVertices);
      const indices   = expandedTypedArray(new Uint16Array(6 * 2 * 3))
  
      for (let f = 0; f < 6; ++f) {
        const faceIndices = CUBE_FACE_INDICES[f];
        for (let v = 0; v < 4; ++v) {
          const position = cornerVertices[faceIndices[v]];
          const normal = faceNormals[f];
          positions.push(position)
          normals.push(normal)
          
          
  
        }
        
        const offset = 4 * f;
        indices.push(offset + 0, offset + 1, offset + 2);
        indices.push(offset + 0, offset + 2, offset + 3);
      }
      const len = positions.byteLength
      const texcoordBuffer = new Float32Array(
        [
        // Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Back
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Top
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Bottom
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Right
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Left
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
      ]
      )
      return {
          gltf : {
            accessors : [
            {
                bufferView : 0,
                byteOffset : 0,
                count :72,
                componentType : 5126,
                type : 'VEC3'
            },
            {
              bufferView : 1,
              byteOffset : 0,
              count : 72,
              componentType : 5126,
              type : 'VEC3'
            },
            {
              bufferView : 2,
              byteOffset : 0,
              count : 36,
              componentType : 5123,
              type : 'SCALAR'
            }
            ],
          bufferViews : [
              {
                buffer : 0,
                byteLength : positions.byteLength,
                byteOffset : 0
              },
              {
                buffer : 1,
                byteLength : normals.byteLength,
                byteOffset : 0
              },
              {
                buffer : 2,
                byteLength : indices.byteLength,
                byteOffset : 0
              }
            ],
          meshes : [
            {
              name : 'Cube',
              primitives : [
                {
                  attributes : {
                    NORMAL : 1,
                    POSITION : 0,
                  },
                  indices : 2,
                }
              ]
            }
          ],
          nodes : [
            {
              name : "Cube",
              mesh : 0,
              children : [0]
            }
          ]
        },
        binaryBuffers : [
          positions.buffer, normals.buffer, indices.buffer
        ]
      };
}




export {
  createBoxGeometry
}