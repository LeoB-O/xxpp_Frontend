<template>
  <el-dialog :visible.sync="isVisible">
    <el-form label-width="80px">
      <el-form-item label="收货人">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="省">
        <el-input v-model="form.province"/>
      </el-form-item>
      <el-form-item label="市">
        <el-input v-model="form.city"/>
      </el-form-item>
      <el-form-item label="区">
        <el-input v-model="form.district"/>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="form.detail"/>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.phone"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status">
          <el-option value="配送中"/>
          <el-option value="已下单"/>
          <el-option value="已接单"/>
          <el-option value="已送达"/>
          <el-option value="申请退款中"/>
          <el-option value="已退款"/>
          <el-option value="退款已拒绝"/>
        </el-select>
      </el-form-item>
      <el-form-item label="选购的商品">
        <el-row v-for="item in form.items" :key="item.key">
          <el-col :span="4">
            <el-select v-model="item.id">
              <el-option v-for="good in goods" :key="good.id" :value="good.id" :label="good.name"/>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-for="option in getGoodById(item.id).options" v-model="item.options[getOptionIndex(item, option.key)].value" :key="option.key" :placeholder="option.key">
              <el-option v-for="val in option.values" :key="val.key" :value="val"/>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input-number v-model="item.amount" size="small"/>
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
import { getGoods } from '../api/goods'
import {editOrder, getOrders} from "../api/order";

export default {
  name: 'EditOrder',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        name: '',
        province: '',
        city: '',
        district: '',
        detail: '',
        phone: '',
        status: '',
        items: []
      },
      goods: []
    }
  },
  watch: {
    order: function() {
      this.form = this.order
      getGoods().then(response => {
        this.goods = response.data.goods
      })
    }
  },
  methods: {
    handleCancel: function() {
      this.$emit('cancel')
    },
    handleConfirm: function() {
      editOrder(this.form).then(response => {
        if (response.code == 20000) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }
      })
      this.$emit('confirm')
    },
    getGoodById: function(id) {
      return this.goods.filter(value => id == value.id)[0] || []
    },
    getOptionIndex: function(item, optionKey) {
      for (let i=0;i<item.options.length;i++) {
        if (item.options[i].key == optionKey) {
          return i
        }
      }
      item.options.push({key: optionKey, value: ''})
      return item.options.length-1
    }
  }
}
</script>

<style scoped>

</style>
