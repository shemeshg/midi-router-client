<template>
  <a href="#" class="router-link-exact-active router-link-active" @click="$emit('click')">
    <slot></slot>
  </a>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class BtnHref extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
