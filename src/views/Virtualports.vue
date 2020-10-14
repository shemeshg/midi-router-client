<template>
  <div>
    <VirtualportsComponent ></VirtualportsComponent>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import VirtualportsComponent from '@/components/VirtualportsComponent.vue'

export default defineComponent({
  name: 'Virtualports',
  components: {
    VirtualportsComponent
  },
})
</script>