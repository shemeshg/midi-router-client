<template>
  <div>
    <UsercontrolsComponent ></UsercontrolsComponent>
  </div>
</template>

<script>
// @ is an alias to /src
import UsercontrolsComponent from '@/components/usercontrol/UsercontrolsComponent'

export default {
  name: 'Usercontrols',
  components: {
    UsercontrolsComponent
  },
}
</script>