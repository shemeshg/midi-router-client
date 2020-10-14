<template>
  <Row>
    <RowCellRight>
      <BtnHref @click="$emit('delete-self')">Delete</BtnHref>
    </RowCellRight>
    <RowCell>
      <select
        class="w3-select"
        name="option"
        v-model.number="inputVal.splitPosition"
      >
        <option value></option>
        <option
          v-for="item in noteNames"
          v-bind:key="item.id"
          v-bind:value="item.id"
        >
          {{ item.id }} - {{ item.name }}
        </option>
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

import { defineComponent, computed } from "@vue/composition-api";
import { KeyboardZone } from "../../src/UserDataConfig/Easyconfig";

export default defineComponent({
  components: {
    Row,
    RowCell,
    RowCellRight,
    BtnHref,
  },
  props: {
    inputVal: {
      type: KeyboardZone,
      required: true,
    },
  },
  setup(props) {
    const noteNames = computed(() => {
      const ret: { id: number; name: string }[] = [];
      for (let i = 9; i <= 96; i++) {
        ret.push({ id: i, name: props.inputVal.getPositionName(i) });
      }
      return ret;
    });
    return {noteNames}; 
  },
});


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
