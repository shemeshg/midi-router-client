<template>
  <Page :text="headrMsg">
    <Card>
      <CardBody>
        <p>
          <label>Log to</label>

          <select class="w3-select" name="option" v-model.number="destinationId">
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
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import { LoginStatus } from "../../src/loginStatus";
import * as Connection from "../../src/connection";

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
export default class AddConsoleLogComponent extends Vue {
  destinationId = 0;
  userdata = "{}";
  loginStatus!: LoginStatus;

  get filterid() {
    return this.$route.params.filterid;
  }
  get filterObj() {
    return this.midiRouteInput.midiRouterChains[
      parseInt(this.chainid)
    ].getFilterToConsle(parseInt(this.filterid));
  }
  mounted() {
    if (this.filterid === "-1") {
      return;
    }
    this.destinationId = this.filterObj.logTo;
    this.userdata = JSON.stringify(this.filterObj.userdata);
  }

  doOk() {
    if (this.filterid === "-1") {
      this.midiRouteInput.midiRouterChains[
        parseInt(this.chainid)
      ].addFilterToConsle(this.destinationId, JSON.parse(this.userdata));
    } else {
      this.filterObj.setVal(this.destinationId, JSON.parse(this.userdata));
    }
    this.$router.push(`/midiin/${this.midiinid}`);
  }

  get midiRouteInput() {
    return Connection.loginStatus.userDataConfig.getMidiRouteInput(
      parseInt(this.midiinid)
    );
  }

  doCancel() {
    if (this.filterid === "-1") {
      this.$router.push(`/AddChainFilter/${this.midiinid}/${this.chainid}`);
    } else {
      this.$router.push(`/midiin/${this.midiinid}`);
    }
  }

  get midiinid() {
    return this.$route.params.midiinid;
  }

  get chainid() {
    return this.$route.params.chainid;
  }

  get headrMsg(): string {
    return `${this.midiinid}-${this.chainid} Add console log`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
