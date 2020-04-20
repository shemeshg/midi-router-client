<template>
  <Row>
    <RowCellRight>
      <BtnHref @click="$emit('deleteSelf')">Delete</BtnHref>
    </RowCellRight>
    <RowCell>
      <select class="w3-select" name="option" v-model.number="inputVal.splitPosition">
        <option value></option>
        <option
          v-for="(item) in noteNames"
          v-bind:key="item.id"
          v-bind:value="item.id"
        >{{item.id}} - {{item.name}}</option>
      </select>
    </RowCell>
    <input
      class="w3-input"
      type="range"
      v-bind:min="9"
      v-bind:max="96"
      v-model.number="inputVal.splitPosition"
    />
  </Row>
</template>


<script lang="ts">
import Row from "../a/Row.vue";
import RowCell from "../a/RowCell.vue";
import RowCellRight from "../a/RowCellRight.vue";
import BtnHref from "../a/BtnHref.vue";

import { Component, Vue, Prop } from "vue-property-decorator";
import { KeyboardZone } from "../../src/UserDataConfig/Easyconfig";

@Component({
  components: {
    Row,
    RowCell,
    RowCellRight,
    BtnHref
  }
})
export default class SelectNoteSliderComponent extends Vue {
  @Prop() inputVal!: KeyboardZone;

  get noteNames() {
    const ret: { id: number; name: string }[] = [];
    for (let i = 9; i <= 96; i++) {
      ret.push({ id: i, name: this.inputVal.getPositionName(i) });
    }
    return ret;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
