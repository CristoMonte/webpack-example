<template>
  <div class="test-page">
    <Hello/>
  </div>
</template>

<script>
import Hello from '../component/Hello'
import util from '../assets/js/index'
export default {
  created () {
    util.test()
  }
}
</script>
