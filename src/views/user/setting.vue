<template>
  <el-form label-width="80px" ref="form" :model="form">
    <el-form-item label="客服电话" prop="customerServicePhone">
      <el-input v-model="form.customerServicePhone"/>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {getSettings, setCustomerServicePhone} from "../../api/config";

  export default {
    name: "setting",
    data() {
      return {
        form: {
          customerServicePhone: ''
        }
      }
    },
    created: function () {
      getSettings().then(response => {
        this.form.customerServicePhone = response.data.settings.customerServicePhone
      })
    },
    methods: {
      handleSubmit: function () {
        setCustomerServicePhone(this.form.customerServicePhone).then(() => {
          this.$message.success('修改成功')
        })
      }
    }
  }
</script>

<style scoped>

</style>
