<template>
  <div class="outer" style="display: flex; flex-direction: column">
    <div v-for="order in orders" :key="order.key">
      <div class="items">
        <span>名称</span>
        <span>单价</span>
        <span>数量</span>
        <span>总价</span>
      </div>
      <div v-for="item in order.items" :key="item.key" class="items" style="height: auto; margin: 20px 0;">
        <span style="height: auto; display: block;">{{item.name}}</span>
        <span style="display: block;">${{item.price}}</span>
        <span style="display: block;">{{item.amount}}</span>
        <span style="display: block;">${{(+item.price) * (+item.amount)}}</span>
      </div>
      <div>
        {{order.name}}
      </div>
      <div>
        {{order.phone}}
      </div>
      <div>
        <div v-if="!order.isSelfPickUp">{{order.province + order.city + order.district + order.detail}}</div>
        <div v-else>自提</div>
      </div>
      <div>
        <div v-if="order.isPreSale">配送时间：{{order.items[0].options[0].value[0]+order.items[0].options[0].value[1]}}</div>
        <div v-else>配送时间：{{order.requestDeliverTime}}</div>
      </div>
      <div>
        备注：{{order.note}}
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
  display: block;
  width: 12mm;
  text-align: center;
}
  .outer {
    width: 58mm;
    display: flex;
    flex-direction: column;
  }
  div {
    margin: 10px;
  }
  .items {
    display: flex;
    justify-content: space-between;
  }
</style>
