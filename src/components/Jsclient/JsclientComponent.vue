<template>
  <Page text="JS client routing">
    <div>
      <CardBody>
        <Row>
          <RowCell>
            <label>From JS</label>
            <select class="w3-select" v-model.number="routeJsOutPort">
              <option value="-1">-</option>
              <option
                v-for="(item,idx) in jsInPorts"
                v-bind:key="item.id"
                v-bind:value="item.id"
              >{{idx}} - {{item.name}}</option>
            </select>
          </RowCell>
          <RowCell>
            <label>To Server</label>
            <ServerInOutPortsSelect v-model.number="routeServerInPort" mode="out" />
          </RowCell>
          <RowCell>
            <Btn @click="addToServer()" v-bind:ml="true">Add Route</Btn>
          </RowCell>
        </Row>

        <div class="w3-card-4">
          <header class="w3-container w3-blue">
            <h5>From JS To Server</h5>
          </header>
          <div class="w3-container">
            <p v-for="(item) in routesToServer" v-bind:key="item.id">
              {{ item.computerUuid.substr(-4) }} {{item.fromName }} to {{ item.toName }}
              <RowCellRight>
                <BtnHref @click="removeJsToServer(item.id)">Delete</BtnHref>
              </RowCellRight>
            </p>
          </div>
        </div>

        <Row>
          <RowCell>
            <label>From Server</label>
            <ServerInOutPortsSelect v-model.number="routeServerOutPort" mode="in" />
          </RowCell>
          <RowCell>
            <label>To JS</label>
            <select class="w3-select" v-model.number="routeJsInPort">
              <option value="-1">-</option>
              <option
                v-for="(item,idx) in jsOutPorts"
                v-bind:key="item.id"
                v-bind:value="item.id"
              >{{idx}} - {{item.name}}</option>
            </select>
          </RowCell>
          <RowCell>
            <Btn :ml="true" @click="addFromServer()">Add Route</Btn>
          </RowCell>
        </Row>

        <Card>
          <CardHeader>From Server To JS</CardHeader>
          <CardBody>
            <p v-for="(item) in routesFromServer" v-bind:key="item.id">
              {{ item.computerUuid.substr(-4) }} {{item.fromName }} to {{ item.toName }}
              <RowCellRight>
                <BtnHref @click="removeJsToServer(item.id)">Delete</BtnHref>
              </RowCellRight>
            </p>
          </CardBody>
        </Card>

        <p>&nbsp;</p>
      </CardBody>
    </div>
  </Page>
</template>



<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../../src/connection";
import { JS_TO_SERVER_TYPE } from "../../src/UserDataConfig/MidiRoutePreset/jsRouter";

import Page from "../a/Page.vue";
import Card from "../a/Card.vue";
import CardHeader from "../a/CardHeader.vue";
import CardBody from "../a/CardBody.vue";
import Row from "../a/Row.vue";
import RowCell from "../a/RowCell.vue";
import Btn from "../a/Btn.vue";
import BtnHref from "../a/BtnHref.vue";
import RowCellRight from "../a/RowCellRight.vue";
import ServerInOutPortsSelect from "../a/ServerInOutPortsSelect.vue";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    ServerInOutPortsSelect,
    Page,
    Card,
    CardHeader,
    CardBody,
    Row,
    RowCell,
    Btn,
    BtnHref,
    RowCellRight
  }
})
export default class JsclientComponent extends Vue {
  routeServerInPort = -1;
  routeServerOutPort = -1;

  routeJsInPort = -1;
  routeJsOutPort = -1;

  jsInPorts: { id: number; name: string }[] = [];
  jsOutPorts: { id: number; name: string }[] = [];

  jsToServers =
    Connection.loginStatus.userDataConfig.activePreset.jsRouter.jsToServers;

  get routesFromServer() {
    return this.jsToServers.filter(row => {
      return row.jsToServerType === JS_TO_SERVER_TYPE.FROM_SERVER;
    });
  }

  get routesToServer() {
    return this.jsToServers.filter(row => {
      return row.jsToServerType === JS_TO_SERVER_TYPE.TO_SERVER;
    });
  }

  async mounted() {
    const jsRouter =
      Connection.loginStatus.userDataConfig.activePreset.jsRouter;
    await jsRouter.doOpen();
    this.jsInPorts = jsRouter.inPorts;
    this.jsOutPorts = jsRouter.outPorts;
  }

  removeJsToServer(id: string) {
    const jsRouter =
      Connection.loginStatus.userDataConfig.activePreset.jsRouter;
    jsRouter.removeJsToServer(id);
    this.jsToServers = jsRouter.jsToServers;
  }

  addToServer() {
    const jsRouter =
      Connection.loginStatus.userDataConfig.activePreset.jsRouter;

    if (this.routeJsOutPort === -1 || this.routeServerInPort === -1) {
      return;
    }
    const fromStr = this.jsInPorts.filter(row => {
      return row.id === this.routeJsOutPort;
    })[0].name;
    const toStr = this.serverInPorts.filter(row => {
      return row.id === this.routeServerInPort;
    })[0].name;

    jsRouter.addJsServer(
      JS_TO_SERVER_TYPE.TO_SERVER,
      this.routeJsOutPort,
      this.routeServerInPort,
      fromStr,
      toStr
    );
    this.jsToServers = jsRouter.jsToServers;
  }

  addFromServer() {
    const jsRouter =
      Connection.loginStatus.userDataConfig.activePreset.jsRouter;

    if (this.routeJsInPort === -1 || this.routeServerOutPort === -1) {
      return;
    }
    const fromStr = this.serverOutPorts.filter(row => {
      return row.id === this.routeServerOutPort;
    })[0].name;
    const toStr = this.jsOutPorts.filter(row => {
      return row.id === this.routeJsInPort;
    })[0].name;
    jsRouter.addJsServer(
      JS_TO_SERVER_TYPE.FROM_SERVER,
      this.routeServerOutPort,
      this.routeJsInPort,
      fromStr,
      toStr
    );
    this.jsToServers = jsRouter.jsToServers;
  }

  get serverInPorts() {
    const i = [];
    const ports = Connection.loginStatus.inPorts;
    for (const key in ports) {
      i.push({ id: Number(key), name: ports[key] });
    }

    return i;
  }

  get serverOutPorts() {
    const i = [];
    const ports = Connection.loginStatus.outPorts;
    for (const key in ports) {
      i.push({ id: Number(key), name: ports[key] });
    }

    return i;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
