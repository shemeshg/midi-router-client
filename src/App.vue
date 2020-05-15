<template>
  <div id="app">


<div class="w3-sidebar w3-bar-block w3-card w3-animate-left" style="display:none" id="mySidebar" @click="sidebarClose()">
  <button class="w3-bar-item w3-button w3-large"
  >Close &times;</button>

  <router-link class="w3-bar-item w3-button" to="/">Home</router-link> 
  <router-link class="w3-bar-item w3-button" to="/midiinlist" v-if="isLoggedIn">in ports</router-link> 
  <router-link class="w3-bar-item w3-button" to="/virtualports" v-if="isLoggedIn">Virtual ports</router-link> 
  <router-link class="w3-bar-item w3-button" to="/monitor" v-if="isLoggedIn">Monitor</router-link> 
  <router-link class="w3-bar-item w3-button" to="/jsclient" v-if="isLoggedIn">JS routing</router-link> 
  <router-link class="w3-bar-item w3-button" to="/presets" v-if="isLoggedIn">Presets</router-link> 
  <router-link class="w3-bar-item w3-button" to="/usercontrols" v-if="isLoggedIn">User Controls</router-link> 
  <router-link class="w3-bar-item w3-button" to="/easyconfig" v-if="isLoggedIn">Easyconfig</router-link> 
  <router-link class="w3-bar-item w3-button" to="/about">About</router-link>
  <a class="w3-bar-item w3-button"  @click="shutdownQuit" v-if="isLoggedIn">Quit</a>

</div>


    <div id="nav" class="w3-teal w3-bar w3-container w3-row" v-if="isLoggedIn"  style="position: fixed;" >

        <div class="w3-col " style="width:50%" @click="sidebarOpen()">
          <span class="w3-button">&#9776;</span>
        </div>
        <div class="w3-col" style="width:50%" @click="applyChanges">
          <span class="w3-right w3-button">Apply {{defaultPresetName}}</span>
        </div>


    </div>




    <div id="main">
      <router-view/>
    </div>
  </div>
</template>


<script >




import * as Connection from './src/connection'
import * as Utils  from "./src/Utils"

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
    },
    shutdownQuit(){
      Connection.connection.wcuserdata.applicationQuit();
      if (Utils.isElectron()){
        Utils.quitElectron();
      }
      
    }
  },
  computed: {
    // display the item from store state.
    isLoggedIn () {
      return this.$store.getters.isLoggedIn;
    },
    defaultPresetName(){
      return this.$store.getters.defaultPresetName.substring(0,15);
      
    },
    isElectron(){
      return Utils.isElectron()
    }
  },
}
</script>

<style lang="scss">
@import '../node_modules/w3-css/w3.css';
@import '../node_modules/@fortawesome/fontawesome-free/css/all.css';

header {
  padding-top: 15px !important;
}

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


/* 
Round switch START
*/
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
/* 
Round switch END
*/



</style>
