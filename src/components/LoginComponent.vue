<template>
  <Page :text="headrMsg">
    <Card>
      <CardBody>
        <p v-if="!isLoggedIn">
          <input class="w3-input" type="text" style="width:90%" required v-model="serverName" />
          <label>Server name</label>
        </p>
        <p v-if="!isLoggedIn">
          <input class="w3-input" type="number" style="width:90%" required v-model="serverPort" />
          <label>Port number</label>
        </p>
        <p v-if="!isLoggedIn">
          <Btn @click="doLogin">Log in</Btn>
        </p>
        <p v-if="isLoggedIn">
          <Btn @click="doLogout">Log out</Btn>
        </p>
      </CardBody>
    </Card>

    <p v-if="isLoggedIn">
      <Btn :ml="true" @click="doShutdown">Shutdown Server</Btn>
    </p>
  </Page>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import { LoginStatus } from "../src/loginStatus";
import * as Connection from "../src/connection";

import Page from "./a/Page.vue";
import Card from "./a/Card.vue";
import CardBody from "./a/CardBody.vue";
import Btn from "./a/Btn.vue";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    Page,
    Card,
    CardBody,
    Btn
  }
})
export default class Login extends Vue {
  @Prop() private msg!: string;
  isLoggedIn!: boolean;
  loginStatus!: LoginStatus;

  serverName = Connection.loginStatus.serverName;
  serverPort = Connection.loginStatus.serverPort;
  errMsg = Connection.loginStatus.errMsg;

  async doLogin() {
    await Connection.login(this.serverName, this.serverPort);
    this.errMsg = Connection.loginStatus.errMsg;
    this.$store.commit("setLoginStatusRedirect", Connection.loginStatus);
  }

  async doShutdown() {
    Connection.connection.wcuserdata.applicationQuit();
    //Connection.loginStatus.isLoggedIn = false;
    this.$store.commit("setLoginStatusRedirect", Connection.loginStatus);
  }

  async doRestart() {
    await Connection.connection.wcmidiin.restart();
    await Connection.connection.wcmidiout.restart();
    this.doLogout();
  }

  async doLogout() {
    await Connection.connection.close();
    //Connection.loginStatus.isLoggedIn = false;
    this.$store.commit("setLoginStatusRedirect", Connection.loginStatus);
  }

  get myGet(): number {
    return 3;
  }

  get headrMsg(): string {
    if (this.isLoggedIn) {
      return this.loginStatus.serverName + ":" + this.loginStatus.serverPort;
    } else {
      if (this.errMsg) {
        return this.errMsg;
      }
      return "Not connected - try again";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
