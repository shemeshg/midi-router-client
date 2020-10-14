<template>
  <div>
    <AddChainFilterComponent></AddChainFilterComponent>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import AddChainFilterComponent from '@/components/AddChainFilterComponent.vue'

export default defineComponent({
  name: 'Midiin',
  components: {
    AddChainFilterComponent
  },
})
</script>