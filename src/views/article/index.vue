<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>筛选条件</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <!-- ref绑定当前的表单   :model动态绑定数据    :rules="rules"表单数据验证规则 -->
      <el-form ref="filterParams" :model="filterParams" label-width="80px">
        <el-form-item label="查询">
          <!-- 动态绑定数据中的filterParams.status值 label为选中时给的值 -->
          <el-radio-group v-model="filterParams.status">
            <el-radio label="">全部</el-radio>
            <el-radio :label="index+''" v-for="(item, index) in statTypes" :key="index" >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <article-channel v-model="filterParams.channel_id"></article-channel>
        </el-form-item>
        <el-form-item label="时间">
          <div class="block">
            <!-- 动态绑定数据中的value1值 但这个数据与后端接口要使用的值不符， 需要另行转换 -->
            <!-- value-format="yyyy-MM-dd" 转换时间的格式，可以供我们使用 -->
            <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" @change="handleDateChange" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitSearch" :loading="articleLoading">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{totalCount}}条符合信息的条件</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <el-table :data="articlelist" style="width: 100%" v-loading="articleLoading">
        <el-table-column label="封面" width="180">
          <!-- 插槽   scope.row为遍历时的item -->
          <template slot-scope="scope">
            <img width="50" :src="scope.row.cover.images[0]" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <!-- statTypes[scope.row.status].type" 获取数据statTypes中的数据 -->
            <el-tag type="statTypes[scope.row.status].type">{{statTypes[scope.row.status].label}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="时间">
        </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button @click="$router.push(`/publish/${scope.row.id}`)">编辑</el-button><el-button @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- total为数据的总条数    current-page为数据绑定时的页面数 -->
      <el-pagination background layout="prev, pager, next" :total="totalCount" @current-change="handleCurrentChange" :disabled="articleLoading"
      :current-page="page">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
import articleChannel from '@/components/article-channel'
export default {
  name: 'ArticleList',
  components: {
    articleChannel
  },
  data () {
    return {
      articlelist: [], // 文章列表的数据
      totalCount: 0, // 总文章数
      articleLoading: false, // 是否禁用按钮
      statTypes: [ // 文章状态
        {
          type: 'info', // 控制数据的格式的
          label: '草稿'// 状态
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      filterParams: { // 查询加载文章列表的数组
        begin_pubdate: '', // 查询开始时间
        end_pubdate: '', // 查询结束时间
        status: '', // 文章状态
        channel_id: ''// 文章频道
      },
      page: 1,
      value1: ''// 搜索时间的数据无实际用途，但没有不会有change事件触发
    }
  },
  created () {
    this.articleLoading = true// 禁用按钮
    this.handleArticle()// 文章加载
  },
  methods: {
    onSubmitSearch () { // 搜索按钮点击事件
      this.page = 1// 将页码状态调到第一页
      this.handleArticle()// 文章加载
    },

    handleArticle (page = 1) { // 文章加载
      let shuju = {}
      for (let key in this.filterParams) { // 筛选出空的参数去除，否则axios请求时会报错
        if (this.filterParams[key]) {
          shuju[key] = this.filterParams[key]
        }
      }
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page,
          ...shuju
        }
      }).then((res) => {
        this.articlelist = res.results
        this.totalCount = res.total_count// 控制页面显示的总条数
        this.articleLoading = false
      })
    },

    handleDelete (id) { // 删除数据
      this.$http({
        method: 'DELETE',
        url: `/articles/${id}`
      }).then((res) => {
        this.handleArticle()
      })
    },

    handleCurrentChange (page) { // 点击分页按钮触发的数据
      this.page = page
      this.articleLoading = true
      this.handleArticle(page)
    },

    // 时间改变触发的函数 参数为选择的时间
    handleDateChange (data) {
      this.filterParams.begin_pubdate = data[0]
      this.filterParams.end_pubdate = data[1]
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin: 20px;
}
</style>
