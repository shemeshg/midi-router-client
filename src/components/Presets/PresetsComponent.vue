<template>
  <Page text="Presets">
    <Card>
      <CardHeader>Select active preset</CardHeader>
      <CardBody>
        <p
          v-for="(itemPreset, indexPreset) in midiRoutePresets"
          v-bind:key="indexPreset"
        >
          <input
            class="w3-radio"
            type="radio"
            v-model="activePresetID"
            :value="indexPreset"
          />

          <label class="switch w3-right">
            <input
              type="checkbox"
              v-model="itemPreset.isEnabled"
              @change="doUpdate"
            />
            <span class="slider round"></span>
          </label>

          <label>{{ indexPreset }} {{ itemPreset.name }}</label>
        </p>

        <p>
          <Btn @click="$router.push(`/preset/-1`)">Add</Btn>
          <Btn :ml="true" @click="$router.push(`/preset/${activePresetID}`)"
            >Edit</Btn
          >
          <Btn :ml="true" v-if="midiRoutePresets.length > 1" @click="doDelete()"
            >Delete</Btn
          >

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
      <input
        class="w3-check w3-margin-left"
        type="checkbox"
        v-model="changeAndApplay"
      />
      <label>Auto applay preset on file upload</label>
    </CardBody>

    <Card :mt="true">
      <p>
        <label class="w3-margin-left">Upload config</label>
        <input
          class="w3-button w3-teal w3-margin-left"
          type="file"
          @change="loadFile"
          ref="el"
        />

        <Btn :ml="true" @click="saveToFile">Appay and download</Btn>
      </p>
    </Card>
  </Page>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
} from "@vue/composition-api";

import * as Connection from "../../src/connection";
import * as Utils from "../../src/Utils";

import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardHeader from "../a/CardHeader.vue";
import CardBody from "../a/CardBody.vue";
import Btn from "../a/Btn.vue";

export default defineComponent({
  components: {
    Page,
    Card,
    CardHeader,
    CardBody,
    Btn,
  },
  setup(props, { root }) {
    const changeAndApplay = ref(true);
    const midiRoutePresets = ref(
      Connection.loginStatus.userDataConfig.midiRoutePresets
    );

    const activePresetID = ref(Connection.loginStatus.userDataConfig.activePresetID);
    function _setActivePresetID(idx: number) {
      Connection.loginStatus.userDataConfig.activePresetID = idx;
      if (changeAndApplay.value) {
        Connection.loginStatus.userDataConfig.applyChanges(
          Connection.connection
        );
      }
    }
    watch(
      () => activePresetID.value,
      (idx: number) => {
        _setActivePresetID(idx);
      }
    );

    function doUpdate() {
      if (changeAndApplay.value) {
        Connection.loginStatus.userDataConfig.applyChanges(
          Connection.connection
        );
      }
    }

    function doDelete() {
      midiRoutePresets.value.splice(activePresetID.value, 1);
      _setActivePresetID(0);
    }

    function applyChanges() {
      Connection.loginStatus.userDataConfig.applyChanges(Connection.connection);
    }

    async function loadFile() {
      // eslint-disable-next-line
      const el: any = root.$refs.el;
      const str = await Utils.readFileAsString(el);

      el.value = "";

      Connection.loginStatus.resetUserDataConfig(JSON.parse(str));

      if (changeAndApplay.value) {
        await Connection.loginStatus.userDataConfig.applyChanges(
          Connection.connection
        );
      }
    }

    async function saveToFile() {
      await Connection.loginStatus.userDataConfig.applyChanges(
        Connection.connection
      );
      Utils.downloadFileAsString(
        "config.midiRouter",
        JSON.stringify(Connection.loginStatus.userDataConfig)
      );
    }

    function doMoveUp() {
      Utils.arrayMove(
        midiRoutePresets.value,
        activePresetID.value,
        activePresetID.value - 1
      );
    }

    function doMoveDown() {
      Utils.arrayMove(
        midiRoutePresets.value,
        activePresetID.value,
        activePresetID.value + 1
      );
    }

    return {doMoveDown, doMoveUp,saveToFile,  loadFile, applyChanges, doDelete, doUpdate,
           activePresetID, midiRoutePresets, changeAndApplay}

  },
});


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>