<template>
  <div>
    <PageHeader>{{text}} </PageHeader>
    <div class="w3-container w3-margin-top">
      <slot></slot>
       <p>&nbsp;</p>
    </div>
  </div>
</template>

<script lang="ts">
import PageHeader from "./PageHeader.vue"

import { defineComponent  } from '@vue/composition-api'

export default defineComponent({
  components: {
    PageHeader,
  },
  props: {
    text: String,
  },
});




</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
