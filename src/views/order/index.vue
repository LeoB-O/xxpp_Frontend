<template>
  <div class="app-container">
    <el-table :data="orders">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline>
            <el-form-item label="商品">
              <div v-for="item in props.row.items" :key="item.key">
                <span>{{ item.name }}</span>
                <!--<span class="options">{{ showOptions(item.options) }}</span>-->
                <span class="options">
                  <div v-for="option in item.options" :key="option.key">{{option.key}}:{{option.value}}</div>
                </span>
                <span>¥{{ item.price }}</span>
                <span>x{{ item.amount }}</span>
                <span>{{ totalPrice(item) }}</span>
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="订单编号"/>
      <el-table-column prop="name" label="收货人"/>
      <el-table-column prop="address" label="收货地址"/>
      <el-table-column prop="phone" label="联系电话"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column prop="createTime" label="下单时间"/>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status != '已送达'" type="text" size="small" @click="handleClick(scope.row, scope.$index)">确认送达</el-button>
          <el-button v-else type="text" size="small" @click="handleClick(scope.row, scope.$index)">取消送达</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :offset="11"><el-button @click="loadMore">加载更多</el-button></el-col>
    <EditOrder :order="currentOrder" @cancel="isVisible = false" @confirm="isVisible = false" :is-visible="isVisible"/>
  </div>
</template>

<script>
import EditOrder from '@/components/EditOrder'

import {editOrder, getOrders} from "../../api/order";

export default {
  name: 'Index',
  components: {
    EditOrder
  },
  data() {
    return {
      isVisible: false,
      currentOrder: {},
      orders: [
        {
          id: '001',
          name: '张三',
          address: '江苏大学D区5栋101',
          phone: '13566668888',
          status: '派送中',
          createTime: '2019年3月27日10:00',
          items: [{
            name: '香蕉',
            amount: 3,
            options: [{
              key: '选项1',
              value: '值1'
            }],
            price: 32
          }, {
            name: '苹果',
            amount: 3,
            options: [{
              key: '选项1',
              value: '值1'
            }, {
              key: '选项2',
              value: '值2'
            }],
            price: 32
          }]
        }
      ]
    }
  },
  created: function() {
    getOrders().then(response => {
      this.orders = response.data.orders
    })
  },
  methods: {
    handleClick: function(row, index) {
      let originStatus = row.status
      row.status = row.status=='已送达'?'派送中':'已送达'
      editOrder(row).then(response => {
        if (response.code != 20000) {
          row.status = originStatus
        }
      })
    },
    handleEdit: function(row, index) {
      this.currentOrder = row
      this.isVisible = !this.isVisible
    },
    showOptions: function(options) {
      console.log(options)
      let result = ''
      for (const o of options) {
        result += o.key + ':' + o.value + ' '
      }
      return result
    },
    totalPrice: function(item) {
      return item.amount * item.price
    },
    loadMore: function() {
      let originScrollTop = document.documentElement.scrollTop
      getOrders().then(response => {
        this.orders = this.orders.concat(response.data.orders)
        this.$nextTick(() => {
          document.documentElement.scrollTop = originScrollTop
        })
      })
    }
  }
}
</script>

<style scoped>
span {
  margin: 0 10px;
}
  .options {
    display: inline-block;
    width: 200px;
    vertical-align: top;
  }
</style>
