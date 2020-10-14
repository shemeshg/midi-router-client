<template>
  <div>
    <select
      class="w3-select"
      v-model.number="value"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event.target.value)"
    >
      <option value="-1">-</option>
      <option v-for="item in channels" v-bind:key="item" v-bind:value="item">
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  props: {
    value: Number,
  },
  setup() {
    const channels = [];
    for (let i = 1; i <= 16; i++) {
      channels.push(i);
    }

    return { channels };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
