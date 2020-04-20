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
            >{{itm.midiInputId}} - {{itm.midiInputName}}</option>
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
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import { LoginStatus } from "../../src/loginStatus";
import * as Connection from "../../src/connection";
import { BaseMidiRouteInput } from "../../src/UserDataConfig/MidiRoutePreset/BaseMidiRouteInput";

import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardBody from "../a/CardBody.vue";
import Btn from "../a/Btn.vue";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    Page,
    Card,
    CardBody,
    Btn
  }
})
export default class AddNetworkDestinationComponent extends Vue {
  loginStatus!: LoginStatus;
  serverName = "";
  portNumber = 12345;
  destinationMidiId = "";
  remoteMidiPorts: BaseMidiRouteInput[] = [];

  get filterid() {
    return this.$route.params.filterid;
  }
  get filterObj() {
    return this.midiRouteInput.midiRouterChains[
      parseInt(this.chainid)
    ].getFilterNetworkDestination(parseInt(this.filterid));
  }

  mounted() {
    if (this.filterid === "-1") {
      return;
    }
    this.serverName = this.filterObj.serverName;
    this.portNumber = this.filterObj.serverPort;
    this.destinationMidiId = this.filterObj.baseMidiRouteInput.midiInputId.toString();
    this.remoteMidiPorts = [this.filterObj.baseMidiRouteInput];
  }

  doOk() {
    if (this.destinationMidiId === "") {
      return;
    }

    const inputObj = this.remoteMidiPorts.filter(row => {
      return row.midiInputId === parseInt(this.destinationMidiId);
    })[0];

    if (this.filterid === "-1") {
      this.midiRouteInput.midiRouterChains[
        parseInt(this.chainid)
      ].addFilterNetworkDestination(this.serverName, this.portNumber, inputObj);
    } else {
      this.filterObj.setVal(this.serverName, this.portNumber, inputObj);
    }

    this.$router.push(`/midiin/${this.midiinid}`);
  }

  doCancel() {
    if (this.filterid === "-1") {
      this.$router.push(`/AddChainFilter/${this.midiinid}/${this.chainid}`);
    } else {
      this.$router.push(`/midiin/${this.midiinid}`);
    }
  }

  async getRemotePorts() {
    this.destinationMidiId = "";
    this.remoteMidiPorts = [];
    const l = await Connection.loginNoSingleTon(
      this.serverName,
      this.portNumber
    );

    const keys = Object.keys(l.inPorts);

    for (let i = 0; i < keys.length; i++) {
      const ikey = parseInt(keys[i]);
      this.remoteMidiPorts.push(new BaseMidiRouteInput(ikey, l.inPorts[ikey]));
    }
  }

  get midiRouteInput() {
    return Connection.loginStatus.userDataConfig.getMidiRouteInput(
      parseInt(this.midiinid)
    );
  }

  get midiinid() {
    return this.$route.params.midiinid;
  }

  get chainid() {
    return this.$route.params.chainid;
  }

  get headrMsg(): string {
    return `${this.midiinid}-${this.chainid} Add Network Destination`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
