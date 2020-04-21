<template>
  <Page text="Presets">
    <Card>
      <CardHeader>Select active preset</CardHeader>
      <CardBody>
        <p v-for="(itemPreset, indexPreset) in midiRoutePresets" v-bind:key="indexPreset">
          <input class="w3-radio" type="radio" v-model="activePresetID" :value="indexPreset" />

          <label class="switch w3-right">
            <input type="checkbox" v-model="itemPreset.isEnabled" @change="doUpdate" />
            <span class="slider round"></span>
          </label>

          <label>{{indexPreset}} {{itemPreset.name}}</label>
        </p>

        <p>
          <Btn @click="$router.push(`/preset/-1`)">Add</Btn>
          <Btn :ml="true" @click="$router.push(`/preset/${activePresetID}`)">Edit</Btn>
          <Btn :ml="true" v-if="midiRoutePresets.length > 1" @click="doDelete()">Delete</Btn>

          <Btn :ml="true" @click="doMoveUp()">
            <i class="fa fa-arrow-up"></i>
          </Btn>
          <Btn :ml="true" @click="doMoveDown()">
            <i class="fa fa-arrow-down"></i>
          </Btn>
        </p>
      </CardBody>
    </Card>

    <CardBody>
      <input class="w3-check w3-margin-left" type="checkbox" v-model="changeAndApplay" />
      <label>Auto applay select change and file upload</label>
    </CardBody>

    <Card :mt="true">
      <p>
        <label class="w3-margin-left">Upload config</label>
        <input class="w3-button w3-teal w3-margin-left" type="file" @change="loadFile" ref="el" />

        <Btn :ml="true" @click="saveToFile">Appay and download</Btn>
      </p>
    </Card>
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../../src/connection";
import * as Utils from "../../src/Utils";

import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardHeader from "../a/CardHeader.vue";
import CardBody from "../a/CardBody.vue";
import Btn from "../a/Btn.vue";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    Page,
    Card,
    CardHeader,
    CardBody,
    Btn
  }
})
export default class PresetsComponent extends Vue {
  changeAndApplay = true;

  midiRoutePresets = Connection.loginStatus.userDataConfig.midiRoutePresets;
  get activePresetID() {
    return Connection.loginStatus.userDataConfig.activePresetID;
  }

  set activePresetID(idx: number) {
    Connection.loginStatus.userDataConfig.activePresetID = idx;
    if (this.changeAndApplay) {
      Connection.loginStatus.userDataConfig.applyChanges(Connection.connection);
    }
  }

  doUpdate() {
    if (this.changeAndApplay) {
      Connection.loginStatus.userDataConfig.applyChanges(Connection.connection);
    }
  }

  doDelete() {
    Connection.loginStatus.userDataConfig.midiRoutePresets.splice(
      this.activePresetID,
      1
    );
    this.activePresetID = 0;
  }

  applyChanges() {
    Connection.loginStatus.userDataConfig.applyChanges(Connection.connection);
  }

  async loadFile() {
    // eslint-disable-next-line
    const el: any = this.$refs.el;
    const str = await Utils.readFileAsString(el);

    el.value = "";

    Connection.loginStatus.resetUserDataConfig(JSON.parse(str));

    if (this.changeAndApplay) {
      await Connection.loginStatus.userDataConfig.applyChanges(
        Connection.connection
      );
    }
  }

  async saveToFile() {
    await Connection.loginStatus.userDataConfig.applyChanges(
      Connection.connection
    );
    Utils.downloadFileAsString(
      "config.midiRouter",
      JSON.stringify(Connection.loginStatus.userDataConfig)
    );
  }

  doMoveUp() {
    Utils.arrayMove(
      Connection.loginStatus.userDataConfig.midiRoutePresets,
      this.activePresetID,
      this.activePresetID - 1
    );
  }

  doMoveDown() {
    Utils.arrayMove(
      Connection.loginStatus.userDataConfig.midiRoutePresets,
      this.activePresetID,
      this.activePresetID + 1
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>