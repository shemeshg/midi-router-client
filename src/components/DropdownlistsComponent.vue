<template>
  <Page text="Controls">
    <Btn :ml="true" @click="doBack">Back</Btn>

    <Row>
      Custom dropdowns items description one per line
      <RowCellRight>
        <span @click="addItem()">
          <BtnHref>Add</BtnHref>
        </span>
      </RowCellRight>
    </Row>

    <Card :mt="true" v-for="(item, idx) in dropdownlists" v-bind:key="idx" v-bind:value="idx">
      <CardBody>
        <RowCellRight>
          <BtnHref @click="spliceItem(idx)">Delete</BtnHref>
        </RowCellRight>
        <p>
          <label>Name</label>
          <input type="text" class="w3-input w3-border" v-model="item.name" />
        </p>
        <p>
          <label>Values</label>
          <textarea class="w3-input w3-border" style="resize:none;" v-model="item.data"></textarea>
        </p>
      </CardBody>
    </Card>
  </Page>
</template>



<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../src/connection";
import { Dropdownlist } from "../src/UserDataConfig/dropdownlists";

import Page from "./a/Page.vue";
import Card from "./a/Card.vue";
import CardBody from "./a/CardBody.vue";
import Btn from "./a/Btn.vue";
import Row from "./a/Row.vue";
import RowCellRight from "./a/RowCellRight.vue";
import BtnHref from "./a/BtnHref.vue";

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    Page,
    Card,
    CardBody,
    Btn,
    Row,
    RowCellRight,
    BtnHref
  }
})
export default class DropdownlistsComponent extends Vue {
  dropdownlists = Connection.loginStatus.userDataConfig.dropdownlists;
  addItem() {
    this.dropdownlists.push(new Dropdownlist());
  }

  spliceItem(idx: number) {
    this.dropdownlists.splice(idx, 1);
  }

  doBack() {
    this.$router.push(`/usercontrols`);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
