<template>
  <Page :text="headrMsg">
    <Card>
      <CardBody>
        <p>
          <label>Preset name</label>
          <input class="w3-input" type="text" v-model="presetName" />
        </p>
      </CardBody>
    </Card>

    <h5>Midi controller (optional)</h5>
    <AddPresetMidiOnOffComponent
      description="ON"
      v-bind:presetMidiControl="midiOn"
    ></AddPresetMidiOnOffComponent>
    <AddPresetMidiOnOffComponent
      description="OFF"
      v-bind:presetMidiControl="midiOff"
    ></AddPresetMidiOnOffComponent>

    <Card>
      <CardBody>
        <Btn @click="doOk()">OK</Btn>
        <Btn :ml="true" @click="doCancel()">Cancel</Btn>
      </CardBody>
    </Card>
  </Page>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  reactive,
} from "@vue/composition-api";

import * as Connection from "../../src/connection";
import {
  PresetMidiControl,
  PresetMidiType,
} from "../../src/UserDataConfig/MidiRoutePreset/MidiRoutePreset";

import AddPresetMidiOnOffComponent from "./AddPresetMidiOnOffComponent.vue";
import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardBody from "../a/CardBody.vue";
import Btn from "../a/Btn.vue";

export default defineComponent({
  components: {
    AddPresetMidiOnOffComponent,
    Page,
    Card,
    CardBody,
    Btn,
  },
  setup(props, { root }) {
    const presetName = ref("");
    const _midiOn = new PresetMidiControl(PresetMidiType.PRESET_ON, "");
    let midiOn = reactive(_midiOn);
    const _midiOff = new PresetMidiControl(PresetMidiType.PRESET_OFF, "");
    let midiOff = reactive(_midiOff);

    const routeId = computed(() => {
      return root.$route.params.id;
    });
    const routeObj = computed(() => {
      return Connection.loginStatus.userDataConfig.midiRoutePresets[
        parseInt(routeId.value)
      ];
    });

    const headrMsg = computed(() => {
      return "Edit preset";
    });

    function doOk() {
      if (presetName.value === "") {
        return;
      }
      if (routeId.value === "-1") {
        const newPreset = Connection.loginStatus.userDataConfig.addPreset(
          presetName.value
        );
        newPreset.setVal(presetName.value, midiOn, midiOff);
      } else {
        routeObj.value.setVal(presetName.value, midiOn, midiOff);
      }
      root.$router.push(`/presets`);
    }

    function doCancel() {
      root.$router.push(`/presets`);
    }

    onMounted(() => {
      if (routeId.value === "-1") {
        return;
      }
      presetName.value = routeObj.value.name;
      midiOn = reactive(routeObj.value.midiControlOn);
      midiOff = reactive(routeObj.value.midiControlOff);
    });

    return {
      doCancel,
      doOk,
      headrMsg,
      routeObj,
      routeId,
      midiOff,
      midiOn,
      presetName,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>