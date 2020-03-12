<template>
  <div>
    <header class="w3-container w3-teal">
      <h1>Easy config</h1>
    </header>
    <div class="w3-container w3-margin-top">
      <div>
        <div class="w3-container w3-cell w3-cell-middle">
          <select class="w3-select" name="option" v-model="inputToAdd">
            <option value></option>
            <option
              v-for="(item,idx) in inPorts"
              v-bind:key="idx"
              v-bind:value="idx"
            >{{idx}} - {{item}}</option>
          </select>
        </div>
        <div class="w3-container w3-cell w3-cell-middle">
          <button
            class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
            @click="addSplitedKeyboard()"
          >Add zone split</button>
        </div>
      </div>

      <div class="w3-card-4">
        <div class="w3-container">
          <div v-for="(inputItem, inputIdx) in inputZonesAndRoutes" v-bind:key="inputIdx">            
            <SplitedInputComponent v-bind:inputVal="inputItem" v-if="inputItem.keyboardSplits.length > 0 "/>
          </div>
        </div>
      </div>

      <div>
        <div class="w3-container w3-cell w3-cell-middle">
          <select class="w3-select" name="option" v-model="routeToAdd">
            <option value></option>
            <option
              v-for="(item,idx) in inPorts"
              v-bind:key="idx"
              v-bind:value="idx"
            >{{idx}} - {{item}}</option>
          </select>
        </div>
        <div class="w3-container w3-cell w3-cell-middle">
          <button
            class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
            @click="addRoute()"
          >Add Route</button>
        </div>
      </div>


      <div class="w3-card-4">
        <div class="w3-container">
            

          <div v-for="(inputItem, inputIdx) in inputZonesAndRoutes" v-bind:key="inputIdx">        
            <EasyConfigRoutesComponent v-bind:inputVal="inputItem" v-if="inputItem.easyConfigRoutes.length > 0 "/>
          </div>

        </div>
      </div>


      <p>&nbsp;</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import { LoginStatus } from "../../src/loginStatus";
import * as Connection from "../../src/connection";




import SplitedInputComponent from "./SplitedInputComponent.vue";
import EasyConfigRoutesComponent from "./EasyConfigRoutesComponent.vue"




@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    SplitedInputComponent,
    EasyConfigRoutesComponent
  }
})
export default class EasyconfigComponent extends Vue {
  loginStatus!: LoginStatus;
  inputToAdd = "";
  routeToAdd = "";

  get easyConfig(){
    return Connection.loginStatus.userDataConfig.easyConfig
  }
   
  inputZonesAndRoutes =  this.easyConfig.inputZonesAndRoutes

  
  addRoute(){
    if (this.routeToAdd === "" ){return; }
    this.easyConfig.addRoute( parseInt(this.routeToAdd))
    this.$forceUpdate()
  }

  addSplitedKeyboard(){
    if (this.inputToAdd === "" ){return; }
    this.easyConfig.addKeyboardSplit( parseInt(this.inputToAdd), 60)
    this.$forceUpdate()
  }

  get inPorts(){
    return Connection.loginStatus.inPorts;
      
    
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
