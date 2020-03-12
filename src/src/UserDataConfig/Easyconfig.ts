import { BaseMidiRouteInput } from "./MidiRoutePreset";
import * as Connection from "../connection";
import { MidiRouterChain } from "../UserDataConfig/MidiRoutePreset"
import {MIDI_FILTER_ACTION_IF_NOT} from "../channel/WcMidiIn"


export class KeyboardZone {
    splitPosition: number;
    constructor(splitPosition: number) {
      this.splitPosition = splitPosition;
    }
  
    getPositionName(n: number){
      const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      const inputVal = n
      const noteName = notes[ inputVal % 12] 
      const octave = Math.floor(Math.floor(inputVal) / 12 - 1);
      return `${octave} ${noteName}`
    }

    get positionName() {
      return this.getPositionName( this.splitPosition);
    }
  }
  

  export class ZoneRange{
    name: string
    fromKey: number
    toKey: number
    constructor (name: string, fromKey: number, toKey: number){
      this.name = name;
      this.fromKey = fromKey
      this.toKey = toKey
    }
  }


  enum EventTypes {
    noteoff = 8,    
    noteon = 9,
    keyaftertouch = 10,
    controlchange = 11,
    channelmode = 11,
    nrpn = 11,
    programchange = 12,
    channelaftertouch = 13,
    pitchbend = 14
  }


  export const dropdownMidiEventType = [
    {id: 0, eventTypes: [], name: "-"},
    {id: 1, eventTypes: [EventTypes.noteon, EventTypes.noteoff ], name: "Note on/off"},
    {id: 2, eventTypes: [EventTypes.noteoff], name: "Note off"},
    {id: 3, eventTypes: [EventTypes.noteon], name: "Note on"},
    {id: 4, eventTypes: [EventTypes.keyaftertouch], name: "keyaftertouch"},
    {id: 5, eventTypes: [EventTypes.controlchange], name: "controlchange"},
    {id: 6, eventTypes: [EventTypes.channelmode], name: "channelmode"},
    {id: 7, eventTypes: [EventTypes.nrpn], name: "nrpn"},
    {id: 8, eventTypes: [EventTypes.programchange], name: "programchange"},
    {id: 9, eventTypes: [EventTypes.channelaftertouch], name: "channelaftertouch"},
    {id: 10, eventTypes: [EventTypes.pitchbend], name: "pitchbend"},
    ]

  class EasyConfigRoute extends  BaseMidiRouteInput{
     

    

    splitRangeId = -1
    fromSelectedMidiEventTypeId = 0;
    fromChannel = -1
    fromData1 = -1
    transpose = 0

    toSelectedMidiEventTypeId = 0;
    toChannel = -1
    toData1 = -1
    toDestinationId = ""

    get getMidiRouterChains(): MidiRouterChain[]{
      // GGGG
      const ret: MidiRouterChain[] = [];
      const isAllValid = this.toDestinationId !== ""

      const inputZonesAndRoute: InputZonesAndRoutes = Connection.loginStatus.userDataConfig.easyConfig.inputZonesAndRoutes[this.midiInputId]
      if (!isAllValid){return ret;}

      
      let isAllDefault = true;
      let channelFilter = [[0,16,0]]

      if (this.fromChannel !== -1){
        isAllDefault = false;
        channelFilter = [[this.fromChannel, this.toChannel]]
      }

      let eventFilter = [[0,16,0]]
      if (this.fromSelectedMidiEventTypeId !== 0){
        isAllDefault = false
        if (this.fromSelectedMidiEventTypeId ===  this.toSelectedMidiEventTypeId && this.toSelectedMidiEventTypeId === 1){
          eventFilter = [[EventTypes.noteoff],[EventTypes.noteon]]
        }
        else {          
          eventFilter = [ [ dropdownMidiEventType[this.fromSelectedMidiEventTypeId].eventTypes[0],
                            dropdownMidiEventType[this.toSelectedMidiEventTypeId].eventTypes[0] ] ]
        }
      }
      

      let data1Filter = [[0,127,0]]
      const data2Filter = [[0,127,0]]

      if (this.splitRangeId !== -1 && this.isShowSplitRanges){
        const zoneRange =  inputZonesAndRoute.getZoneRanges[this.splitRangeId ]
        data1Filter = [[zoneRange.fromKey, zoneRange.toKey,  zoneRange.fromKey + this.transpose]]
      }

      if (this.isShowData1Filed){
        data1Filter= [[this.fromData1, this.toData1]]
      }
      const midiRouterChain = new MidiRouterChain("Easyconfig");
      midiRouterChain.isEasyConfig = true      
      if (!isAllDefault){
        midiRouterChain.addFilterFilterAndTransform("EasyConfig",MIDI_FILTER_ACTION_IF_NOT.DELETE_IF_NOT,
                    JSON.stringify(channelFilter),
                    JSON.stringify(eventFilter),
                    JSON.stringify(data1Filter),
                    JSON.stringify(data2Filter)) 
      }

      const midiOutId = parseInt( this.toDestinationId )
      const midioutObj = new BaseMidiRouteInput(midiOutId,  Connection.loginStatus.inPorts[ midiOutId ])

      midiRouterChain.addFilterMidiDestination(midioutObj);
      ret.push( midiRouterChain )

      return ret;
    }


    get isShowSplitRanges(){
      return dropdownMidiEventType[ this.fromSelectedMidiEventTypeId ].eventTypes.indexOf(EventTypes.noteoff) > -1 ||
        dropdownMidiEventType[ this.fromSelectedMidiEventTypeId].eventTypes.indexOf(EventTypes.noteon) > -1 
    }

    get isShowData1Filed(){
      // tue for cc
      return [EventTypes.controlchange].indexOf(dropdownMidiEventType [this.fromSelectedMidiEventTypeId].eventTypes[0]) > -1
    }

    get getData1Description(){
      if ([EventTypes.controlchange].indexOf(dropdownMidiEventType[ this.fromSelectedMidiEventTypeId ].eventTypes[0]) > -1){
        return "cc number";
      } 
      return ""
    }

    get isShowToData1Filed(){
      // tue for cc
      return [EventTypes.controlchange].indexOf(dropdownMidiEventType [this.toSelectedMidiEventTypeId].eventTypes[0]) > -1
    }

    get getToData1Description(){
      if ([EventTypes.controlchange].indexOf(dropdownMidiEventType[ this.toSelectedMidiEventTypeId ].eventTypes[0]) > -1){
        return "cc number";
      } 
      return ""
    }



  }



  export class InputZonesAndRoutes extends BaseMidiRouteInput {
    keyboardSplits: KeyboardZone[] = []
    zoneNames: string[] = []
   

    easyConfigRoutes: EasyConfigRoute[] = []

    constructor(inputId: number){    
      super(inputId,Connection.loginStatus.inPorts[inputId])
    }
  
    

    addRoute(){
      const _ret = new EasyConfigRoute(this.midiInputId, this.midiInputName)
      this.easyConfigRoutes.push( _ret )
      return _ret
    }

    addKeyboardSplit(splitPosition: number){
      const _ret = new KeyboardZone(splitPosition)
      this.keyboardSplits.push( _ret )
      this.doUpdateZoneNameLen();
      return _ret
    }
  
    doUpdateZoneNameLen(){
      if (this.keyboardSplits.length === 0){ 
        this.zoneNames.length = 0;
        return;
       }
      this.zoneNames.splice(  this.keyboardSplits.length + 1);
      for (let i = 0; i<this.keyboardSplits.length + 1; i++ ){
        if (this.zoneNames[i] === undefined){this.zoneNames[i] = `I${this.midiInputId}S${i}`}
      }
    }

    get getZoneRanges(){
      const zoneRanges: ZoneRange[] = []
      zoneRanges.length = 0;
      let newAry = this.keyboardSplits.map((row)=>{return row.splitPosition;})
      

      // Begin and end of keyboard
      newAry.push(8)
      newAry.push(96)

      newAry.sort( (a ,b)=>{
        return  a - b
      })
      //uniq
      newAry = newAry.filter((v, i, a) => a.indexOf(v) === i);
     
      for (let i=0;i<newAry.length - 1; i++){
        zoneRanges.push( new ZoneRange( this.zoneNames[i], newAry[i], newAry[i + 1])) 
      }

      return zoneRanges;
    }


  }
  


  


  export class EasyConfig {
  
     
  
     inputZonesAndRoutes: { [value: string]: InputZonesAndRoutes}= {}
     
     addRoute(intputId: number){
      this.ensureEasyConfigInputExists(intputId);
 
       return this.inputZonesAndRoutes[intputId].addRoute();       
     }

     addKeyboardSplit(intputId: number, splitPosition: number){
       this.ensureEasyConfigInputExists(intputId)
  
        this.inputZonesAndRoutes[intputId].addKeyboardSplit(splitPosition)
     }
  
     ensureEasyConfigInputExists(intputId: number){
      if ( this.inputZonesAndRoutes[intputId] === undefined ){ 
        this.inputZonesAndRoutes[intputId] = new InputZonesAndRoutes(intputId)
       }   
     }
     
   }



   