<template>
  <div id="app">


<div class="w3-sidebar w3-bar-block w3-card w3-animate-left" style="display:none" id="mySidebar" @click="sidebarClose()">
  <button class="w3-bar-item w3-button w3-large"
  >Close &times;</button>

  <router-link class="w3-bar-item w3-button" to="/">Home</router-link> 
  <router-link class="w3-bar-item w3-button" to="/midiinlist" v-if="isLoggedIn">in ports</router-link> 
  <router-link class="w3-bar-item w3-button" to="/monitor" v-if="isLoggedIn">Monitor</router-link> 
  <router-link class="w3-bar-item w3-button" to="/presets" v-if="isLoggedIn">Presets</router-link> 
  <router-link class="w3-bar-item w3-button" to="/usercontrols" v-if="isLoggedIn">User Controls</router-link> 
  <router-link class="w3-bar-item w3-button" to="/easyconfig" v-if="isLoggedIn">Easyconfig</router-link> 
  <router-link class="w3-bar-item w3-button" to="/about">About</router-link>


</div>


    <div id="nav" class="w3-teal w3-bar w3-container w3-row" v-if="isLoggedIn"  style="position: fixed;" >

        <div class="w3-col " style="width:50%" @click="sidebarOpen()">
          <span>&#9776;</span>
        </div>
        <div class="w3-col" style="width:50%" @click="applyChanges">
          <span class="w3-right">Apply {{defaultPresetName}}</span>
        </div>


    </div>




    <div id="main">
      <router-view/>
    </div>
  </div>
</template>


<script >




import * as Connection from './src/connection'

export default {
  methods: {
    applyChanges(){      
      window.Connection = Connection;
      Connection.loginStatus.userDataConfig.applyChanges(Connection.connection);
    },
    sidebarOpen(){
        //document.getElementById("main").style.marginLeft = "25%";
        //document.getElementById("mySidebar").style.width = "25%";
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("nav").style.display = 'none';
    },
    sidebarClose(){
        document.getElementById("main").style.marginLeft = "0%";
        document.getElementById("mySidebar").style.display = "none";
        document.getElementById("nav").style.display = "inline-block";
    }
  },
  computed: {
    // display the item from store state.
    isLoggedIn () {
      return this.$store.getters.isLoggedIn;
    },
    defaultPresetName(){
      return Connection.loginStatus.userDataConfig.activePreset.name.substring(0,15)
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
