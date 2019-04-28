<template>
  <el-form label-width="80px" ref="form" :model="form">
    <el-form-item label="自提地址" prop="selfPickUpAddress">
      <el-input v-model="form.selfPickUpAddress"/>
    </el-form-item>
    <el-form-item label="客服电话" prop="customerServicePhone">
      <el-input v-model="form.customerServicePhone"/>
    </el-form-item>
    <el-form-item label="预计送达时间" prop="estimateTime">
      <el-input v-model="form.estimateTime"/>
    </el-form-item>
    <el-form-item label="可配送时间" prop="deliverTime">
      <el-time-picker
        is-range
        value-format="HH:mm"
        v-model="form.deliverTime"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围">
      </el-time-picker>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {
    getSettings,
    setCustomerServicePhone,
    setDeliverTime,
    setEstimateTime,
    setSelfPickUpAddress
  } from "../../api/config";

  export default {
    name: "setting",
    data() {
      return {
        form: {
          customerServicePhone: '',
          estimateTime: '',
          selfPickUpAddress: '',
          deliverTime: ['08:00', '23:00'],
        }
      }
    },
    created: function () {
      getSettings().then(response => {
        this.form.customerServicePhone = response.data.settings.customerServicePhone
        this.form.estimateTime = response.data.settings.estimateTime
        this.form.selfPickUpAddress = response.data.settings.selfPickUpAddress
        this.form.deliverTime[0] = response.data.settings.startDeliverTime || '08:00'
        this.form.deliverTime[1] = response.data.settings.endDeliverTime || '23:00'
      })
    },
    methods: {
      handleSubmit: function () {
        let promises = [];
        promises.push(setCustomerServicePhone(this.form.customerServicePhone))
        promises.push(setEstimateTime(this.form.estimateTime))
        promises.push(setSelfPickUpAddress(this.form.selfPickUpAddress))
        promises.push(setDeliverTime(this.form.deliverTime[0], this.form.deliverTime[1]))
        Promise.all(promises).then(() => {
          this.$message.success('修改成功')
        })
      }
    }
  }
</script>

<style scoped>

</style>
