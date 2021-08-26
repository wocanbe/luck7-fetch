function isObj(obj) {
  return Object.prototype.toString.call(obj)=== '[object Object]'
}
function isArr(arr) {
  return Array.isArray(arr)
}
function isFun(fn) {
  return Object.prototype.toString.call(fn)=== '[object Function]'
}
function isBool (fromVal) {
  return fromVal === true || fromVal === false
}
function isStr (str) {
  return typeof str == 'string'
}
function json2query (json) {
  if (!json) return ''
  let queryArr = []
  for (const key in json) {
    if (json[key] !== undefined) queryArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
  }
  if (queryArr.length) return '?' + queryArr.join('&')
  else return ''
}
function mergeJson (to, from) {
  let res = {}
  if (isObj(to)) res = JSON.parse(JSON.stringify(to))
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
export {isObj, isFun, isArr, isBool, isStr, json2query, mergeJson}