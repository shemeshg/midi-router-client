<template>
  <div>
    <Row class="unselectable">
      <span @click="doInputVal(-1)">-</span>
      <span class="unselectable">{{ item.description }}</span>
      <input type="number" v-model="getVal" v-if="!item.isShowDropdown" />

      <select v-model="item.inputVal" v-if="item.isShowDropdown">
        <option
          v-for="(name, idx) in getDropdownDescriptions"
          v-bind:key="idx"
          v-bind:value="idx"
        >
          {{ name }}
        </option>
      </select>

      <span @click="doInputVal(+1)">+</span>

      <RowCellRight>
        <span @click="item.isEditMode = !item.isEditMode">
          <BtnHref v-if="!item.isEditMode">Edit</BtnHref>
          <BtnHref v-if="item.isEditMode">Hide details</BtnHref>
        </span>
        &nbsp;
        <span @click="doSend">
          <BtnHref>Send</BtnHref>
        </span>
      </RowCellRight>
    </Row>

    <input
      class="w3-input"
      type="range"
      v-bind:min="item.minVal"
      v-bind:max="item.maxVal"
      v-model="item.inputVal"
    />

    <Card v-if="item.isEditMode" :mt="true">
      <CardBody>
        <p>
          <label>Output</label>
          <ServerInOutPortsSelect
            v-model.number="item.outputPortId"
            mode="out"
          />
        </p>

        <p>
          <label>Event type</label>
          <select class="w3-select" v-model="item.eventType">
            <option
              v-for="item in eventTypes"
              v-bind:key="item.id"
              v-bind:value="item.id"
            >
              {{ item.name }}
            </option>
          </select>
        </p>

        <label>Description</label>
        <input class="w3-input" type="text" v-model="item.description" />

        <label>Minimum value</label>
        <input class="w3-input" type="text" v-model="item.minVal" />

        <label>Maximum value</label>
        <input class="w3-input" type="text" v-model="item.maxVal" />

        <input class="w3-check" type="checkbox" v-model="item.is64Mode" />
        <label> 64 + - mode</label>
        <hr style="border-bottom: 1px solid #ccc" />

        <label>Channel</label>
        <input class="w3-input" type="number" v-model="item.channelId" />

        <div v-if="item.eventType === EventType.CC">
          <label>CC number</label>
          <input class="w3-input" type="number" v-model="item.ccId" />
        </div>

        <input class="w3-check" type="checkbox" v-model="item.isShowDropdown" />
        <label>Show Dropdown</label>

        <Row v-if="item.isShowDropdown">
          <RowCell>
            <label>Selecct list of values</label>
          </RowCell>
          <RowCell>
            <select class="w3-select" v-model="item.dropdownListId">
              <option
                v-for="(item, idx) in dropdownlists"
                v-bind:key="idx"
                v-bind:value="idx"
              >
                {{ idx }} - {{ item.name }}
              </option>
            </select>
          </RowCell>
          <RowCell>
            <router-link to="/dropdownlists">Manage dropdown lists</router-link>
          </RowCell>
        </Row>

        <hr style="border-bottom: 1px solid #ccc" />
      </CardBody>
    </Card>
  </div>
</template>


<script lang="ts">
import { computed, defineComponent, watch } from "@vue/composition-api";

import * as Connection from "../../src/connection";
import {
  UserControl,
  eventTypes,
  EventType,
} from "../../src/UserDataConfig/userControl";

import BtnHref from "../a/BtnHref.vue";
import Row from "../a/Row.vue";
import RowCell from "../a/RowCell.vue";
import RowCellRight from "../a/RowCellRight.vue";
import Card from "../a/Card.vue";
import CardBody from "../a/CardBody.vue";
import ServerInOutPortsSelect from "../a/ServerInOutPortsSelect.vue";

export default defineComponent({
  components: {
    ServerInOutPortsSelect,
    Card,
    CardBody,
    BtnHref,
    Row,
    RowCell,
    RowCellRight,
  },
  props: {
    item: {
      type: UserControl,
      required: true,
    },
  },
  setup(props) {
    const dropdownlists = computed(() => {
      return Connection.loginStatus.userDataConfig.dropdownlists;
    });

    const getDropdownDescriptions = computed(() => {
      const ary: string[] = [];
      const names = props.item.dropDownDecriptions.split("\n");
      for (let i = 0; i <= 127; i++) {
        if (names[i] !== undefined) {
          ary.push(names[i]);
        } else {
          ary.push(i.toString());
        }
      }
      return ary;
    });

    const outPorts = computed(() => {
      return Connection.loginStatus.outPorts;
    });

    const getVal = computed({
      get: () => {
        if (props.item.is64Mode) {
          return (parseInt(props.item.inputVal) - 64).toString();
        }
        return props.item.inputVal;
      },
      set: (n: string) => {
        const val = parseInt(n);
        if (props.item.is64Mode) {
          props.item.inputVal = (val + 64).toString();
        } else {
          props.item.inputVal = val.toString();
        }
      },
    });

    function doInputVal(n: number) {
      const newVal = parseInt(props.item.inputVal) + n;
      if (
        newVal < parseInt(props.item.minVal) ||
        newVal > parseInt(props.item.maxVal)
      ) {
        return;
      }
      props.item.inputVal = newVal.toString();
    }

    async function doSend() {
      props.item.doSend();
    }

    watch(
      () => props.item.inputVal,
      () => {
        doSend();
      },
      { immediate: true, deep: false }
    );

    return {
      eventTypes,
      EventType,
      doSend,
      doInputVal,
      getVal,
      outPorts,
      getDropdownDescriptions,
      dropdownlists,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
