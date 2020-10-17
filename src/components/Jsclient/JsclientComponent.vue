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
                v-for="(item, idx) in jsInPorts"
                v-bind:key="item.id"
                v-bind:value="item.id"
              >
                {{ idx }} - {{ item.name }}
              </option>
            </select>
          </RowCell>
          <RowCell>
            <label>To Server</label>
            <ServerInOutPortsSelect
              v-model.number="routeServerInPort"
              mode="out"
            />
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
            <p v-for="item in routesToServer" v-bind:key="item.id">
              {{ item.computerUuid.substr(-4) }} {{ item.fromName }} to
              {{ item.toName }}
              <RowCellRight>
                <BtnHref @click="removeJsToServer(item.id)">Delete</BtnHref>
              </RowCellRight>
            </p>
          </div>
        </div>

        <Row>
          <RowCell>
            <label>From Server</label>
            <ServerInOutPortsSelect
              v-model.number="routeServerOutPort"
              mode="in"
            />
          </RowCell>
          <RowCell>
            <label>To JS</label>
            <select class="w3-select" v-model.number="routeJsInPort">
              <option value="-1">-</option>
              <option
                v-for="(item, idx) in jsOutPorts"
                v-bind:key="item.id"
                v-bind:value="item.id"
              >
                {{ idx }} - {{ item.name }}
              </option>
            </select>
          </RowCell>
          <RowCell>
            <Btn :ml="true" @click="addFromServer()">Add Route</Btn>
          </RowCell>
        </Row>

        <Card>
          <CardHeader>From Server To JS</CardHeader>
          <CardBody>
            <p v-for="item in routesFromServer" v-bind:key="item.id">
              {{ item.computerUuid.substr(-4) }} {{ item.fromName }} to
              {{ item.toName }}
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
import {
  defineComponent,
  ref,
  computed,
  onMounted,
} from "@vue/composition-api";

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

export default defineComponent({
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
    RowCellRight,
  },
  setup() {
    const routeServerInPort = ref(-1);
    const routeServerOutPort = ref(-1);

    const routeJsInPort = ref(-1);
    const routeJsOutPort = ref(-1);

    const _jsInPorts: { id: number; name: string }[] = [];
    const _jsOutPorts: { id: number; name: string }[] = [];
    const jsInPorts = ref(_jsInPorts);
    const jsOutPorts = ref(_jsOutPorts);

    const jsToServers = ref(
      Connection.loginStatus.userDataConfig.activePreset.jsRouter.jsToServers
    );

    const routesFromServer = computed(() => {
      return jsToServers.value.filter((row) => {
        return row.jsToServerType === JS_TO_SERVER_TYPE.FROM_SERVER;
      });
    });

    const routesToServer = computed(() => {
      return jsToServers.value.filter((row) => {
        return row.jsToServerType === JS_TO_SERVER_TYPE.TO_SERVER;
      });
    });

    const serverInPorts = computed(() => {
      const i = [];
      const ports = Connection.loginStatus.inPorts;
      for (const key in ports) {
        i.push({ id: Number(key), name: ports[key] });
      }

      return i;
    });

    const serverOutPorts = computed(() => {
      const i = [];
      const ports = Connection.loginStatus.outPorts;
      for (const key in ports) {
        i.push({ id: Number(key), name: ports[key] });
      }

      return i;
    });

    function removeJsToServer(id: string) {
      const jsRouter =
        Connection.loginStatus.userDataConfig.activePreset.jsRouter;
      jsRouter.removeJsToServer(id);
      jsToServers.value = jsRouter.jsToServers;
    }

    function addToServer() {
      const jsRouter =
        Connection.loginStatus.userDataConfig.activePreset.jsRouter;

      if (routeJsOutPort.value === -1 || routeServerInPort.value === -1) {
        return;
      }
      const fromStr = jsInPorts.value.filter((row) => {
        return row.id === routeJsOutPort.value;
      })[0].name;
      const toStr = serverInPorts.value.filter((row) => {
        return row.id === routeServerInPort.value;
      })[0].name;

      jsRouter.addJsServer(
        JS_TO_SERVER_TYPE.TO_SERVER,
        routeJsOutPort.value,
        routeServerInPort.value,
        fromStr,
        toStr
      );
      jsToServers.value = jsRouter.jsToServers;
    }

    function addFromServer() {
      const jsRouter =
        Connection.loginStatus.userDataConfig.activePreset.jsRouter;

      if (routeJsInPort.value === -1 || routeServerOutPort.value === -1) {
        return;
      }
      const fromStr = serverOutPorts.value.filter((row) => {
        return row.id === routeServerOutPort.value;
      })[0].name;
      const toStr = jsOutPorts.value.filter((row) => {
        return row.id === routeJsInPort.value;
      })[0].name;
      jsRouter.addJsServer(
        JS_TO_SERVER_TYPE.FROM_SERVER,
        routeServerOutPort.value,
        routeJsInPort.value,
        fromStr,
        toStr
      );
      jsToServers.value = jsRouter.jsToServers;
    }

    onMounted(async () => {
      const jsRouter =
        Connection.loginStatus.userDataConfig.activePreset.jsRouter;
      await jsRouter.doOpen();
      jsInPorts.value = jsRouter.inPorts;
      jsOutPorts.value = jsRouter.outPorts;
    });

    return {addFromServer, addToServer, removeJsToServer,
        serverOutPorts, serverInPorts,  routesToServer, routesFromServer, 
        jsToServers, jsOutPorts, jsInPorts, routeJsOutPort, routeJsInPort, 
        routeServerOutPort, routeServerInPort}
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
