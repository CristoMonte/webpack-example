import Router from 'vue-router'
import Vue from 'vue'
Vue.use(Router)

const route = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import(/* webpackChunkName: "Index" */ '../pages/index.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "About"*/ '../pages/about.vue')
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import(/* webpackChunkName: "Test" */ '../pages/test.vue')
    }
  ]
})

export default route