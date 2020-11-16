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

      <input
        class="w3-check w3-margin-left"
        type="checkbox"
        v-model="isSendAllUserControls"
      />
      <label> Send all User Controls position on apply</label>
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
    const isSendAllUserControls = ref(false);

    const _midiOn = new PresetMidiControl(PresetMidiType.PRESET_ON, "");
    const midiOn = reactive(_midiOn);
    const _midiOff = new PresetMidiControl(PresetMidiType.PRESET_OFF, "");
    const midiOff = reactive(_midiOff);
    
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
        newPreset.setVal(presetName.value, isSendAllUserControls.value, midiOn, midiOff);
      } else {
        routeObj.value.setVal(presetName.value, isSendAllUserControls.value, midiOn, midiOff);
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
      isSendAllUserControls.value = routeObj.value.isSendAllUserControls
      
      midiOn.presetUuid = routeObj.value.midiControlOn.presetUuid
      midiOn.presetMidiType = routeObj.value.midiControlOn.presetMidiType
      midiOn.portName = routeObj.value.midiControlOn.portName
      midiOn.port = routeObj.value.midiControlOn.port
      midiOn.eventTypeId = routeObj.value.midiControlOn.eventTypeId
      midiOn.channel = routeObj.value.midiControlOn.channel
      midiOn.data1 = routeObj.value.midiControlOn.data1
      midiOn.data2 = routeObj.value.midiControlOn.data2
      midiOn.isMidiParamsEqual = routeObj.value.midiControlOn.isMidiParamsEqual
      
      midiOff.presetUuid = routeObj.value.midiControlOff.presetUuid
      midiOff.presetMidiType = routeObj.value.midiControlOff.presetMidiType
      midiOff.portName = routeObj.value.midiControlOff.portName
      midiOff.port = routeObj.value.midiControlOff.port
      midiOff.eventTypeId = routeObj.value.midiControlOff.eventTypeId
      midiOff.channel = routeObj.value.midiControlOff.channel
      midiOff.data1 = routeObj.value.midiControlOff.data1
      midiOff.data2 = routeObj.value.midiControlOff.data2
      midiOff.isMidiParamsEqual = routeObj.value.midiControlOff.isMidiParamsEqual

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
      isSendAllUserControls,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>