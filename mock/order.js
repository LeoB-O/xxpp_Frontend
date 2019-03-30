import Mock from 'mockjs'
import goods from './goods'

let selectedGoods = goods.goods.goods.map(val => {
  return {
    id: val.id,
    name: val.name,
    amount: 3,
    price: val.price,
    options: val.options.map(val => {
      return {
        key: val.key,
        value: val.values[0]
      }
    })
  }
})

const orders = Mock.mock({
  'orders|30': [{
    id: '@id',
    name: '@cname',
    address: '@province' + '@city' + '@county',
    phone: '13566668888',
    'status|1': ['配送中', '已下单', '已接单', '已送达'],
    createTime: '@date' + '@time',
    'items': selectedGoods
  }]
})

console.log(selectedGoods)

export default {
  getOrders: () => {
    return {
      code: 20000,
      data: orders
    }
  },
  getOrder: () => {
    const order = Mock.mock({
      'order|1': orders.orders
    })
    return {
      code: 20000,
      data: order
    }
  },
  editOrder: () => {
    return {
      code: 20000,
      data: {}
    }
  }
}
