<template>
  <div class="outer">
    <div v-for="order in orders" :key="order.key">
      <div>
        <span>名称</span>
        <span>单价</span>
        <span>数量</span>
        <span>总价</span>
      </div>
      <div v-for="item in order.items" :key="item.key">
        <span>{{item.name}}</span>
        <span>${{item.price}}</span>
        <span>{{item.amount}}</span>
        <span>${{(+item.price) * (+item.amount)}}</span>
      </div>
      <div>
        {{order.name}}
      </div>
      <div>
        {{order.phone}}
      </div>
      <div>
        {{order.province + order.city + order.district + order.detail}}
      </div>
      <hr/>
    </div>
  </div>
</template>

<script>
    export default {
        name: "PrintOrder",
      props: {
          orders: Array
      }
    }
</script>

<style scoped>
span {
  display: inline-block;
  width: 12mm;
}
  .outer {
    width: 58mm;
  }
</style>
