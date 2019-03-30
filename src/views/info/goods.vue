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
    <div id="chart"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { getInfoByGood } from "../../api/info";

  export default {
    name: 'Goods',
    data() {
      return {
        chart: null,
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        option: {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: ['香蕉', '苹果', '菠萝', '梨', '桃子', '猕猴桃', '椰子'],
            axisTick: {
              alignWithLabel: true
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              type: 'bar',
              data: [10, 52, 200, 334, 390, 330, 220]
            }
          ]
        }
      }
    },
    mounted: function () {
      this.chart = echarts.init(document.getElementById('chart'));
      this.chart.setOption(this.option)
    },
    methods: {
      handleClick: function () {
        getInfoByGood(this.startDate.getTime(), this.endDate.getTime()).then(response => {
          console.log(response)
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
