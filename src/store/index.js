import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions.js'
import * as getters from './getters.js'
import * as mutations from './mutations.js'
Vue.use(Vuex);
const state = {
    loginAbout:{

    },
    dataAbout:{

    },
    textAbout:{
      username:'王男'
   }
};

const store = new Vuex.Store({
   state,          //共同维护的状态对象
   actions,        //异步修改数据的方法
   mutations,      //异步修改的具体操作
   getters         //获取具体数据的计算属性
})

export default store;
