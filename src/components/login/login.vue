<template>
    <div class="allHeight">
      <el-row class="allHeight">
        <el-col :span="24" class="allHeight positionHead">
          <div id="bg-box" class="allHeight positionLocal"></div>
          <loginBox></loginBox>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    import loginBox from "./componentsOwn/loginBox";
    export default {
        name: "login",
        data(){
            return{

            }
        },
        methods:{

        },
        components:{
          loginBox:loginBox
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
