import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import 'amfe-flexible'
import '@/validator'
import relativeTime from '@/filters/relativeTime'
import { NavBar, Field, Button, Cell, CellGroup, Toast, Tab, Tabs, Tabbar, TabbarItem, List, PullRefresh, Popup, Icon, Grid, GridItem, Image, dialog } from 'vant'

Vue.use(NavBar).use(Field).use(Cell).use(CellGroup).use(Toast).use(Button).use(Tab).use(Tabs).use(Tabbar).use(TabbarItem).use(List).use(PullRefresh).use(Popup).use(Icon).use(Grid).use(GridItem).use(Image).use(dialog)

Vue.filter('relativeTime', relativeTime)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
