interface request {
  method?:string,
  data?: any,
  headers?: any
  timeout?: number
}
interface api {
  url:string,
  method?:string,
  isCros?: boolean,
  options?: request
}

interface apiList {
  [propName:string]:string|api
}
interface lang {
  [propName:string]:string
}
interface ajaxConfig {
  baseURL?: string,
  isStrict?:boolean
  lang?:lang,
  options:any
}
interface methodFun {
  request?(req:request):void,
  response?(responseData:any):any|Promise<any>,
  error?(err:Error):void
}
interface apiMethod {
  [propName:string]:() => methodFun
}
declare class L7Fetch {
  constructor(apiList:apiList, ajaxConfig:ajaxConfig, apiMethods:apiMethod);
  setFetch(fetch:(url: string, options?: any) => Promise<any>):void;
  do(apiName:string|api, params:any):Promise<any>;
}
export = L7Fetch