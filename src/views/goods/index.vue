<template>
  <div class="app-container">
    <el-table ref="table" :data="goods" @expand-change="loadReviews" @selection-change="handleSelectionChange">
      <el-table-column
        label="首页轮播"
        type="selection"
        width="55">
      </el-table-column>
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
                <el-button type="primary" @click="loadReviews(reviews.row)" :disabled="!reviews.row.hasMore" size="mini">{{reviews.row.hasMore?'加载更多':'没有更多'}}</el-button>
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

import {getGoods, changeStatus, deleteGood, setIndexItems} from '../../api/goods'
import {deleteReview, getReviews} from "../../api/reviews";
import {getSettings} from "../../api/config";
import {showConfirm} from '../../utils/index'

export default {
  name: 'Index',
  components: {
    EditGood
  },
  data() {
    return {
      goods: [],
      indexItems: [],
      isVisible: false,
      currentGood: '',
      firstLoad: true,
      showConfirm: showConfirm.bind(this)
    }
  },
  created: function() {
    this.getData()
  },
  methods: {
    getData: function() {
      this.firstLoad = true
      getSettings()
        .then(response => {
          this.indexItems = response.data.settings.items;
        })
        .then(()=>getGoods())
        .then((response) => {
          this.goods = response.data.goods.map(value => {
            return {
              id: value.id,
              name: value.name,
              category: value.category,
              stock: value.stock,
              status: value.status,
              pictures: value.pictures,
              previewPic: value.previewPic,
              description: value.description,
              price: value.price,
              options: value.options,
              reviews: [],
              sale: value.sale,
              start: 0,
              offset: 30,
              hasMore: true
            }
          })
        })
        .then(() => {
          this.indexItems.forEach(item => {
            this.goods.forEach(good => {
              if (good.id == item.id) {
                this.$refs.table.toggleRowSelection(good, true)
              }
            })
          })
          this.firstLoad = false;
        })
        .catch((e) => {
        })
    },
    loadReviews: function(row) {
      getReviews(row.id, row.start, row.offset).then(response => {
        if (response.data.reviews.length > 0) {
          row.reviews = row.reviews.concat(response.data.reviews)
          row.start += row.offset
        } else{
          row.hasMore = false
        }
      })
    },
    handleClick: function(row, index) {
      let status = row.status == '下架'?'销售中':'下架'
      changeStatus(row.id, status).then(() => {
        row.status = status
        this.$message({type: 'success', message: '操作成功'})
      })
    },
    handleEdit: function(row, index) {
      this.currentGood = row.id
      this.isVisible = !this.isVisible
      this.getData()
    },
    handleDelete: function(row) {
      this.showConfirm(() => {
        deleteGood(row.id).then(() => {
          this.$message.success('删除成功')
          this.loadData()
        })
      })
    },
    handleDeleteReview: function(good, reviewId) {
      this.showConfirm(() => {
        deleteReview(good.id, reviewId).then(() => {
          this.$message.success('删除成功')
        }).then(() => {
          good.start = 0;
          good.hasMore = true;
          good.reviews = [];
          this.loadReviews(good);
        })
      })
    },
    handleConfirm: function () {
      this.isVisible = false;
      this.getData();
    },
    handleSelectionChange: function (val) {
      if (!this.firstLoad) {
        setIndexItems(val).then(() => {this.$message.success('设置首页显示成功')})
      }
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
