<template>
  <div class="hello">
  
<header class="w3-container w3-teal">
  <h1>{{ headrMsg }}</h1>
</header>
<div class="w3-container  w3-margin-top">
<div class="w3-container w3-card-4">
<p v-if="!isLoggedIn">
<input class="w3-input" type="text" style="width:90%" required v-model="serverName">
<label>Server name</label></p>
<p v-if="!isLoggedIn">
<input class="w3-input" type="number" style="width:90%" required v-model="serverPort">
<label>Port number</label></p>
<p v-if="!isLoggedIn">
<button class="w3-button w3-section w3-teal w3-ripple" @click="doLogin"> Log in </button></p>
<p v-if="isLoggedIn">
<button class="w3-button w3-section w3-teal w3-ripple" @click="doLogout"> Log out </button></p>

</div>
<p v-if="isLoggedIn">
<button class="w3-button w3-section w3-teal w3-ripple w3-margin-left" @click="doShutdown">Shutdown Server</button>

<button class="w3-button w3-section w3-teal w3-ripple w3-margin-left" @click="doRestart">Restart Server</button>



</p>
</div>


    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { mapGetters } from 'vuex'

import {LoginStatus} from '../src/loginStatus'
import * as Connection from '../src/connection';

@Component({
  computed: {
    ...mapState([
      'loginStatus'
    ]),
    ...mapGetters([
      'isLoggedIn',
    ]),
  },
})
export default class Login extends Vue {
  @Prop() private msg!: string;
  isLoggedIn!: boolean;
  loginStatus!: LoginStatus;

  serverName = Connection.loginStatus.serverName;
  serverPort = Connection.loginStatus.serverPort;
  errMsg = Connection.loginStatus.errMsg;
  

  async doLogin(){
    await Connection.login(this.serverName, this.serverPort);
    this.errMsg = Connection.loginStatus.errMsg;
    this.$store.commit('setLoginStatusRedirect', Connection.loginStatus);
  }


  async doShutdown(){
    Connection.connection.wcuserdata.applicationQuit();
    //Connection.loginStatus.isLoggedIn = false;
    this.$store.commit('setLoginStatusRedirect', Connection.loginStatus);
  }

  async doRestart(){
    await Connection.connection.wcmidiin.restart();
    await Connection.connection.wcmidiout.restart();
    this.doLogout();
  }

  async doLogout(){
    await Connection.connection.close();
    //Connection.loginStatus.isLoggedIn = false;
    this.$store.commit('setLoginStatusRedirect', Connection.loginStatus);
  }


  get myGet(): number {
    return 3
  }  

  get headrMsg(): string{
    if (this.isLoggedIn) {
      return this.loginStatus.serverName + ":" + this.loginStatus.serverPort; 
    } else {
      if (this.errMsg){
        return this.errMsg;
      }
      return "Not connected - try again"
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
