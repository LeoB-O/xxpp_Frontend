export default {
  getUrlParams: function(url) {
    url = url.slice(url.search(/\?/)+1).split('&')
    url = url.map(value => {
      return {
        key: value.split('=')[0],
        value: value.split('=')[1]
      }
    })
    let ret = {}
    for (let i=0;i<url.length;i++) {
      ret[url[i].key] = url[i].value
    }
    return ret
  }
}
