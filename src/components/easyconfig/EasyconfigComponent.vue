<template>
  <Page text="Easy config">
    <Row>
      <RowCell>
        <ServerInOutPortsSelect v-model.number="inputToAdd" mode="in" />
      </RowCell>
      <RowCell>
        <Btn @click="addSplitedKeyboard()" v-bind:ml="true">Add zone split</Btn>
      </RowCell>
    </Row>

    <Card>
      <div
        v-for="(inputItem, inputIdx) in inputZonesAndRoutes"
        v-bind:key="inputIdx"
      >
        <SplitedInputComponent v-bind:inputVal="inputItem" />
      </div>
    </Card>

    <Row>
      <RowCell>
        <ServerInOutPortsSelect v-model.number="routeToAdd" mode="in" />
      </RowCell>
      <RowCell>
        <Btn @click="addRoute()" v-bind:ml="true">Add Route</Btn>
      </RowCell>
    </Row>

    <Card>
      <div
        v-for="(inputItem, inputIdx) in inputZonesAndRoutes"
        v-bind:key="inputIdx"
      >
        <EasyConfigRoutesComponent v-bind:inputVal="inputItem" />
      </div>
    </Card>
  </Page>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive } from "@vue/composition-api";

import * as Connection from "../../src/connection";

import Page from "../a/Page.vue";
import RowCell from "../a/RowCell.vue";
import Btn from "../a/Btn.vue";
import Card from "../a/Card.vue";
import Row from "../a/Row.vue";

import ServerInOutPortsSelect from "../a/ServerInOutPortsSelect.vue";
import SplitedInputComponent from "./SplitedInputComponent.vue";
import EasyConfigRoutesComponent from "./EasyConfigRoutesComponent.vue";

export default defineComponent({
  components: {
    Page,
    Row,
    RowCell,
    Btn,
    Card,
    ServerInOutPortsSelect,
    SplitedInputComponent,
    EasyConfigRoutesComponent,
  },
  setup(props, { root }) {
    const inputToAdd = ref(-1);
    const routeToAdd = ref(-1);

    const easyConfig = reactive(
      Connection.loginStatus.userDataConfig.activePreset.easyConfig
    );
    const inputZonesAndRoutes = easyConfig.inputZonesAndRoutes;

    const loginStatus = computed(() => root.$store.state.loginStatus);

    function addRoute() {
      if (routeToAdd.value === -1) {
        return;
      }

      easyConfig.addRoute(Connection.loginStatus.inPorts[routeToAdd.value]);

      const n = routeToAdd.value;
      routeToAdd.value = -1;
      root.$nextTick(() => {
        routeToAdd.value = n;
      });
    }

    function addSplitedKeyboard() {
      if (inputToAdd.value === -1) {
        return;
      }
      easyConfig.addKeyboardSplit(
        Connection.loginStatus.inPorts[inputToAdd.value],
        60
      );

      const n = inputToAdd.value;
      inputToAdd.value = -1;
      root.$nextTick(() => {
        inputToAdd.value = n;
      });
    }

    return {
      loginStatus,
      inputToAdd,
      routeToAdd,
      addRoute,
      addSplitedKeyboard,
      inputZonesAndRoutes,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
