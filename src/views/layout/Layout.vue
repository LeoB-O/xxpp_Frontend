<template>
  <div :class="classObj" class="app-wrapper">
    <audio :src="baseUrl+ '/static/newOrder.mp3'" hidden id="orderNotice"></audio>
    <audio :src="baseUrl + '/static/autoAccept.mp3'" hidden id="autoAccept"></audio>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar/>
      <app-main/>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import PrintOrder from '../../components/PrintOrder'
import ResizeMixin from './mixin/ResizeHandler'
import io from 'socket.io-client'
import { mapGetters } from 'vuex'
import print from 'print-js'
import {getOrdersByStatus} from "../../api/order";

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    PrintOrder
  },
  data() {
    return {
      io: '',
      baseUrl: '',
      currentOrder: {}
    }
  },
  computed: {
    ...mapGetters(['newOrderNum', 'autoAccept'])
  },
  mixins: [ResizeMixin],
  created: function() {
    getOrdersByStatus('已下单').then(response => {
      this.$store.commit('SET_NEW_ORDER_NUM', response.data.orders.length)
    })
    this.baseUrl = process.env.BASE_URL
    this.io = io(process.env.BASE_API)
    this.io.on('newOrder', (data) => {
      let notice = document.getElementById('orderNotice')
      let accept = document.getElementById('autoAccept')
      if (this.$store.state.order.autoAccept) {
        // 直接执行打印逻辑
        // data是新订单的内容
        accept.play()
        this.currentOrder = data.order
        this.$nextTick(() => {
          print('print-order', 'html')
        })
      } else {
        // 新订单+1
        notice.play()
        this.$store.commit('NEW_ORDER')
      }
    })
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
