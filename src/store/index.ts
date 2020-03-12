import Vue from 'vue'
import Vuex from 'vuex'
import * as Connection from '../src/connection';
import {LoginStatus} from '../src/loginStatus'
import router from '../router'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    loginStatus: Connection.loginStatus
  },
  mutations: {
    setLoginStatusRedirect (state, loginStatus: LoginStatus) {
      state.loginStatus = loginStatus
      if (state.loginStatus ){
        router.push('/midiinlist')
      } else {
        router.push('/')
      }
    },
    setLoginStatusNoRedirect (state, loginStatus: LoginStatus) {
      state.loginStatus = loginStatus
    },
  },
  actions: {
  },
  modules: {
  },
  getters: {
    isLoggedIn: state => {
      if (!state.loginStatus){return false;}
      return state.loginStatus.isLoggedIn;
    }
  }
})
