<template>
  <Page text="Input monitor">
    <p>
      <BtnHref v-if="!isMonitoring" @click="startMonitoring()">Start</BtnHref>
      <BtnHref v-if="isMonitoring" @click="stopMonitoring()">Stop</BtnHref>|
      <BtnHref @click="doClear()">Clear</BtnHref>
    </p>

    <p>
      <ServerInOutPortsSelect v-model.number="inputToMonitor" mode="in" />
      <label>input</label>
    </p>
    <p>
      <input class="w3-input" type="number" v-model.number="perPage" />
      <label>per page</label>
    </p>

    <pre>
{{data.join("\n")}}            
    </pre>
  </Page>
</template>


<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import { FilterType } from "../src/UserDataConfig/MidiRoutePreset/MidiRoutersFilter";
import * as Connection from "../src/connection";
import { ToConsoleUserdata } from "src/src/UserDataConfig/MidiRoutePreset/ToConsoleUserdata";

import Page from "./a/Page.vue";
import BtnHref from "./a/BtnHref.vue";
import ServerInOutPortsSelect from "./a/ServerInOutPortsSelect.vue";

@Component({
  computed: {
    ...mapState(["loginStatus", "dataToClient"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    Page,
    BtnHref,
    ServerInOutPortsSelect
  }
})
export default class MonitorComponent extends Vue {
  inputToMonitor = -1;
  perPage = 2;
  data: string[] = [];
  isMonitoring = false;

  get inPorts() {
    return Connection.loginStatus.inPorts;
  }

  async inputToMonitorChanged() {
    if (this.isMonitoring === true) {
      await this.startMonitoring();
    }
  }

  @Watch("dataToClient")
  onPropertyChanged(value: string) {
    const json = JSON.parse(value);
    if (json.portNumber === this.inputToMonitor && this.isMonitoring) {
      const userdata: ToConsoleUserdata = JSON.parse(json.userdata);
      if (userdata.action === "monitor") this.data.unshift(value);
      this.data.splice(this.perPage);
    }
  }

  async startMonitoring() {
    if (this.inputToMonitor === -1) {
      return;
    }

    this.isMonitoring = true;
    this.data = [];

    const input = Connection.loginStatus.userDataConfig.getMidiRouteInput(
      this.inPorts[this.inputToMonitor]
    );
    const chains = input.midiRouterChains;

    let hasLogToConsole = false;
    for (let chainId = 0; chainId < chains.length; chainId++) {
      const filters = chains[chainId].midiRoutersFilters;
      for (let filterId = 0; filterId < filters.length; filterId++) {
        if (filters[filterId].filterType === FilterType.TO_CONSOLE) {
          hasLogToConsole =
            chains[chainId].getFilterToConsle(filterId).logTo === 0;
        }
      }
    }
    if (hasLogToConsole) {
      return;
    }
    const configChain = input.addMidiRouterChain("EAsyConfig log client");
    configChain.isEasyConfig = true;
    configChain.addFilterToConsle(0, { action: "monitor" });

    const midiPort = await Connection.connection.wcmidiin.port(
      this.inputToMonitor
    );
    const chain = await midiPort.routingMidiChainsAaddChain();
    await chain.routingActionAddLogData(0, { action: "monitor" });
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }

  doClear() {
    this.data = [];
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
