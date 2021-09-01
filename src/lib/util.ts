function isObj(obj:any):boolean {
  return Object.prototype.toString.call(obj)=== '[object Object]'
}
function isArr(arr:any):boolean {
  return Array.isArray(arr)
}
function isFun(fn:any):boolean {
  return Object.prototype.toString.call(fn)=== '[object Function]'
}
function isBool (fromVal:any):boolean {
  return fromVal === true || fromVal === false
}
function isStr (str:any):boolean {
  return typeof str == 'string'
}
function json2query (json:any):string {
  if (!json) return ''
  let queryArr = []
  for (const key in json) {
    if (json[key] !== undefined) queryArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
  }
  if (queryArr.length) return '?' + queryArr.join('&')
  else return ''
}
function cloneJson (json:any):any {
  if (json === undefined) return
  return JSON.parse(JSON.stringify(json))
}

function mergeJson (to:any, from:any):any {
  let res:any = {}
  if (isObj(to)) res = cloneJson(to)
  if (isObj(from)) {
    for (const key in from) {
      const toVal = res[key]
      const fromVal = from[key]
      if (!toVal) {
        res[key] = fromVal
      } else {
        if (isObj(fromVal)) {
          res[key] = mergeJson(toVal, fromVal)
        // } else if (isArr(fromVal)) {
        //   res[key] = fromVal
        } else {
          res[key] = fromVal
        }
  
      }
    }
  }
  return res
}
export {isObj, isFun, isArr, isBool, isStr, json2query, cloneJson, mergeJson}