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
import { computed, ref, defineComponent } from "@vue/composition-api";

import * as Connection from "../src/connection";

import Page from "./a/Page.vue";
import Card from "./a/Card.vue";
import CardBody from "./a/CardBody.vue";
import Btn from "./a/Btn.vue";


export default defineComponent({
  components: {
    Page,
    Card,
    CardBody,
    Btn
  },
  setup(props, { root }) {



    const isLoggedIn = computed(() => {
      return root.$store.getters.isLoggedIn;
    });

    const loginStatus = computed(() => {
      return root.$store.state.loginStatus
    });

    const serverName = ref( localStorage.getItem("serverName") || "localhost" );
    const serverPort = ref( parseInt( (localStorage.getItem("serverPort")  || 12345).toString() ) );
    const errMsg = ref( Connection.loginStatus.errMsg );

    const headrMsg= computed (()=> {
      if (isLoggedIn.value) {
        return loginStatus.value.serverName + ":" + loginStatus.value.serverPort;
      } else {
        if (errMsg.value) {
          return errMsg.value;
        }
        return "Not connected - try again";
      }
    })

  const doLogin=async ()=> {
    await Connection.login(serverName.value, serverPort.value);
    errMsg.value = Connection.loginStatus.errMsg;
    localStorage.setItem("serverName", serverName.value);
    localStorage.setItem("serverPort", serverPort.value.toString());
    root.$store.commit("setLoginStatusRedirect", Connection.loginStatus);
  }

  const  doShutdown=async () => {
    Connection.connection.wcuserdata.applicationQuit();
    //Connection.loginStatus.isLoggedIn = false;
    root.$store.commit("setLoginStatusRedirect", Connection.loginStatus);
  }

  const doLogout=async() => {
    await Connection.connection.close();
    //Connection.loginStatus.isLoggedIn = false;
    root.$store.commit("setLoginStatusRedirect", Connection.loginStatus);
  }

  const doRestart=async() =>{
    await Connection.connection.wcmidiin.restart();
    await Connection.connection.wcmidiout.restart();
    doLogout();
  }

  return {doRestart,doLogout,doShutdown,doLogin,headrMsg,errMsg,
         serverPort,serverName,loginStatus,isLoggedIn }

  }
})


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
