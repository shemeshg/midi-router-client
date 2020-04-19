<template>
    <header class="w3-container w3-teal">
      <h1>{{text}}</h1>
    </header>
    
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";


@Component({
})
export default class PageHeader extends Vue {
  @Prop() text!: string;  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
