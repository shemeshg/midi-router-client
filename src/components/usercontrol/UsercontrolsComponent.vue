<template>
  <Page text="Controls">
    <p v-if="editMode">
      <BtnHref @click="editMode = !editMode">Exit edit mode</BtnHref>&nbsp; | &nbsp;
      <BtnHref @click="addUserControl">Add</BtnHref>
    </p>
    <p v-if="!editMode">
      <BtnHref @click="editMode = !editMode">Edit</BtnHref>&nbsp; | &nbsp;
      <BtnHref @click="sendAll">Send all</BtnHref>
    </p>
    <div v-for="(item, index) in userControls" v-bind:key="index">
      <p v-if="editMode">
        <BtnHref @click="am(index,index -1)">Up</BtnHref>&nbsp; | &nbsp;
        <BtnHref @click="am(index,index +1)">Down</BtnHref>&nbsp; | &nbsp;
        <BtnHref @click="userControls.splice(index,1)">Delete</BtnHref>
      </p>
      <ControlComponent v-bind:item="item"></ControlComponent>
      <p>&nbsp;</p>
    </div>
  </Page>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { LoginStatus } from "../../src/loginStatus";
import * as Connection from "../../src/connection";
import { arrayMove } from "../../src/Utils";

import ControlComponent from "@/components/usercontrol/controlComponent.vue";

import Page from "../a/Page.vue";
import BtnHref from "../a/BtnHref.vue";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    ControlComponent,
    Page,
    BtnHref
  }
})
export default class UsercontrolsComponent extends Vue {
  loginStatus!: LoginStatus;

  editMode = false;

  addUserControl() {
    Connection.loginStatus.userDataConfig.activePreset.addUserControl();
  }

  am(oldIdex: number, newIndex: number) {
    arrayMove(this.userControls, oldIdex, newIndex);
  }

  async sendAll() {
    for (let i = 0; i < this.userControls.length; i++) {
      await this.userControls[i].doSend();
    }
  }

  get userControls() {
    return Connection.loginStatus.userDataConfig.activePreset.userControls;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
