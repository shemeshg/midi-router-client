<template>
  <Page :text="headrMsg">
    <Card>
      <CardBody>
        <p>
          <label>Server name/ip</label>
          <input class="w3-input" type="text" v-model="serverName" />
        </p>
        <p>
          <label>Server port number</label>
          <input class="w3-input" type="number" v-model.number="portNumber" />
        </p>
        <p>
          <Btn @click="getRemotePorts">Get remote ports</Btn>
        </p>
        <p>
          <label>Server remote midi port</label>
          <select class="w3-select" v-model.number="destinationMidiId">
            <option value></option>
            <option
              v-for="itm in remoteMidiPorts"
              v-bind:key="itm.midiInputId"
              v-bind:value="itm.midiInputId"
            >
              {{ itm.midiInputId }} - {{ itm.midiInputName }}
            </option>
          </select>
        </p>
      </CardBody>
    </Card>

    <Card>
      <CardBody>
        <Btn @click="doOk">OK</Btn>
        <Btn :ml="true" @click="doCancel">Cancel</Btn>
      </CardBody>
    </Card>
  </Page>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
} from "@vue/composition-api";

import * as Connection from "../../src/connection";
import { BaseMidiRouteInput } from "../../src/UserDataConfig/MidiRoutePreset/BaseMidiRouteInput";

import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardBody from "../a/CardBody.vue";
import Btn from "../a/Btn.vue";


export default defineComponent({
  components: {
    Page,
    Card,
    CardBody,
    Btn,
  },
  setup(props, { root }) {
    const serverName = ref("");
    const portNumber = ref(12345);
    const destinationMidiId = ref("");

    const _bmi: BaseMidiRouteInput[] = [];
    const remoteMidiPorts = ref(_bmi);

    const filterid = computed(() => {
      return root.$route.params.filterid;
    });

    const midiinid = computed(() => {
      return root.$route.params.midiinid;
    });

    const chainid = computed(() => {
      return root.$route.params.chainid;
    });

    const headrMsg = computed(() => {
      return `${midiinid.value}-${chainid.value} Add Network Destination`;
    });

    const midiRouteInput = computed(() => {
      return Connection.loginStatus.userDataConfig.getMidiRouteInput(
        Connection.loginStatus.inPorts[Number(midiinid.value)]
      );
    });

    const filterObj = computed(() => {
      return midiRouteInput.value.midiRouterChains[
        parseInt(chainid.value)
      ].getFilterNetworkDestination(parseInt(filterid.value));
    });

    async function getRemotePorts() {
      destinationMidiId.value = "";
      remoteMidiPorts.value.splice(0, remoteMidiPorts.value.length);
      const l = await Connection.loginNoSingleTon(
        serverName.value,
        portNumber.value
      );

      const keys = Object.keys(l.inPorts);

      for (let i = 0; i < keys.length; i++) {
        const ikey = parseInt(keys[i]);
        remoteMidiPorts.value.push({
          midiInputId: ikey,
          midiInputName: l.inPorts[ikey],
        });
      }
    }

    function doOk() {
      if (destinationMidiId.value === "") {
        return;
      }

      const inputObj = remoteMidiPorts.value.filter((row) => {
        return row.midiInputId === parseInt(destinationMidiId.value);
      })[0];

      if (filterid.value === "-1") {
        midiRouteInput.value.midiRouterChains[
          parseInt(chainid.value)
        ].addFilterNetworkDestination(
          serverName.value,
          portNumber.value,
          inputObj
        );
      } else {
        filterObj.value.setVal(serverName.value, portNumber.value, inputObj);
      }

      root.$router.push(`/midiin/${midiinid.value}`);
    }

    function doCancel() {
      if (filterid.value === "-1") {
        root.$router.push(`/AddChainFilter/${midiinid.value}/${chainid.value}`);
      } else {
        root.$router.push(`/midiin/${midiinid.value}`);
      }
    }

    onMounted(() => {
      if (filterid.value === "-1") {
        return;
      }
      serverName.value = filterObj.value.serverName;
      portNumber.value = filterObj.value.serverPort;
      destinationMidiId.value = filterObj.value.baseMidiRouteInput.midiInputId.toString();
      remoteMidiPorts.value = [filterObj.value.baseMidiRouteInput];
    });

    return {doCancel, doOk, getRemotePorts, filterObj, 
        midiRouteInput, headrMsg, chainid, midiinid, filterid, remoteMidiPorts,
        destinationMidiId, portNumber, serverName}
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
