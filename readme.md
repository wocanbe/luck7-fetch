# luck7-fetch

可以拥有统一配置的项目层面的对ajax的再封装，没有任何依赖，体积小巧(仅4.5kb,开启gzip压缩后仅2kb)，使用简洁，可以同时存在多个

```javascript
import L7Fetch from 'luck7-fetch'

// 创建ajax对象
const ajax = new L7Fetch(apiLists, ajaxConfigs, apiMethods)
// 使用ajax对象发起请求
ajax.do(apiName, params) // 没有请求参数的时候，params可以不写
  .then(res => {
    console.log(res)
  }).catch(err => {
    console.error(err)
  })
```
## 参数

 * apiLists

  Array类型，api接口列表，格式为```key: {method, url, options}```，支持简写

 * ajaxConfigs

  Object类型，对ajax请求的配置(如headers、timeout等)，用于对请求/返回数据进行处理，默认值如下
  ```javascript
  {
    baseURL: '/',
    lang: Object, // 错误提示文本
    isStrict: true // 是否开启严格模式
    options: { // 可参考fetch的配置，额外引入了timeout配置
      headers: {
        // ...
      },
      method: 'GET',
      timeout: 120000 // 单位毫秒
    } // 请求配置项
  }
  ```

  错误提示文本默认值
  ```javascript
  {
    noList: '配置错误: 缺少接口配置(list)',
    methodError: '配置错误: #apiName#请求类型异常#method#',
    urlError: '配置错误: #apiName#缺少请求地址(url)',
    typeError: '使用错误: 接口参数类型错误',
    noConfig: '使用错误: 接口#apiName#未配置',
    netError: '服务器错误: 状态码：#status#',
    paramError: '缺少URL参数#param#'
  }
  ```
 * apiMethods

 跟``apiLists``中的key对应，代表相应的api请求后的处理方法，格式如下

  ```javascript
  {
    key () { // key的唯一特例是'_',代表通用处理方法,将对所有未配置method的api生效
      return {
        request (req) { /* ... */ }, // 对request参数进行处理
        response (res) { return res }, // 对返回数据进行处理,返回处理后的数据
        error (err) {} // 对异常进行处理
      }
    }
  }
  ```