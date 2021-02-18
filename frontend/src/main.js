import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Components
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Dashboard from './components/Dashboard.vue';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
// Vue router
Vue.use(VueRouter)

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Login,
      name: 'login',
      meta: {
        guest: true,
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Register,
      meta: {
        guest: true
      }
    },
    {
      path: '/dashboard',
      component: Dashboard,
      name: 'dashboard',
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({ path: '/' });
    } else{
      next();
    }
  }

  else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') != null) {
      next({ path: '/dashboard'});
    } else {
      next()
    }
  }

  else{
    next();
  }
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
