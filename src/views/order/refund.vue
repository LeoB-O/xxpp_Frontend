<template>
  <div class="app-container">
    <OrdersTable type="refund"/>
  </div>
</template>

<script>
  import OrdersTable from './components/OrdersTable'

  export default {
    name: 'Refund',
    components: {
      OrdersTable
    },
  }
</script>

<style scoped>

</style>
