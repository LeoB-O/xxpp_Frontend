<template>
  <div class="app-container">
    <OrdersTable type="deliver"/>
  </div>
</template>

<script>
import OrdersTable from './components/OrdersTable'

export default {
  name: 'Index',
  components: {
    OrdersTable
  }
}
</script>

<style scoped>

</style>
