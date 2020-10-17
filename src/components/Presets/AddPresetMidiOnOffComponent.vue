<template>
  <div>
    <Card :mt="true">
      <CardHeader>{{ description }}</CardHeader>
      <CardBody>
        <p>
          <label>Midi input</label>
          <ServerInOutPortsSelect
            v-model.number="presetMidiControl.port"
            mode="in"
          />
        </p>
        <p v-if="presetMidiControl.port !== -1">
          <label>Event</label>
          <SelectedMidiEventType
            v-model.number="presetMidiControl.eventTypeId"
          />
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
import {
  defineComponent,
  computed,
} from "@vue/composition-api";

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

export default defineComponent({
  components: {
    Card,
    CardHeader,
    CardBody,
    ServerInOutPortsSelect,
    SelectedMidiEventType,
    SelectedMidiChannel,
    SelectedMidiData,
  },
  props: {
    description: {
      type: String,
      required: true,
    },
    presetMidiControl: {
      type: PresetMidiControl,
      required: true,
    },
  },
  setup() {
    const inPorts = computed(() => {
      return Connection.loginStatus.inPorts;
    });

    const channels = computed(() => {
      const ret = [];
      for (let i = 1; i <= 16; i++) {
        ret.push(i);
      }
      return ret;
    });

    const range127 = computed(() => {
      const ret = [];
      for (let i = 0; i <= 127; i++) {
        ret.push(i);
      }
      return ret;
    });

    return { dropdownMidiEventType, range127, channels, inPorts };
  },
});


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>