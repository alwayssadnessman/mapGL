import Vue from 'vue';
import Router from 'vue-router';
import index from '@/components/index/index';
import login from '@/components/login/login';
import mapGL from '@/components/mapGL/mapGL';
import mapGLm from '@/components/mapGLN/mapGLm';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: index
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },{
      path: '/map',
      name: 'mapGL',
      component: mapGL
    },{
      path: '/mapGLN',
      name: 'mapGLN',
      component: mapGLm
    }
  ]
})
router.beforeEach((to,form,next) => {
  if(to.path==='/login'){
    next()
  }else {
    console.log(to)
    next()
  }
})
export default router;
