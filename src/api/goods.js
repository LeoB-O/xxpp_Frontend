import request from '@/utils/request'

export function getGoods() {
  return request({
    url: '/goods',
    method: 'get'
  })
}

export function getGood(goodId) {
  return request({
    url: '/good',
    method: 'get',
    params: {
      id: goodId
    }
  })
}

export function getCategories() {
  return request({
    url: '/categories',
    method: 'get'
  })
}

export function addGood(good) {
  return request({
    url: '/good',
    method: 'post',
    data: good
  })
}

export function changeStatus(goodId, status) {
  return request({
    url: '/good/status',
    method: 'post',
    data: {
      id: goodId,
      status: status
    }
  })
}

export function editGood(good) {
  return request({
    url: '/good',
    method: 'put',
    data: {
      good: good
    }
  })
}

export const picUploadUrl = process.env.BASE_API + '/upload'
