<template>
  <div>
    <header class="w3-container w3-teal">
      <h1>{{ headrMsg }}</h1>
    </header>
    <div class="w3-container w3-margin-top">

      <div class="w3-card-4">
        <div class="w3-container">
        <p >
          <label>Server name/ip</label>
          <input class="w3-input" type="text" v-model="serverName"> 
        </p>
        <p >
          <label>Server port number</label>
          <input class="w3-input" type="number" v-model.number="portNumber">
        </p> 
        <p>
          <button
            @click="getRemotePorts"
              class="w3-button w3-section w3-teal w3-ripple"
            >Get remote ports</button>
        </p>

        <p>
          <label>Server remote midi port</label>
          <select class="w3-select" name="option" v-model.number="destinationMidiId">
            <option value=""></option>
            <option v-for="itm in remoteMidiPorts" v-bind:key="itm.midiInputId" v-bind:value="itm.midiInputId" >{{itm.midiInputId}} - {{itm.midiInputName}}</option>
          </select>
        </p>     
        </div>
      </div>

      <div class="w3-card-4">
        <div class="w3-container">
                    <button
              class="w3-button w3-section w3-teal w3-ripple"
              @click="doOk"
            >OK</button>
          <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
              @click="doCancel"
            >Cancel</button>
        </div>
      </div>

    </div>
  </div>
  
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import {LoginStatus} from '../../src/loginStatus'
import * as Connection from "../../src/connection";
import * as MidiRoutePreset from "../../src/UserDataConfig/MidiRoutePreset"

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  }
})
export default class AddNetworkDestinationComponent extends Vue {

  loginStatus!: LoginStatus;
  serverName = ""
  portNumber = 12345
  destinationMidiId = ""
  remoteMidiPorts: MidiRoutePreset.BaseMidiRouteInput[] = []


  get filterid(){
    return this.$route.params.filterid;
  }
  get filterObj(){
    return this.midiRouteInput.midiRouterChains[parseInt(this.chainid)].getFilterNetworkDestination(parseInt(this.filterid));
  }

  mounted() {
    if (this.filterid === "-1"){return;}
    this.serverName = this.filterObj.serverName
    this.portNumber = this.filterObj.serverPort
    this.destinationMidiId = this.filterObj.baseMidiRouteInput.midiInputId.toString()
    this.remoteMidiPorts = [this.filterObj.baseMidiRouteInput]
  }

  doOk(){
    if (this.destinationMidiId === ""){return ;}
    

      const inputObj = this.remoteMidiPorts.filter( row =>{return row.midiInputId === parseInt(this.destinationMidiId)})[0]

      if (this.filterid === "-1"){
        this.midiRouteInput.midiRouterChains[parseInt(this.chainid)].addFilterNetworkDestination(this.serverName, this.portNumber, inputObj)
      }else {
        this.filterObj.setVal(this.serverName, this.portNumber, inputObj)
      }
      
      this.$router.push(`/midiin/${this.midiinid}`)

  }

  doCancel(){
    if (this.filterid === "-1"){
      this.$router.push(`/AddChainFilter/${this.midiinid}/${this.chainid}`);
    } else {
      this.$router.push(`/midiin/${this.midiinid}`) 
    }
  }

  async getRemotePorts(){
    this.destinationMidiId = "";
    this.remoteMidiPorts = [];
    const l = await Connection.loginNoSingleTon(this.serverName, this.portNumber)

    const keys = Object.keys( l.inPorts)
    
    for (let i = 0;i<keys.length;i++){
      const ikey= parseInt(keys[i]);
      this.remoteMidiPorts.push(new MidiRoutePreset.BaseMidiRouteInput(ikey, l.inPorts[ikey]) )
    }


    
  }

  get midiRouteInput() {    
    return Connection.loginStatus.userDataConfig.getMidiRouteInput(parseInt(this.midiinid))
  }

  get midiinid(){
    return this.$route.params.midiinid;
  }

  get chainid(){
    return this.$route.params.chainid;
  }

  get headrMsg(): string {
    return `${this.midiinid}-${this.chainid} Add Network Destination`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
