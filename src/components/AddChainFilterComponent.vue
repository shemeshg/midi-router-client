<template>
  <Page :text="headrMsg">
    <Card>
      <CardHeader>To Output</CardHeader>
      <CardBody>
        <ul class="w3-ul w3-border w3-hoverable w3-margin-left w3-margin-top">
          <li
            class="w3-display-container"
            @click="$router.push(`/addFilter/AddMidiDestination/${midiinid}/${chainid}/-1`)"
          >Midi</li>
          <li
            class="w3-display-container"
            @click="$router.push(`/addFilter/AddConsoleLog/${midiinid}/${chainid}/-1`)"
          >Console</li>
          <li
            class="w3-display-container"
            @click="$router.push(`/addFilter/AddNetworkDestination/${midiinid}/${chainid}/-1`)"
          >Network</li>
        </ul>
      </CardBody>
      <p>&nbsp;</p>
      <CardHeader>Filter and modify</CardHeader>
      <CardBody>
        <ul class="w3-ul w3-border w3-hoverable w3-margin-left w3-margin-top">
          <li
            class="w3-display-container"
            @click="$router.push(`/addFilter/AddSchedule/${midiinid}/${chainid}/-1`)"
          >Schedule</li>
          <li
            class="w3-display-container"
            @click="$router.push(`/addFilter/AddFilterTransform/${midiinid}/${chainid}/-1`)"
          >Filter and transform</li>
        </ul>
        <p>&nbsp;</p>
      </CardBody>
    </Card>

    <Card>
      <CardBody>
        <Btn :ml="true" @click="$router.push(`/midiin/${midiinid}`)">Cancel</Btn>
      </CardBody>
    </Card>
  </Page>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import * as Connection from "../src/connection";

import Page from "./a/Page.vue";
import Card from "./a/Card.vue";
import CardHeader from "./a/CardHeader.vue";
import CardBody from "./a/CardBody.vue";
import Btn from "./a/Btn.vue";


export default defineComponent({
  components: {
    Page,
    Card,
    CardHeader,
    CardBody,
    Btn
  },
  setup(props, { root }) {
    const midiinid=computed(()=> {
      return root.$route.params.midiinid;
    })

    const chainid=computed( ()=> {
      return root.$route.params.chainid;
    })

    const headrMsg=computed(()=> {
      return `${midiinid.value} - ${
        Connection.loginStatus.inPorts[parseInt(midiinid.value)]
      } - Chain ${chainid.value}`;
    })

    return {midiinid,chainid, headrMsg}
  }
})



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
