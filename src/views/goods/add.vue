<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="所属类别" prop="category">
        <el-select v-model="form.category.name">
          <el-option v-for="category in categories" :key="category.name" :label="category.name" :value="category.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="当前状态" prop="status">
        <el-select v-model="form.status">
          <el-option label="下架" value="下架"/>
          <el-option label="销售中" value="销售中"/>
          <el-option label="预售中" value="预售中"/>
        </el-select>
      </el-form-item>
      <el-form-item label="剩余库存" prop="stock">
        <el-input-number v-model="form.stock"/>
      </el-form-item>
      <el-form-item label="原价">
        <el-input-number v-model="form.originPrice"/>
      </el-form-item>
      <el-form-item label="售价">
        <el-input-number v-model="form.price"/>
      </el-form-item>
      <el-form-item label="送达时间">
        <div><el-input-number v-model="form.finalDeliverTime"/> 天内</div>
      </el-form-item>
      <el-form-item label="商品图片" prop="pictures">
        <el-upload
          name="pic"
          :action="uploadUrl"
          :auto-upload="true"
          :file-list="form.pictures"
          list-type="picture"
          accept="image/*"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :headers="{Authorization: token}">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="展示图片" prop="previewPic">
        <el-select v-model="form.previewPic">
          <el-option v-for="p in form.pictures" :label="p.name" :value="p.url" :key="p.key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="商品详情" prop="description">
        <el-input :autosize="{minRows: 10}" type="textarea" v-model="form.description"/>
      </el-form-item>
      <!--<el-form-item label="可选项" prop="options">-->
        <!--<div v-for="(option, index) in form.options" :key="index">-->
          <!--<el-row>-->
            <!--<el-col :span="10">-->
              <!--<el-input v-model="option.key"/>-->
              <!--<el-button @click="addValue(index)">添加值</el-button>-->
              <!--<el-button @click="removeOption(index)">删除</el-button>-->
            <!--</el-col>-->
            <!--<el-col :span="10">-->
              <!--<el-row v-for="(value, valueIndex) in option.values" :key="value.key">-->
                <!--<el-input v-model="option.values[valueIndex]"/>-->
                <!--<el-button @click="removeValue(index, valueIndex)">删除</el-button>-->
              <!--</el-row>-->
            <!--</el-col>-->
          <!--</el-row>-->
        <!--</div>-->
        <!--<el-row>-->
          <!--<el-col :span="10">-->
            <!--<el-button @click="addOption">添加选项</el-button>-->
          <!--</el-col>-->
        <!--</el-row>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-col :span="12">
          <el-button type="primary" size="large" class="submit" @click="handleSubmit">提交</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {picUploadUrl, addGood, getCategories, uploadPic} from '../../api/goods'
  import {getToken} from "../../utils/auth";

export default {
  name: 'Add',
  data() {
    return {
      token: '',
      form: {
        name: '',
        category: {name: ''},
        stock: 0,
        options: [],
        pictures: [],
        previewPic: '',
        status: '',
        description: '',
        price: 0,
        originPrice: 0,
        finalDeliverTime: 0
      },
      categories: [],
      uploadUrl: picUploadUrl
    }
  },
  created: function() {
    this.token = 'Bearer ' + getToken()
    getCategories().then(response => {
      this.categories = response.data.categories
    })
  },
  methods: {
    addOption: function() {
      this.form.options.push({ key: '', values: [''] })
    },
    addValue: function(index) {
      this.form.options[index].values.push('')
    },
    removeOption: function(index) {
      this.form.options.splice(index, 1)
    },
    removeValue: function(index, innerIndex) {
      this.form.options[index].values.splice(innerIndex, 1)
    },
    handleSubmit: function() {
      addGood(this.form).then((response) => {
        this.$message.success('提交成功 ')
        this.$refs['form'].resetFields()
      }).catch((err) => this.$message.error(err))
    },
    handleSuccess: function(response, file, fileList) {
      this.form.pictures.push({
        name: response.data.file.filename,
        url: response.data.file.path
      })
    },
    handleRemove: function (file, fileList) {
      this.form.pictures = fileList
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 60%;
}
  .el-button+.el-button {
    margin-left: 0;
  }

  .submit {
    margin-top: 30px;
  }
</style>
