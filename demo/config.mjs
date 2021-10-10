const list = {
  demo1: '/mock1', // 等价于 { url: '/mock1' },
  // 使用请求超时
  demo2: {
    method: 'POST', // 默认值为GET
    url: '/mock2', // 请求地址，必填且不能为空
    options: { // 请求配置项
      timeout: 1000, // 请求超时时间
      data: {} // 请求参数，可以进行一些特殊写法，如写成'vuex.xxxx'，然后在methods中处理成对应的vuex数据。
    }
  },
  // 使用URL参数（:path）
  demo3: '/:id/mock3',
  demo4: {
    method: 'GET',
    isCros: true,  // 跨域请求，url中包含协议(仅支持http和https)的时候必须加
    url: 'https://my.domain/demo',
  }
}
const baseURL = 'https://localhost/mock'
const ajaxConfigs = { // ajax配置
  // method: 'GET', // 框架默认值
  // lang
  isStrict: false, // 关闭严格模式
  baseURL
}
const methods = {
  _ () {
  // _代表对所有的过滤，用于实现对request和respone的拦截
  // _跟其他的method配置(如login)不能同时生效
  // 为什么是function？为了实现一些情况下request和response共用变量，并且每次请求该变量都会变化的情况，如对数据进行加解密的情况
    return {
      request (req) {
        const token = 'sognrv'
        req.headers = {'Access-token': token}
        const data = req.data
        const userid = 1
        const backData = Object.assign({ userid }, data)
        req.data = backData
      },
      response (res) {
        if (res.code !== 0) { // 抛出异常
          throw new Error(res.msg)
        } else return data.data
      }
    }
  }
}
export {list, ajaxConfigs, methods}