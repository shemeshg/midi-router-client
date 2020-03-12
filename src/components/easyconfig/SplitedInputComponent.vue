<template>
    <div>            
            <header class="w3-container w3-blue">
              <h5>{{inputVal.midiInputId}} - {{inputVal.midiInputName}}</h5>
            </header>
            
            <div
              v-for="(splitItem, idx) in keyboardSplits"
              v-bind:key="idx"
            >
              <SelectNoteSliderComponent v-bind:inputVal="splitItem" v-on:deleteSelf="doDelete(idx)"/>

              
            </div>
            
            <p>Zone Names</p>
            <div v-for="(name,idx) in zoneNames" v-bind:key="`${idx}-${name.id}`">
            <input type="text" class="w3-input"   v-model="zoneNames[idx]">
            </div>
            
    </div>
</template>


<script lang="ts">
import { Component,  Vue , Prop} from "vue-property-decorator";
import SelectNoteSliderComponent from "./SelectNoteSlider.vue";
import { InputZonesAndRoutes } from "../../src/UserDataConfig/Easyconfig"

@Component({
  components: {
    SelectNoteSliderComponent
  }
})
export default class SplitedInputComponent extends Vue {
    @Prop() inputVal!: InputZonesAndRoutes;
    keyboardSplits =  this.inputVal.keyboardSplits
    zoneNames = this.inputVal.zoneNames

    doDelete(idx: number){
      this.keyboardSplits.splice(idx, 1);
      this.inputVal.doUpdateZoneNameLen();
      
    }
 
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>