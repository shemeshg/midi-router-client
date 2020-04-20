<template>
<div>
  <select class="w3-select" name="option" v-model.number="value" @input="$emit('input', $event.target.value)">
    <option value="-1">-</option>
    <option v-for="(item) in inPorts" v-bind:key="item.id" v-bind:value="item.id">{{item.id}} - {{item.name}}</option>
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
  @Prop() excludeId!: number|undefined;

  get inPorts() {
    let ports = Connection.loginStatus.inPorts
    if (this.mode === "out"){
      ports =  Connection.loginStatus.outPorts;
    }    
    const portsAry: {id: number; name: string}[] = []
    Object.keys(ports).forEach( (key)=>{
      if (this.excludeId !== Number(key)  ){
        portsAry.push({id: Number(key), name: ports[Number(key)]})
      }      
    })
    return portsAry;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
