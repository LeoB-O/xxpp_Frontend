import request from '@/utils/request'

export function getInfoByTime(startTime, endTime) {
  return request({
    url: '/info/time',
    method: 'get',
    params: {
      startTime: startTime,
      endTime: endTime
    }
  })
}

export function getInfoByGood(startTime, endTime) {
  return request({
    url: '/info/good',
    method: 'get',
    params: {
      startTime: startTime,
      endTime: endTime
    }
  })
}
