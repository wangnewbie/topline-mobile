import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import 'amfe-flexible'
import { NavBar, Field, Button, Cell, CellGroup, Toast } from 'vant'

Vue.use(NavBar).use(Field).use(Cell).use(CellGroup).use(Toast).use(Button)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
