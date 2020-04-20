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
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../../src/connection";
import { LoginStatus } from "../../src/loginStatus";

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
export default class AddScheduleComponent extends Vue {
  loginStatus!: LoginStatus;
  defferedType = "";
  defferedTo = 0;

  get filterid() {
    return this.$route.params.filterid;
  }
  get filterObj() {
    return this.midiRouteInput.midiRouterChains[
      parseInt(this.chainid)
    ].getFilterSchedule(parseInt(this.filterid));
  }

  mounted() {
    if (this.filterid === "-1") {
      return;
    }
    this.defferedType = this.filterObj.defferedType.toString();
    this.defferedTo = this.filterObj.defferedTo;
  }

  doOk() {
    if (this.defferedType === "") {
      return;
    }

    if (this.filterid === "-1") {
      this.midiRouteInput.midiRouterChains[
        parseInt(this.chainid)
      ].addFilterSchedule(parseInt(this.defferedType), this.defferedTo);
    } else {
      this.filterObj.setVal(parseInt(this.defferedType), this.defferedTo);
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
    return `${this.midiinid}-${this.chainid} Add Schedule`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
