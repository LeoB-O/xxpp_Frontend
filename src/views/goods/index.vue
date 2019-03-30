<template>
  <div class="app-container">
    <el-table :data="goods">
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="name" label="商品名称"/>
      <el-table-column prop="category.name" label="所属类别"/>
      <el-table-column prop="stock" label="剩余库存"/>
      <el-table-column label="可选项">
        <template slot-scope="scope">
          <span v-for="option in scope.row.options" :key="option.key">{{ option.key }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态"/>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status != '销售中'" type="text" size="small" @click="handleClick(scope.row, scope.$index)">上架</el-button>
          <el-button v-else type="text" size="small" @click="handleClick(scope.row, scope.$index)">下架</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <EditGood :is-visible="isVisible" @cancel="isVisible = false" @confirm="isVisible = false"/>
  </div>
</template>

<script>
import EditGood from '@/components/EditGood'

import { getGoods, changeStatus } from '../../api/goods'

export default {
  name: 'Index',
  components: {
    EditGood
  },
  data() {
    return {
      goods: [],
      isVisible: false
    }
  },
  created: function() {
    getGoods().then((response) => {
      console.log(response)
      this.goods = response.data.goods
    }).catch((e) => {
      console.log(e)
    })
  },
  methods: {
    handleClick: function(row, index) {
      let status = row.status == '下架'?'销售中':'下架'
      changeStatus(row.goodId, status).then(response => {
        if (response.code == 20000) {
          row.status = status
        }
      })
    },
    handleEdit: function(row, index) {
      this.isVisible = !this.isVisible
    }
  }
}
</script>

<style scoped>
</style>
