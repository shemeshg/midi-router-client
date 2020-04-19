<template>  
    <button class="w3-button w3-section w3-teal w3-ripple w3-margin-left" @click="$emit('click')">
      <slot></slot>
    </button>
</template>

<script lang="ts">

import { Component, Vue } from "vue-property-decorator";

@Component({
})
export default class Btn extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
