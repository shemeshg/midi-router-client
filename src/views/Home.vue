<template>
  <div>
    <Login msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import Login from '@/components/LoginComponent.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Login
  }
})
</script>
