import Mock from 'mockjs'
import userAPI from './user'
import tableAPI from './table'
import goodsAPI from './goods'
import orderAPI from './order'
import infoAPI from './info'

// Fix an issue with setting withCredentials = true, cross-domain request lost cookies
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}
// Mock.setup({
//   timeout: '350-600'
// })

// User
Mock.mock(/\/user\/login/, 'post', userAPI.login)
Mock.mock(/\/user\/info/, 'get', userAPI.getInfo)
Mock.mock(/\/user\/logout/, 'post', userAPI.logout)

// Table
Mock.mock(/\/table\/list/, 'get', tableAPI.list)

// Goods
Mock.mock(/\/goods/, 'get', goodsAPI.getGoods)
Mock.mock(/$\/good/, 'get', goodsAPI.getGood)
Mock.mock(/\/categories/, 'get', goodsAPI.getCategories)
Mock.mock(/\/good\/status/, 'post', goodsAPI.changeStatus)
Mock.mock(/\/good/, 'post', goodsAPI.addGood)
Mock.mock(/\/good/, 'put', goodsAPI.editGood)

// Orders
Mock.mock(/\/orders/, 'get', orderAPI.getOrders)
Mock.mock(/\/order/, 'get', orderAPI.getOrder)
Mock.mock(/\/order/, 'put', orderAPI.editOrder)

// Info
Mock.mock(/\/info\/time/, 'get', infoAPI.getInfoByTime)
Mock.mock(/\/info\/good/, 'get', infoAPI.getInfoByGood)

export default Mock
