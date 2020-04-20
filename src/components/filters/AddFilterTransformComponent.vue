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
          <select class="w3-select" name="option" v-model.number="conditionAction">
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
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import { LoginStatus } from "../../src/loginStatus";
import * as Connection from "../../src/connection";

import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardBody from "../a/CardBody.vue";
import CardHeader from "../a/CardHeader.vue";
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
    CardHeader,
    Btn
  }
})
export default class AddFilterTransformComponent extends Vue {
  loginStatus!: LoginStatus;

  description = "";
  conditionAction = 0;
  filterChannel = "[[0,16,0]]";
  filterEvents = "[[0,16,0]]";
  filterData1 = "[[0,127,0]]";
  filterData2 = "[[0,127,0]]";

  get filterid() {
    return this.$route.params.filterid;
  }
  get filterObj() {
    return this.midiRouteInput.midiRouterChains[
      parseInt(this.chainid)
    ].getFilterFilterAndTransform(parseInt(this.filterid));
  }
  mounted() {
    if (this.filterid === "-1") {
      return;
    }
    this.conditionAction = this.filterObj.conditionAction;
    this.description = this.filterObj.name;
    this.filterChannel = this.filterObj.filterChannel;
    this.filterEvents = this.filterObj.filterEvents;
    this.filterData1 = this.filterObj.filterData1;
    this.filterData2 = this.filterObj.filterData2;
  }

  doOk() {
    if (this.description === "") {
      this.description = "Filter and transform";
    }
    if (this.filterid === "-1") {
      this.midiRouteInput.midiRouterChains[
        parseInt(this.chainid)
      ].addFilterFilterAndTransform(
        this.description,
        this.conditionAction,
        this.filterChannel,
        this.filterEvents,
        this.filterData1,
        this.filterData2
      );
    } else {
      this.filterObj.setVal(
        this.description,
        this.conditionAction,
        this.filterChannel,
        this.filterEvents,
        this.filterData1,
        this.filterData2
      );
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
    return `${this.midiinid}-${this.chainid} Add filter and transform`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
