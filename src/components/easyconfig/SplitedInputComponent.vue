<template>
  <div v-if="keyboardSplits.length > 0">
    <CardHeader
      >{{ inputVal.midiInputId }} - {{ inputVal.midiInputName }}</CardHeader
    >
    <CardBody>
      <div v-for="(splitItem, idx) in keyboardSplits" v-bind:key="idx">
        <SelectNoteSliderComponent
          v-bind:inputVal="splitItem"
          v-on:delete-self="doDelete(idx)"
        />
      </div>

      <p>Zone Names</p>
      <div v-for="(name, idx) in zoneNames" v-bind:key="`${idx}-${name.id}`">
        <input type="text" class="w3-input" v-model="zoneNames[idx]" />
      </div>
    </CardBody>
  </div>
</template>


<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import SelectNoteSliderComponent from "./SelectNoteSlider.vue";
import { InputZonesAndRoutes } from "../../src/UserDataConfig/Easyconfig";

import CardHeader from "../a/CardHeader.vue";
import CardBody from "../a/CardBody.vue";

export default defineComponent({
  components: {
    SelectNoteSliderComponent,
    CardHeader,
    CardBody,
  },
  props: {
    inputVal: {
      type: InputZonesAndRoutes,
      required: true,
    },
  },
  setup(props) {
    const keyboardSplits = reactive(props.inputVal.keyboardSplits);
    const zoneNames = reactive(props.inputVal.zoneNames);

    function doDelete(idx: number) {
      keyboardSplits.splice(idx, 1);
      props.inputVal.doUpdateZoneNameLen();
    }
    return { keyboardSplits, zoneNames, doDelete };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>