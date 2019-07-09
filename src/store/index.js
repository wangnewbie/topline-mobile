import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, setUser } from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // user: JSON.parse(window.localStorage.getItem('user'))
    user: getUser()
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // window.localStorage.setItem('user', JSON.stringify(state.user))
      setUser(state.user)
    }
  },
  actions: {

  }
})
