<template>
  <div>

    <header class="w3-container w3-teal">
      <h1>Input monitor</h1>
    </header>
    <div class="w3-container w3-margin-top">
       
       <div> 
        <div class="w3-container  w3-cell w3-cell-middle">

          <select class="w3-select" name="option" v-model.number="inputToMonitor">
            <option value="-1"></option>
            <option v-for="(item, idx) in inPorts" v-bind:key="idx" v-bind:value="idx"  >{{idx}} - {{item}}</option>
          </select>

        </div>
        <div class="w3-container  w3-cell w3-cell-middle">
            per page 
            <input type="number" v-model.number="perPage">
        </div>

                <div class="w3-container  w3-cell ">
           <a href="#" class="router-link-exact-active router-link-active" v-if="!isMonitoring" @click="startMonitoring()">
            Start
          </a>    
           <a href="#" class="router-link-exact-active router-link-active" v-if="isMonitoring" @click="stopMonitoring()">
            Stop
          </a>  
          |                         
           <a href="#" class="router-link-exact-active router-link-active" @click="doClear()">
            Clear
          </a>   
        </div>
  
        </div>

        <pre>
{{data.join("\n")}}            

        </pre>
    </div>
  </div>
</template>


<script lang="ts">
import { Component,  Vue , Watch} from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { FilterType } from "../src/UserDataConfig/MidiRoutePreset/MidiRoutersFilter"

import * as Connection from "../src/connection";

@Component({
  computed: {
    ...mapState(["loginStatus","dataToClient"]),
    ...mapGetters(["isLoggedIn"])
  }
})
export default class MonitorComponent extends Vue {
    inputToMonitor = -1
    perPage = 2
    data: string[] = []
    isMonitoring = false;

    get inPorts(){
        return Connection.loginStatus.inPorts
    }

    

    @Watch('dataToClient')
    onPropertyChanged(value: string) {
        const json = JSON.parse(value);
        if (json.portNumber === this.inputToMonitor && this.isMonitoring){
            this.data.unshift(value);
            this.data.splice(this.perPage)
        }

    }

    async startMonitoring(){
         if (this.inputToMonitor === -1){return ;}

        this.isMonitoring = true;
        this.data = []

        const input = Connection.loginStatus.userDataConfig.getMidiRouteInput(this.inputToMonitor)
        const chains = input.midiRouterChains
        
        let hasLogToConsole =false
        for (let chainId=0;chainId<chains.length;chainId++){
            const filters = chains[chainId].midiRoutersFilters
            for( let filterId=0; filterId<filters.length;filterId++){
                if (filters[filterId].filterType === FilterType.TO_CONSOLE){
                    hasLogToConsole = chains[chainId].getFilterToConsle(filterId).logTo === 0
                }
            }
        }
        if (hasLogToConsole) {return ;}
        const configChain = input.addMidiRouterChain("EAsyConfig log client")
        configChain.isEasyConfig = true;
        configChain.addFilterToConsle(0);


        const midiPort = await Connection.connection.wcmidiin.port(this.inputToMonitor )
        const chain = await midiPort.routingMidiChainsAaddChain();
        await chain.routingActionAddLogData(0)
    }

    stopMonitoring(){
        this.isMonitoring = false;        
    }

    doClear(){
        this.data = []
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
