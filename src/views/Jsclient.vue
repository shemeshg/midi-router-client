<template>
  <div>
    <JsclientComponent />
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import JsclientComponent from '@/components/Jsclient/JsclientComponent.vue'

export default defineComponent({
  components: {
    JsclientComponent
  }
})
</script>