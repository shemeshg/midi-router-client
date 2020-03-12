<template>
  <div>

    <header class="w3-container w3-teal">
      <h1>Virtual ports</h1>
    </header>
    <div class="w3-container w3-margin-top">
      <div class="w3-card-4">
        <header class="w3-container w3-blue">
          <h5>Virtual in ports</h5>
        </header>
        <div class="w3-container">


      <div>
        <div class="w3-container  w3-cell w3-cell-middle">
            <div class="w3-container  w3-cell w3-cell-middle"> 
            <label>Name</label>
            <input class="w3-input" type="text" v-model="inPort" @focus="$event.target.select()">
            </div>
        </div>
        <div class="w3-container  w3-cell w3-cell-middle">
           <button
            class="w3-button w3-section w3-teal w3-ripple w3-margin-left "
            @click="addInPort"
          >+</button> 
        </div>
      </div>

<p>
      <ul class="w3-ul w3-border w3-hoverable w3-margin-left">
<li class="w3-display-container" v-for="(inport, idx) in virtualInPorts" v-bind:key="inport" >
  {{inport}}
  <span @click="inPortSplice(idx)" class="w3-button w3-transparent w3-display-right">&times;</span></li>
      </ul>
  </p>


        </div>
        <header class="w3-container w3-blue">
          <h5>Virtual out ports</h5>
        </header>
        <div class="w3-container">


      <div>
        <div class="w3-container  w3-cell w3-cell-middle">
            <div class="w3-container  w3-cell w3-cell-middle">
            <label>Name</label>
            <input class="w3-input" type="text" v-model="outPort" @focus="$event.target.select()">
            </div>
        </div>
        <div class="w3-container  w3-cell w3-cell-middle">
           <button
            class="w3-button w3-section w3-teal w3-ripple w3-margin-left "
            @click="addOutPort"
          >+</button> 
        </div>
      </div>

<p>
      <ul class="w3-ul w3-border w3-hoverable w3-margin-left">
<li class="w3-display-container" v-for="(outport, idx) in virtualOutPorts" v-bind:key="outport">{{outport}} 
  <span @click="outPortSplice(idx)" class="w3-button w3-transparent w3-display-right">&times;</span></li>
      </ul>
  </p>

        </div>        
      </div>
    </div>




</div>

</template>


<script lang="ts">
import { Component,  Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import {LoginStatus} from '../src/loginStatus'

import * as Connection from "../src/connection";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  }
})
export default class VirtualportsComponent extends Vue {

  loginStatus!: LoginStatus;

  inPort = ""
  outPort = ""

  virtualInPorts: string[] = Connection.loginStatus.userDataConfig.virtualInPorts;
  virtualOutPorts: string[] = Connection.loginStatus.userDataConfig.virtualOutPorts;


  outPortSplice(idx: number){
    Connection.loginStatus.userDataConfig.virtualOutPorts.splice(idx,1);
  }

  inPortSplice(idx: number){
    Connection.loginStatus.userDataConfig.virtualInPorts.splice(idx,1);
  }
    addInPort(){
      if (this.inPort && Connection.loginStatus.userDataConfig.virtualInPorts.indexOf(this.inPort) === -1){
        Connection.loginStatus.userDataConfig.virtualInPorts.push(this.inPort);
      }
      
    }

    addOutPort(){
      if (this.outPort && Connection.loginStatus.userDataConfig.virtualOutPorts.indexOf(this.outPort) === -1){
        Connection.loginStatus.userDataConfig.virtualOutPorts.push(this.outPort);
      }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
