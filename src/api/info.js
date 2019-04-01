import request from '@/utils/request'

export function getInfoByTime(startTime, endTime) {
  return request({
    url: '/admin/info/time',
    method: 'get',
    params: {
      startTime: startTime,
      endTime: endTime
    }
  })
}

export function getInfoByGood(startTime, endTime) {
  return request({
    url: '/admin/info/good',
    method: 'get',
    params: {
      startTime: startTime,
      endTime: endTime
    }
  })
}
