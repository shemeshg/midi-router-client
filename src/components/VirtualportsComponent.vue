<template>
  <Page text="Virtual ports">
    <Card>
      <CardHeader>Virtual in/out ports</CardHeader>
      <CardBody>
        <Row>
          <RowCell>
            <label>Name</label>
          </RowCell>
          <RowCell>
            <input
              class="w3-input"
              type="text"
              v-model="inPort"
              @focus="$event.target.select()"
            />
          </RowCell>
          <RowCell>
            <Btn :ml="true" @click="addInPort">+</Btn>
          </RowCell>
        </Row>

        <Row>
          <ul class="w3-ul w3-border w3-hoverable w3-margin-left">
            <li
              class="w3-display-container"
              v-for="(inport, idx) in virtualInPorts"
              v-bind:key="inport"
            >
              {{ inport }}
              <span
                @click="inPortSplice(idx)"
                class="w3-button w3-transparent w3-display-right"
                >&times;</span
              >
            </li>
          </ul>
        </Row>
        <p>&nbsp;</p>
      </CardBody>
    </Card>
  </Page>
</template>


<script lang="ts">
import { ref, defineComponent } from "@vue/composition-api";

import * as Connection from "../src/connection";

import Page from "./a/Page.vue";
import Card from "./a/Card.vue";
import CardHeader from "./a/CardHeader.vue";
import CardBody from "./a/CardBody.vue";
import Row from "./a/Row.vue";
import RowCell from "./a/RowCell.vue";
import Btn from "./a/Btn.vue";

export default defineComponent({
  components: {
    Page,
    Card,
    CardHeader,
    CardBody,
    Row,
    RowCell,
    Btn,
  },
  setup() {
    const inPort = ref("");

    const virtualInPorts = ref(
      Connection.loginStatus.userDataConfig.virtualInPorts
    );

    const inPortSplice = (idx: number) => {
      Connection.loginStatus.userDataConfig.virtualInPorts.splice(idx, 1);
    };

    const addInPort = () => {
      if (
        inPort.value &&
        Connection.loginStatus.userDataConfig.virtualInPorts.indexOf(
          inPort.value
        ) === -1
      ) {
        Connection.loginStatus.userDataConfig.virtualInPorts.push(inPort.value);
      }
    };

    return { addInPort, inPortSplice, virtualInPorts, inPort };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
