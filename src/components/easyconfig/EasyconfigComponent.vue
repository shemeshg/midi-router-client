<template>
    <Page text="Easy config">
      <Row>
        <RowCell>
          <ServerInOutPortsSelect v-model.number="inputToAdd" mode="in"  />
        </RowCell>
        <RowCell>
          <Btn @click="addSplitedKeyboard()" v-bind:ml="true">Add zone split</Btn>
        </RowCell>
      </Row>

      <Card>            
          <div v-for="(inputItem, inputIdx) in inputZonesAndRoutes" v-bind:key="inputIdx">            
            <SplitedInputComponent v-bind:inputVal="inputItem" v-if="inputItem.keyboardSplits.length > 0 "/>
          </div>

      </Card>

      <Row>
        <RowCell>
          <ServerInOutPortsSelect v-model.number="routeToAdd" mode="in"  />
        </RowCell>
        <RowCell>
          <Btn @click="addRoute()" v-bind:ml="true">Add Route</Btn>
        </RowCell>
      </Row>


      <Card>
          <div v-for="(inputItem, inputIdx) in inputZonesAndRoutes" v-bind:key="inputIdx">        
            <EasyConfigRoutesComponent v-bind:inputVal="inputItem" v-if="inputItem.easyConfigRoutes.length > 0 "/>
          </div>       
      </Card>


     
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
import Btn from "../a/Btn.vue"
import Card from "../a/Card.vue"
import Row from "../a/Row.vue"

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
    Row,
    RowCell,
    Btn,
    Card,
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
    
    this.easyConfig.addRoute( Connection.loginStatus.inPorts[ this.routeToAdd ] ) 
    this.$forceUpdate()
  }

  addSplitedKeyboard(){
    if (this.inputToAdd === -1 ){return; }
    this.easyConfig.addKeyboardSplit( Connection.loginStatus.inPorts[  this.inputToAdd ], 60)
    this.$forceUpdate()
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
