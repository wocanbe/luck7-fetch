import fetch from 'node-fetch'
import _ajax from './ajax.mjs'

// 指定node环境使用的fetch
_ajax.setFetch(fetch)

const ajax = function (apiName, params) {
  return _ajax.do(apiName, params)
}

ajax('demo3', {
  id: 1, // id出现在地址参数中，不能缺少，不然会报错
  pageNo: 1,
  size: 10
}).then((data) => {
  console.log(data)
}).catch((e) => {
  console.error(e.message)
})

ajax(['demo1', 'demo2'], []) // 第二个数组不能省略
  .then((datas) => {
    console.log(datas[0], datas[1])
  }).catch((err) => {
    console.error(err.message)
  })
/*
上例等价于
Promise.all([
  ajax('demo1'),
  ajax('demo2')
]).then((datas) => {
  console.log(datas[0], datas[1])
}).catch((err) => {
  console.error(err.message)
})
*/
ajax('demo4').then((data) => {
  console.log(data)
}).catch((e) => {
  console.error(e.message)
})

ajax(
  '/login', // 注意：这种使用方式在严格模式下会报错，只能在非严格模式下使用
  {
    username: 'admin',
    password: 'admin'
  }
).then((data) => {
  console.log(data)
}).catch((e) => {
  console.error(e.message)
})