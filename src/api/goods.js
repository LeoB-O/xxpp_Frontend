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

export function addCategory(name) {
  return request({
    url: '/admin/category',
    method: 'post',
    data: {
      name: name
    }
  })
}

export function deleteCategory(id) {
  return request({
    url: '/admin/category',
    method: 'delete',
    params: {
      id: id
    }
  })
}

export function addGood(good) {
  return request({
    url: '/admin/good',
    method: 'post',
    data: good
  })
}

export function changeStatus(goodId, status) {
  return request({
    url: '/admin/good/status',
    method: 'put',
    data: {
      id: goodId,
      status: status
    }
  })
}

export function editGood(good) {
  return request({
    url: '/admin/good',
    method: 'put',
    data: {
      good: good
    }
  })
}

export function deleteGood(goodId) {
  return request({
    url: '/admin/good',
    method: 'delete',
    params: {
      id: goodId
    }
  })
}

export function uploadPic(files) {
  let data = new FormData();
  data.append('pic', data);
  return  request({
    url: '/admin/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}

export function setIndexItems(items) {
  return request({
    url: '/admin/setting/items',
    method: 'post',
    data: {items: items}
  })
}

export const picUploadUrl = process.env.BASE_API + '/admin/upload'
