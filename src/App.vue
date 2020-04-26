<template>
  <div id="app" class="allHeight">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
html,body{
  height: 100%;
  overflow: hidden;
}
.allHeight{
  height: 100%;
}
.positionHead{
  position: relative;
}
.positionLocal{
  position: absolute;
  left: 0;
  top:0;
}
</style>
