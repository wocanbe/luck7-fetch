import {isStr, cloneJson, mergeJson} from './util'
import lang from './lang'

function checkAllowMethod (method, key) {
  if (['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) === -1) {
    throw new Error(lang.methodError.replace('#apiName#', key).replace('#method#', method))
  }
}
function checkItem (reqConfig, key) {
  if (isStr(reqConfig)) return {url: reqConfig}
  if (!reqConfig.url) throw new Error(lang.urlError.replace('#apiName#', key))
  if (reqConfig.method) {
    reqConfig.method = reqConfig.method.toUpperCase()
    checkAllowMethod(reqConfig.method, key)
  }
  return reqConfig
}
function checkList (list) {
  for (const key in list) {
    list[key] = checkItem(list[key], key)
  }
  return list
}
function prefetch (url, params, isCros) {
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
    if (params instanceof FormData) {
      if (params.has(urlPat[1])) {
        url = url.replace(urlPat[0], params.get(urlPat[1]))
      } else {
        throw new Error(urlPat[1])
      }
    } else if (params.hasOwnProperty(urlPat[1])) {
      url = url.replace(urlPat[0], params[urlPat[1]])
    } else {
      throw new Error(urlPat[1])
    }
    urlPat = url.match(urlRegx)
  }
  return domain + url
}
function getAjaxConfig (reqConfig, params) {
  let reqCfg = cloneJson(reqConfig.options)
  let data = cloneJson(params)
  if (reqConfig.method) reqCfg.method = reqConfig.method
  if (params instanceof FormData) {
    reqCfg.headers['Content-Type'] = 'multipart/form-data'
  } else data = mergeJson(reqConfig.options.data, params)

  let reqUrl
  try {
    reqUrl = prefetch(reqConfig.url, data, reqConfig.isCros)
  } catch (e) {
    return new Error(lang.paramError.replace('#param#', e.message))
  }
  reqCfg.data = data
  return [reqUrl, reqCfg]
}

export {checkList, checkItem, checkAllowMethod, getAjaxConfig}
