<template>
  <div>
    <header class="w3-container w3-teal">
      <h1>{{ headrMsg }}</h1>
    </header>
    <div class="w3-container w3-margin-top">
      <div class="w3-card-4">
        <div class="w3-container">
          <p>
            <label>Preset name</label>
            <input class="w3-input" type="text" v-model="presetName" />
          </p>
        </div>
      </div>

      <div class="w3-card-4">
        <div class="w3-container">
          <button class="w3-button w3-section w3-teal w3-ripple" @click="doOk">OK</button>
          <button
            class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
            @click="doCancel"
          >Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../../src/connection";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  }
})
export default class AddPresetComponent extends Vue {
  presetName = "";
  get routeId() {
    return this.$route.params.id;
  }
  get routeObj() {
    return Connection.loginStatus.userDataConfig.midiRoutePresets[
      parseInt(this.routeId)
    ];
  }

  mounted() {
    if (this.routeId === "-1") {
      return;
    }
    this.presetName = this.routeObj.name;
  }

  doOk() {
    if (this.presetName === "") {
      return;
    }
    if (this.routeId === "-1") {
      Connection.loginStatus.userDataConfig.addPreset(this.presetName);
    } else {
      this.routeObj.setVal(this.presetName)
    }
    this.$router.push(`/presets`);
  }

  doCancel() {
    this.$router.push(`/presets`);
  }

  get headrMsg() {
    return "Add preset";
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>