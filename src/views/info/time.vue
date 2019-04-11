<template>
  <div class="app-container">
    <el-form label-width="80px">
      <el-form-item label="起止时间">
        <el-date-picker placeholder="开始日期" v-model="startDate"/>
        <span>-</span>
        <el-time-picker placeholder="开始时间" v-model="startTime"/>
        <span>到</span>
        <el-date-picker placeholder="结束日期" v-model="endDate"/>
        <span>-</span>
        <el-time-picker placeholder="结束时间" v-model="endTime"/>
        <el-button @click="handleClick">统计</el-button>
      </el-form-item>
    </el-form>
    <div id="chart"/>
  </div>
</template>

<script>
import echarts from 'echarts'
import {getInfoByTime} from "../../api/info";

export default {
  name: 'Time',
  data() {
    return {
      chart: null,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      option: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      }
    }
  },
  created: function() {
    this.startTime = new Date();
    this.startTime.setDate(this.startTime.getDate() - 1)
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 1)
    this.endTime = new Date();
    this.endDate = new Date();
  },
  mounted: function() {
    this.chart = echarts.init(document.getElementById('chart'))
    getInfoByTime().then(response => {
      this.option = response.data.option
      this.chart.setOption(this.option)
    })
  },
  methods: {
    handleClick: function() {
      let start = new Date(this.startDate)
      let end = new Date(this.endDate)
      start.setHours(this.startTime.getHours(), this.startTime.getMinutes(), this.startTime.getSeconds())
      end.setHours(this.endTime.getHours(), this.endTime.getMinutes(), this.endTime.getSeconds())
      getInfoByTime(start.getTime(), end.getTime()).then(response => {
        this.option = response.data.option
        this.chart.setOption(this.option)
      })
    }
  }
}
</script>

<style scoped>
  #chart {
    width: 100%;
    height: 400px;
  }
</style>
