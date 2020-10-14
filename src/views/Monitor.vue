<template>
  <div>
    <MonitorComponent ></MonitorComponent>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import MonitorComponent from '@/components/MonitorComponent'

export default defineComponent({
  name: 'Presets',
  components: {
    MonitorComponent
  },
})
</script>