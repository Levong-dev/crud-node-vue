import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faSignOutAlt, faPlusCircle, faPaperPlane, faTrash, faPen, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Font Awesome
library.add(faUser, faSignOutAlt, faPlusCircle, faPaperPlane, faTrash, faPen, faSyncAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Components
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Dashboard from './components/Dashboard.vue';

// Store
import store from './store'

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

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') == null) {
      next({ path: '/' });
    } else{
      fetch("http://localhost:3000/verifyToken", {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      }).then(data => {

        console.log(data.status)

        if(data.status != 200){
          localStorage.clear('token');
          return next({ path: '/' })
        }

        return next();
      })
    }
  }
  else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('token') != null) {
      fetch("http://localhost:3000/verifyToken", {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      }).then(data => {
        if(data.status != 200){
          return next()
        }

        return next({ path: '/dashboard'});
      })
    } else {
      next()
    }
  }
  else{
    next();
  }
})

new Vue({
  store,
  render: h => h(App),
  router
}).$mount('#app')
