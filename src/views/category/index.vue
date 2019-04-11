<template>
  <div class="app-container">
    <el-table :data="categories">
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="name" label="类别"/>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" circle/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {deleteCategory, getCategories} from '../../api/goods';
  import {showConfirm} from "../../utils";

  export default {
    name: "index",
    data() {
      return {
        categories: [],
        showConfirm: showConfirm.bind(this)
      }
    },
    created: function () {
      getCategories().then(response => {
        this.categories = response.data.categories
      })
    },
    methods: {
      handleDelete(row) {
        this.showConfirm(() => {
          deleteCategory(row.id)
            .then(() => {this.$message.success('删除成功')})
            .then(() => {return getCategories()})
            .then(response => {this.categories = response.data.categories})
        })
      }
    }
  }
</script>

<style scoped>

</style>
