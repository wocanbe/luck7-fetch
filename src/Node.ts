import fetch from 'node-fetch'

class NodeAjax extends Ajax {
  constructor(apiList:apiList, configs?:ajaxConfig, apiMethods?:apiMethod) {
    super(apiList, configs, apiMethods)
    super.setFetch(fetch)
  }
}
export default NodeAjax