<template>
  <div>
    <select
      class="w3-select"
      v-model.number="value"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event.target.value)"
    >
      <option
        v-for="(item) in dropdownMidiEventType"
        v-bind:key="item.id"
        v-bind:value="item.id"
      >{{item.eventTypes}} - {{item.name}}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { dropdownMidiEventType } from "../../src/UserDataConfig/Easyconfig";

@Component({})
export default class SelectedMidiEventType extends Vue {
  @Prop() value!: number;
  dropdownMidiEventType = dropdownMidiEventType;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
