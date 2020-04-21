<template>
  <Page :text="headrMsg"> 
      <Card
        :mt="true"
        v-for="(item, index) in midiRouteInput.midiRouterChains"
        v-bind:key="index"
      >
        <MidiFilterChain v-bind:chainItem="item" v-bind:chainIdx="index" v-bind:midiId="midiId" v-on:do-splice="spliceRouterChain($event,1)"></MidiFilterChain>
      </Card>

      <Card :mt="true">
        <p>
          <Btn
            :ml="true"
            @click="addChain()"
          >Add chain</Btn>
        </p>
      </Card>

      <Card :mt="true">
        <CardBody>
        <h5>Ignore Types</h5>
        <p>
          <input class="w3-check" type="checkbox" v-model="midiRouteInput.ignoreTypes.midiSysex" />
          <label>Sysex</label>
          <input class="w3-check" type="checkbox" v-model="midiRouteInput.ignoreTypes.midiTime" />
          <label>Time</label>
          <input class="w3-check" type="checkbox" v-model="midiRouteInput.ignoreTypes.midiSense" />
          <label>Sense</label>
        </p>
        <h5>Clock</h5>
        <Row>
          <RowCell>
            <label>Time signature from SPP</label>
            <input
              class="w3-input"
              type="number"
              v-model.number="midiRouteInput.midiRouteClock.fromSppPos"
            />
          </RowCell>
        </Row>
        <Row>
          <RowCell>
            <label>upper numeral</label>
            <input
              class="w3-input"
              type="number"
              v-model.number="midiRouteInput.midiRouteClock.timeSig"
            />
          </RowCell>
          <RowCell>
            <label>lower numeral</label>
            <input
              class="w3-input"
              type="number"
              v-model.number="midiRouteInput.midiRouteClock.timeSigDivBy"
            />
          </RowCell>
        </Row>
        <Row>
          <RowCell>Propagate Inputs</RowCell>
          <RowCell>
            <select class="w3-select" name="option" v-model="propegateInputToAdd">
              <option value></option>
              <option
                v-for="(item) in inPortsWithoutSelfClockPropegate"
                v-bind:key="item.midiInputId"
                v-bind:value="item.midiInputId"
              >{{item.midiInputId}} - {{item.midiInputName}}</option>
            </select>
          </RowCell>
          <RowCell>
            <Btn
              :ml="true"
              @click="addClockPropegateInput()"
            >+</Btn>
          </RowCell>
        </Row>

        <Row>
          <ul class="w3-ul w3-border w3-hoverable w3-margin-left">
            <li
              class="w3-display-container"
              v-for="(item) in midiRouteInput.midiRouteClock.propegateInputs"
              v-bind:key="item.midiInputId"
            >
           
              {{item.midiInputId}} - {{item.midiInputName}}
            
              <RowCellRight>
                <BtnHref @click="spliceClockPropegateInput(item.midiInputId)">Delete</BtnHref>
              </RowCellRight>
            </li>
          </ul>
        </Row>

        <h5>14 Bit CC</h5>
        <Row>
          <RowCell>
            <label>Channel</label>
            <input
              class="w3-input"
              type="number"
              v-model.number="cc14bitChannel"
              @focus="$event.target.select()"
            />
          </RowCell>
          <RowCell>
            <label>CC</label>
            <input
              class="w3-input"
              type="number"
              v-model.number="cc14bitCc"
              @focus="$event.target.select()"
            />
          </RowCell>

          <RowCell>
            <Btn
              :ml="true"
              @click="addCc14bit()"
            >+</Btn>
          </RowCell>
        </Row>

        <Row>
          <ul class="w3-ul w3-border w3-hoverable w3-margin-left">
            <li
              class="w3-display-container"
              v-for="(row, idx) in midiRouteInput.cc14bitAry"
              v-bind:key="idx"
            >
              Channel {{row.channel}} CC {{row.cc}}


              <RowCellRight>
                <BtnHref @click="spliceCc14bit(idx)">Delete</BtnHref>
              </RowCellRight>
            </li>
          </ul>
        </Row>
        <p>&nbsp;</p>
     </CardBody>
      </Card>
      <p>&nbsp;</p>
    </page>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../../src/connection";
import { LoginStatus } from "../../src/loginStatus";

import MidiFilterChain from "./MidiInFilterChainComponent.vue";

import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardBody from "../a/CardBody.vue";
import Row from "../a/Row.vue";
import RowCell from "../a/RowCell.vue";
import BtnHref from "../a/BtnHref.vue";
import RowCellRight from "../a/RowCellRight.vue";
import Btn from "../a/Btn.vue";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    MidiFilterChain,
    Page,
    Card,
    CardBody,
    Row,
    RowCell,
    RowCellRight,
    Btn,
    BtnHref
  }
})
export default class MidiInComponent extends Vue {
  @Prop() private midiId!: string;
  propegateInputToAdd = "";
  inPortsWithoutSelfClockPropegate = this._inPortsWithoutSelfClockPropegate();

  loginStatus!: LoginStatus;

  cc14bitChannel = 1;
  cc14bitCc = 0;

  spliceRouterChain(idx: number){
    this.midiRouteInput.midiRouterChains.splice(idx,1)
    this.$forceUpdate();
  }

  spliceCc14bit(idx: number) {
    this.midiRouteInput.cc14bitAry.splice(idx, 1);
    this.$forceUpdate();
  }

  addCc14bit() {
    if (
      this.cc14bitChannel < 1 ||
      this.cc14bitChannel > 16 ||
      this.cc14bitCc < 0 ||
      this.cc14bitCc > 17
    ) {
      return;
    }
    if (
      this.midiRouteInput.cc14bitAry.filter(row => {
        return row.channel === this.cc14bitChannel && row.cc === this.cc14bitCc;
      }).length > 0
    ) {
      return;
    }
    this.midiRouteInput.addCc14bitAry(this.cc14bitChannel, this.cc14bitCc);

    this.$forceUpdate();
  }

  spliceClockPropegateInput(inputsId: number) {
    for (
      let i = 0;
      i < this.midiRouteInput.midiRouteClock.propegateInputs.length;
      i++
    ) {
      if (
        this.midiRouteInput.midiRouteClock.propegateInputs[i].midiInputId ===
        inputsId
      ) {
        this.midiRouteInput.midiRouteClock.propegateInputs.splice(i, 1);
        continue;
      }
    }
    this.inPortsWithoutSelfClockPropegate = this._inPortsWithoutSelfClockPropegate();
  }

  addClockPropegateInput() {
    if (this.propegateInputToAdd === "") {
      return;
    }
    this.midiRouteInput.addClockPropegateInput(
      parseInt(this.propegateInputToAdd)
    );
    this.inPortsWithoutSelfClockPropegate = this._inPortsWithoutSelfClockPropegate();
  }

  _inPortsWithoutSelfClockPropegate() {
    const keysSelected = this.midiRouteInput.midiRouteClock.propegateInputs.map(
      row => {
        return row.midiInputId;
      }
    );
    return this.midiRouteInput.inPortsWithoutSelf.filter(row => {
      return keysSelected.indexOf(row.midiInputId) === -1;
    });
  }

  addChain() {
    this.midiRouteInput.addMidiRouterChain("New chain");
    this.$forceUpdate();
  }

  get midiRouteInput() {
    return Connection.loginStatus.userDataConfig.getMidiRouteInput(
      parseInt(this.midiId)
    );
  }

  get headrMsg(): string {
    return `${this.midiId} - ${
      this.loginStatus.inPorts[parseInt(this.midiId)]
    }`;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
