<template>
  <div class="about-page">
    <img class="about__img" src="../assets/img/mantou.jpg">
    <p class="text">{{message}}</p>
    <button @click="changeMessage">change message</button>
    <Hello/>
  </div>
</template>

<script>
import Hello from '../component/Hello'
import util from '../assets/js/index'
export default {
  data () {
    return {
      message: 'this is about page'
    }
  },
  components: {
    Hello
  },
  created () {
    console.log('well come to about page')
    util.test()
  },
  methods: {
    changeMessage () {
      this.message = this.message + Math.random()
    }
  }
}
</script>

<style lang="scss" scoped>
  .about-page {
    width: 100%;
    height: 100vh;
    background-color: #f6f6f6;
    .text {
      color: #999;
    }
  }
  .about__img {
    width: 100%;
    height: 650px;
  }
</style>