<template>
  <div>
    <header class="w3-container w3-teal">
      <h1>JS client routing</h1>
    </header>
    <div class="w3-container w3-margin-top">
      <div>
        <div class="w3-container">
          <div>
            <div class="w3-cell w3-cell-middle">
              <label>From JS</label>
              <select class="w3-select">
                <option>A1</option>
                <option>A2</option>
              </select>
            </div>
            <div class="w3-container w3-cell w3-cell-middle">
              <label>To Server</label>
              <select class="w3-select">
                <option>A1</option>
                <option>A2</option>
              </select>
            </div>
            <div class="w3-container w3-cell w3-cell-middle">
              <button class="w3-button w3-section w3-teal w3-ripple w3-margin-left">Add Route</button>
            </div>
          </div>

          <div class="w3-card-4">
            <header class="w3-container w3-blue">
              <h5>From JS To Server</h5>
            </header>
            <div class="w3-container">
              <p>
                a to b
                <a
                  href="#"
                  class="router-link-exact-active router-link-active w3-right"
                >Delete</a>
              </p>
              <p>
                c to b
                <a
                  href="#"
                  class="router-link-exact-active router-link-active w3-right"
                >Delete</a>
              </p>
            </div>
          </div>

          <div>
            <div class="w3-cell w3-cell-middle">
              <label>From Server</label>
              <select class="w3-select">
                <option>A1</option>
                <option>A2</option>
              </select>
            </div>
            <div class="w3-container w3-cell w3-cell-middle">
              <label>To JS</label>
              <select class="w3-select">
                <option>A1</option>
                <option>A2</option>
              </select>
            </div>
            <div class="w3-container w3-cell w3-cell-middle">
              <button class="w3-button w3-section w3-teal w3-ripple w3-margin-left">Add Route</button>
            </div>
          </div>

          <div class="w3-card-4">
            <header class="w3-container w3-blue">
              <h5>From Server To JS</h5>
            </header>
            <div class="w3-container">
              <p>
                c to a
                <a
                  href="#"
                  class="router-link-exact-active router-link-active w3-right"
                >Delete</a>
              </p>
              <p>
                c to b
                <a
                  href="#"
                  class="router-link-exact-active router-link-active w3-right"
                >Delete</a>
              </p>
            </div>
          </div>

          <p>
            &nbsp;
          </p>
        </div>
      </div>
    </div>
  </div>
</template>



<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  }
})
export default class JsclientComponent extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
