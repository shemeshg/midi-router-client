<template>
  <div>
    <VirtualportsComponent ></VirtualportsComponent>
  </div>
</template>

<script>
// @ is an alias to /src
import VirtualportsComponent from '@/components/VirtualportsComponent.vue'

export default {
  name: 'Virtualports',
  components: {
    VirtualportsComponent
  },
}
</script>