<template>
  <div>
    <CardHeader>
      {{ chainIdx }} -
      <input class="w3-blue" type="text" v-model="chainItem.name" />
      <RowCellRight v-if="midiRouteInput.midiRouterChains.length > 1">
        <BtnHref @click="$emit('do-splice', chainIdx)">Delete</BtnHref>
      </RowCellRight>
    </CardHeader>

    <CardBody>
      <p
        v-for="(itemFilter, indexFilter) in midiRouteInput.midiRouterChains[
          chainIdx
        ].midiRoutersFilters"
        v-bind:key="indexFilter"
      >
        <input
          class="w3-radio"
          type="radio"
          v-model="filterSelected"
          :value="indexFilter"
        />
        <label>{{ indexFilter }} {{ itemFilter.name }}</label>
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
import {
  defineComponent,
  ref,
  computed,
  onMounted,
} from "@vue/composition-api";

import { MidiRouterChain } from "../../src/UserDataConfig/MidiRoutePreset/MidiRouterChain";

import * as MRF from "../../src/UserDataConfig/MidiRoutePreset/MidiRoutersFilter";

import * as Connection from "../../src/connection";
import * as Utils from "../../src/Utils";

import CardHeader from "../a/CardHeader.vue";
import CardBody from "../a/CardBody.vue";
import Btn from "../a/Btn.vue";
import BtnHref from "../a/BtnHref.vue";
import RowCellRight from "../a/RowCellRight.vue";

export default defineComponent({
  components: {
    CardHeader,
    CardBody,
    RowCellRight,
    Btn,
    BtnHref,
  },
  props: {
    chainItem: {
      type: MidiRouterChain,
      required: true,
    },
    chainIdx: {
      type: Number,
      required: true,
    },
    midiId: {
      type: String,
      required: true,
    },
  },
  setup(props, { root }) {
    const filterSelected = ref("");

    const midiRouteInput = computed(() => {
      return Connection.loginStatus.userDataConfig.getMidiRouteInput(
        Connection.loginStatus.inPorts[Number(props.midiId)]
      );
    });

    function doMoveUp() {
      if (filterSelected.value === "") {
        return;
      }
      const iFilterSelected = parseInt(filterSelected.value);
      Utils.arrayMove(
        midiRouteInput.value.midiRouterChains[props.chainIdx]
          .midiRoutersFilters,
        iFilterSelected,
        iFilterSelected - 1
      );
      if (iFilterSelected - 1 > -1) {
        filterSelected.value = (iFilterSelected - 1).toString();
      }
      root.$forceUpdate();
    }

    function doMoveDown() {
      if (filterSelected.value === "") {
        return;
      }
      const iFilterSelected = parseInt(filterSelected.value);
      Utils.arrayMove(
        midiRouteInput.value.midiRouterChains[props.chainIdx]
          .midiRoutersFilters,
        iFilterSelected,
        iFilterSelected + 1
      );
      if (
        iFilterSelected + 1 <
        midiRouteInput.value.midiRouterChains[props.chainIdx].midiRoutersFilters
          .length
      ) {
        filterSelected.value = (iFilterSelected + 1).toString();
      }
      root.$forceUpdate();
    }

    function deleteChainFilter() {
      if (filterSelected.value === "") {
        return;
      }
      midiRouteInput.value.midiRouterChains[
        props.chainIdx
      ].midiRoutersFilters.splice(parseInt(filterSelected.value), 1);
      filterSelected.value = ""
      root.$forceUpdate();
    }

    function editChainFilter() {
      if (filterSelected.value === "") {
        return;
      }
      const filterSelectedObj =
        midiRouteInput.value.midiRouterChains[props.chainIdx]
          .midiRoutersFilters[parseInt(filterSelected.value)];
      if (filterSelectedObj.filterType === MRF.FilterType.TO_MIDI_DESTINATION) {
        root.$router.push(
          `/addFilter/AddMidiDestination/${props.midiId}/${props.chainIdx}/${filterSelected.value}`
        );
      }
      if (filterSelectedObj.filterType === MRF.FilterType.TO_CONSOLE) {
        root.$router.push(
          `/addFilter/AddConsoleLog/${props.midiId}/${props.chainIdx}/${filterSelected.value}`
        );
      }
      if (filterSelectedObj.filterType === MRF.FilterType.TO_NETWORK) {
        root.$router.push(
          `/addFilter/AddNetworkDestination/${props.midiId}/${props.chainIdx}/${filterSelected.value}`
        );
      }
      if (filterSelectedObj.filterType === MRF.FilterType.SCHEDULE_TO) {
        root.$router.push(
          `/addFilter/AddSchedule/${props.midiId}/${props.chainIdx}/${filterSelected.value}`
        );
      }
      if (
        filterSelectedObj.filterType === MRF.FilterType.FILTER_AND_TRANSFORM
      ) {
        root.$router.push(
          `/addFilter/AddFilterTransform/${props.midiId}/${props.chainIdx}/${filterSelected.value}`
        );
      }
    }

    function addChainFilter() {
      root.$router.push(`/AddChainFilter/${props.midiId}/${props.chainIdx}`);
    }

    onMounted(() => {
      midiRouteInput.value.midiRouterChains[props.chainIdx].midiRoutersFilters;
    });

    return {addChainFilter, editChainFilter,deleteChainFilter, doMoveDown,
      doMoveUp, midiRouteInput, filterSelected}
  },
});
</script>