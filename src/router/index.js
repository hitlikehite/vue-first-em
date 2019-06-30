import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      // name: 'layout', // 由于它有默认子路由，所以它的名字没有意义，否则 Vue 会给你发黄牌警告
      path: '/',
      component: () => import('@/views/layout'),
      // 嵌套路由：https://router.vuejs.org/zh/guide/essentials/nested-routes.html
      // 所有 children 路由都显示到父路由的 router-view 中
      children: [
        {
          name: 'home',
          path: '', // 它就是 layout 的默认子路由
          component: () => import('@/views/home')
        },
        { // 发布文章
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        { // 编辑文章
          name: 'publish-edit',
          path: '/publish/:id',
          component: () => import('@/views/publish')
        },
        {
          name: 'article-list',
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'article-comment',
          path: '/comment',
          component: () => import('@/views/comment')
        },
        { // 账户设置
          name: 'account-setting',
          path: '/account',
          component: () => import('@/views/account')
        },
        { // 图片管理
          name: 'image',
          path: '/image',
          component: () => import('@/views/image')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})

router.beforeEach((to, path, next) => {
  nprogress.start()
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  if (to.path !== '/login') {
    if (userInfo) {
      next()
    } else {
      next({ name: 'login' })
    }
  } else {
    if (userInfo) {
      return next(false)
    }
    next()
  }
})
router.afterEach((to, from) => {
  nprogress.done()
})
export default router
