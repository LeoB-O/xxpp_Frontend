import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function changePassword(oldPassword, newPassword) {
  return request({
    url: '/admin/password',
    method: 'put',
    data: {
      oldPassword: oldPassword,
      newPassword: newPassword
    }
  })
}
