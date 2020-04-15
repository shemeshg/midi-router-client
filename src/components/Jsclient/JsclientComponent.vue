<template>
  <div>
    <header class="w3-container w3-teal">
      <h1>JS client routing</h1>
    </header>
    <div class="w3-container w3-margin-top">
      <div>
        <div class="w3-container">
          <div>
            <div class="w3-cell w3-cell-middle">
              <label>From JS</label>
              <select class="w3-select" v-model.number="routeJsOutPort">
                <option value="-1">-</option>
                <option
                  v-for="(item,idx) in jsInPorts"  
                  v-bind:key="item.id"
                  v-bind:value="item.id"
                >{{idx}} - {{item.name}}</option>
              </select>
            </div>
            <div class="w3-container w3-cell w3-cell-middle">
              <label>To Server</label>

              <select class="w3-select" v-model.number="routeServerInPort">
                <option value="-1">-</option>
           <option
                  v-for="(item) in serverOutPorts"
                  v-bind:key="item.id"            
                  v-bind:value="item.id"
                >{{item.id}} - {{item.name}}</option>
              </select>

            </div>
            <div class="w3-container w3-cell w3-cell-middle">
              <button class="w3-button w3-section w3-teal w3-ripple w3-margin-left" @click="addToServer" >Add Route</button>
            </div>
          </div>

          <div class="w3-card-4">
            <header class="w3-container w3-blue">
              <h5>From JS To Server</h5>
            </header>
            <div class="w3-container">            
              <p v-for="(item) in routesToServer" v-bind:key="item.id">
                {{item.fromName }} to {{ item.toName }} 
                <a @click="removeJsToServer(item.id)"
                  href="#"
                  class="router-link-exact-active router-link-active w3-right"
                >Delete</a>
              </p>
            </div>
          </div>

          <div>
            <div class="w3-cell w3-cell-middle">
              <label>From Server</label>
              <select class="w3-select" v-model.number="routeServerOutPort">
                <option value="-1">-</option>
                <option
                  v-for="(item) in serverInPorts"
                  v-bind:key="item.id"
                  v-bind:value="item.id"
                >{{item.id}} - {{item.name}}</option>
              </select>
            </div>
            <div class="w3-container w3-cell w3-cell-middle">
              <label>To JS</label>
              <select class="w3-select" v-model.number="routeJsInPort">
                <option value="-1">-</option>
                <option
                  v-for="(item,idx) in jsOutPorts"
                  v-bind:key="item.id"
                  v-bind:value="item.id"
                >{{idx}} - {{item.name}}</option>
              </select>
            </div>
            <div class="w3-container w3-cell w3-cell-middle">
              <button class="w3-button w3-section w3-teal w3-ripple w3-margin-left" @click="addFromServer">Add Route</button>
            </div>
          </div>

          <div class="w3-card-4">
            <header class="w3-container w3-blue">
              <h5>From Server To JS</h5>
            </header>
            <div class="w3-container">
              <p v-for="(item) in routesFromServer" v-bind:key="item.id">
                {{item.fromName }} to {{ item.toName }} 
                <a @click="removeJsToServer(item.id)"
                  href="#"
                  class="router-link-exact-active router-link-active w3-right"
                >Delete</a>
              </p>
            </div>
          </div>

          <p>
            &nbsp;
          </p>
        </div>
      </div>
    </div>
  </div>
</template>



<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

import * as Connection from "../../src/connection";
import {jsRouter, JS_TO_SERVER_TYPE} from "../../src/jsRouter"

@Component({
  computed: {
    ...mapState(["loginStatus"]),
    ...mapGetters(["isLoggedIn"])
  }
})
export default class JsclientComponent extends Vue {
  
  routeServerInPort = -1
  routeServerOutPort = -1

  routeJsInPort = -1
  routeJsOutPort = -1

  jsInPorts: { id: number; name: string}[] = []
  jsOutPorts: { id: number; name: string}[] = []

  jsToServers = jsRouter.jsToServers

  get routesFromServer(){
    return this.jsToServers.filter( (row)=>{return row.jsToServerType === JS_TO_SERVER_TYPE.FROM_SERVER})
  }

  get routesToServer(){
    return this.jsToServers.filter( (row)=>{return row.jsToServerType === JS_TO_SERVER_TYPE.TO_SERVER})
  }

  async mounted(){    
    await jsRouter.doOpen()      
    this.jsInPorts = jsRouter.inPorts
    this.jsOutPorts = jsRouter.outPorts
  }

  removeJsToServer(id: string){
    jsRouter.removeJsToServer( id );
    this.jsToServers = jsRouter.jsToServers
  }

  addToServer(){
    
    if ( this.routeJsOutPort === -1 || this.routeServerInPort === -1){return;}
    const fromStr = this.jsInPorts.filter( (row)=>{return row.id ===  this.routeJsOutPort})[0].name
    const toStr = this.serverInPorts.filter( (row)=>{ return row.id === this.routeServerInPort })[0].name 


    jsRouter.addJsServer(JS_TO_SERVER_TYPE.TO_SERVER, this.routeJsOutPort,  this.routeServerInPort, fromStr, toStr )
    this.jsToServers = jsRouter.jsToServers
  }

  addFromServer(){
    if ( this.routeJsInPort === -1 || this.routeServerOutPort === -1){return;}
    const fromStr = this.serverOutPorts.filter( (row)=>{ return row.id === this.routeServerOutPort})[0].name  
    const toStr = this.jsOutPorts.filter( (row)=>{return row.id ===  this.routeJsInPort})[0].name
    jsRouter.addJsServer(JS_TO_SERVER_TYPE.FROM_SERVER, this.routeServerOutPort, this.routeJsInPort, fromStr, toStr )
    this.jsToServers = jsRouter.jsToServers
  }

  get serverInPorts(){
    const i = []
    const ports = Connection.loginStatus.inPorts
    for (const key in ports){ 
      i.push({ id: Number(key), name: ports[key]}) 
    }

    return i;          
  }

  get serverOutPorts(){
    const i = []
    const ports = Connection.loginStatus.outPorts
    for (const key in ports){ 
      i.push({ id: Number( key ), name: ports[key]}) 
    }

    return i;         
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
