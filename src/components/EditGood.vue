<template>
  <el-dialog :visible.sync="isVisible">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="商品名称">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="所属类别">
        <el-select v-model="form.category.name">
          <el-option v-for="category in categories" :key="category.name" :label="category.name" :value="category.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="剩余库存">
        <el-input-number v-model="form.stock"/>
      </el-form-item>
      <el-form-item label="价格">
        <el-input-number v-model="form.price"/>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload
          name="pic"
          :action="uploadUrl"
          :auto-upload="true"
          :file-list="form.pictures"
          list-type="picture"
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
      <el-form-item label="商品详情">
        <el-input :autosize="{minRows: 10}" type="textarea" v-model="form.description"/>
      </el-form-item>
      <el-form-item label="可选项">
        <div v-for="(option, index) in form.options" :key="index">
          <el-row>
            <el-col :span="10">
              <el-input v-model="option.key"/>
              <el-button @click="addValue(index)">添加值</el-button>
              <el-button @click="removeOption(index)">删除</el-button>
            </el-col>
            <el-col :span="10">
              <el-row v-for="(value, valueIndex) in option.values" :key="value.key">
                <el-input v-model="option.values[valueIndex]"/>
                <el-button @click="removeValue(index, valueIndex)">删除</el-button>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="10">
            <el-button @click="addOption">添加选项</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getGood, getCategories, picUploadUrl, editGood } from '../api/goods'
import {getToken} from "../utils/auth";
export default {
  name: 'EditGood',
  props: {
    goodId: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    category: {
      type: Object,
      default: () => {name: ''}
    },
    stock: {
      type: Number,
      default: 0
    },
    options: {
      type: Array,
      default: () => []
    },
    pictures: {
      type: Array,
      default: () => []
    },
    previewPic: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    isVisible: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        category: '',
        stock: 0,
        options: [], // todo 库存结构{value: '', stock}
        pictures: [],
        previewPic: '',
        description: '',
        price: 0
      },
      token: '',
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
  watch: {
    goodId: function() {
      this.form.id = this.goodId
      getCategories().then((response) => {
        this.categories = response.data.categories
      })
      getGood(this.goodId).then((response) => {
        const good = response.data.good
        this.form.name = good.name || this.name
        this.form.category = good.category || this.category
        this.form.stock = good.stock || this.stock
        this.form.options = good.options || this.options
        this.form.pictures = good.pictures || this.pictures
        this.form.previewPic = good.previewPic || this.previewPic
        this.form.description = good.description || this.description
        this.form.price = good.price || this.price
      })
    }
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
    handleCancel: function() {
      this.$emit('cancel')
    },
    handleConfirm: function() {
      editGood(this.form).then(response => {
        if (response.code == 20000) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }
      })
      this.$emit('confirm')
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

</style>
