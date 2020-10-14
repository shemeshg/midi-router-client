<template>
  <div>
    <AddScheduleComponent></AddScheduleComponent>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import AddScheduleComponent from '@/components/filters/AddScheduleComponent.vue'

export default defineComponent({
  components: {
    AddScheduleComponent
  },
})
</script>