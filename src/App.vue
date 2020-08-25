<template>
  <!-- 直接替换index.html中的节点，所以这里是一个同名的节点 -->
  <!-- 提供的元素只能作为挂载点。不同于 Vue 1.x，所有的挂载元素会被 Vue 生成的 DOM 替换。因此不推荐挂载 root 实例到 <html> 或者 <body> 上。 -->
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created () {
    this.test()
  },
  methods: {
    test () {
      setTimeout(() => {
        console.log('webpack example test function called')
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
  #app {
    text-align: left;
  }
</style>