import Mock from 'mockjs'
import util from '../src/utils/index'

export default {
  getInfoByTime: (options) => {
    let params = util.getUrlParams(options.url)
    let startTime = new Date(+params.startTime)
    let endTime = new Date(+params.endTime)
    let xAxis = {
      type: 'category',
      data: []
    }
    let yAxis = {
      type: 'value'
    }
    let data = []
    while (startTime < endTime) {
      let month = startTime.getMonth() + 1
      let date = startTime.getDate()
      xAxis.data.push(month + '-' + date)
      data.push(Mock.Random.natural(0, 500))
      startTime.setDate(date + 1)
    }
    return {
      code: 20000,
      data: {
        option: {
          xAxis: xAxis,
          yAxis: yAxis,
          series: [{
            data: data,
            type: 'line'
          }]
        }
      }
    }
  },
  getInfoByGood: (options) => {
    let xAxis = {
      type: 'category',
      data: ['香蕉', '苹果', '西瓜', '菠萝', '椰子', '柠檬', '西柚', '橙子', '草莓', '芒果']
    }
    let yAxis = {
      type: 'value'
    }
    let data = []
    for (let i=0;i<xAxis.data.length;i++) {
      data.push(Mock.Random.natural(0,500))
    }
    return {
      code: 20000,
      data: {
        option: {
          xAxis: xAxis,
          yAxis: yAxis,
          series: [{
            type: 'bar',
            data: data
          }]
        }
      }
    }
  }
}
