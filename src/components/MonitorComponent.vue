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

    <pre
      >{{ data.join("\n") }}            
    </pre>
  </Page>
</template>


<script lang="ts">
import { computed, ref, defineComponent, watch } from "@vue/composition-api";

import { FilterType } from "../src/UserDataConfig/MidiRoutePreset/MidiRoutersFilter";
import * as Connection from "../src/connection";
import { ToConsoleUserdata } from "src/src/UserDataConfig/MidiRoutePreset/ToConsoleUserdata";

import Page from "./a/Page.vue";
import BtnHref from "./a/BtnHref.vue";
import ServerInOutPortsSelect from "./a/ServerInOutPortsSelect.vue";

export default defineComponent({
  components: {
    Page,
    BtnHref,
    ServerInOutPortsSelect,
  },
  setup(props, { root }) {
    const inputToMonitor = ref(-1);
    const perPage = ref(2);

    const _data: string[] = [];
    const data = ref(_data);
    const isMonitoring = ref(false);

    const inPorts = computed(() => {
      return Connection.loginStatus.inPorts;
    });

    const startMonitoring = async () => {
      if (inputToMonitor.value === -1) {
        return;
      }

      isMonitoring.value = true;
      data.value = [];

      const input = Connection.loginStatus.userDataConfig.getMidiRouteInput(
        inPorts.value[inputToMonitor.value]
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
        inputToMonitor.value
      );
      const chain = await midiPort.routingMidiChainsAaddChain();
      await chain.routingActionAddLogData(0, { action: "monitor" });
    };

    const inputToMonitorChanged = async () => {
      if (isMonitoring.value === true) {
        await startMonitoring();
      }
    };

    const stopMonitoring = () => {
      isMonitoring.value = false;
    };

    const doClear = () => {
      data.value = [];
    };

    watch(
      () => root.$store.state.dataToClient,
      (value: string) => {
        const json = JSON.parse(value);
        if (json.portNumber === inputToMonitor.value && isMonitoring.value) {
          const userdata: ToConsoleUserdata = JSON.parse(json.userdata);
          if (userdata.action === "monitor") data.value.unshift(value);
          data.value.splice(perPage.value);
        }
      }
    );

    return {doClear,stopMonitoring,inputToMonitorChanged,startMonitoring,
          inPorts,isMonitoring,data,perPage,inputToMonitor }

  },
});


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
