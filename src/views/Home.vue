<template>
  <div>
    <Login msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/LoginComponent.vue'

export default {
  name: 'Home',
  components: {
    Login
  }
}
</script>
