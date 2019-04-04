<template>
  <div class="app-container">
  <OrdersTable type="accept"/>
  </div>
</template>

<script>
  import OrdersTable from './components/OrdersTable'

  export default {
    name: 'Accept',
    components: {
      OrdersTable
    },
  }
</script>

<style scoped>

</style>
