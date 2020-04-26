<template>
    <div class="allHeight">
      <el-row class="allHeight">
        <el-col :span="24" class="allHeight positionHead">
          <div id="bg-box" class="allHeight positionLocal"></div>
        </el-col>
        <el-col :span="8">

        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        name: "login",
        data(){
            return{

            }
        },
        methods:{

        },
        mounted() {

        }
    }
</script>

<style scoped>

  #bg-box{
    width: 100%;
    background:url("./img/bg.jpg") no-repeat;
    background-size: 100% 100%;
  }

</style>
