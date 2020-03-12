<template>
  <div>
    <header class="w3-container w3-teal">
      <h1>{{ headrMsg }}</h1>
    </header>
    <div class="w3-container w3-margin-top">
      <div class="w3-card-4">
        <header class="w3-container w3-blue">
          <h5>To Output</h5>
        </header>
        <div class="w3-container">

          <ul class="w3-ul w3-border w3-hoverable w3-margin-left w3-margin-top">
              <li class="w3-display-container"
              @click="$router.push(`/addFilter/AddMidiDestination/${midiinid}/${chainid}/-1`)" >Midi</li>
              <li class="w3-display-container"
              @click="$router.push(`/addFilter/AddConsoleLog/${midiinid}/${chainid}/-1`)" >Console</li>
                <li class="w3-display-container"
                @click="$router.push(`/addFilter/AddNetworkDestination/${midiinid}/${chainid}/-1`)" >Network</li>
          </ul>
            
          
        </div>

        <header class="w3-container w3-blue w3-margin-top">
          <h5>Filter and modify</h5>
        </header>
        <div class="w3-container">
          
          <ul class="w3-ul w3-border w3-hoverable w3-margin-left w3-margin-top">
            <li class="w3-display-container"
            @click="$router.push(`/addFilter/AddSchedule/${midiinid}/${chainid}/-1`)"  >Schedule</li>
            <li class="w3-display-container"
            @click="$router.push(`/addFilter/AddFilterTransform/${midiinid}/${chainid}/-1`)" >Filter and transform</li>
          </ul>
            
        </div>

      </div>
    </div>


    <div class="w3-card-4">
        <p>
          <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
              @click="$router.push(`/midiin/${midiinid}`)"
            >Cancel</button>
        </p>
      </div>


</div>


</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";


import {LoginStatus}  from "../src/loginStatus";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  }
})
export default class AddChainFilterComponent extends Vue {
  loginStatus!: LoginStatus;



  get midiinid(){
    return this.$route.params.midiinid;
  }

  get chainid(){
    return this.$route.params.chainid;
  }

  get headrMsg(): string {

    return `${this.midiinid} - ${
      this.loginStatus.inPorts[parseInt(this.midiinid)]
    } - Chain ${this.chainid}`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
