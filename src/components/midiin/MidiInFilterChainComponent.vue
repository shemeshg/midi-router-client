<template>
  <div>
    <CardHeader>
      {{chainIdx}} -
      <input class="w3-blue" type="text" v-model="chainItem.name" />
      <RowCellRight v-if="midiRouteInput.midiRouterChains.length > 1">
        <BtnHref @click="$emit('do-splice', chainIdx)">Delete</BtnHref>
      </RowCellRight>
    </CardHeader>

    <CardBody>
      <p
        v-for="(itemFilter, indexFilter) in midiRouteInput.midiRouterChains[chainIdx].midiRoutersFilters"
        v-bind:key="indexFilter"
      >
        <input class="w3-radio" type="radio" v-model="filterSelected" :value="indexFilter" />
        <label>{{indexFilter}} {{itemFilter.name}}</label>
      </p>

      <p>
        <Btn @click="addChainFilter()">Add</Btn>
        <Btn :ml="true" @click="editChainFilter()">Edit</Btn>
        <Btn :ml="true" @click="deleteChainFilter()">Delete</Btn>
        <Btn :ml="true" @click="doMoveUp()">
          <i class="fa fa-arrow-up"></i>
        </Btn>
        <Btn :ml="true" @click="doMoveDown()">
          <i class="fa fa-arrow-down"></i>
        </Btn>
      </p>
    </CardBody>
  </div>
</template>


<script lang="ts">
import { MidiRouterChain } from "../../src/UserDataConfig/MidiRoutePreset/MidiRouterChain";

import * as MRF from "../../src/UserDataConfig/MidiRoutePreset/MidiRoutersFilter";

import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../../src/connection";
import * as Utils from "../../src/Utils";

import CardHeader from "../a/CardHeader.vue";
import CardBody from "../a/CardBody.vue";
import Btn from "../a/Btn.vue";
import BtnHref from "../a/BtnHref.vue";
import RowCellRight from "../a/RowCellRight.vue";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    CardHeader,
    CardBody,
    RowCellRight,
    Btn,
    BtnHref
  }
})
export default class MidiInFilterChain extends Vue {
  @Prop() private chainItem!: MidiRouterChain;
  @Prop() private chainIdx!: number;
  @Prop() private midiId!: string;
  filterSelected = "";

  mounted() {
    this.midiRouteInput.midiRouterChains[this.chainIdx].midiRoutersFilters;
  }

  get midiRouteInput() {
    return Connection.loginStatus.userDataConfig.getMidiRouteInput(
      Connection.loginStatus.inPorts[ Number(this.midiId) ]
    );
  }

  doMoveUp() {
    if (this.filterSelected === "") {
      return;
    }
    const iFilterSelected = parseInt(this.filterSelected);
    Utils.arrayMove(
      this.midiRouteInput.midiRouterChains[this.chainIdx].midiRoutersFilters,
      iFilterSelected,
      iFilterSelected - 1
    );
    if (iFilterSelected - 1 > -1) {
      this.filterSelected = (iFilterSelected - 1).toString();
    }
    this.$forceUpdate();
  }

  doMoveDown() {
    if (this.filterSelected === "") {
      return;
    }
    const iFilterSelected = parseInt(this.filterSelected);
    Utils.arrayMove(
      this.midiRouteInput.midiRouterChains[this.chainIdx].midiRoutersFilters,
      iFilterSelected,
      iFilterSelected + 1
    );
    if (
      iFilterSelected + 1 <
      this.midiRouteInput.midiRouterChains[this.chainIdx].midiRoutersFilters
        .length
    ) {
      this.filterSelected = (iFilterSelected + 1).toString();
    }
    this.$forceUpdate();
  }

  deleteChainFilter() {
    if (this.filterSelected === "") {
      return;
    }
    this.midiRouteInput.midiRouterChains[
      this.chainIdx
    ].midiRoutersFilters.splice(parseInt(this.filterSelected), 1);
    this.$forceUpdate();
  }

  editChainFilter() {
    if (this.filterSelected === "") {
      return;
    }
    const filterSelectedObj = this.midiRouteInput.midiRouterChains[
      this.chainIdx
    ].midiRoutersFilters[parseInt(this.filterSelected)];
    if (filterSelectedObj.filterType === MRF.FilterType.TO_MIDI_DESTINATION) {
      this.$router.push(
        `/addFilter/AddMidiDestination/${this.midiId}/${this.chainIdx}/${this.filterSelected}`
      );
    }
    if (filterSelectedObj.filterType === MRF.FilterType.TO_CONSOLE) {
      this.$router.push(
        `/addFilter/AddConsoleLog/${this.midiId}/${this.chainIdx}/${this.filterSelected}`
      );
    }
    if (filterSelectedObj.filterType === MRF.FilterType.TO_NETWORK) {
      this.$router.push(
        `/addFilter/AddNetworkDestination/${this.midiId}/${this.chainIdx}/${this.filterSelected}`
      );
    }
    if (filterSelectedObj.filterType === MRF.FilterType.SCHEDULE_TO) {
      this.$router.push(
        `/addFilter/AddSchedule/${this.midiId}/${this.chainIdx}/${this.filterSelected}`
      );
    }
    if (filterSelectedObj.filterType === MRF.FilterType.FILTER_AND_TRANSFORM) {
      this.$router.push(
        `/addFilter/AddFilterTransform/${this.midiId}/${this.chainIdx}/${this.filterSelected}`
      );
    }
  }

  addChainFilter() {
    this.$router.push(`/AddChainFilter/${this.midiId}/${this.chainIdx}`);
  }
}
</script>