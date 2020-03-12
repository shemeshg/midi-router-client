<template>
    <div>
        <header class="w3-container w3-blue">
          <h5>{{chainIdx}} - <input class="w3-blue" type="text" v-model="chainItem.name">
          <a href="#" class="router-link-exact-active router-link-active w3-right" 
              v-if="midiRouteInput.midiRouterChains.length > 1" 
              @click="doSplice(chainIdx)"> Delete</a>
          </h5>
          
        </header>
            

        <div class="w3-container">
          <p  v-for="(itemFilter, indexFilter) in midiRouteInput.midiRouterChains[chainIdx].midiRoutersFilters" v-bind:key="indexFilter">
            <input class="w3-radio" type="radio"  v-model="filterSelected" :value="indexFilter" />
            <label>{{indexFilter}} {{itemFilter.name}}</label>
          </p>




          <p>
            <button class="w3-button w3-section w3-teal w3-ripple" 
            @click="addChainFilter()">Add</button>
            <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
             @click="editChainFilter()">Edit</button>
            <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
                @click="deleteChainFilter()"              
            >Delete</button>

            <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
              @click="doMoveUp()"
            >
              <i class="fa fa-arrow-up"></i>
            </button>
            <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
              @click="doMoveDown()"
            >
              <i class="fa fa-arrow-down"></i>
            </button>
          </p>
        </div>

    </div>
</template>


<script lang="ts">
import {MidiRouterChain} from "../../src/UserDataConfig/MidiRoutePreset/MidiRouterChain"

import * as MRF from '../../src/UserDataConfig/MidiRoutePreset/MidiRoutersFilter'

import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { mapGetters } from 'vuex'



import * as Connection from '../../src/connection';


import * as Utils from "../../src/Utils"

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
export default class MidiInFilterChain extends Vue {
    @Prop() private chainItem!: MidiRouterChain;
    @Prop() private chainIdx!: number;
    @Prop() private midiId!: string;
    filterSelected = ""


    mounted(){
      this.midiRouteInput.midiRouterChains[this.chainIdx].midiRoutersFilters
      
    }

    get midiRouteInput() {    
        return Connection.loginStatus.userDataConfig.getMidiRouteInput(parseInt(this.midiId))
    }


    doSplice(chainIdx: number){
      this.midiRouteInput.midiRouterChains.splice(chainIdx,1)
    }

    doMoveUp(){
        if (this.filterSelected === ""){return;}
        const iFilterSelected = parseInt( this.filterSelected )
        Utils.arrayMove( this.midiRouteInput.midiRouterChains[this.chainIdx].midiRoutersFilters, iFilterSelected, iFilterSelected -1 )
        if (iFilterSelected -1 > -1) {this.filterSelected = (iFilterSelected -1).toString()}
        this.$forceUpdate();
    }

    doMoveDown(){
        if (this.filterSelected === ""){return;}
        const iFilterSelected = parseInt( this.filterSelected )
        Utils.arrayMove( this.midiRouteInput.midiRouterChains[this.chainIdx].midiRoutersFilters, iFilterSelected, iFilterSelected + 1 )
        if (iFilterSelected +1 < this.midiRouteInput.midiRouterChains[this.chainIdx].midiRoutersFilters.length) {this.filterSelected = (iFilterSelected +1).toString()}
        this.$forceUpdate();
    }

    deleteChainFilter(){
        if (this.filterSelected === ""){return;}
        this.midiRouteInput.midiRouterChains[this.chainIdx].midiRoutersFilters.splice(parseInt(this.filterSelected),1)
        this.$forceUpdate();
    }

    editChainFilter(){
        if (this.filterSelected === ""){return;}
        const filterSelectedObj = this.midiRouteInput.midiRouterChains[this.chainIdx].midiRoutersFilters[parseInt(this.filterSelected)];
        if (filterSelectedObj.filterType === MRF.FilterType.TO_MIDI_DESTINATION){
            this.$router.push(`/addFilter/AddMidiDestination/${this.midiId}/${this.chainIdx}/${this.filterSelected}`)
        }
        if (filterSelectedObj.filterType === MRF.FilterType.TO_CONSOLE){
          this.$router.push(`/addFilter/AddConsoleLog/${this.midiId}/${this.chainIdx}/${this.filterSelected}`)
        }
        if (filterSelectedObj.filterType === MRF.FilterType.TO_NETWORK){
          this.$router.push(`/addFilter/AddNetworkDestination/${this.midiId}/${this.chainIdx}/${this.filterSelected}`)
        }
        if (filterSelectedObj.filterType === MRF.FilterType.SCHEDULE_TO){
          this.$router.push(`/addFilter/AddSchedule/${this.midiId}/${this.chainIdx}/${this.filterSelected}`)
        }
        if (filterSelectedObj.filterType === MRF.FilterType.FILTER_AND_TRANSFORM){
          this.$router.push(`/addFilter/AddFilterTransform/${this.midiId}/${this.chainIdx}/${this.filterSelected}`)
        }
    }

    addChainFilter(){
    this.$router.push(`/AddChainFilter/${this.midiId}/${this.chainIdx}`);


  }

}
</script>