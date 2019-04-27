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
    <el-form-item>
      <el-button @click="handleSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {getSettings, setCustomerServicePhone, setEstimateTime, setSelfPickUpAddress} from "../../api/config";

  export default {
    name: "setting",
    data() {
      return {
        form: {
          customerServicePhone: '',
          estimateTime: '',
          selfPickUpAddress: ''
        }
      }
    },
    created: function () {
      getSettings().then(response => {
        this.form.customerServicePhone = response.data.settings.customerServicePhone
        this.form.estimateTime = response.data.settings.estimateTime
        this.form.selfPickUpAddress = response.data.settings.selfPickUpAddress
      })
    },
    methods: {
      handleSubmit: function () {
        let promises = [];
        promises.push(setCustomerServicePhone(this.form.customerServicePhone))
        promises.push(setEstimateTime(this.form.estimateTime))
        promises.push(setSelfPickUpAddress(this.form.selfPickUpAddress))
        Promise.all(promises).then(() => {
          this.$message.success('修改成功')
        })
      }
    }
  }
</script>

<style scoped>

</style>
