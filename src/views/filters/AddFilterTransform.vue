<template>
  <div>
    <AddFilterTransformComponent></AddFilterTransformComponent>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import AddFilterTransformComponent from '@/components/filters/AddFilterTransformComponent.vue'

export default defineComponent({
  components: {
    AddFilterTransformComponent
  },
})
</script>