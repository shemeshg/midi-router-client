<template>
  <Page text="Controls">
    <p v-if="editMode">
      <BtnHref @click="editMode = !editMode">Exit edit mode</BtnHref>&nbsp; |
      &nbsp;
      <BtnHref @click="addUserControl">Add</BtnHref>
    </p>
    <p v-if="!editMode">
      <BtnHref @click="editMode = !editMode">Edit</BtnHref>&nbsp; | &nbsp;
      <BtnHref @click="sendAll">Send all</BtnHref>
    </p>
    <div v-for="(item, index) in userControls" v-bind:key="index">
      <p v-if="editMode">
        <BtnHref @click="am(index, index - 1)">Up</BtnHref>&nbsp; | &nbsp;
        <BtnHref @click="am(index, index + 1)">Down</BtnHref>&nbsp; | &nbsp;
        <BtnHref @click="userControls.splice(index, 1)">Delete</BtnHref>
      </p>
      <ControlComponent v-bind:item="item"></ControlComponent>
      <p>&nbsp;</p>
    </div>
  </Page>
</template>


<script lang="ts">
import { computed, defineComponent, ref } from "@vue/composition-api";

import * as Connection from "../../src/connection";
import { arrayMove } from "../../src/Utils";

import ControlComponent from "@/components/usercontrol/controlComponent.vue";

import Page from "../a/Page.vue";
import BtnHref from "../a/BtnHref.vue";

export default defineComponent({
  components: {
    ControlComponent,
    Page,
    BtnHref,
  },
  setup() {
    const editMode = ref(false);

    const userControls = computed(() => {
      return Connection.loginStatus.userDataConfig.activePreset.userControls;
    });

    const addUserControl = () => {
      Connection.loginStatus.userDataConfig.activePreset.addUserControl();
    };

    const am = (oldIdex: number, newIndex: number) => {
      arrayMove(userControls.value, oldIdex, newIndex);
    };

    const sendAll = () => {
      return Connection.loginStatus.userDataConfig.activePreset.sendAllUserControls()
    };

    return { sendAll, am, addUserControl, userControls, editMode };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
