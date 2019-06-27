import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          // shhshs
          component: () => import('@/views/publish')
        },
        {
          name: 'article',
          path: '/article',
          component: () => import('@/views/article')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
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
