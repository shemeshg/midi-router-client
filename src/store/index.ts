import Vue from 'vue'
import Vuex from 'vuex'
import * as Connection from '../src/connection';
import {LoginStatus} from '../src/loginStatus'
import router from '../router'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    loginStatus: Connection.loginStatus,
    dataToClient: "",
  },
  mutations: {
    setLoginStatusRedirect (state, loginStatus: LoginStatus) {
      state.loginStatus = loginStatus
      if (state.loginStatus ){
        router.push('/easyconfig')
      } else {
        router.push('/')
      }
    },
    setLoginStatusNoRedirect (state, loginStatus: LoginStatus) {
      state.loginStatus = loginStatus
    },
    setDataToClient (state, str: string){
      state.dataToClient = str;
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    isLoggedIn: state => {
      if (!state.loginStatus){return false;}
      return state.loginStatus.isLoggedIn;
    },
    defaultPresetName: state => {
      if (state.loginStatus.isLoggedIn){
        return  Connection.loginStatus.userDataConfig.activePreset.name;
      }
      return ""
    }
  }
})
