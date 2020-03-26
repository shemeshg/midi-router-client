<template>
  <div>
    <header class="w3-container w3-teal">
      <h1>{{ headrMsg }}</h1>
    </header>
    <div class="w3-container w3-margin-top">

      <div class="w3-card-4">
        <div class="w3-container">
        <p>

          <label>Log to</label>


          <select class="w3-select" name="option" v-model.number="destinationId">
            <option value=0>Client</option>
            <option value=1>Server</option>
          </select>


        </p>
        <p>
          <label>Userdata</label>
          <input class="w3-input" v-model="userdata">
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
export default class AddConsoleLogComponent extends Vue {
  destinationId = 0;
  userdata =  "{}"
  loginStatus!: LoginStatus;

  get filterid(){
    return this.$route.params.filterid;
  }
  get filterObj(){
    return this.midiRouteInput.midiRouterChains[parseInt(this.chainid)].getFilterToConsle(parseInt(this.filterid));
  }
  mounted() {
    if (this.filterid === "-1"){return;}
    this.destinationId = this.filterObj.logTo
    this.userdata = this.filterObj.userdata
  }

  doOk(){
    if (this.filterid === "-1"){
      this.midiRouteInput.midiRouterChains[parseInt(this.chainid)].addFilterToConsle(this.destinationId, this.userdata);
    } else {
      this.filterObj.setVal(this.destinationId, this.userdata)
    }
    this.$router.push(`/midiin/${this.midiinid}`)

  }

  get midiRouteInput() {    
    return Connection.loginStatus.userDataConfig.getMidiRouteInput(parseInt(this.midiinid))
  }

  doCancel(){
    if (this.filterid === "-1"){
      this.$router.push(`/AddChainFilter/${this.midiinid}/${this.chainid}`);
    } else {
      this.$router.push(`/midiin/${this.midiinid}`) 
    }
  }

  get midiinid(){
    return this.$route.params.midiinid;
  }

  get chainid(){
    return this.$route.params.chainid;
  }

  get headrMsg(): string {
    return `${this.midiinid}-${this.chainid} Add console log`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
