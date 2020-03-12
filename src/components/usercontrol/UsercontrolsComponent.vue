<template>
  <div>

    <header class="w3-container w3-teal">
      <h1>Controls</h1>
    </header>
    <div class="w3-container w3-margin-top">
        
        <p v-if="editMode" >
          <a href="#" class="router-link-exact-active router-link-active" @click="editMode = !editMode">
            Exit edit mode
          </a>
          &nbsp; | &nbsp;
          <a href="#" class="router-link-exact-active router-link-active" @click="addUserControl">
            Add
          </a>          
        </p>
        <p v-if="!editMode" >
          <a href="#" class="router-link-exact-active router-link-active" @click="editMode = !editMode">
            Edit
          </a>
          &nbsp; | &nbsp;
          <a href="#" class="router-link-exact-active router-link-active" @click="sendAll">
            Send all
          </a>
        </p>
        <div v-for="(item, index) in userControls" v-bind:key="index" >
        <p v-if="editMode">
          <a href="#" class="router-link-exact-active router-link-active" @click="am(index,index -1)">
            Up
          </a>
          &nbsp; | &nbsp;
          <a href="#" class="router-link-exact-active router-link-active" @click="am(index,index +1)">
            Down
          </a>
          &nbsp; | &nbsp;
          <a href="#" class="router-link-exact-active router-link-active" @click="userControls.splice(index,1)">
            Delete
          </a>          
        </p>
        <ControlComponent  v-bind:item="item"></ControlComponent>
        <p>&nbsp;</p>
        </div>

        </div>    


        
    
      </div>


</template>


<script lang="ts">
import { Component,  Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import {LoginStatus} from '../../src/loginStatus'
import * as Connection from "../../src/connection";
import {arrayMove} from "../../src/Utils"

import ControlComponent from '@/components/usercontrol/controlComponent.vue'

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  },
  components: {
    ControlComponent,
  }
})
export default class UsercontrolsComponent extends Vue {

  loginStatus!: LoginStatus;
  
  editMode = false;
  
  addUserControl(){
    Connection.loginStatus.userDataConfig.activePreset.addUserControl();
  }


  am(oldIdex: number, newIndex: number){
    arrayMove(this.userControls,oldIdex, newIndex)
  }

  async sendAll(){
    for (let i=0;i<this.userControls.length;i++){
      await this.userControls[i].doSend();
    }
  }

  get userControls(){
    return Connection.loginStatus.userDataConfig.activePreset.userControls;
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
