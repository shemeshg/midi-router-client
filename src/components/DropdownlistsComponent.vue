<template>
  <div>

    <header class="w3-container w3-teal">
      <h1>Controls</h1>
    </header>
          <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
              @click = "doBack"
            >Back</button>

    <div class="w3-container w3-margin-top">
      <div>
        Custom dropdowns items description one per line

        <div class="w3-right">
            <span  @click="addItem()">
                <a href="#" class="router-link-exact-active router-link-active">Add</a>
            </span>
        </div>

      </div>
    

    <div class="w3-container w3-card-4 w3-margin-top" v-for="(item, idx) in dropdownlists" v-bind:key="idx" v-bind:value="idx">

          <div class="w3-right">
    
                <a href="#" class="router-link-exact-active router-link-active" @click="spliceItem(idx)">Delete</a>


        
      </div>
      <p>
        <label> Name </label>
          <input type="text"  class="w3-input w3-border" v-model="item.name"> 
        </p>
        <p>
            <label> Values </label>
            <textarea class="w3-input w3-border"  style="resize:none;" v-model="item.data">            
            </textarea>
        </p>
    </div>
    </div>
  </div>
</template>



<script lang="ts">
import { Component,  Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../src/connection";
import {Dropdownlist} from "../src/UserDataConfig/dropdownlists"


@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  }
})
export default class DropdownlistsComponent extends Vue {
  dropdownlists = Connection.loginStatus.userDataConfig.dropdownlists;
  addItem(){
    this.dropdownlists.push( new Dropdownlist());
  }

  spliceItem(idx: number){
    this.dropdownlists.splice(idx,1)
  }

  doBack(){
    this.$router.push(`/usercontrols`);
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
