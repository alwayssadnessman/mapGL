<template>
    <div class="box-position">
        <p>{{username}}</p>
    </div>
</template>

<script>
    import {mapGetters,mapActions} from 'vuex';
    export default {
        name: "loginBox",
        data(){
            return{

            }
        },
        methods:{
          ...mapActions(["changeUserName"])
        },
        computed: {
          ...mapGetters(["username"])
        },
        mounted() {
            var _this = this;
            _this.changeUserName('222')
        }
    }
</script>

<style scoped>
  .box-position{
    position: absolute;
    z-index: 1;
    right: 1rem;
    color: white;
  }
</style>
