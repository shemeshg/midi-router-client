<template>
  <div>
    <PresetsComponent ></PresetsComponent>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import PresetsComponent from '@/components/Presets/PresetsComponent'

export default defineComponent({
  name: 'Presets',
  components: {
    PresetsComponent
  },
})
</script>