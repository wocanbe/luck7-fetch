import {isFun, isStr, isArr, isObj, isBool, json2query, mergeJson} from './lib/util'
import defaultLang from './lib/lang'
import {checkList, checkAllowMethod, getAjaxConfig} from './lib/tools'

const ajaxList = Symbol('api')
const methodList = Symbol('method')
const strictMode = Symbol('mode')
const defaultCfg = Symbol('default')
const baseURL = Symbol('base')
const getCfg = Symbol('get')
const single = Symbol('single')
const dafaultConfig = {
  timeout: 120000 // 默认超时2分钟
}
class Ajax {
  constructor () {
    if (arguments[0] instanceof Promise) {
      arguments[0].then(res => {
        this.init(res, arguments[1], arguments[2])
      })
    } else {
      this.init(...arguments)
      if (arguments[0].init) this.do('init')
    }
  }
  init (apiList, configs = {}, apiMethods = {}) {
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
    this[strictMode] = isBool(configs.isStrict) ? configs.isStrict : true
    this[baseURL] = configs.baseURL || '/'
    if (apiList) this[ajaxList] = checkList(apiList)
    else throw new Error(defaultLang.noList)

    this[methodList] = apiMethods
    this[defaultCfg] = options
  }
  do (apiName, params) {
    if (isArr(apiName)) {
      const ajaxReqs = []
      for (var s in apiName) {
        ajaxReqs.push(this[single](apiName[s], params[s]))
      }
      return Promise.all(ajaxReqs)
    } else return this[single](apiName, params)
  }
  [getCfg] (apiName, params) {
    let localConfig
    if (isStr(apiName)) {
      const apiConfig = this[ajaxList][apiName]
      if (apiConfig) localConfig = apiConfig
      else if (this[strictMode]) throw new Error(defaultLang.noConfig.replace('#apiName#', apiName))
      else localConfig = {url: apiName}
    } else {
      if (this[strictMode]) throw new Error(defaultLang.typeError)
      if (isObj(apiName)) localConfig = checkItem(apiName, '')
      else throw new Error(defaultLang.typeError)
    }
    if (localConfig.options) localConfig.options = mergeJson(this[defaultCfg], localConfig.options)
    else localConfig.options = this[defaultCfg]

    const reqConfig = getAjaxConfig(localConfig, params)
    if (reqConfig instanceof Error) throw reqConfig
    return reqConfig
  }
  [single] (apiName, params) {
    let reqConfig
    try {
      reqConfig = this[getCfg](apiName, params)
    } catch (e) {
      return Promise.reject(e)
    }
    const filterFun = this[methodList][apiName] || this[methodList]['_']
    let sucessFun, errorFun
    if (isFun(filterFun)) {
      const filterObj = filterFun()
      if (isFun(filterObj)) {
        sucessFun = filterObj
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
    let reqUrl = this[baseURL] + reqConfig.url
    if (reqConfig.options.method === 'GET') {
      reqUrl = reqUrl + json2query(data)
      delete reqConfig.options.data
    }
    return new Promise((resolve, reject) => {
      const outNo = setTimeout(() => reject(new Error('fetch timeout')), reqConfig.options.timeout)
      delete reqConfig.options.timeout
      fetch(reqUrl, reqConfig.options).then(res => {
        clearTimeout(outNo)
        if (res.status == 200) {
          try {
            const resData = res.json()
            const data = sucessFun ? sucessFun(resData) : resData
            resolve(data)
          } catch (e) {
            reject(e)
          }
        } else {
          // 捕捉2XX(除200),304之类的返回
          reject(new Error(defaultLang.netError.replace('#status#', res.status)))
        }
      }).catch((err) => {
        clearTimeout(outNo)
        if (errorFun) errorFun(err)
        else reject(err)
      })
    })
  }
}
export default Ajax
