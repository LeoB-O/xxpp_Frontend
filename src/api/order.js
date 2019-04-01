import request from '@/utils/request'
import order from "../../mock/order";

export function getOrders(start=0, offset=30) {
  return request({
    url: '/admin/orders',
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
    url: '/admin/order',
    method: 'put',
    data: {
      order: order
    }
  })
}

export function deleteOrder(orderId) {
  return request({
    url: '/admin/order',
    method: 'delete',
    params: {
      id: orderId
    }
  })
}
