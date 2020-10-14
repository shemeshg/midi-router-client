<template>
  <div>
    <AddMidiDestinationComponent></AddMidiDestinationComponent>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import AddMidiDestinationComponent from '@/components/filters/AddMidiDestinationComponent.vue'

export default defineComponent({
  components: {
    AddMidiDestinationComponent
  },
})
</script>