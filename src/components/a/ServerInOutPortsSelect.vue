<template>
  <div>
    <select
      class="w3-select"
      name="option"
      v-model.number="value"
      @input="$emit('input', $event.target.value)"
    >
      <option value="-1">-</option>
      <option
        v-for="item in inPorts"
        v-bind:key="item.id"
        v-bind:value="item.id"
      >
        {{ item.id }} - {{ item.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import * as Connection from "../../src/connection";
import { defineComponent, computed } from "@vue/composition-api";

export default defineComponent({
  name: "ServerInOutPortsSelect",
  props: {
    value: Number,
    excludeId: [Number],
    mode: {
      validator: function (value: string) {
        return ["in", "out"].indexOf(value) !== -1;
      },
    },
  },
  // eslint-disable-next-line 
  setup(props: any) {
    const inPorts = computed(() => {
      let ports = Connection.loginStatus.inPorts;
      if (props.mode === "out") {
        ports = Connection.loginStatus.outPorts;
      }
      const portsAry: { id: number; name: string }[] = [];
      Object.keys(ports).forEach((key) => {
        if (props.excludeId !== Number(key)) {
          portsAry.push({ id: Number(key), name: ports[Number(key)] });
        }
      });
      return portsAry;
    });
    
    return { inPorts };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
