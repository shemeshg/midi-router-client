<template>
  <div>
    <header class="w3-container w3-teal">
      <h1>{{ headrMsg }}</h1>
    </header>
    <div class="w3-container w3-margin-top">

      <div class="w3-card-4">
        <div class="w3-container">
          <p>
         <label>Description</label>
          <input class="w3-input" type="text" v-model="description">            
          </p>
         <p >
         <label>Condition action</label>
          <select class="w3-select" name="option" v-model.number="conditionAction">
            <option value="0">Do not delete</option>
            <option value="1">Delete if not met condition</option>
            <option value="2">Delete if met condition</option>
          </select>
        </p>

        </div>
      </div>
      <div class="w3-card-4 w3-margin-top">
        <header class="w3-container w3-blue">
          <h5>Channels</h5>
        </header>
        <div class="w3-container">
         <p >
         <label>Channels</label>
          <input class="w3-input" type="text"  v-model="filterChannel">
        </p>

        
        </div>
      </div>

      <div class="w3-card-4 w3-margin-top">
        <header class="w3-container w3-blue">
          <h5>Events</h5>
        </header>
        <div class="w3-container">
         <p >
         <label>Events</label>
          <input class="w3-input" type="text" v-model="filterEvents">
        </p>

        <pre>
          noteoff: 0x8,           // 8
          noteon: 0x9,            // 9
          keyaftertouch: 0xA,     // 10
          controlchange: 0xB,     // 11
          channelmode: 0xB,       // 11
          nrpn: 0xB,              // 11
          programchange: 0xC,     // 12
          channelaftertouch: 0xD, // 13
          pitchbend: 0xE          // 14
        </pre>
        
        </div>
      </div>

      <div class="w3-card-4 w3-margin-top">
        <header class="w3-container w3-blue">
          <h5>Data 1</h5>
        </header>
        <div class="w3-container">
         <p >
         <label>Data 1</label>
          <input class="w3-input" type="text" v-model="filterData1">
        </p>

        
        </div>
      </div>

      <div class="w3-card-4 w3-margin-top">
        <header class="w3-container w3-blue">
          <h5>Data 2</h5>
        </header>
        <div class="w3-container">
         <p >
         <label>Data 2</label>
          <input class="w3-input" type="text" v-model="filterData2">
        </p>

        
        </div>
      </div>

      <div class="w3-card-4">
        <div class="w3-container">
                    <button
              class="w3-button w3-section w3-teal w3-ripple"
            @click = "doOk"
            >OK</button>
          <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
              @click = "doCancel"
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
export default class AddFilterTransformComponent extends Vue {

  loginStatus!: LoginStatus;

  description = "";
  conditionAction = 0;
  filterChannel = "[[0,16,0]]"
  filterEvents = "[[0,16,0]]"
  filterData1 = "[[0,127,0]]"
  filterData2 = "[[0,127,0]]"


  get filterid(){
    return this.$route.params.filterid;
  }
  get filterObj(){
    return this.midiRouteInput.midiRouterChains[parseInt(this.chainid)].getFilterFilterAndTransform(parseInt(this.filterid));
  }
  mounted() {
    if (this.filterid === "-1"){return;}
    this.conditionAction = this.filterObj.conditionAction;
    this.description = this.filterObj.name
    this.filterChannel = this.filterObj.filterChannel
    this.filterEvents = this.filterObj.filterEvents
    this.filterData1 = this.filterObj.filterData1
    this.filterData2 = this.filterObj.filterData2
  }

  doOk(){
    if (this.description === ""){this.description = "Filter and transform"}
    if (this.filterid === "-1"){
        this.midiRouteInput.midiRouterChains[parseInt(this.chainid)].addFilterFilterAndTransform(
          this.description, this.conditionAction, this.filterChannel, this.filterEvents, this.filterData1, this.filterData2)
    } else{
      this.filterObj.setVal(  this.description, this.conditionAction, this.filterChannel, this.filterEvents, this.filterData1, this.filterData2 )
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
    return `${this.midiinid}-${this.chainid} Add filter and transform`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
