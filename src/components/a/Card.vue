<template>  
    <div class="w3-card-4" v-bind:class="{ 'w3-margin-top': mt }">
      <slot></slot>
    </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
})
export default class Card extends Vue {
  @Prop() mt!: boolean;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
