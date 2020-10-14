<template>  
    <div class="w3-card-4" v-bind:class="{ 'w3-margin-top': mt }">
      <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent  } from '@vue/composition-api'

export default defineComponent({
  name: 'Card',
  props: {
    mt: Boolean,
  },
});


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
