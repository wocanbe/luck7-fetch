import {isStr, cloneJson, mergeJson} from './util'
import lang from './lang'

function checkAllowMethod (method:string, key:string):void {
  if (['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) === -1) {
    throw new Error(lang.methodError.replace('#apiName#', key).replace('#method#', method))
  }
}
function checkItem (reqConfig:string|api, key:string):api {
  if (isStr(reqConfig)) return {url: reqConfig as string}
  else {
    reqConfig = reqConfig as api
    if (!reqConfig.url) throw new Error(lang.urlError.replace('#apiName#', key))
    if (reqConfig.method) {
      reqConfig.method = reqConfig.method.toUpperCase()
      checkAllowMethod(reqConfig.method, key)
    }
    return reqConfig
  }
}
function checkList (list:apiList) {
  for (const key in list) {
    list[key] = checkItem(list[key], key)
  }
  return list
}
function prefetch (url:string, params:any, isCros:boolean):string {
  let urlRegx
  let domain = ''
  // 在请求发出之前进行一些操作
  if (isCros) {
    urlRegx = /^https?:\/\/[^:]+(:\d+)?\//i
    const ret = url.match(urlRegx)
    if (ret !== null) {
      domain = ret[0]
      url = url.replace(domain, '')
    }
  }
  urlRegx = /:(\w+)/
  let urlPat = url.match(urlRegx)
  while (urlPat !== null) {
    const pat = urlPat[1]
    if (params instanceof FormData) {
      if (params.has(pat)) {
        url = url.replace(urlPat[0], params.get(pat) as string)
      } else {
        throw new Error(lang.paramError.replace('#param#', pat))
      }
    } else if (params.hasOwnProperty(pat)) {
      url = url.replace(urlPat[0], params[pat])
    } else {
      throw new Error(lang.paramError.replace('#param#', pat))
    }
    urlPat = url.match(urlRegx)
  }
  return domain + url
}
function getAjaxConfig (reqConfig:api, params:any) {
  let reqCfg = cloneJson(reqConfig.options)
  let data
  if (reqConfig.method) reqCfg.method = reqConfig.method
  if (params instanceof FormData) {
    data = params
  } else {
    data = mergeJson(reqConfig.options.data, params)
  }

  let reqUrl
  reqUrl = prefetch(reqConfig.url, data, reqConfig.isCros)
  reqCfg.data = data
  return [reqUrl, reqCfg]
}

export {checkList, checkItem, checkAllowMethod, getAjaxConfig}
