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
    <AddPresetMidiOnOffComponent description="ON" v-bind:presetMidiControl="midiOn"></AddPresetMidiOnOffComponent>
    <AddPresetMidiOnOffComponent description="OFF" v-bind:presetMidiControl="midiOff"></AddPresetMidiOnOffComponent>

    <Card>
      <CardBody>
        <Btn @click="doOk()">OK</Btn>
        <Btn :ml="true" @click="doCancel()">Cancel</Btn>
      </CardBody>
    </Card>
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../../src/connection";
import {
  PresetMidiControl,
  PresetMidiType
} from "../../src/UserDataConfig/MidiRoutePreset/MidiRoutePreset";

import AddPresetMidiOnOffComponent from "./AddPresetMidiOnOffComponent.vue";
import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardBody from "../a/CardBody.vue";
import Btn from "../a/Btn.vue";

@Component({
  components: {
    AddPresetMidiOnOffComponent,
    Page,
    Card,
    CardBody,
    Btn
  },
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  }
})
export default class AddPresetComponent extends Vue {
  presetName = "";
  midiOn = new PresetMidiControl(PresetMidiType.PRESET_ON, "");
  midiOff = new PresetMidiControl(PresetMidiType.PRESET_OFF, "");

  get routeId() {
    return this.$route.params.id;
  }
  get routeObj() {
    return Connection.loginStatus.userDataConfig.midiRoutePresets[
      parseInt(this.routeId)
    ];
  }

  mounted() {
    if (this.routeId === "-1") {
      return;
    }
    this.presetName = this.routeObj.name;
    this.midiOn = this.routeObj.midiControlOn;
    this.midiOff = this.routeObj.midiControlOff;
  }

  doOk() {
    if (this.presetName === "") {
      return;
    }
    if (this.routeId === "-1") {
      const newPreset = Connection.loginStatus.userDataConfig.addPreset(
        this.presetName
      );
      newPreset.setVal(this.presetName, this.midiOn, this.midiOff);
    } else {
      this.routeObj.setVal(this.presetName, this.midiOn, this.midiOff);
    }
    this.$router.push(`/presets`);
  }

  doCancel() {
    this.$router.push(`/presets`);
  }

  get headrMsg() {
    return "Edit preset";
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>