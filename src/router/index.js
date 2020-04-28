import Vue from 'vue';
import Router from 'vue-router';
import login from '@/components/login/login';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    }
  ]
})
router.beforeEach((to,form,next) => {
  if(to.path==='/login'){
    next()
  }else {

  }
})
export default router;
