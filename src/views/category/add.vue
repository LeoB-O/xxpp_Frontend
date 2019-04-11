<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="类别名称" prop="name">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {addCategory} from "../../api/goods";

  export default {
    name: "add",
    data() {
      return {
        form: {name: ''}
      }
    },
    methods: {
      handleSubmit: function () {
        addCategory(this.form.name).then(() => {
          this.$message.success('提交成功')
          this.$refs['form'].resetFields()
        })
      }
    }
  }
</script>

<style scoped>

</style>
