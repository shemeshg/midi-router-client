<template>
  <div
    v-if="easyConfigRoutes.length > 0"
  >
    <CardHeader
      >{{ inputVal.midiInputId }} - {{ inputVal.midiInputName }}</CardHeader
    >
    <CardBody>
      <div v-for="(easyConfigRoute, idx) in easyConfigRoutes" v-bind:key="idx">
        <Row>
          <RowCellRight>
            <BtnHref @click="deleteSelf(idx)">Delete</BtnHref>
          </RowCellRight>
          <label>Desstination</label>
          <ServerInOutPortsSelect
            v-model.number="easyConfigRoute.toDestinationId"
            mode="out"
          />
        </Row>

        <Row>
          <RowCell>
            <label>From event</label>
            <SelectedMidiEventType
              v-model.number="easyConfigRoute.fromSelectedMidiEventTypeId"
              @change="fromEventTypeChanged(idx)"
            />
          </RowCell>
          <RowCell>
            <label>channel</label>
            <SelectedMidiChannel
              v-model.number="easyConfigRoute.fromChannel"
              @change="fromChannelChange(idx)"
            />
          </RowCell>
          <RowCell v-if="easyConfigRoute.isShowSplitRanges">
            <label>Zone</label>
            <select
              class="w3-select"
              name="option"
              v-model.number="easyConfigRoute.splitRangeId"
            >
              <option value="-1">-</option>
              <option
                v-for="(item, idx) in zoneNames"
                v-bind:key="idx"
                v-bind:value="idx"
              >
                {{ item }}
              </option>
            </select>
          </RowCell>
          <RowCell v-if="easyConfigRoute.isShowData1Filed">
            <label>{{ easyConfigRoute.getData1Description }}</label>
            <SelectedMidiData v-model.number="easyConfigRoute.fromData1" />
          </RowCell>
          <RowCell v-if="easyConfigRoute.isShowSplitRanges">
            <label>Transpose</label>
            <select
              class="w3-select"
              name="option"
              v-model.number="easyConfigRoute.transpose"
            >
              <option
                v-for="item in transposeRange"
                v-bind:key="item"
                v-bind:value="item"
              >
                {{ item }}
              </option>
            </select>
          </RowCell>
        </Row>

        <Row>
          <RowCell>
            <label>To event</label>
            <SelectedMidiEventType
              v-model.number="easyConfigRoute.toSelectedMidiEventTypeId"
              @change="toEventTypeChanged(idx)"
            />
          </RowCell>
          <RowCell>
            <label>channel</label>
            <SelectedMidiChannel
              v-model.number="easyConfigRoute.toChannel"
              @change="toChannelChange(idx)"
            />
          </RowCell>
          <RowCell v-if="easyConfigRoute.isShowToData1Filed">
            <label>{{ easyConfigRoute.getToData1Description }}</label>
            <SelectedMidiData v-model.number="easyConfigRoute.toData1" />
          </RowCell>

          <hr style="border-top: 1px dotted red" />
        </Row>
      </div>
    </CardBody>
  </div>
</template>


<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";

import { InputZonesAndRoutes } from "../../src/UserDataConfig/Easyconfig";

import CardHeader from "../a/CardHeader.vue";
import CardBody from "../a/CardBody.vue";

import Row from "../a/Row.vue";
import RowCell from "../a/RowCell.vue";
import RowCellRight from "../a/RowCellRight.vue";
import BtnHref from "../a/BtnHref.vue";
import ServerInOutPortsSelect from "../a/ServerInOutPortsSelect.vue";
import SelectedMidiEventType from "../a/SelectedMidiEventType.vue";
import SelectedMidiChannel from "../a/SelectedMidiChannel.vue";
import SelectedMidiData from "../a/SelectedMidiData.vue";

export default defineComponent({
  components: {
    SelectedMidiChannel,
    SelectedMidiEventType,
    SelectedMidiData,
    ServerInOutPortsSelect,
    CardHeader,
    CardBody,
    Row,
    RowCell,
    RowCellRight,
    BtnHref,
  },
  props: {
    inputVal: {
      type: InputZonesAndRoutes,
      required: true,
    },
  },
  setup(props) {
    const easyConfigRoutes = reactive(props.inputVal.easyConfigRoutes);
    const zoneNames = reactive(props.inputVal.zoneNames);

    function deleteSelf(idx: number) {
      easyConfigRoutes.splice(idx, 1);
    }

    function toEventTypeChanged(idx: number) {
      if (easyConfigRoutes[idx].fromSelectedMidiEventTypeId == 0) {
        easyConfigRoutes[idx].fromChannel = easyConfigRoutes[idx].toChannel;
      }
      if (easyConfigRoutes[idx].toSelectedMidiEventTypeId == 0) {
        easyConfigRoutes[idx].fromSelectedMidiEventTypeId = 0;
      }
    }

    function fromEventTypeChanged(idx: number) {
      if (easyConfigRoutes[idx].fromSelectedMidiEventTypeId == 0) {
        easyConfigRoutes[idx].toSelectedMidiEventTypeId = 0;
      } else {
        easyConfigRoutes[idx].toSelectedMidiEventTypeId =
          easyConfigRoutes[idx].fromSelectedMidiEventTypeId;
      }
    }

    function toChannelChange(idx: number) {
      if (easyConfigRoutes[idx].fromChannel == -1) {
        easyConfigRoutes[idx].fromChannel = easyConfigRoutes[idx].toChannel;
      }
      if (easyConfigRoutes[idx].toChannel == -1) {
        easyConfigRoutes[idx].fromChannel = -1;
      }
    }

    function fromChannelChange(idx: number) {
      if (easyConfigRoutes[idx].fromChannel == -1) {
        easyConfigRoutes[idx].toChannel = -1;
      } else {
        easyConfigRoutes[idx].toChannel = easyConfigRoutes[idx].fromChannel;
      }
    }

    const transposeRange = [];
    for (let i = -36; i <= 36; i++) {
      transposeRange.push(i);
    }

    return {easyConfigRoutes, zoneNames, deleteSelf, toEventTypeChanged, fromEventTypeChanged, 
            toChannelChange, fromChannelChange, transposeRange}

  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>