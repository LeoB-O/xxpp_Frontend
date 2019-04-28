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
                <!--<span class="options">-->
                  <!--<div v-for="option in item.options" :key="option.key">{{option.key}}:{{option.value}}</div>-->
                <!--</span>-->
                <span>¥{{ item.price }}</span>
                <span>x{{ item.amount }}</span>
                <span>{{ totalPrice(item) }}</span>
              </div>
            </el-form-item>
            <el-form-item label="备注">
              <div>{{props.row.note}}</div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="订单编号"/>
      <el-table-column prop="name" label="收货人"/>
      <el-table-column label="收货地址">
        <template slot-scope="address">
          <div v-if="!address.row.isSelfPickUp">{{address.row.province + address.row.city + address.row.district + address.row.detail}}</div>
          <div v-else>自提</div>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话"/>
      <el-table-column prop="status" label="状态" :filter-method="statusFilter"
                       :filters="[{text: '已下单', value: '已下单'},{text: '已接单', value: '已接单'},{text: '配送中', value: '配送中'},{text: '已送达', value: '已送达'}]"/>
      <el-table-column prop="isPreSale" label="是否预售" :filter-method="preSaleFilter"
                       :filters="[{text: '预售', value: '预售'}, {text: '现货', value: '现货'}]">
        <template slot-scope="scope">
          {{scope.row.isPreSale?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="time">
          {{new Date(time.row.createTime).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column label="配送时间">
        <template slot-scope="time">
          <div v-if="!time.row.isPreSale">{{time.row.requestDeliverTime}}</div>
          <div v-else>{{time.row.items[0].options[0].value[0] + ' ' + time.row.items[0].options[0].value[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-row v-if="(type=='index'||type=='deliver') && scope.row.status == '已接单'">
            <el-button type="text" size="small" @click="handleClick(scope.row, scope.$index)">开始配送</el-button>
          </el-row>
          <el-row v-if="(type=='index'||type=='deliver') && scope.row.status == '配送中'">
            <el-button type="text" size="small" @click="handleClick(scope.row, scope.$index)">确认送达</el-button>
          </el-row>
          <el-row v-if="type=='index'">
            <el-button type="text" size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
          </el-row>
          <el-row v-if="type=='index'">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)"
                       circle></el-button>
          </el-row>
          <el-row v-if="type=='accept'">
            <el-button type="text" size="small" @click="handleClick(scope.row, scope.$index)">接单</el-button>
          </el-row>
          <el-row v-if="type=='refund'">
            <el-button type="text" size="small" @click="handleClick(scope.row, scope.$index)">处理退款</el-button>
          </el-row>
          <el-row v-if="type=='refund'">
            <el-button type="text" size="small" @click="handleReject(scope.row, scope.$index)">拒绝退款</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-col :offset="11" v-if="type=='index'">
      <el-button @click="loadMore">{{hasMore?'加载更多':'没有更多'}}</el-button>
    </el-col>
    <EditOrder :order="currentOrder" @cancel="isVisible = false" @confirm="isVisible = false" :is-visible="isVisible"/>
    <PrintOrder v-if="type=='accept'" :orders="printOrders" id="print-order" v-show="isPrint"/>
  </div>
</template>

<script>
  import EditOrder from '@/components/EditOrder'
  import PrintOrder from '@/components/PrintOrder'
  import {mapGetters} from 'vuex'
  import print from 'print-js'
  import {deleteOrder, editOrder, getOrders, getOrdersByStatus} from "@/api/order";
  import {getSettings, setShopStatus} from "../../../api/config";
  import {showConfirm} from "../../../utils";

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
        printOrders: [],
        showConfirm: showConfirm.bind(this)
      }
    },
    computed: {
      ...mapGetters(['newOrderNum', 'autoAccept'])
    },
    watch: {
      newOrderNum: function () {
        if (this.type == 'accept') {
          getOrdersByStatus('已下单').then(response => {
            this.orders = response.data.orders
            this.$store.commit('SET_NEW_ORDER_NUM', this.orders.length)
          })
        }
      }
    },
    created: function () {
      getSettings().then(response => {
        this.switchAutoAccept = response.data.settings.isOpen
        this.$store.commit('CHANGE_AUTO_ACCEPT', this.switchAutoAccept)
      })
      // this.switchAutoAccept = this.$store.state.order.autoAccept //实际上是是否接单
      // setShopStatus(this.switchAutoAccept)
      this.loading = true
      if (this.type == 'index') {
        getOrders(this.start, this.offset).then(response => {
          this.orders = response.data.orders
          this.currentOrder = this.orders[0]
          this.start += this.offset
          this.loading = false
        })
      }
      if (this.type == 'deliver') {
        getOrdersByStatus('已接单').then(response => {
          this.orders = response.data.orders
          this.currentOrder = this.orders[0]
          return getOrdersByStatus('配送中')
        }).then(response => {
          this.orders = this.orders.concat(response.data.orders)
          this.loading = false
        })
      }
      if (this.type == 'accept') {
        let loadData = (start, offset) => {
          getOrdersByStatus('已下单', start, offset).then(response => {
            this.orders = this.orders.concat(response.data.orders)
            if (response.data.orders.length > 0) {
              loadData(start + offset, offset)
            } else {
              this.currentOrder = this.orders[0]
              this.$store.commit('SET_NEW_ORDER_NUM', this.orders.length)
              this.loading = false
            }
          })
        }
        loadData(0, 100)
      }
      if (this.type == 'refund') {
        getOrdersByStatus('申请退款中').then(response => {
          this.orders = response.data.orders
          this.currentOrder = this.orders[0]
          this.loading = false
        })
      }
    },
    methods: {
      handleClick: function (row, index) {
        let originStatus = row.status
        if (this.type == 'index' || this.type == 'deliver') {
          row.status = row.status == '已接单' ? '配送中' : '已送达'
          editOrder(row).catch(() => {
            row.status = originStatus
          })
        }
        if (this.type == 'accept') {
          let order = {
            id: row.id,
            status: '已接单'
          }
          // row.status = '已接单'
          this.printOrders = [row]
          this.isPrint = true
          this.$nextTick(() => {
            print({printable: 'print-order', type: 'html', targetStyles: ['*']})
            editOrder(order)
              .then(() => getOrdersByStatus('已下单'))
              .then(response => {
                this.isPrint = false
                this.orders = response.data.orders
                this.$store.commit('SET_NEW_ORDER_NUM', this.orders.length)
              })
              .catch(() => {
                row.status = originStatus
              })
          })
        }
        if (this.type == 'refund') {
          window.open('https://pay.weixin.qq.com/index.php/core/trade/search_new')
          // row.status = '已退款'
          // editOrder(row)
          //   .then(() => getOrdersByStatus('申请退款中'))
          //   .then(response => {
          //     this.orders = response.data.orders
          //   })
          //   .catch(() => {
          //     row.status = originStatus
          //   })
        }
      },
      handleReject: function (row, index) {
        row.status = '退款已拒绝';
        editOrder(row)
          .then(() => getOrdersByStatus('申请退款中'))
          .then(response => {
            this.orders = response.data.orders
          })
          .catch(() => {
            row.status = '申请退款中'
          })
      },
      handleEdit: function (row, index) {
        this.currentOrder = row
        this.isVisible = !this.isVisible
      },
      handleDelete: function (row) {
        this.showConfirm(() => {
          deleteOrder(row.id)
            .then(() => {
              this.$message.success('删除成功')
            })
            .then(() => {
              this.start = 0;
              return getOrders(this.start, this.offset)
            }).then(response => {
            this.orders = response.data.orders
            this.start += this.offset
          })
        })
      },
      totalPrice: function (item) {
        return item.amount * item.price
      },
      statusFilter: function (value, row, col) {
        return row.status == value
      },
      preSaleFilter: function (value, row, col) {
        // return row.isPreSale
        if (value == '预售')
          return row.isPreSale
        else
          return !row.isPreSale
      },
      loadMore: function () {
        let originScrollTop = document.documentElement.scrollTop;
        getOrders(this.start, this.offset).then(response => {
          if (response.data.orders.length === 0) {
            this.$message.info("没有更多");
            this.hasMore = false
          } else {
            this.hasMore = true;
            this.orders = this.orders.concat(response.data.orders);
            this.start += this.offset;
            this.$nextTick(() => {
              document.documentElement.scrollTop = originScrollTop
            })
          }
        })
      },
      handleAutoAccept: function (newVal) {
        this.$store.commit('CHANGE_AUTO_ACCEPT', newVal);
        setShopStatus(newVal);
      },
      handleAcceptAll: function () {
        let promises = [];
        this.printOrders = this.orders;
        this.isPrint = true;
        this.$nextTick(() => {
          print({printable: 'print-order', type: 'html', targetStyles: ['*']})
          let accept = () => {
            promises = [];
            while (this.orders.length > 0) {
              let order = this.orders.shift();
              let sOrder = {
                id: order.id,
                status: '已接单'
              };
              order.status = '已接单';
              promises.push(new Promise(((resolve, reject) => {
                editOrder(sOrder)
                  .then(() => {
                    resolve()
                  })
                  .catch(() => {
                    reject()
                  })
              })));
              if (promises.length === 30) {
                Promise.all(promises).then(() => {
                  accept();
                });
                break
              }
            }
          };
          accept();
          Promise.all(promises).then(() => {
            getOrdersByStatus('已下单').then(response => {
              this.orders = response.data.orders;
              this.isPrint = false;
              this.$store.commit('SET_NEW_ORDER_NUM', this.orders.length);
            })
          })
        });

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
