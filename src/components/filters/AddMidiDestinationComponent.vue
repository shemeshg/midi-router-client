<template>
  <div>
    <header class="w3-container w3-teal">
      <h1>{{ headrMsg }}</h1>
    </header>
    <div class="w3-container w3-margin-top">

      <div class="w3-card-4">
        <div class="w3-container">
        <p>
        </p>

        <div class="w3-container  w3-cell w3-cell-middle">
        Select midi output 
        </div>
        <div class="w3-container  w3-cell w3-cell-middle">
          <select class="w3-select" name="option" v-model.number="inputToAdd">
            <option value=""></option>
            <option v-for="(item) in inPortsWithoutSelf" v-bind:key="item.midiInputId" v-bind:value="item.midiInputId"  >{{item.midiInputId}} - {{item.midiInputName}}</option>
          </select>
        </div>
        <p>
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

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  }
})
export default class AddMidiDestinationComponent extends Vue {
  inputToAdd = "";

  loginStatus!: LoginStatus;

  mounted() {
    if (this.filterid === "-1"){return;}
    this.inputToAdd = this.filterMidiDestination.baseMidiRouteInput.midiInputId.toString();
  }

  get filterMidiDestination(){
    return this.midiRouteInput.midiRouterChains[parseInt(this.chainid)].getFilterMidiDestination(parseInt(this.filterid));
  }

  doOk(){
    if ( this.inputToAdd === ""){return;}
    const inputObj = this.inPortsWithoutSelf.filter( row =>{return row.midiInputId === parseInt(this.inputToAdd)})[0]
    if (this.filterid === "-1"){
      this.midiRouteInput.midiRouterChains[parseInt(this.chainid)].addFilterMidiDestination(inputObj)     
    } else {    
      this.filterMidiDestination.setVal(inputObj);
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

  get inPortsWithoutSelf(){  
    return this.midiRouteInput.inPortsWithoutSelf
  }

  get midiRouteInput() {    
    return Connection.loginStatus.userDataConfig.getMidiRouteInput(parseInt(this.midiinid))
  }

  get filterid(){
    return this.$route.params.filterid;
  }

  get midiinid(){
    return this.$route.params.midiinid;
  }

  get chainid(){
    return this.$route.params.chainid;
  }

  get headrMsg(): string {
    return `${this.midiinid}-${this.chainid} Add Midi Destination`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
