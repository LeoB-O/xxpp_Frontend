<template>
  <div class="app-container">
    <el-table :data="goods" @expand-change="handleExpand">
      <el-table-column type="expand">
        <template slot-scope="reviews">
          <el-form label-position="left" inline>
            <el-form-item label="评论">
              <el-row v-for="review in reviews.row.reviews" :key="review.key">
                <span>{{review.userId}}</span>
                <span>{{review.content}}</span>
                <span>{{new Date(review.createdAt).toLocaleString()}}</span>
                <span><el-button type="danger" icon="el-icon-delete" @click="handleDeleteReview(reviews.row, review.id)" size="mini" circle/></span>
              </el-row>
              <el-row>
                <el-button type="primary" @click="loadMore(reviews.row)" :disabled="!reviews.row.hasMore" size="mini">{{reviews.row.hasMore?'加载更多':'没有更多'}}</el-button>
              </el-row>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="name" label="商品名称"/>
      <el-table-column prop="price" label="价格"/>
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
          <el-row v-if="scope.row.status!= '销售中'"><el-button type="text" size="small" @click="handleClick(scope.row, scope.$index)">上架</el-button></el-row>
            <el-row v-else><el-button type="text" size="small" @click="handleClick(scope.row, scope.$index)">下架</el-button></el-row>
            <el-row><el-button type="text" size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button></el-row>
            <el-row><el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" circle></el-button></el-row>
        </template>
      </el-table-column>
    </el-table>
    <EditGood :goodId="currentGood" :is-visible="isVisible" @cancel="isVisible = false" @confirm="handleConfirm"/>
  </div>
</template>

<script>
import EditGood from '@/components/EditGood'

import {getGoods, changeStatus, deleteGood} from '../../api/goods'
import {deleteReview, getReviews} from "../../api/reviews";

export default {
  name: 'Index',
  components: {
    EditGood
  },
  data() {
    return {
      goods: [],
      isVisible: false,
      currentGood: ''
    }
  },
  created: function() {
    getGoods().then((response) => {
      this.goods = response.data.goods.map(value => {
        return {
          id: value.id,
          name: value.name,
          category: value.category,
          stock: value.stock,
          status: value.status,
          pictures: value.pictures,
          description: value.description,
          price: value.price,
          options: value.options,
          reviews: [],
          start: 0,
          offset: 30,
          hasMore: true
        }
      })
    }).catch((e) => {
    })
  },
  methods: {
    handleExpand: function(row) {
      getReviews(row.id, row.start, row.offset).then(response => {
        if (response.code == 20000 && response.data.reviews.length > 0) {
          row.reviews = row.reviews.concat(response.data.reviews)
          row.start += row.offset
        } else{
          row.hasMore = false
        }
      })
    },
    loadMore: function(row) {
      getReviews(row.id, row.start, row.offset).then(response => {
        if (response.code == 20000 && response.data.reviews.length > 0) {
          row.reviews = row.reviews.concat(response.data.reviews)
          row.start += row.offset
        } else{
          row.hasMore = false
        }
      })
    },
    handleClick: function(row, index) {
      let status = row.status == '下架'?'销售中':'下架'
      changeStatus(row.id, status).then(response => {
        if (response.code == 20000) {
          row.status = status
          this.$message({type: 'success', message: '操作成功'})
        }
      })
    },
    handleEdit: function(row, index) {
      this.currentGood = row.id
      this.isVisible = !this.isVisible
      getGoods().then((response) => {
        this.goods = response.data.goods
      }).catch((e) => {
      })
    },
    handleDelete: function(row) {
      // todo 弹窗确认是否删除
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGood(row.id).then(response => {
          if (response.code != 20000) {
            this.$message.error(response.message || 'error when delete good');
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          getGoods().then((response) => {
            this.goods = response.data.goods
          }).catch((e) => {
            console.log(e)
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleDeleteReview: function(good, reviewId) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteReview(good.id, reviewId).then(response => {
          if (response.code == 20000) {
            this.$message.success('删除成功')
          }
        }).then(() => {
          good.start = 0;
          good.hasMore = true;
          getReviews(good.id, good.start, good.offset).then(response => {
            if (response.code == 20000 && response.data.reviews.length > 0) {
              good.reviews = response.data.reviews
              good.start += good.offset
            } else{
              row.hasMore = false
            }
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleConfirm: function () {
      this.isVisible = false;
      getGoods().then((response) => {
        this.goods = response.data.goods.map(value => {
          return {
            id: value.id,
            name: value.name,
            category: value.category,
            stock: value.stock,
            status: value.status,
            pictures: value.pictures,
            description: value.description,
            price: value.price,
            options: value.options,
            reviews: [],
            start: 0,
            offset: 30,
            hasMore: true
          }
        })
      }).catch((e) => {
      })
    }
  }
}
</script>

<style scoped>
  span {
    display: inline-block;
    min-width: 100px;
  }
</style>
