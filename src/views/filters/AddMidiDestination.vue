<template>
  <div>
    <AddMidiDestinationComponent></AddMidiDestinationComponent>
  </div>
</template>

<script>
// @ is an alias to /src
import AddMidiDestinationComponent from '@/components/filters/AddMidiDestinationComponent.vue'

export default {
  name: 'Midiin',
  components: {
    AddMidiDestinationComponent
  },
}
</script>