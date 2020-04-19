<template>
    <header class="w3-container w3-blue">
      <h5>
         <slot></slot>
      </h5>
    </header>
    
</template>

<script lang="ts">
import { Component, Vue} from "vue-property-decorator";


@Component({
})
export default class CardHeader extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
