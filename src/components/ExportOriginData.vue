<template>

</template>

<script>
  import XLSX from 'xlsx'
  import {getOrders} from "../api/order";
    export default {
        name: "ExportOriginData",
      data: {},
      created: function () {

      },
      methods: {
          createSheet: function () {
            getOrders().then(response => {
              let data = response.data.map(value => {
                return {

                }
              })
              let sheet = XLSX.utils.json_to_sheet()
            })
          }
      }
    }
</script>

<style scoped>

</style>
