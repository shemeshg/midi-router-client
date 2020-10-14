<template>
  <div>
    <AddNetworkDestinationComponent></AddNetworkDestinationComponent>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import AddNetworkDestinationComponent from '@/components/filters/AddNetworkDestinationComponent.vue'

export default defineComponent({
  components: {
    AddNetworkDestinationComponent
  },
})
</script>