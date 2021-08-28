interface requset {
  method?:string, // 请求方式，默认值为GET
  data?: any, // 请求参数，可以进行一些特殊写法，如写成'vuex.xxxx'，然后在methods中处理成对应的vuex数据
  headers?: any // 请求头
  timeout?: number // 超时时间，单位毫秒
}
interface api {
  url:string, // 请求地址，必填且不能为空
  method?:string, // 请求方式，默认值为GET，优先级高于request中的method
  options?: requset
}

interface apiList {
  [propName:string]:string|api
}
interface lang {
  noList?:string,
  methodError?:string,
  urlError?:string,
  typeError?:string,
  noConfig?:string,
  netError?:string
}
interface ajaxConfig {
  baseURL?: string, // 默认值’/‘
  isStrict?:boolean
  lang?:lang,
  options:any // 请求配置项
}
interface methodFun {
  request?(req:request):void, // 对request参数进行处理
  response?(responseData:any):any|Promise<any>, // 对返回数据进行处理，返回处理后的数据(也可以在这儿交由vuex处理，返回空对象)
  error?(err:Error)
}
interface apiMethod {
  [propName:string]:() => methodFun
}
declare class Luck7Ajax {
  constructor(apiList:apiList, ajaxConfig:ajaxConfig, apiMethods:apiMethod);
  do (apiName:string|api, params:any);
}
export = Luck7Ajax