import IProgramInfo from "./IProgramInfo";
export default interface IGLWrapper {
  gl: WebGL2RenderingContext;
  lastUsedProgramInfo: IProgramInfo;
  programs: { [name: string]: IProgramInfo };
  useProgramInfo(program : IProgramInfo):void
}
