<template>
  <Page :text="headrMsg">
    <Card>
      <CardBody>
        <p>
          <label>Log to</label>

          <select
            class="w3-select"
            name="option"
            v-model.number="destinationId"
          >
            <option value="0">Client</option>
            <option value="1">Server</option>
          </select>
        </p>
        <p>
          <label>Userdata</label>
          <input class="w3-input" v-model="userdata" />
        </p>
      </CardBody>
    </Card>

    <Card>
      <CardBody>
        <Btn @click="doOk">OK</Btn>
        <Btn v-bind:ml="true" @click="doCancel">Cancel</Btn>
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
import Btn from "../a/Btn.vue";

export default defineComponent({
  components: {
    Page,
    Card,
    CardBody,
    Btn,
  },
  setup(props, { root }) {
    const destinationId = ref(0);
    const userdata = ref("{}");

    const filterid = computed(() => {
      return root.$route.params.filterid;
    });

    const midiinid = computed(() => {
      return root.$route.params.midiinid;
    });

    const midiRouteInput = computed(() => {
      return Connection.loginStatus.userDataConfig.getMidiRouteInput(
        Connection.loginStatus.inPorts[Number(midiinid.value)]
      );
    });

    const chainid = computed(() => {
      return root.$route.params.chainid;
    });

    function filterObj() {
      return midiRouteInput.value.midiRouterChains[
        parseInt(chainid.value)
      ].getFilterToConsle(parseInt(filterid.value));
    }



    const headrMsg = computed(() => {
      return `${midiinid.value}-${chainid.value} Add console log`;
    });

    function doOk() {
      if (filterid.value === "-1") {
        midiRouteInput.value.midiRouterChains[
          parseInt(chainid.value)
        ].addFilterToConsle(destinationId.value, JSON.parse(userdata.value));
      } else {
        filterObj().setVal(destinationId.value, JSON.parse(userdata.value));
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
      destinationId.value = filterObj().logTo;
      userdata.value = JSON.stringify(filterObj().userdata);
    });

    return {doCancel, doOk, headrMsg, midiinid, chainid, 
        midiRouteInput, filterid, userdata, destinationId}
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
