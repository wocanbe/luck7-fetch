import {isFun, isStr, isArr, isObj, isBool, json2query, cloneJson, mergeJson} from './lib/util'
import defaultLang from './lib/lang'
import {checkList, checkItem, checkAllowMethod, getAjaxConfig} from './lib/tools'

const ajaxList = Symbol() // api
const methodList = Symbol() // method
const strictMode = Symbol() // mode
const defaultCfg = Symbol() // default
const baseURL = Symbol() // base
const getCfg = Symbol() // get
const single = Symbol() // single

const dafaultConfig = {
  timeout: 120000 // 默认超时2分钟
}
class Ajax {
  [strictMode]:boolean = true;
  [baseURL]:string = '/';
  [ajaxList]:apiList = {};
  [methodList]:apiMethod = {};
  [defaultCfg]:any = {};
  constructor (apiList:apiList, configs?:ajaxConfig, apiMethods?:apiMethod) {
    this.init(apiList, configs, apiMethods)
    if (arguments[0].init) this.do('init')
  }
  init (apiList:apiList, configs?:ajaxConfig, apiMethods?:apiMethod) {
    const options = mergeJson(dafaultConfig, configs.options)
    if (options.method) {
      options.method = options.method.toUpperCase()
      checkAllowMethod(options.method, '默认')
    }
    if (isObj(configs.lang)) {
      for (const key in configs.lang) {
        if (defaultLang[key]) defaultLang[key] = configs.lang[key]
      }
    }
    if (isBool(configs.isStrict)) this[strictMode] = configs.isStrict
    if (configs.baseURL) this[baseURL] = configs.baseURL
    if (apiList) this[ajaxList] = checkList(apiList)
    else throw new Error(defaultLang.noList)

    this[methodList] = apiMethods
    this[defaultCfg] = options
  }
  do (apiName:Array<string|api>|string|api, params?:any):Promise<any> {
    if (isArr(apiName)) {
      const ajaxReqs = []
      const apis = apiName as Array<string|api>
      for (let order:number = 0; order < apis.length; order++) {
        ajaxReqs.push(this[single](apis[order], params[order]))
      }
      return Promise.all(ajaxReqs)
    } else return this[single]((apiName as string|api), params)
  }
  [getCfg] (apiName:string|api, params?:any) {
    let localConfig
    if (isStr(apiName)) {
      const apiConfig = this[ajaxList][apiName as string]
      if (apiConfig) localConfig = cloneJson(apiConfig)
      else if (this[strictMode]) throw new Error(defaultLang.noConfig.replace('#apiName#', apiName as string))
      else localConfig = {url: apiName}
    } else {
      if (this[strictMode]) throw new Error(defaultLang.typeError)
      if (isObj(apiName)) localConfig = checkItem(apiName, '')
      else throw new Error(defaultLang.typeError)
    }
    if (localConfig.options) localConfig.options = mergeJson(this[defaultCfg], localConfig.options)
    else localConfig.options = this[defaultCfg]
    const reqConfig = getAjaxConfig(localConfig, params)
    return reqConfig
  }
  [single] (apiName:string|api, params?:any) {
    let reqUrl:string, reqConfig:any
    try {
      const lCfg = this[getCfg](apiName, params)
      reqUrl = lCfg[0]
      reqConfig = lCfg[1]
    } catch (e) {
      return Promise.reject(e)
    }
    let filterFun = this[methodList]['_']
    if (isStr(apiName)) filterFun = this[methodList][apiName as string]
    let sucessFun:Function, errorFun:Function
    if (isFun(filterFun)) {
      const filterObj = filterFun()
      if (isFun(filterObj)) {
        sucessFun = filterObj as Function
      } else {
        if (filterObj.error) errorFun = filterObj.error
        if (filterObj.request) {
          try {
            filterObj.request(reqConfig)
          } catch (e) {
            if (errorFun) return errorFun(e)
            else throw e
          }
        }
        if (filterObj.response) sucessFun = filterObj.response
      }
    }
    reqUrl = this[baseURL] + reqUrl
    let reqData = reqConfig.data
    if (reqConfig.method === 'GET') {
      reqUrl = reqUrl + json2query(reqData)
    } else if (reqData instanceof FormData) {
      if (reqConfig.headers) delete reqConfig.headers['Content-Type']
      reqConfig.body = reqData
    } else {
      reqConfig.body = JSON.stringify(reqData)
    }
    delete reqConfig.data
    return new Promise(async (resolve, reject) => {
      const outNo = setTimeout(() => reject(new Error('fetch timeout')), reqConfig.timeout)
      delete reqConfig.timeout
      try {
        const res = await fetch(reqUrl, reqConfig)
        if (res.status == 200) {
          const resData = await res.json()
          const data = sucessFun ? sucessFun(resData) : resData
          resolve(data)
        } else {
          // 捕捉2XX(除200),304之类的返回
          throw new Error(defaultLang.netError.replace('#status#', res.status + ''))
        }
      } catch (err) {
        if (errorFun) errorFun(err)
        else reject(err)
      } finally {
        clearTimeout(outNo)
      }
    })
  }
}
export default Ajax
