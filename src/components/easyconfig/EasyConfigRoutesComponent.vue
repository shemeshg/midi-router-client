<template>
  <div>
    <header class="w3-container w3-blue">
      <h5>{{inputVal.midiInputId}} - {{inputVal.midiInputName}}</h5>
    </header>
 <div class="w3-container">
    <div v-for="(easyConfigRoute, idx) in easyConfigRoutes" v-bind:key="idx">
      <div>
        <div class="w3-container">
          <div class="w3-container w3-cell w3-cell-middle w3-right">
            <a
              href="#"
              class="router-link-exact-active router-link-active"
              @click="deleteSelf(idx)"
            >Delete</a>
          </div>
          <label>Desstination</label>
          <select class="w3-select" name="option" v-model.number="easyConfigRoute.toDestinationId">
            <option value></option>
            <option
              v-for="(item) in outPortsWithoutSelf"
              v-bind:key="item.midiInputId"
              v-bind:value="item.midiInputId"
            >{{item.midiInputId}} - {{item.midiInputName}}</option>
          </select>
        </div>

        <div class="w3-container w3-cell w3-cell-middle">
          <label>From event</label>
          <select
            class="w3-select"
            name="option"
            v-model="easyConfigRoute.fromSelectedMidiEventTypeId"
            @change="fromEventTypeChanged(idx)"
          >
            <option
              v-for="(item) in dropdownMidiEventType"
              v-bind:key="item.id"
              v-bind:value="item.id"
            >{{item.eventTypes}} - {{item.name}}</option>
          </select>
        </div>
        <div class="w3-container w3-cell w3-cell-middle">
          <label>channel</label>
          <select
            class="w3-select"
            name="option"
            v-model.number="easyConfigRoute.fromChannel"
            @change="fromChannelChange(idx)"
          >
            <option value="-1">-</option>
            <option v-for="(item) in channels" v-bind:key="item" v-bind:value="item">{{item}}</option>
          </select>
        </div>
        <div class="w3-container w3-cell w3-cell-middle" v-if="easyConfigRoute.isShowSplitRanges">
          <label>Zone</label>
          <select class="w3-select" name="option" v-model.number="easyConfigRoute.splitRangeId">
            <option value="-1">-</option>
            <option v-for="(item, idx) in zoneNames" v-bind:key="idx" v-bind:value="idx">{{item}}</option>
          </select>
        </div>
        <div class="w3-container w3-cell w3-cell-middle" v-if="easyConfigRoute.isShowData1Filed">
          <label>{{easyConfigRoute.getData1Description}}</label>
          <select class="w3-select" name="option" v-model.number="easyConfigRoute.fromData1">
            <option value="-1">-</option>
            <option v-for="(item) in range127" v-bind:key="item" v-bind:value="item">{{item}}</option>
          </select>
        </div>
        <div class="w3-container w3-cell w3-cell-middle" v-if="easyConfigRoute.isShowSplitRanges">
          <label>Transpose</label>
          <select class="w3-select" name="option" v-model.number="easyConfigRoute.transpose">
            <option value="-1">-</option>
            <option v-for="(item) in transposeRange" v-bind:key="item" v-bind:value="item">{{item}}</option>
          </select>
        </div>
      </div>

      <div>
        <div class="w3-container w3-cell w3-cell-middle">
          <label>To event</label>
          <select
            class="w3-select"
            name="option"
            v-model="easyConfigRoute.toSelectedMidiEventTypeId"
            @change="toEventTypeChanged(idx)"
          >
            <option
              v-for="(item) in dropdownMidiEventType"
              v-bind:key="item.id"
              v-bind:value="item.id"
            >{{item.eventTypes}} - {{item.name}}</option>
          </select>
        </div>
        <div class="w3-container w3-cell w3-cell-middle">
          <label>channel</label>
          <select
            class="w3-select"
            name="option"
            v-model.number="easyConfigRoute.toChannel"
            @change="toChannelChange(idx)"
          >
            <option value="-1">-</option>
            <option v-for="(item) in channels" v-bind:key="item" v-bind:value="item">{{item}}</option>
          </select>
        </div>
        <div class="w3-container w3-cell w3-cell-middle" v-if="easyConfigRoute.isShowToData1Filed">
          <label>{{easyConfigRoute.getToData1Description}}</label>
          <select class="w3-select" name="option" v-model.number="easyConfigRoute.toData1">
            <option value="-1">-</option>
            <option v-for="(item) in range127" v-bind:key="item" v-bind:value="item">{{item}}</option>
          </select>
        </div>

        <hr style="border-top: 1px dotted red;  " />
      </div>
    </div>
 </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  InputZonesAndRoutes,
  dropdownMidiEventType
} from "../../src/UserDataConfig/Easyconfig";
import * as Connection from "../../src/connection";

@Component({
  components: {}
})
export default class EasyConfigRoutesComponent extends Vue {
  @Prop() inputVal!: InputZonesAndRoutes;
  easyConfigRoutes = this.inputVal.easyConfigRoutes;
  dropdownMidiEventType = dropdownMidiEventType;

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

  get outPortsWithoutSelf() {
    return Connection.loginStatus.userDataConfig.getMidiRouteInput(
      this.inputVal.midiInputId
    ).inPortsWithoutSelf;
  }

  get channels() {
    const ret = [];
    for (let i = 1; i <= 16; i++) {
      ret.push(i);
    }
    return ret;
  }

  get range127() {
    const ret = [];
    for (let i = 0; i <= 127; i++) {
      ret.push(i);
    }
    return ret;
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