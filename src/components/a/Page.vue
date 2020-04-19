<template>
  <div>
    <PageHeader v-bind:text="text" />
    <div class="w3-container w3-margin-top">
      <slot></slot>
       <p>&nbsp;</p>
    </div>
  </div>
</template>

<script lang="ts">
import PageHeader from "./PageHeader.vue"
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {
    PageHeader,
  }
})
export default class Page extends Vue {
  @Prop() text!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
