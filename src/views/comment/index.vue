<template>
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>评论管理</span>
  </div>
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="评论粉丝数">
      </el-table-column>
      <el-table-column
        label="评论状态">
        <template slot-scope="scope">
        <el-switch
          :disabled="scope.row.loaddelable"
          v-model="scope.row.comment_status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="amendStatus(scope.row)">
        </el-switch>
        </template>
      </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
  name: 'comment',
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.loadDataP()
  },
  methods: {
    loadDataP () {
      this.$http({
        method: 'GET',
        url: '/articles',
        params: { response_type: 'comment' }
      }).then(data => {
        data.results.forEach(item => {
          item.loaddelable = false
        })
        this.tableData = data.results
      })
    },
    amendStatus (item) {
      item.loaddelable = true
      console.log(item.loaddelable)
      this.$http({
        method: 'PUT',
        url: 'comments/status',
        params: { article_id: item.id.toString() },
        data: { allow_comment: item.comment_status }
      }).then(() => {
        item.loaddelable = false
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }).catch(error => {
        console.log(error)
        this.$message.error('修改失败')
        item.comment_status = !item.comment_status
        item.loaddelable = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
