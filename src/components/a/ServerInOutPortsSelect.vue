<template>
<div>
  <select class="w3-select" name="option" v-model.number="value" @input="$emit('input', $event.target.value)">
    <option value="-1">-</option>
    <option v-for="(item,idx) in inPorts" v-bind:key="idx" v-bind:value="idx">{{idx}} - {{item}}</option>
  </select>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import * as Connection from "../../src/connection";

@Component({})
export default class ServerInOutPortsSelect extends Vue {
  @Prop() mode!: "in" | "out";
  @Prop() value!: number;

  get inPorts() {
    if (this.mode === "out"){
      return Connection.loginStatus.outPorts;
    }    
    return Connection.loginStatus.inPorts;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
