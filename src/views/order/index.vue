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
      <el-table-column label="收货地址">
        <template slot-scope="address">
          {{address.row.province + address.row.city + address.row.district + address.row.detail}}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column label="下单时间">
        <template slot-scope="time">
          {{new Date(time.row.createTime).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-row v-if="scope.row.status != '已送达'"><el-button type="text" size="small" @click="handleClick(scope.row, scope.$index)">确认送达</el-button></el-row>
          <el-row v-else><el-button type="text" size="small" @click="handleClick(scope.row, scope.$index)">取消送达</el-button></el-row>
          <el-row><el-button type="text" size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button></el-row>
          <el-row><el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)" circle></el-button></el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-col :offset="11"><el-button @click="loadMore">{{hasMore?'加载更多':'没有更多'}}</el-button></el-col>
    <EditOrder :order="currentOrder" @cancel="isVisible = false" @confirm="isVisible = false" :is-visible="isVisible"/>
  </div>
</template>

<script>
import EditOrder from '@/components/EditOrder'

import {deleteOrder, editOrder, getOrders} from "../../api/order";

export default {
  name: 'Index',
  components: {
    EditOrder
  },
  data() {
    return {
      isVisible: false,
      hasMore: true,
      currentOrder: {},
      start: 0,
      offset: 30,
      orders: [
        {
          id: '001',
          name: '张三',
          province: '江苏省',
          city: '镇江市',
          district: '京口区',
          detail: '学府路301号',
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
    getOrders(this.start, this.offset).then(response => {
      this.orders = response.data.orders
      this.start += this.offset
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
    handleDelete: function(row) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder(row.id).then(response => {
          if (response.code == 20000) {
            this.$message.success('删除成功')
          } else {
            this.$message.error(response.message || '删除失败')
          }
        }).then(() => {
          this.start = 0;
          getOrders(this.start, this.offset).then(response => {
            this.orders = response.data.orders
            this.start += this.offset
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

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
      getOrders(this.start, this.offset).then(response => {
        if (response.data.orders.length == 0) {
          this.$message.info("没有更多")
          this.hasMore = false
        } else {
          this.hasMore = true
          this.orders = this.orders.concat(response.data.orders)
          this.start += this.offset
          this.$nextTick(() => {
            document.documentElement.scrollTop = originScrollTop
          })
        }
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
