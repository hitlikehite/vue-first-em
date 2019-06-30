import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: JSON.parse(window.localStorage.getItem('user_info'))
  },
  mutations: {
    updatePhoto (state, data) {
      Object.assign(state.userInfo, data)
      window.localStorage.setItem('user_info', JSON.stringify(state.userInfo))
    },
    storageLogin (state, data) {
      state.userInfo = data
    }
  }
})

export default store
