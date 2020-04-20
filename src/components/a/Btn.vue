<template>  
    <button class="w3-button w3-section w3-teal w3-ripple" 
    v-bind:class="{ 'w3-margin-left': ml }"
    @click="$emit('click')">
      <slot></slot>
    </button>
</template>

<script lang="ts">

import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
})
export default class Btn extends Vue {
  @Prop() ml!: boolean;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
