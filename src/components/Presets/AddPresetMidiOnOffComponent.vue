<template>
  <div>
    <div class="w3-card-4 w3-margin-top">
      <header class="w3-container w3-blue">
        <h5>{{description}}</h5>
      </header>
      <div class="w3-container">
        <p>
          <label>Midi input</label>
          <select class="w3-select" name="option" v-model.number="presetMidiControl.port">
            <option value="-1"></option>
            <option
              v-for="(item,idx) in inPorts"
              v-bind:key="idx"
              v-bind:value="idx"
            >{{idx}} - {{item}}</option>
          </select>
        </p>
        <p v-if="presetMidiControl.port !== -1">
          <label>Event</label>
          <select
            class="w3-select"
            name="option"
            v-model.number="presetMidiControl.eventTypeId"
            @change="eventTypeChanged(idx)"
          >
            <option
              v-for="(item) in dropdownMidiEventType"
              v-bind:key="item.id"
              v-bind:value="item.id"
            >{{item.eventTypes}} - {{item.name}}</option>
          </select>
        </p>
        <p v-if="presetMidiControl.port !== -1">
          <label>channel</label>
          <select class="w3-select" name="option" v-model.number="presetMidiControl.channel">
            <option value="-1">-</option>
            <option v-for="(item) in channels" v-bind:key="item" v-bind:value="item">{{item}}</option>
          </select>
        </p>
        <p v-if="presetMidiControl.port !== -1">
          <labe>data1</labe>
          <select class="w3-select" name="option" v-model.number="presetMidiControl.data1">
            <option value="-1">-</option>
            <option v-for="(item) in range127" v-bind:key="item" v-bind:value="item">{{item}}</option>
          </select>
        </p>

        <p v-if="presetMidiControl.port !== -1">
          <labe>data2</labe>
          <select class="w3-select" name="option" v-model.number="presetMidiControl.data2">
            <option value="-1">-</option>
            <option v-for="(item) in range127" v-bind:key="item" v-bind:value="item">{{item}}</option>
          </select>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../../src/connection";

import { dropdownMidiEventType } from "../../src/UserDataConfig/Easyconfig";
import { PresetMidiControl } from "../../src/UserDataConfig/MidiRoutePreset/MidiRoutePreset"

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  }
})
export default class AddPresetMidiOnOffComponent extends Vue {
  //@Prop() inputVal!: InputZonesAndRoutes;    
  @Prop()  description!: string;
  @Prop()  presetMidiControl!: PresetMidiControl;


  dropdownMidiEventType = dropdownMidiEventType;

  eventTypeChanged(idx: number) {
    console.log(idx);
    //debugger;
  }

  get inPorts() {
    return Connection.loginStatus.inPorts;
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>