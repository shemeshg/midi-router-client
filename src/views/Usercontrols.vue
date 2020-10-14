<template>
  <div>
    <UsercontrolsComponent ></UsercontrolsComponent>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
// @ is an alias to /src
import UsercontrolsComponent from '@/components/usercontrol/UsercontrolsComponent'

export default defineComponent({
  name: 'Usercontrols',
  components: {
    UsercontrolsComponent
  },
})
</script>