import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/
export const constantRouterMap = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},

{
  path: '/',
  component: Layout,
  redirect: '/goods/index',
  name: 'Index',
  hidden: true
},

{
  path: '/goods',
  component: Layout,
  redirect: '/goods/index',
  name: 'Goods',
  meta: {
    title: '商品管理',
    icon: 'price-tag'
  },
  children: [{
    path: 'index',
    name: 'GoodsList',
    component: () => import('@/views/goods/index'),
    meta: {
      title: '商品列表',
      icon: 'calendar'
    }
  }, {
    path: 'add',
    name: 'AddGood',
    component: () => import('@/views/goods/add'),
    meta: {
      title: '添加商品',
      icon: 'add'
    }
  }]
},

  {
    path: '/category',
    component: Layout,
    redirect: '/category/index',
    name: 'Category',
    meta: {
      title: '类别管理',
      icon: 'archive'
    },
    children: [{
      path: 'index',
      name: 'CategoryList',
      component: () => import('@/views/category/index'),
      meta: {
        title: '类别列表',
        icon: 'calendar'
      }
    }, {
      path: 'add',
      name: 'AddCategory',
      component: () => import('@/views/category/add'),
      meta: {
        title: '添加类别',
        icon: 'add'
      }
    }]
  },

{
  path: '/order',
  component: Layout,
  redirect: '/order/index',
  name: 'Order',
  meta: {
    title: '订单管理',
    icon: 'calculator'
  },
  children: [{
    path: 'index',
    name: 'OrderList',
    component: () => import('@/views/order/index'),
    meta: {
      title: '订单列表',
      icon: 'calendar'
    }
  }, {
    path: 'accept',
    name: 'AcceptOrder',
    component: () => import('@/views/order/accept'),
    meta: {
      title: '待接单',
      icon: 'clock'
    }
  }, {
    path: 'deliver',
    name: 'DeliverOrder',
    component: () => import('@/views/order/deliver'),
    meta: {
      title: '待配送',
      icon: 'clock'
    }
  }, {
    path: 'refund',
    name: 'RefundOrder',
    component: () => import('@/views/order/refund'),
    meta: {
      title: '退款订单',
      icon: 'eye'
    }
  }]
},

{
  path: '/info',
  component: Layout,
  redirect: '/info/time',
  name: 'Info',
  meta: {
    title: '信息统计',
    icon: 'file'
  },
  children: [{
    path: 'time',
    name: 'InfoByTime',
    component: () => import('@/views/info/time'),
    meta: {
      title: '按时间统计',
      icon: 'clock'
    }
  }, {
    path: 'goods',
    name: 'InfoByGoods',
    component: () => import('@/views/info/goods'),
    meta: {
      title: '按商品统计',
      icon: 'price-tag'
    }
  }, {
    path: 'export',
    name: 'Export',
    component: () => import('@/components/ExportOriginData'),
    meta: {
      title: '导出原始数据',
      icon: 'price-tag'
    }
  }]
},

  {
    path: '/user',
    component: Layout,
    redirect: '/user/password',
    name: 'User',
    meta: {
      title: '系统设置',
      icon: 'user'
    },
    children: [{
      path: 'password',
      component: () => import('@/views/user/password'),
      meta: {
        title: '修改密码',
        icon: 'password'
      }
    }, {
      path: 'settings',
      component: () => import('@/views/user/setting'),
      meta: {
        title: '店铺设置',
        icon: 'form'
      }
    }]
  },

{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
