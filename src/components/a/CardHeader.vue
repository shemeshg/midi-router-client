<template>
    <header class="w3-container w3-blue">
      <h5>
         <slot></slot>
      </h5>
    </header>
    
</template>

<script lang="ts">
import { defineComponent  } from '@vue/composition-api'

export default defineComponent({
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
