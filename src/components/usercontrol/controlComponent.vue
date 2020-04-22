<template>
  <div>
    <Row class="unselectable">
 
      <span @click="doInputVal(-1)">-</span>
      <span class="unselectable">{{item.description}}</span>
      <input type="number" v-model="getVal" v-if="!item.isShowDropdown" />

      <select v-model="item.inputVal" v-if="item.isShowDropdown">
        <option
          v-for="(name, idx) in getDropdownDescriptions"
          v-bind:key="idx"
          v-bind:value="idx"
        >{{name}}</option>
      </select>

      <span @click="doInputVal(+1)">+</span>
     

      <RowCellRight>
        <span @click="item.isEditMode = !item.isEditMode">
          <BtnHref
            v-if="!item.isEditMode"
          >Edit</BtnHref>
          <BtnHref
            v-if="item.isEditMode"
          >Hide details</BtnHref>
        </span>
        &nbsp;
        <span @click="doSend">
          <BtnHref >Send</BtnHref>
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
        <ServerInOutPortsSelect v-model.number="item.outputPortId" mode="out" />
      </p>

      <p>
        <label>Event type</label>
        <select class="w3-select" v-model="item.eventType">
          <option
            v-for="(item) in eventTypes"
            v-bind:key="item.id"
            v-bind:value="item.id"
          >{{item.name}}</option>
        </select>
      </p>

      <label>Description</label>
      <input class="w3-input" type="text" v-model="item.description" />

      <label>Minimum value</label>
      <input class="w3-input" type="text" v-model="item.minVal" />

      <label>Maximum value</label>
      <input class="w3-input" type="text" v-model="item.maxVal" />

      <input class="w3-check" type="checkbox" v-model="item.is64Mode" />
      <label>64 + - mode</label>

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
            >{{idx}} - {{item.name}}</option>
          </select>
        </RowCell>
        <RowCell>
          <router-link to="/dropdownlists">Manage dropdown lists</router-link>
        </RowCell>
      </Row>
      </CardBody>
    </Card>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import * as Connection from "../../src/connection";
import {
  UserControl,
  eventTypes,
  EventType
} from "../../src/UserDataConfig/userControl";

import BtnHref from "../a/BtnHref.vue";
import Row from "../a/Row.vue";
import RowCell from "../a/RowCell.vue";
import RowCellRight from "../a/RowCellRight.vue";
import Card from "../a/Card.vue";
import CardBody from "../a/CardBody.vue";
import ServerInOutPortsSelect from "../a/ServerInOutPortsSelect.vue";
@Component({
    components: {
    ServerInOutPortsSelect,
    Card,
    CardBody,
    BtnHref,
    Row,
    RowCell,
    RowCellRight,
  },
})
export default class ControlComponent extends Vue {
  @Prop() item!: UserControl;

  eventTypes = eventTypes;
  EventType = EventType;

  doInputVal(n: number) {
    const newVal = parseInt(this.item.inputVal) + n;
    if (
      newVal < parseInt(this.item.minVal) ||
      newVal > parseInt(this.item.maxVal)
    ) {
      return;
    }
    this.item.inputVal = newVal.toString();
  }
  async doSend() {
    this.item.doSend();
  }

  @Watch("item.inputVal", { immediate: true, deep: false })
  onInputValChanged1() {
    this.doSend();
  }

  get dropdownlists() {
    return Connection.loginStatus.userDataConfig.dropdownlists;
  }

  get getDropdownDescriptions() {
    const ary: string[] = [];
    const names = this.item.dropDownDecriptions.split("\n");
    for (let i = 0; i <= 127; i++) {
      if (names[i] !== undefined) {
        ary.push(names[i]);
      } else {
        ary.push(i.toString());
      }
    }
    return ary;
  }
  get outPorts() {
    return Connection.loginStatus.outPorts;
  }
  get getVal() {
    if (this.item.is64Mode) {
      return (parseInt(this.item.inputVal) - 64).toString();
    }
    return this.item.inputVal;
  }

  set getVal(n: string) {
    const val = parseInt(n);
    if (this.item.is64Mode) {
      this.item.inputVal = (val + 64).toString();
    } else {
      this.item.inputVal = val.toString();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
