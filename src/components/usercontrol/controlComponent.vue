<template>
  <div>

        
        <label class="unselectable">
            <span @click="doInputVal(-1)"> - </span>
            <span class="unselectable">{{item.description}} </span>
            <input type="number" v-model="getVal" v-if="!item.isShowDropdown">
             
       <select v-model="item.inputVal" v-if="item.isShowDropdown">
        <option v-for="(name, idx) in getDropdownDescriptions" v-bind:key="idx" v-bind:value="idx"  >{{name}}</option>
        </select>

            <span @click="doInputVal(+1)"> + </span>

            <div class="w3-right">
            <span  @click="item.isEditMode = !item.isEditMode">
                <a v-if="!item.isEditMode" href="#" class="router-link-exact-active router-link-active">Edit</a>
                <a v-if="item.isEditMode" href="#" class="router-link-exact-active router-link-active">Hide details</a>
            </span> 
            &nbsp;
            <span @click="doSend">
                <a href="#" class="router-link-exact-active router-link-active">Send</a>                
            </span> 
            </div>
        </label>
        <input class="w3-input" type="range" v-bind:min="item.minVal" v-bind:max="item.maxVal" v-model="item.inputVal">  
        <div v-if="item.isEditMode" class="w3-card-4 w3-margin-top w3-container" >
        

        <p>
        <label>Output</label>
        <select class="w3-select" v-model="item.outputPortId">
        <option value="" selected>Disabled</option>
        <option v-for="(item, idx) in outPorts" v-bind:key="item.midiOutputId" v-bind:value="idx"  >{{idx}} - {{item}}</option>
        </select>
        </p>

        <p>
        <label>Event type</label>
        <select class="w3-select" v-model="item.eventType">
        <option v-for="(item) in eventTypes" v-bind:key="item.id" v-bind:value="item.id"  >{{item.name}}</option>
        </select>
        </p>


        <label>Description</label>
        <input class="w3-input" type="text" v-model="item.description" >

        <label>Minimum value</label>
        <input class="w3-input" type="text" v-model="item.minVal" >

        <label>Maximum value</label>
        <input class="w3-input" type="text" v-model="item.maxVal" >

        <input class="w3-check" type="checkbox" v-model="item.is64Mode">
        <label>64 + - mode </label>


        <label>Channel</label>
        <input class="w3-input" type="number" v-model="item.channelId" >

        <div v-if="item.eventType === EventType.CC">
        <label>CC number</label>
        <input class="w3-input" type="number" v-model="item.ccId" >
        </div>

        <input class="w3-check" type="checkbox" v-model="item.isShowDropdown">
        <label>Show Dropdown </label>




        <p v-if="item.isShowDropdown">
        <label>Custom dropdown items description one per line</label>
            <textarea class="w3-input w3-border"  style="resize:none;" v-model="item.dropDownDecriptions">
            
            </textarea>
        </p>
    

        </div>

      </div>


</template>


<script lang="ts">
import { Component,  Vue , Watch, Prop} from "vue-property-decorator";

import * as Connection from "../../src/connection";
import {UserControl, eventTypes, EventType} from "../../src/UserDataConfig/userControl"

@Component({

})
export default class ControlComponent extends Vue {
    @Prop() item!: UserControl

    eventTypes= eventTypes;
    EventType = EventType
 

    doInputVal(n: number){
        const newVal = parseInt(this.item.inputVal) + n
        if (newVal < parseInt(this.item.minVal) || newVal > parseInt( this.item.maxVal)){return ;}
        this.item.inputVal = newVal.toString()
    }
    async doSend(){
        this.item.doSend()
    }

  @Watch('item.inputVal', { immediate: true, deep: false })
  onInputValChanged1() {
      this.doSend();
  }


    get getDropdownDescriptions(){
        const ary: string[] = [];
        const names = this.item.dropDownDecriptions.split("\n");
        for (let i=0;i<=127;i++){
            if(names[i] !== undefined){
                ary.push(names[i])
            } else {
                ary.push(i.toString())
            }
        }
        return ary;
    }
    get outPorts(){
        return Connection.loginStatus.outPorts
    }
    get getVal() {
        if (this.item.is64Mode){
            return (parseInt(this.item.inputVal) - 64).toString();
        }
        return this.item.inputVal
        
    }

    set getVal(n: string){
        const val = parseInt(n)
        if (this.item.is64Mode){
            this.item.inputVal = (val + 64).toString();
        } else {
            this.item.inputVal = val.toString()
        }

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
