<template>
    <Page text="Easy config">
      <div>
        <RowCell>
          <ServerInOutPortsSelect v-model.number="inputToAdd" mode="in"  />
        </RowCell>
        <RowCell>
          <button
            class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
            @click="addSplitedKeyboard()"
          >Add zone split</button>
        </RowCell>
      </div>

      <div class="w3-card-4">
      
          <div v-for="(inputItem, inputIdx) in inputZonesAndRoutes" v-bind:key="inputIdx">            
            <SplitedInputComponent v-bind:inputVal="inputItem" v-if="inputItem.keyboardSplits.length > 0 "/>
          </div>

      </div>

      <div>
        <RowCell>
          <ServerInOutPortsSelect v-model.number="routeToAdd" mode="in"  />
        </RowCell>
        <RowCell>
          <button
            class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
            @click="addRoute()"
          >Add Route</button>
        </RowCell>
      </div>


      <div class="w3-card-4">
       
            

          <div v-for="(inputItem, inputIdx) in inputZonesAndRoutes" v-bind:key="inputIdx">        
            <EasyConfigRoutesComponent v-bind:inputVal="inputItem" v-if="inputItem.easyConfigRoutes.length > 0 "/>
          </div>

       
      </div>


     
    </Page>

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import { LoginStatus } from "../../src/loginStatus";
import * as Connection from "../../src/connection";




import Page from "../a/Page.vue"
import RowCell from "../a/RowCell.vue"

import ServerInOutPortsSelect from "../a/ServerInOutPortsSelect.vue"
import SplitedInputComponent from "./SplitedInputComponent.vue";
import EasyConfigRoutesComponent from "./EasyConfigRoutesComponent.vue"




@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    Page,
    RowCell,
    ServerInOutPortsSelect,
    SplitedInputComponent,
    EasyConfigRoutesComponent
  }
})
export default class EasyconfigComponent extends Vue {
  loginStatus!: LoginStatus;
  inputToAdd = -1;
  routeToAdd = -1;

  get easyConfig(){
    return Connection.loginStatus.userDataConfig.activePreset.easyConfig
  }
   
  inputZonesAndRoutes =  this.easyConfig.inputZonesAndRoutes

  
  addRoute(){
    if (this.routeToAdd === -1 ){return; }
    this.easyConfig.addRoute( this.routeToAdd) 
    this.$forceUpdate()
  }

  addSplitedKeyboard(){
    if (this.inputToAdd === -1 ){return; }
    this.easyConfig.addKeyboardSplit( this.inputToAdd, 60)
    this.$forceUpdate()
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
