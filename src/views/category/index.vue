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
  export default {
    name: "index",
    data() {
      return {
        categories: [{id: '123', name: '美容养颜'}]
      }
    },
    created: function() {
      getCategories().then(response => {
        this.categories = response.data.categories
      })
    },
    methods: {
      handleDelete(row) {
        // todo 弹框确认删除
        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCategory(row.id).then(response => {
            if (response.code == 20000) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
            return
          }).then(() => {
            getCategories().then(response => {
              this.categories = response.data.categories
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>
