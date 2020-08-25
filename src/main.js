import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 这种写法需要编译器，所以在webpack打包的时候，需要假如一个别名`vue$: 'vue/dist/vue.esm.js'`引入运行时+编译器版本的vue
// 但是生产的版本实际上是不需要编译器的，所以推荐引入运行时版本，运行时版本就需要使用render写法，
// 使用render写法是，默认会引入运行时的包，但是并不确定是不是esm版本的，所以最好也声明一个别名。
// new Vue({
//   el: '#app',
//   components: { App },
//   template: '<App/>'
// })

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
