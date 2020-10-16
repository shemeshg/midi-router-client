<template>
  <Page :text="headrMsg">
    <Card>
      <CardBody>
        <p></p>
        <RowCell>Select midi output</RowCell>
        <RowCell>
          <ServerInOutPortsSelect
            v-model.number="inputToAdd"
            mode="out"
            :excludeId="midiRouteInput.midiInputId"
          />
        </RowCell>
        <p></p>
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

import ServerInOutPortsSelect from "../a/ServerInOutPortsSelect.vue";
import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardBody from "../a/CardBody.vue";
import RowCell from "../a/RowCell.vue";
import Btn from "../a/Btn.vue";

export default defineComponent({
  components: {
    ServerInOutPortsSelect,
    Page,
    Card,
    CardBody,
    RowCell,
    Btn,
  },
  setup(props, { root }) {
    const inputToAdd = ref(-1);

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
      return `${midiinid.value}-${chainid.value} Add Midi Destination`;
    });

    const midiRouteInput = computed(() => {
      return Connection.loginStatus.userDataConfig.getMidiRouteInput(
        Connection.loginStatus.inPorts[Number(midiinid.value)]
      );
    });

    const filterMidiDestination = computed(() => {
      return midiRouteInput.value.midiRouterChains[
        parseInt(chainid.value)
      ].getFilterMidiDestination(parseInt(filterid.value));
    });

    const inPortsWithoutSelf = computed(() => {
      return midiRouteInput.value.inPortsWithoutSelf;
    });

    function doOk() {
      if (inputToAdd.value === -1) {
        return;
      }
      const inputObj = inPortsWithoutSelf.value.filter((row) => {
        return row.midiInputId === inputToAdd.value;
      })[0];
      if (filterid.value === "-1") {
        midiRouteInput.value.midiRouterChains[
          parseInt(chainid.value)
        ].addFilterMidiDestination(inputObj);
      } else {
        filterMidiDestination.value.setVal(inputObj);
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
      inputToAdd.value =
        filterMidiDestination.value.baseMidiRouteInput.midiInputId;
    });

    return {
      doCancel,
      doOk,
      inPortsWithoutSelf,
      filterMidiDestination,
      midiRouteInput,
      headrMsg,
      chainid,
      midiinid,
      filterid,
      inputToAdd,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
