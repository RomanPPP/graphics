interface IAttributeInfo {
  data?: ArrayBuffer;
  count: number;
  location: number;
  byteLength?: number;
  stride?: number;
  offset?: number;
  numComponents: number;
  type?: number;
  attributeType: GLenum;
  divisor?: number;
}

export default interface IArrayData {
  attributes: {
    NORMAL?: IAttributeInfo;
    POSITION?: IAttributeInfo;
    TEXCOORD_0?: IAttributeInfo;
  };
  indices?: ArrayBuffer;
  numElements?: number;
  componentType?: number;
  mode?: number;
  offset?: number;
}
