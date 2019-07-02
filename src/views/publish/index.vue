<template>
  <el-card class="box-card">
    <div slot="header" class="headerfabu">
      <div>{{ isEdit?"修改文章":"发布文章" }}</div>
      <div>
        <el-button @click="buttonclick(false)">{{ isEdit?"修改文章":"发布文章" }}</el-button>
        <el-button @click="buttonclick(true)">存入草稿</el-button>
      </div>
    </div>
    <div>
      <el-form ref="form" :model="form">
            <el-form-item label="标题">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item >
              <quill-editor v-model="form.content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)">
              </quill-editor>
            </el-form-item>
            <el-form-item label="封面">
              <div>
                <!-- 选项按钮 -->
                <el-radio-group v-model="form.cover.type">
                  <el-radio :label="1">单图</el-radio>
                  <el-radio :label="3">三图</el-radio>
                  <el-radio :label="0">无图</el-radio>
                  <el-radio :label="-1">自动</el-radio>
                </el-radio-group>
              </div>
              <!-- 图片组件 -->
              <template v-if="form.cover.type > 0">
                <el-row :gutter="40">
                  <el-col :span="6" v-for="n in form.cover.type" :key="n">
                    <upload-img v-model="form.cover.images[n-1]" ></upload-img>
                  </el-col>
                </el-row>
              </template>
            </el-form-item >
            <el-form-item label="频道" class="statuspindao">
              <article-channel v-model="form.channel_id"></article-channel>
            </el-form-item>
          </el-form>
    </div>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import articleChannel from '@/components/article-channel'
import uploadImg from '@/views/publish/commponents'

export default {
  name: 'AppPublish',
  components: {
    quillEditor,
    articleChannel,
    uploadImg
  },
  data () {
    return {
      form: {
        title: '',
        content: '',
        channel_id: '',
        cover: {
          type: 1,
          images: []
        }
      },
      editorOption: {
      }
    }
  },
  created () {
    this.editarticle()
  },
  watch: {
    $route (to, from) {
      // 如果你是从更新页面来的
      if (from.name === 'publish-edit') {
        this.form = {
          title: '', // 标题
          content: '', // 内容
          cover: { // 封面
            type: 1, // 封面类型 -1:自动，0-无图，1-1张，3-3张
            images: [] // 图片链接
          },
          channel_id: '' // 频道
        }
      }
    }
  },
  methods: {
    onEditorBlur (quill) {
    },
    onEditorFocus (quill) {
    },
    onEditorReady (quill) {
    },
    sendarticle (draft) {
      this.$http({
        method: 'POST',
        url: '/articles',
        data: this.form,
        params: { draft }
      }).then(data => {
        this.$message({
          message: '发布成功',
          type: 'success'
        })
      })
    },
    buttonclick (draft) {
      if (this.isEdit) {
        this.editarticleup(draft)
      } else {
        this.sendarticle(draft)
      }
    },
    editarticleup (draft) {
      this.$http({
        method: 'put',
        url: '/articles/' + this.$route.params.id,
        data: this.form,
        params: { draft }
      }).then(data => {
        this.$message({
          message: '发布成功',
          type: 'success'
        })
      })
    },
    editarticle () {
      console.log(this.$route.params.id)
      if (this.$route.params.id) {
        this.$http({
          method: 'GET',
          url: '/articles/' + this.$route.params.id
        }).then(data => {
          this.form = data
        })
      }
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    },
    isEdit () {
      return this.$route.name === 'publish-edit'
    }
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
  }
}
</script>

<style lang="less" scoped>
.headerfabu {
  display: flex;
  justify-content: space-between;
}
.statuspindao {
  margin-top: 30px;
}
</style>
