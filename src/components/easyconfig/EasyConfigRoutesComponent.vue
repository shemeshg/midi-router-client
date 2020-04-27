<template>
  <div>
    <CardHeader>{{inputVal.midiInputId}} - {{inputVal.midiInputName}}</CardHeader>
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
            :excludeId="inputVal.midiInputId"
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
            <select class="w3-select" name="option" v-model.number="easyConfigRoute.splitRangeId">
              <option value="-1">-</option>
              <option v-for="(item, idx) in zoneNames" v-bind:key="idx" v-bind:value="idx">{{item}}</option>
            </select>
          </RowCell>
          <RowCell v-if="easyConfigRoute.isShowData1Filed">
            <label>{{easyConfigRoute.getData1Description}}</label>
            <SelectedMidiData v-model.number="easyConfigRoute.fromData1" />
          </RowCell>
          <RowCell v-if="easyConfigRoute.isShowSplitRanges">
            <label>Transpose</label>
            <select class="w3-select" name="option" v-model.number="easyConfigRoute.transpose">
              <option value="-1">-</option>
              <option
                v-for="(item) in transposeRange"
                v-bind:key="item"
                v-bind:value="item"
              >{{item}}</option>
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
            <label>{{easyConfigRoute.getToData1Description}}</label>
            <SelectedMidiData v-model.number="easyConfigRoute.toData1" />
          </RowCell>

          <hr style="border-top: 1px dotted red;  " />
        </Row>
      </div>
    </CardBody>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
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

@Component({
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
    BtnHref
  }
})
export default class EasyConfigRoutesComponent extends Vue {
  @Prop() inputVal!: InputZonesAndRoutes;
  easyConfigRoutes = this.inputVal.easyConfigRoutes;

  zoneNames = this.inputVal.zoneNames;

  deleteSelf(idx: number) {
    this.easyConfigRoutes.splice(idx, 1);
  }

  toEventTypeChanged(idx: number) {
    if (this.easyConfigRoutes[idx].fromSelectedMidiEventTypeId == 0) {
      this.easyConfigRoutes[idx].fromChannel = this.easyConfigRoutes[
        idx
      ].toChannel;
    }
    if (this.easyConfigRoutes[idx].toSelectedMidiEventTypeId == 0) {
      this.easyConfigRoutes[idx].fromSelectedMidiEventTypeId = 0;
    }
  }

  fromEventTypeChanged(idx: number) {
    if (this.easyConfigRoutes[idx].fromSelectedMidiEventTypeId == 0) {
      this.easyConfigRoutes[idx].toSelectedMidiEventTypeId = 0;
    } else {
      this.easyConfigRoutes[
        idx
      ].toSelectedMidiEventTypeId = this.easyConfigRoutes[
        idx
      ].fromSelectedMidiEventTypeId;
    }
  }

  toChannelChange(idx: number) {
    if (this.easyConfigRoutes[idx].fromChannel == -1) {
      this.easyConfigRoutes[idx].fromChannel = this.easyConfigRoutes[
        idx
      ].toChannel;
    }
    if (this.easyConfigRoutes[idx].toChannel == -1) {
      this.easyConfigRoutes[idx].fromChannel = -1;
    }
  }

  fromChannelChange(idx: number) {
    if (this.easyConfigRoutes[idx].fromChannel == -1) {
      this.easyConfigRoutes[idx].toChannel = -1;
    } else {
      this.easyConfigRoutes[idx].toChannel = this.easyConfigRoutes[
        idx
      ].fromChannel;
    }
  }

  get transposeRange() {
    const ret = [];
    for (let i = -36; i <= 36; i++) {
      ret.push(i);
    }
    return ret;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>