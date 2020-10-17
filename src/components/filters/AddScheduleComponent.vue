<template>
  <Page :text="headrMsg">
    <Card>
      <CardBody>
        <p>
          <label>Deffered type</label>
          <select class="w3-select" name="option" v-model="defferedType">
            <option value>-</option>
            <option value="0">In SPP</option>
            <option value="1">In bar</option>
            <option value="2">At SPP</option>
            <option value="3">At bar</option>
            <option value="4">Quantize SPP position</option>
            <option value="5">Quantize Bar position</option>
          </select>
        </p>
        <p>
          <label>Deffered to</label>
          <input class="w3-input" type="number" v-model.number="defferedTo" />
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
import Btn from "../a/Btn.vue";

export default defineComponent({
  components: {
    Page,
    Card,
    CardBody,
    Btn,
  },
  setup(props, { root }) {
    const defferedType = ref("");
    const defferedTo = ref(0);

    const filterid = computed(() => {
      return root.$route.params.filterid;
    });

    const midiinid = computed(() => {
      return root.$route.params.midiinid;
    });

    const chainid = computed(() => {
      return root.$route.params.chainid;
    });

    const midiRouteInput = computed(() => {
      return Connection.loginStatus.userDataConfig.getMidiRouteInput(
        Connection.loginStatus.inPorts[Number(midiinid.value)]
      );
    });

    const headrMsg = computed(() => {
      return `${midiinid.value}-${chainid.value} Add Schedule`;
    });

    const filterObj = computed(() => {
      return midiRouteInput.value.midiRouterChains[
        parseInt(chainid.value)
      ].getFilterSchedule(parseInt(filterid.value));
    });

    function doOk() {
      if (defferedType.value === "") {
        return;
      }

      if (filterid.value === "-1") {
        midiRouteInput.value.midiRouterChains[
          parseInt(chainid.value)
        ].addFilterSchedule(parseInt(defferedType.value), defferedTo.value);
      } else {
        filterObj.value.setVal(parseInt(defferedType.value), defferedTo.value);
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
      defferedType.value = filterObj.value.defferedType.toString();
      defferedTo.value = filterObj.value.defferedTo;
    });

    return {
      doCancel,
      doOk,
      headrMsg,
      midiRouteInput,
      chainid,
      midiinid,
      filterid,
      defferedTo,
      defferedType,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
