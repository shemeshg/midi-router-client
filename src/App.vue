<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/midiinlist" v-if="isLoggedIn">in ports</router-link> <span v-if="isLoggedIn">|</span>
<!--  <router-link to="/virtualports" v-if="isLoggedIn">virtual ports</router-link> <span v-if="isLoggedIn">|</span> -->
      <router-link to="/monitor" v-if="isLoggedIn">Monitor</router-link> <span v-if="isLoggedIn">|</span>
      <router-link to="/presets" v-if="isLoggedIn">Presets</router-link> <span v-if="isLoggedIn">|</span>
      <router-link to="/usercontrols" v-if="isLoggedIn">User Controls</router-link> <span v-if="isLoggedIn">|</span>
      <router-link to="/easyconfig" v-if="isLoggedIn">Easyconfig</router-link> <span v-if="isLoggedIn">|</span>
      <a href="#" v-if="isLoggedIn" @click="applyChanges">Apply changes</a> <span v-if="isLoggedIn">|</span>
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>


<script >
import * as Connection from './src/connection'

export default {
  methods: {
    applyChanges(){
      Connection.loginStatus.userDataConfig.applyChanges(Connection.connection);
    }

  },
  computed: {
    // display the item from store state.
    isLoggedIn () {
      return this.$store.getters.isLoggedIn;
    }
  },
}
</script>

<style lang="scss">
@import '../node_modules/w3-css/w3.css';
@import '../node_modules/@fortawesome/fontawesome-free/css/all.css';
.w3-margin-left {
    margin-left: 8px!important;
}

.unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
