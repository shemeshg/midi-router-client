<template>
  <div>
    <Card :mt="true">
      <CardHeader>{{description}}</CardHeader>
      <CardBody>
        <p>
          <label>Midi input</label>
          <ServerInOutPortsSelect v-model.number="presetMidiControl.port" mode="in" />
        </p>
        <p v-if="presetMidiControl.port !== -1">
          <label>Event</label>
          <SelectedMidiEventType v-model.number="presetMidiControl.eventTypeId" />
        </p>
        <p v-if="presetMidiControl.port !== -1">
          <label>channel</label>
          <SelectedMidiChannel v-model.number="presetMidiControl.channel" />
        </p>
        <p v-if="presetMidiControl.port !== -1">
          <label>data1</label>
          <SelectedMidiData v-model.number="presetMidiControl.data1" />
        </p>
        <p v-if="presetMidiControl.port !== -1">
          <label>data2</label>
          <SelectedMidiData v-model.number="presetMidiControl.data2" />
        </p>
      </CardBody>
    </Card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../../src/connection";

import { dropdownMidiEventType } from "../../src/UserDataConfig/Easyconfig";
import { PresetMidiControl } from "../../src/UserDataConfig/MidiRoutePreset/MidiRoutePreset";

import Card from "../a/Card.vue";
import CardHeader from "../a/CardHeader.vue";
import CardBody from "../a/CardBody.vue";
import ServerInOutPortsSelect from "../a/ServerInOutPortsSelect.vue";
import SelectedMidiEventType from "../a/SelectedMidiEventType.vue";
import SelectedMidiChannel from "../a/SelectedMidiChannel.vue";
import SelectedMidiData from "../a/SelectedMidiData.vue";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    Card,
    CardHeader,
    CardBody,
    ServerInOutPortsSelect,
    SelectedMidiEventType,
    SelectedMidiChannel,
    SelectedMidiData
  }
})
export default class AddPresetMidiOnOffComponent extends Vue {
  //@Prop() inputVal!: InputZonesAndRoutes;
  @Prop() description!: string;
  @Prop() presetMidiControl!: PresetMidiControl;

  dropdownMidiEventType = dropdownMidiEventType;

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