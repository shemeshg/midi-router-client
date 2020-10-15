<template>
  <Page :text="headrMsg">
    <Card>
      <CardBody>
        <p>
          <label>Description</label>
          <input class="w3-input" type="text" v-model="description" />
        </p>
        <p>
          <label>Condition action</label>
          <select
            class="w3-select"
            name="option"
            v-model.number="conditionAction"
          >
            <option value="0">Do not delete</option>
            <option value="1">Delete if not met condition</option>
            <option value="2">Delete if met condition</option>
          </select>
        </p>
      </CardBody>
    </Card>

    <Card :mt="true">
      <CardHeader>Channels</CardHeader>
      <CardBody>
        <p>
          <label>Channels</label>
          <input class="w3-input" type="text" v-model="filterChannel" />
        </p>
      </CardBody>
    </Card>

    <Card :mt="true">
      <CardHeader>Events</CardHeader>
      <CardBody>
        <p>
          <label>Events</label>
          <input class="w3-input" type="text" v-model="filterEvents" />
        </p>
        <pre>
          noteoff: 0x8,           // 8
          noteon: 0x9,            // 9
          keyaftertouch: 0xA,     // 10
          controlchange: 0xB,     // 11
          channelmode: 0xB,       // 11
          nrpn: 0xB,              // 11
          programchange: 0xC,     // 12
          channelaftertouch: 0xD, // 13
          pitchbend: 0xE          // 14
        </pre>
      </CardBody>
    </Card>

    <Card :mt="true">
      <CardHeader>Data 1</CardHeader>
      <CardBody>
        <p>
          <label>Data 1</label>
          <input class="w3-input" type="text" v-model="filterData1" />
        </p>
      </CardBody>
    </Card>

    <Card :mt="true">
      <CardHeader>Data 2</CardHeader>
      <CardBody>
        <p>
          <label>Data 2</label>
          <input class="w3-input" type="text" v-model="filterData2" />
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

import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardBody from "../a/CardBody.vue";
import CardHeader from "../a/CardHeader.vue";
import Btn from "../a/Btn.vue";

export default defineComponent({
  components: {
    Page,
    Card,
    CardBody,
    CardHeader,
    Btn,
  },
  setup(props, { root }) {
    const description = ref("");
    const conditionAction = ref(0);
    const filterChannel = ref("[[0,16,0]]");
    const filterEvents = ref("[[0,16,0]]");
    const filterData1 = ref("[[0,127,0]]");
    const filterData2 = ref("[[0,127,0]]");

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
      return `${midiinid.value}-${chainid.value} Add filter and transform`;
    });

    const midiRouteInput = computed(() => {
      return Connection.loginStatus.userDataConfig.getMidiRouteInput(
        Connection.loginStatus.inPorts[Number(midiinid.value)]
      );
    });

    const filterObj = computed(() => {
      return midiRouteInput.value.midiRouterChains[
        parseInt(chainid.value)
      ].getFilterFilterAndTransform(parseInt(filterid.value));
    });

    onMounted(() => {
      if (filterid.value === "-1") {
        return;
      }
      conditionAction.value = filterObj.value.conditionAction;
      description.value = filterObj.value.name;
      filterChannel.value = filterObj.value.filterChannel;
      filterEvents.value = filterObj.value.filterEvents;
      filterData1.value = filterObj.value.filterData1;
      filterData2.value = filterObj.value.filterData2;
    });

    function doOk() {
      if (description.value === "") {
        description.value = "Filter and transform";
      }
      if (filterid.value === "-1") {
        midiRouteInput.value.midiRouterChains[
          parseInt(chainid.value)
        ].addFilterFilterAndTransform(
          description.value,
          conditionAction.value,
          filterChannel.value,
          filterEvents.value,
          filterData1.value,
          filterData2.value
        );
      } else {
        filterObj.value.setVal(
          description.value,
          conditionAction.value,
          filterChannel.value,
          filterEvents.value,
          filterData1.value,
          filterData2.value
        );
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

    return {doCancel,doOk,filterObj,midiRouteInput,headrMsg,
          chainid,midiinid,filterid,filterData2,filterData1,
          filterEvents,filterChannel,conditionAction,description}
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
