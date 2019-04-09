<template>
  <div>
    <el-switch active-text="营业中" v-model="switchAutoAccept" @change="handleAutoAccept"/>
    <el-button v-if="type=='accept'" type="primary" @click="handleAcceptAll">一键接单</el-button>
    <div>你有 {{newOrderNum}} 个新订单</div>
    <el-table :data="orders" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline>
            <el-form-item label="商品">
              <div v-for="item in props.row.items" :key="item.key">
                <span>{{ item.name }}</span>
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
      <el-table-column prop="status" label="状态" :filter-method="statusFilter" :filters="[{text: '已下单', value: '已下单'},{text: '已接单', value: '已接单'},{text: '配送中', value: '配送中'},{text: '已送达', value: '已送达'}]"/>
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
          <el-row v-if="type=='index' && scope.row.status != '已送达'"><el-button type="text" size="small" @click="handleClick(scope.row, scope.$index)">确认送达</el-button></el-row>
          <el-row v-if="type=='index' && scope.row.status == '已送达'"><el-button type="text" size="small" @click="handleClick(scope.row, scope.$index)">取消送达</el-button></el-row>
          <el-row v-if="type=='index'"><el-button type="text" size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button></el-row>
          <el-row v-if="type=='index'"><el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)" circle></el-button></el-row>
          <el-row v-if="type=='accept'"><el-button type="text" size="small" @click="handleClick(scope.row, scope.$index)">接单</el-button></el-row>
          <el-row v-if="type=='refund'"><el-button type="text" size="small" @click="handleClick(scope.row, scope.$index)">同意退款</el-button></el-row>
          <el-row v-if="type=='refund'"><el-button type="text" size="small" @click="handleReject(scope.row, scope.$index)">拒绝退款</el-button></el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-col :offset="11" v-if="type=='index'"><el-button @click="loadMore">{{hasMore?'加载更多':'没有更多'}}</el-button></el-col>
    <EditOrder :order="currentOrder" @cancel="isVisible = false" @confirm="isVisible = false" :is-visible="isVisible"/>
    <PrintOrder v-if="type=='accept'" :orders="printOrders" id="print-order" v-show="isPrint"/>
  </div>
</template>

<script>
  import EditOrder from '@/components/EditOrder'
  import PrintOrder from '@/components/PrintOrder'
  import { mapGetters } from 'vuex'
  import print from 'print-js'

  import {deleteOrder, editOrder, getOrders, getOrdersByStatus} from "@/api/order";
  import {setShopStatus} from "../../../api/config";

  export default {
    name: 'OrdersTable',
    components: {
      EditOrder,
      PrintOrder
    },
    props: {
      type: String  // 待接单 或 订单列表（accept/index）
    },
    data() {
      return {
        isVisible: false,
        isPrint: false,
        hasMore: true,
        loading: false,
        currentOrder: {},
        start: 0,
        offset: 30,
        switchAutoAccept: true,
        orders: [],
        printOrders: []
      }
    },
    computed: {
      ...mapGetters(['newOrderNum', 'autoAccept'])
    },
    watch: {
      newOrderNum: function () {
        if (this.type=='accept') {
          getOrdersByStatus('已下单').then(response => {
            this.orders = response.data.orders
            this.$store.commit('SET_NEW_ORDER_NUM', this.orders.length)
          })
        }
      }
    },
    created: function() {
      this.switchAutoAccept = this.$store.state.order.autoAccept //实际上是是否接单
      setShopStatus(this.switchAutoAccept)
      this.loading = true
      if(this.type=='index') {
        getOrders(this.start, this.offset).then(response => {
          this.orders = response.data.orders
          this.currentOrder = this.orders[0]
          this.start += this.offset
          this.loading = false
        })
      }
      if(this.type=='accept') {
        let loadData = (start, offset) => {
          getOrdersByStatus('已下单', start, offset).then(response => {
            this.orders = this.orders.concat(response.data.orders)
            if (response.data.orders.length > 0) {
              loadData(start+offset, offset)
            } else {
              this.currentOrder = this.orders[0]
              this.$store.commit('SET_NEW_ORDER_NUM', this.orders.length)
              this.loading = false
            }
          })
        }
        loadData(0, 100)
      }
      if(this.type=='refund') {
        getOrdersByStatus('申请退款中').then(response => {
          this.orders = response.data.orders
          this.currentOrder = this.orders[0]
          this.$store.commit('SET_NEW_ORDER_NUM', this.orders.length)
          this.loading = false
        })
      }
    },
    methods: {
      handleClick: function(row, index) {
        let originStatus = row.status
        if(this.type=='index') {
          row.status = row.status=='已送达'?'配送中':'已送达'
          editOrder(row).then(response => {
            if (response.code != 20000) {
              row.status = originStatus
            }
          })
        }
        if (this.type=='accept') {
          row.status = '已接单'
          this.printOrders = [row]
          this.isPrint = true
          this.$nextTick(() => {
            print('print-order', 'html')
          })
          editOrder(row).then(response => {
            if (response.code != 20000) {
              row.status = originStatus
            } else {
              getOrdersByStatus('已下单').then(response => {
                this.isPrint = false
                this.orders = response.data.orders
                this.$store.commit('SET_NEW_ORDER_NUM', this.orders.length)
              })
            }
          })
        }
        if (this.type=='refund') {
          row.status = '已退款'
          editOrder(row).then(response => {
            if (response.code != 20000) {
              row.status = originStatus
            } else {
              getOrdersByStatus('申请退款中').then(response => {
                this.orders = response.data.orders
              })
            }
          })
        }
      },
      handleReject: function(row, index) {
        row.status = '退款已拒绝'
        editOrder(row).then(response => {
          if (response.code != 20000) {
            row.status = originStatus
          } else {
            getOrdersByStatus('申请退款中').then(response => {
              this.orders = response.data.orders
            })
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
      totalPrice: function(item) {
        return item.amount * item.price
      },
      statusFilter: function(value, row, col) {
        return row.status == value
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
      },
      handleAutoAccept: function (newVal) {
        this.$store.commit('CHANGE_AUTO_ACCEPT', newVal)
        setShopStatus(newVal)
      },
      handleAcceptAll: function () {
        let promises = []
        this.printOrders = this.orders
        this.isPrint = true
        this.$nextTick(() => {
          print('print-order', 'html')
        })
        let accept = () => {
          console.log(this.orders);
          if (this.orders.length == 0) {
            return;
          } else {
            while (this.orders.length > 0) {
              let order = this.orders.shift();
              console.log(promises)
              promises.push(new Promise(((resolve, reject) => {
                order.status = '已接单'
                editOrder(order).then(response => {
                  if (response.code == 20000) {
                    resolve()
                  } else {
                    reject()
                  }
                })
              })))
              if (promises.length == 30) {
                Promise.all(promises).then(() => {
                  promises = [];
                  accept();
                })
                break
              }
            }
          }
        }
        accept()
        Promise.all(promises).then(() => {
          console.log('ok');
          getOrdersByStatus('已下单').then(response => {
            this.orders = response.data.orders
            this.isPrint = false
            this.$store.commit('SET_NEW_ORDER_NUM', this.orders.length)
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
