<template>
  <div>
    <header class="w3-container w3-teal">
      <h1>In ports</h1>
    </header>



        <div class="w3-container w3-margin-top">
        <ul class="w3-ul w3-card-4 w3-hoverable">
            <li class="w3-display-container " 
                @click="$router.push(`/midiin/${key}`)"
                v-for="(item, key) in loginStatus.inPorts" v-bind:key="item" > {{key}} - {{item}}
            </li>
       
        </ul>
        </div>
        
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import * as Connection from "../src/connection";

export default defineComponent({
  setup () {
    const loginStatus = computed(() => Connection.loginStatus)
    return {loginStatus};
  },

})
</script>