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
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import { LoginStatus } from "../../src/loginStatus";
import * as Connection from "../../src/connection";

import ServerInOutPortsSelect from "../a/ServerInOutPortsSelect.vue";
import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardBody from "../a/CardBody.vue";
import RowCell from "../a/RowCell.vue";
import Btn from "../a/Btn.vue";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    ServerInOutPortsSelect,
    Page,
    Card,
    CardBody,
    RowCell,
    Btn
  }
})
export default class AddMidiDestinationComponent extends Vue {
  inputToAdd = -1;

  loginStatus!: LoginStatus;

  mounted() {
    if (this.filterid === "-1") {
      return;
    }
    this.inputToAdd = this.filterMidiDestination.baseMidiRouteInput.midiInputId;
  }

  get filterMidiDestination() {
    return this.midiRouteInput.midiRouterChains[
      parseInt(this.chainid)
    ].getFilterMidiDestination(parseInt(this.filterid));
  }

  doOk() {
    if (this.inputToAdd === -1) {
      return;
    }
    const inputObj = this.inPortsWithoutSelf.filter(row => {
      return row.midiInputId === this.inputToAdd;
    })[0];
    if (this.filterid === "-1") {
      this.midiRouteInput.midiRouterChains[
        parseInt(this.chainid)
      ].addFilterMidiDestination(inputObj);
    } else {
      this.filterMidiDestination.setVal(inputObj);
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

  get inPortsWithoutSelf() {
    return this.midiRouteInput.inPortsWithoutSelf;
  }

  get midiRouteInput() {
    return Connection.loginStatus.userDataConfig.getMidiRouteInput(
      parseInt(this.midiinid)
    );
  }

  get filterid() {
    return this.$route.params.filterid;
  }

  get midiinid() {
    return this.$route.params.midiinid;
  }

  get chainid() {
    return this.$route.params.chainid;
  }

  get headrMsg(): string {
    return `${this.midiinid}-${this.chainid} Add Midi Destination`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
