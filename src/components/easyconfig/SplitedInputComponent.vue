<template>
  <div>
    <CardHeader>{{inputVal.midiInputId}} - {{inputVal.midiInputName}}</CardHeader>
    <CardBody>
      <div v-for="(splitItem, idx) in keyboardSplits" v-bind:key="idx">
        <SelectNoteSliderComponent v-bind:inputVal="splitItem" v-on:deleteSelf="doDelete(idx)" />
      </div>

      <p>Zone Names</p>
      <div v-for="(name,idx) in zoneNames" v-bind:key="`${idx}-${name.id}`">
        <input type="text" class="w3-input" v-model="zoneNames[idx]" />
      </div>
    </CardBody>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SelectNoteSliderComponent from "./SelectNoteSlider.vue";
import { InputZonesAndRoutes } from "../../src/UserDataConfig/Easyconfig";

import CardHeader from "../a/CardHeader.vue";
import CardBody from "../a/CardBody.vue";

@Component({
  components: {
    SelectNoteSliderComponent,
    CardHeader,
    CardBody
  }
})
export default class SplitedInputComponent extends Vue {
  @Prop() inputVal!: InputZonesAndRoutes;
  keyboardSplits = this.inputVal.keyboardSplits;
  zoneNames = this.inputVal.zoneNames;

  doDelete(idx: number) {
    this.keyboardSplits.splice(idx, 1);
    this.inputVal.doUpdateZoneNameLen();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>