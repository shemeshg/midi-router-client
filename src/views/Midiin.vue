<template>
  <div>
    <MidiInComponent v-bind:midiId="$route.params.id "></MidiInComponent>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import MidiInComponent from '@/components/midiin/MidiInComponent'

export default defineComponent({
  name: 'Midiin',
  components: {
    MidiInComponent
  },
})
</script>