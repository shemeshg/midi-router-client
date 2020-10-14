<template>
  <a href="#" class="router-link-exact-active router-link-active" @click="$emit('click')">
    <slot></slot>
  </a>
</template>

<script lang="ts">
import { defineComponent  } from '@vue/composition-api'

export default defineComponent({
  name: 'BtnHref',
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
