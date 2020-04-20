<template>
    <div class="w3-container">
         <slot></slot>
    </div>    
</template>

<script lang="ts">
import { Component, Vue} from "vue-property-decorator";


@Component({
})
export default class CardBody extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
