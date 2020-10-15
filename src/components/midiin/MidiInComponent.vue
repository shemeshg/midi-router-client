<template>
  <Page :text="headrMsg">
    <Card
      :mt="true"
      v-for="(item, index) in midiRouteInput.midiRouterChains"
      v-bind:key="index"
    >
      <MidiFilterChain
        v-bind:chainItem="item"
        v-bind:chainIdx="index"
        v-bind:midiId="midiId"
        v-on:do-splice="spliceRouterChain($event, 1)"
      ></MidiFilterChain>
    </Card>

    <Card :mt="true">
      <p>
        <Btn :ml="true" @click="addChain()">Add chain</Btn>
      </p>
    </Card>

    <Card :mt="true">
      <CardBody>
        <h5>Ignore Types</h5>
        <p>
          <input
            class="w3-check"
            type="checkbox"
            v-model="midiRouteInput.ignoreTypes.midiSysex"
          />
          <label>Sysex</label>
          <input
            class="w3-check"
            type="checkbox"
            v-model="midiRouteInput.ignoreTypes.midiTime"
          />
          <label>Time</label>
          <input
            class="w3-check"
            type="checkbox"
            v-model="midiRouteInput.ignoreTypes.midiSense"
          />
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
            <select
              class="w3-select"
              name="option"
              v-model="propegateInputToAdd"
            >
              <option value></option>
              <option
                v-for="item in inPortsWithoutSelfClockPropegate"
                v-bind:key="item.midiInputId"
                v-bind:value="item.midiInputId"
              >
                {{ item.midiInputId }} - {{ item.midiInputName }}
              </option>
            </select>
          </RowCell>
          <RowCell>
            <Btn :ml="true" @click="addClockPropegateInput()">+</Btn>
          </RowCell>
        </Row>

        <Row>
          <ul class="w3-ul w3-border w3-hoverable w3-margin-left">
            <li
              class="w3-display-container"
              v-for="item in midiRouteInput.midiRouteClock.propegateInputs"
              v-bind:key="item.midiInputId"
            >
              {{ item.midiInputId }} - {{ item.midiInputName }}

              <RowCellRight>
                <BtnHref @click="spliceClockPropegateInput(item.midiInputId)"
                  >Delete</BtnHref
                >
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
            <Btn :ml="true" @click="addCc14bit()">+</Btn>
          </RowCell>
        </Row>

        <Row>
          <ul class="w3-ul w3-border w3-hoverable w3-margin-left">
            <li
              class="w3-display-container"
              v-for="(row, idx) in midiRouteInput.cc14bitAry"
              v-bind:key="idx"
            >
              Channel {{ row.channel }} CC {{ row.cc }}

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
  </Page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "@vue/composition-api";

import * as Connection from "../../src/connection";

import MidiFilterChain from "./MidiInFilterChainComponent.vue";

import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardBody from "../a/CardBody.vue";
import Row from "../a/Row.vue";
import RowCell from "../a/RowCell.vue";
import BtnHref from "../a/BtnHref.vue";
import RowCellRight from "../a/RowCellRight.vue";
import Btn from "../a/Btn.vue";

export default defineComponent({
  components: {
    MidiFilterChain,
    Page,
    Card,
    CardBody,
    Row,
    RowCell,
    RowCellRight,
    Btn,
    BtnHref,
  },
  props: {
    midiId: {
      type: String,
      required: true,
    },
  },
  setup(props, { root }) {
    const midiRouteInput = computed(() => {
      {
        return Connection.loginStatus.userDataConfig.getMidiRouteInput(
          Connection.loginStatus.inPorts[Number(props.midiId)]
        );
      }
    });

    function _getInPortsWithoutSelfClockPropegate(){
      const keysSelected = midiRouteInput.value.midiRouteClock.propegateInputs.map(
        (row) => {
          return row.midiInputId;
        }
      );
      return midiRouteInput.value.inPortsWithoutSelf.filter((row) => {
        return keysSelected.indexOf(row.midiInputId) === -1;
      });
    }

    const inPortsWithoutSelfClockPropegate = ref(_getInPortsWithoutSelfClockPropegate());

    const propegateInputToAdd = ref("");

    const cc14bitChannel = ref(1);
    const cc14bitCc = ref(0);

    function forceUpdate() {
      const n = cc14bitCc.value;
      cc14bitCc.value = -1;
      root.$nextTick(() => {
        cc14bitCc.value = n;
      });
    }

    function spliceRouterChain(idx: number) {
      midiRouteInput.value.midiRouterChains.splice(idx, 1);
      forceUpdate();
    }

    function spliceCc14bit(idx: number) {
      midiRouteInput.value.cc14bitAry.splice(idx, 1);
      forceUpdate();
    }

    function addCc14bit() {
      if (
        cc14bitChannel.value < 1 ||
        cc14bitChannel.value > 16 ||
        cc14bitCc.value < 0 ||
        cc14bitCc.value > 17
      ) {
        return;
      }
      if (
        midiRouteInput.value.cc14bitAry.filter((row) => {
          return (
            row.channel === cc14bitChannel.value && row.cc === cc14bitCc.value
          );
        }).length > 0
      ) {
        return;
      }
      midiRouteInput.value.addCc14bitAry(cc14bitChannel.value, cc14bitCc.value);

      forceUpdate();
    }

    function spliceClockPropegateInput(inputsId: number) {
      for (
        let i = 0;
        i < midiRouteInput.value.midiRouteClock.propegateInputs.length;
        i++
      ) {
        if (
          midiRouteInput.value.midiRouteClock.propegateInputs[i].midiInputId ===
          inputsId
        ) {
          midiRouteInput.value.midiRouteClock.propegateInputs.splice(i, 1);
          forceUpdate();
          continue;
        }
      }

      inPortsWithoutSelfClockPropegate.value.splice(0,inPortsWithoutSelfClockPropegate.value.length)
      _getInPortsWithoutSelfClockPropegate().forEach((row)=>{
        inPortsWithoutSelfClockPropegate.value.push(row)
      })

    }

    function addClockPropegateInput() {
      if (propegateInputToAdd.value === "") {
        return;
      }
      
      midiRouteInput.value.addClockPropegateInput(
        parseInt(propegateInputToAdd.value)
      );
      inPortsWithoutSelfClockPropegate.value.splice(0,inPortsWithoutSelfClockPropegate.value.length)
      _getInPortsWithoutSelfClockPropegate().forEach((row)=>{
        inPortsWithoutSelfClockPropegate.value.push(row)
      })
      forceUpdate();
    }

    function addChain() {
      midiRouteInput.value.addMidiRouterChain("New chain");
      forceUpdate();
    }

    const headrMsg = computed(() => {
      return `${props.midiId} - ${
        Connection.loginStatus.inPorts[parseInt(props.midiId)]
      }`;
    });

    return {
      headrMsg,
      addChain,
      addClockPropegateInput,
      spliceClockPropegateInput,
      addCc14bit,
      spliceCc14bit,
      spliceRouterChain,
      cc14bitCc,
      cc14bitChannel,
      propegateInputToAdd,
      inPortsWithoutSelfClockPropegate,
      midiRouteInput,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
