<template>
  <div>
    <MidiInComponent v-bind:midiId="$route.params.id "></MidiInComponent>
  </div>
</template>

<script>
// @ is an alias to /src
import MidiInComponent from '@/components/midiin/MidiInComponent'

export default {
  name: 'Midiin',
  components: {
    MidiInComponent
  },
}
</script>