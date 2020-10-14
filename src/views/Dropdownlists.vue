<template>
  <div>
    <DropdownlistsComponent></DropdownlistsComponent>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import DropdownlistsComponent from '@/components/DropdownlistsComponent.vue'

export default defineComponent({
  name: 'Midiin',
  components: {
    DropdownlistsComponent
  },
})
</script>