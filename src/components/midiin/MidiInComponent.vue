<template>
  <div>
    <header class="w3-container w3-teal">
      <h1>{{ headrMsg }}</h1>
    </header>

    <div class="w3-container "  >  

      

      <div class="w3-card-4 w3-margin-top" v-for="(item, index) in midiRouteInput.midiRouterChains" v-bind:key="index" >
        <MidiFilterChain  v-bind:chainItem ="item" v-bind:chainIdx="index" v-bind:midiId="midiId" 
              ></MidiFilterChain>


      </div>


    



    <div class="w3-card-4">
        <p>
          <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
              @click="addChain()"
            >Add chain</button>
        </p>
      </div>


      <div class="w3-container w3-card-4">
        <h5>Ignore Types</h5>
        <p>
          <input class="w3-check" type="checkbox"  
            v-model="midiRouteInput.ignoreTypes.midiSysex"/>
          <label>Sysex</label>
          <input class="w3-check" type="checkbox" 
            v-model="midiRouteInput.ignoreTypes.midiTime"/>
          <label>Time</label>
          <input class="w3-check" type="checkbox"  
            v-model="midiRouteInput.ignoreTypes.midiSense"/>
          <label>Sense</label>
        </p>
       <h5>Clock</h5>
        <div>
        <div class="w3-container  w3-cell">
          <label>Time signature from SPP</label>
          <input class="w3-input" type="number"  v-model.number="midiRouteInput.midiRouteClock.fromSppPos">
        </div> 
        </div>
      <div>
        <div class="w3-container  w3-cell">
          <label>upper numeral</label>
          <input class="w3-input" type="number" v-model.number="midiRouteInput.midiRouteClock.timeSig">
        </div>
        <div class="w3-container  w3-cell">
          <label>lower numeral</label>
          <input class="w3-input" type="number" v-model.number="midiRouteInput.midiRouteClock.timeSigDivBy">
        </div> 
     
    </div>
      <div>
        <div class="w3-container  w3-cell w3-cell-middle">
        Propagate Inputs 
        </div>
        <div class="w3-container  w3-cell w3-cell-middle">
          <select class="w3-select" name="option"  v-model="propegateInputToAdd">
            <option value=""></option>
            <option v-for="(item) in inPortsWithoutSelfClockPropegate" v-bind:key="item.midiInputId" v-bind:value="item.midiInputId"  >{{item.midiInputId}} - {{item.midiInputName}}</option>
          </select>
        </div>
        <div class="w3-container  w3-cell w3-cell-middle">
           <button
            class="w3-button w3-section w3-teal w3-ripple w3-margin-left "
            @click="addClockPropegateInput"
          >+</button> 
        </div>
      </div>

<p>
      <ul class="w3-ul w3-border w3-hoverable w3-margin-left">
<li class="w3-display-container" v-for="(item) in midiRouteInput.midiRouteClock.propegateInputs" 
    v-bind:key="item.midiInputId"  > {{item.midiInputId}} - {{item.midiInputName}}
  <span @click="spliceClockPropegateInput(item.midiInputId)" class="w3-button w3-transparent w3-display-right">&times;</span></li>
      </ul>
  </p>

              <h5>14 Bit CC </h5>
    

       <div>


            <div class="w3-container  w3-cell">
          <label>Channel</label>
          <input class="w3-input" type="number" v-model.number="cc14bitChannel" @focus="$event.target.select()">
            </div>

        <div class="w3-container w3-cell">
          <label>CC</label>
          <input class="w3-input" type="number" v-model.number="cc14bitCc" @focus="$event.target.select()">
            </div>

        <div class="w3-container w3-cell">
           <button
            class="w3-button w3-section w3-teal w3-ripple w3-margin-left "
            @click="addCc14bit"
          >+</button> 

            </div>            
       </div>
       
       
        <p>
          
      <ul class="w3-ul w3-border w3-hoverable w3-margin-left">
<li class="w3-display-container" v-for="(row, idx) in midiRouteInput.cc14bitAry" v-bind:key="idx" >Channel {{row.channel}} CC {{row.cc}} 
  <span @click="spliceCc14bit(idx)" class="w3-button w3-transparent w3-display-right">&times;</span></li>

      </ul>


 

  </p>

      </div>
  <p>
    &nbsp;
    </p>

    </div>


  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../../src/connection";
import {LoginStatus} from '../../src/loginStatus'

import MidiFilterChain from "./MidiInFilterChainComponent.vue"

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    MidiFilterChain
    }
})
export default class MidiInComponent extends Vue {
  @Prop() private midiId!: string;
  propegateInputToAdd = "";
  inPortsWithoutSelfClockPropegate = this._inPortsWithoutSelfClockPropegate();

  loginStatus!: LoginStatus;

  cc14bitChannel = 1
  cc14bitCc = 0

  spliceCc14bit(idx: number){
    this.midiRouteInput.cc14bitAry.splice(idx,1);
    this.$forceUpdate();
  }

  addCc14bit(){
    if ( this.cc14bitChannel< 1 || this.cc14bitChannel> 16 || this.cc14bitCc < 0 || this.cc14bitCc > 17) {
      return;
      }
    if ( this.midiRouteInput.cc14bitAry.filter( (row)=>{return row.channel === this.cc14bitChannel && row.cc === this.cc14bitCc}).length > 0 ) {
      return;
    }
    this.midiRouteInput.addCc14bitAry(this.cc14bitChannel, this.cc14bitCc);
    
    this.$forceUpdate();
  }

  spliceClockPropegateInput(inputsId: number){
    for (let i=0;i<this.midiRouteInput.midiRouteClock.propegateInputs.length;i++){
      if(this.midiRouteInput.midiRouteClock.propegateInputs[i].midiInputId === inputsId ){
        this.midiRouteInput.midiRouteClock.propegateInputs.splice(i,1);
        continue;
      }
    }
    this.inPortsWithoutSelfClockPropegate = this._inPortsWithoutSelfClockPropegate();
  }  

  addClockPropegateInput(){
    if (this.propegateInputToAdd === ""){return;}
    this.midiRouteInput.addClockPropegateInput(parseInt(this.propegateInputToAdd));
    this.inPortsWithoutSelfClockPropegate = this._inPortsWithoutSelfClockPropegate();
  }

  _inPortsWithoutSelfClockPropegate(){
    const keysSelected = this.midiRouteInput.midiRouteClock.propegateInputs.map( (row)=>{return row.midiInputId});    
    return this.midiRouteInput.inPortsWithoutSelf.filter( (row)=>{return keysSelected.indexOf(row.midiInputId) === -1})
  }



  addChain(){
    this.midiRouteInput.addMidiRouterChain("New chain" );
    this.$forceUpdate();
  }

get midiRouteInput() {    
    return Connection.loginStatus.userDataConfig.getMidiRouteInput(parseInt(this.midiId))
  }



  get headrMsg(): string {
    return `${this.midiId} - ${
      this.loginStatus.inPorts[parseInt(this.midiId)]
    }`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
