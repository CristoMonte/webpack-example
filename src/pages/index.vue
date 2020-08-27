<template>
  <div class="index-page">
    <Hello/>
    <button class="index-page__btn" @click="toAbout">to about</button>
  </div>
</template>

<script>
import Hello from '../component/Hello'
import util from '../assets/js/index'
export default {
  components: {
    Hello
  },
  created () {
    util.test()
  },
  methods: {
    toAbout () {
      console.log('index called')
      this.$router.push('/about')
    }
  }
}
</script>
 
<style lang="scss" scoped>
.index-page {
  text-align: center;
}
.index-page__btn {
  box-sizing: border-box;
  width: 100px;
  height: 20px;
  background: #ff0;
  border: none;
}
</style>