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

export function showConfirm(submitCallback) {
  this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(submitCallback)
    .catch(() => {this.$message.info('已取消删除')});
}
