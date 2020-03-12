<template>
<div>

    <header class="w3-container w3-teal">
      <h1>Presets</h1>      
    </header>



    <div class="w3-container w3-margin-top">
        <div class="w3-card-4">
            <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
              @click="applyChanges"
            >
                Apply changes
            </button>

            
            </div>
    </div>

    <div class="w3-container w3-margin-top">
        <div class="w3-card-4">
          <header class="w3-container w3-blue">
          <h5>Select active preset</h5>
        </header>
  <div class="w3-container">
          <p  v-for="(itemPreset, indexPreset) in midiRoutePresets" v-bind:key="indexPreset">
            <input class="w3-radio" type="radio"  v-model="activePresetID" :value="indexPreset" />
            <label>{{indexPreset}} {{itemPreset.name}}</label>
          </p>

          <p>
            <button class="w3-button w3-section w3-teal w3-ripple" 
            @click="$router.push(`/preset/-1`)"
            >Add</button>
            <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
              @click="$router.push(`/preset/${activePresetID}`)"
             >Edit</button>
            <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"   
              v-if="midiRoutePresets.length > 1"  
              @click="doDelete"      
            >Delete</button>

            <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
              @click="doMoveUp()"
            >
              <i class="fa fa-arrow-up"></i>
            </button>
            <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
              @click="doMoveDown()"
            >
              <i class="fa fa-arrow-down"></i>
            </button>
          </p>



        </div>

        </div>
    </div>
    <div class="w3-container">
        <input class="w3-check w3-margin-left" type="checkbox" v-model="changeAndApplay">
        <label>Auto applay select change and file upload</label>
    </div>

    <div class="w3-container w3-margin-top">
        <div class="w3-card-4">
          <p>
         <label class="w3-margin-left">Upload config</label>
          <input class="w3-button w3-teal w3-margin-left" type="file"  @change="loadFile" ref="el">            
             
            <button
              class="w3-button w3-section w3-teal w3-ripple w3-margin-left"
              @click="saveToFile"
            >
                Appay and download
            </button>            
            </p>
        </div>
    </div>


</div>
</template>

<script lang="ts">
import { Component,  Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../../src/connection";
import * as Utils from "../../src/Utils"

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  }
})
export default class PresetsComponent extends Vue {
  
  changeAndApplay = true;

  midiRoutePresets = Connection.loginStatus.userDataConfig.midiRoutePresets
  get activePresetID() {
    return Connection.loginStatus.userDataConfig.activePresetID;
  }

  set activePresetID(idx: number){
    Connection.loginStatus.userDataConfig.activePresetID = idx;
    if (this.changeAndApplay){
      Connection.loginStatus.userDataConfig.applyChanges(Connection.connection);
    }
  }
  doDelete(){
    Connection.loginStatus.userDataConfig.midiRoutePresets.splice(this.activePresetID, 1)
    this.activePresetID = 0;

  }

  applyChanges(){
    Connection.loginStatus.userDataConfig.applyChanges(Connection.connection);
  }

  async loadFile(){
    // eslint-disable-next-line
    const el:any = this.$refs.el
    const str = await Utils.readFileAsString(el)

    el.value = "";
    
    Connection.loginStatus.resetUserDataConfig(JSON.parse(str));
    
    if (this.changeAndApplay){
      await Connection.loginStatus.userDataConfig.applyChanges(Connection.connection);
    }
  }

  async saveToFile(){
    await Connection.loginStatus.userDataConfig.applyChanges(Connection.connection);
    Utils.downloadFileAsString("config.midiRouter",JSON.stringify(Connection.loginStatus.userDataConfig))
    
  }

      doMoveUp(){
        Utils.arrayMove( Connection.loginStatus.userDataConfig.midiRoutePresets, this.activePresetID, this.activePresetID -1 )

    }

    doMoveDown(){
        Utils.arrayMove( Connection.loginStatus.userDataConfig.midiRoutePresets, this.activePresetID, this.activePresetID + 1 )
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>