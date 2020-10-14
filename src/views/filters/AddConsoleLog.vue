<template>
  <div>
    <AddConsoleLogComponent></AddConsoleLogComponent>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import AddConsoleLogComponent from '@/components/filters/AddConsoleLogComponent.vue'

export default defineComponent({
  components: {
    AddConsoleLogComponent
  },
})

</script>