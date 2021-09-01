class WebAjax extends Ajax {
  constructor(apiList:apiList, configs?:ajaxConfig, apiMethods?:apiMethod) {
    super(apiList, configs, apiMethods)
    super.setFetch(window.fetch)
  }
}
export default WebAjax
