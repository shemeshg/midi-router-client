<template>
  <div>
    <select
      class="w3-select"
      v-model.number="value"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event.target.value)"
    >
      <option value="-1">-</option>
      <option v-for="(item) in range127" v-bind:key="item" v-bind:value="item">{{item}}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class SelectedMidiData extends Vue {
  @Prop() value!: number;

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
