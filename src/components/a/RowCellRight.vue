<template>  
    <div class="w3-container w3-cell w3-cell-middle w3-right"> 
      <slot></slot>
    </div>
</template>

<script lang="ts">

import { Component, Vue } from "vue-property-decorator";

@Component({
})
export default class RowCellRight extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
