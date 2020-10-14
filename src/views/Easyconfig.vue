<template>
  <div>
    <Easyconfig/>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import Easyconfig from '@/components/easyconfig/EasyconfigComponent'

export default defineComponent({
  components: {
    Easyconfig
  }
})
</script>