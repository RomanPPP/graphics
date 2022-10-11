import {expandedTypedArray} from  './programInfo.js'
import { cross, diff, normalize } from 'math/src/vector.js';
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


function createBox(_a = 1, _b = 1, _c = 1){
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
      const texcoord = new Float32Array(
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

      const ArrayData = {
        attributes : {
          NORMAL : {
            data : normals,
            count : 6 * 4 * 3,
            location : 1,
            byteLength : normals.byteLength,
            stride: 0,
            offset : 0,
            numComponents : 3,
            type : 5126
          },
          POSITION : {
            data : positions,
            count : 6 * 4 * 3,
            location : 0,
            byteLength : positions.byteLength,
            stride: 0,
            offset : 0,
            numComponents : 3,
            type : 5126
          },
          TEXCOORD_0 : {
            data : texcoord,
            count : 48,
            type : 5126,
            offset : 0,
            stride : 0,
            byteLength : texcoord.byteLength,
            location : 4,
            numComponents : 2
          }
        },
        indices : indices,
        numElements : indices.length,
        componentType : 5123,
         mode : 4
      }
      return ArrayData
      /*return {
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
            },
            {
              bufferView : 3,
              byteOffset : 0,
              count : 48,
              componentType : 5126,
              type : 'VEC2'
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
              },
              {
                buffer : 3,
                byteLength : texcoord.byteLength,
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
                    TEXCOORD_0 : 3
                  },
                  indices : 2,
                  mode : 4
                }
              ]
            }
          ],
          nodes : [
            {
              name : "Cube",
              mesh : 0,
              children : [1]
            },
            {
              name : 'Cube2',
              mesh : 0,
              translation : [1,1,1]
            }
          ]
        },
        binaryBuffers : [
          positions.buffer, normals.buffer, indices.buffer, texcoord.buffer
        ]
      };*/
}


const createCone = (radius = 2, height = 2, numCorners = 4) =>{
  
  const vertices = [
    0, -height/2, 0
  ]
  const normals = [
  ]
  const indices = [
  ]
  
  for(let i = 0; i < numCorners + 1; i++){
    const angle = 2 * i * Math.PI / numCorners
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const y = -height/2
    vertices.push(x, -height/2, z)
    normals.push(0,-1,0)
  }
  for(let i = 0; i< numCorners ; i++){
    indices.push(0, i+1, i+2)
  }
  //vertices.push(vertices[1], -height/2, vertices[3])
  const n = vertices.length / 3
  const stride = 3
  const start = n
  
  for(let i = 0; i < numCorners + 2; i++){
      const angle = 2 * i * Math.PI / numCorners
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = -height/2
      const a = [vertices[i *3 ], vertices[i * 3+1], vertices[i * 3+2]]
      const b = [vertices[ i*3 + 3], vertices[i*3 + 4], vertices[ i*3 + 5]]
      const c = [0, height/2, 0]
      indices.push(start + i * stride + 2,start + i * stride + 1,  start + i * stride + 3)
      vertices.push( ...c,...a, ...b,  )
      const normal = normalize(cross( diff(b, c), diff(a, c)))
      normals.push(...normal, ...normal, ...normal)
  }
  
  
  const _normal = new Float32Array(normals)
  const _position = new Float32Array(vertices)
  const _indices = new Uint16Array(indices)
  const ArrayData = {
    attributes : {
      POSITION : {
        location : 0,
        count : vertices.length,
        offset : 0,
        stride : 0,
        numComponents : 3,
        type : 5126,
        data : _position,
        byteLength : _position.byteLength
      },
      NORMAL : {
        location : 1,
        count : normals.length,
        numComponents : 3,
        offset : 0,
        stride : 0,
        type : 5126,
        data : _normal,
        byteLength : _normal.byteLength
      }
    },
    componentType : 5123,
    indices : _indices,
    numElements : indices.length,
    mode : 4
  }  
  return ArrayData
}

export {
  createBox, createCone
}