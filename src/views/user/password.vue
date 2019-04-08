<template>
  <div class="app-container">
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input type="password" v-model="ruleForm2.oldPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="ruleForm2.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPassword">
        <el-input type="password" v-model="ruleForm2.checkPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {changePassword} from "../../api/login";
  import SHA256 from'crypto-js/sha256'

  export default {
    name: 'password',
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPassword !== '') {
            this.$refs.ruleForm2.validateField('checkPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm2: {
          oldPassword: '',
          newPassword: '',
          checkPassword: ''
        },
        rules2: {
          oldPassword: [
            { validator: validatePass, trigger: 'blur' }
          ],
          newPassword: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPassword: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            changePassword(SHA256(this.ruleForm2.oldPassword).toString(), SHA256(this.ruleForm2.newPassword).toString()).then(response => {
              if (response.code == 20000) {
                this.$message.success('修改成功')
                this.$refs[formName].resetFields();
              } else {
                this.$message.error('失败')
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
