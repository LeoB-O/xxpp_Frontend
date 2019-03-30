import request from '@/utils/request'

export function getOrders(start=0, offset=30) {
  return request({
    url: '/orders',
    method: 'get',
    params: {
      start: start,
      offset: offset
    }
  })
}

export function getOrder(orderId) {
  return request({
    url: '/order',
    method: 'get',
    params: {
      id: orderId
    }
  })
}

export function editOrder(order) {
  return request({
    url: '/order',
    method: 'put',
    data: {
      order: order
    }
  })
}
