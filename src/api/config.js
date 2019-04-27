import request from '@/utils/request'

export const config = {
  print: {
    url: 'localhost:1998'
  }
};

export function getSettings() {
  return request({
    url: '/admin/settings',
    method: 'get'
  })
}

export function setShopStatus(status) {
  return request({
    url: '/admin/setting/status',
    method: 'put',
    data: {
      status: status
    }
  })
}

export function setCustomerServicePhone(phone) {
  return request({
    url: '/admin/setting/customerServicePhone',
    method: 'put',
    data: {
      customerServicePhone: phone
    }
  })
}

export function setEstimateTime(time) {
  return request({
    url: '/admin/setting/estimateTime',
    method: 'put',
    data: {
      time: time
    }
  })
}
