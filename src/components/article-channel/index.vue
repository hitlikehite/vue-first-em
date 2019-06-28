<template>
  <!-- 动态绑定数据中的filterParams.channel_id值 value为选中时给的值 -->
  <el-select :value="value" placeholder="频道" @change="handleChange" clearable>
    <el-option :label="item.name" :value="item.id" v-for="item in Channels" :key="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'articleChannel',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      Channels: []// 所有频道
    }
  },
  created () {
    this.loadChannels()// 获取频道数据
  },
  methods: {
    // 获取频道列表
    loadChannels () { // 获取频道总个数
      this.$http({
        method: 'get',
        url: '/channels'
      }).then(data => {
        this.Channels = data.channels
      })
    },
    handleChange (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
