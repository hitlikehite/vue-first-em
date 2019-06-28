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
            </el-form-item>
            <el-form-item label="频道">
              <article-channel v-model="form.channel_id"></article-channel>
            </el-form-item>
          </el-form>
    </div>
  </el-card>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import articleChannel from '@/components/article-channel'

export default {
  name: 'AppPublish',
  components: {
    quillEditor,
    articleChannel
  },
  data () {
    return {
      form: {
        title: '',
        content: '',
        channel_id: '',
        cover: {
          type: 0,
          images: []
        }
      },
      editorOption: {
        // some quill options
      },
      isEdit: false
    }
  },
  created () {
    this.editarticle()
  },
  methods: {
    onEditorBlur (quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      console.log('editor ready!', quill)
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
        this.isEdit = true
        this.$http({
          method: 'GET',
          url: '/articles/' + this.$route.params.id
        }).then(data => {
          // console.log(data)
          this.form = data
        })
      }
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
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
</style>
