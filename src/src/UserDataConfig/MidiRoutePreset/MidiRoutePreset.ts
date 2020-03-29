import { UserControl } from "../userControl"
import { EasyConfig, EventTypes, dropdownMidiEventType } from "../Easyconfig"
import { MidiRouteInput } from "./MidiRouteInput"
import { MidiRouterChain } from "./MidiRouterChain"
import { MIDI_FILTER_ACTION_IF_NOT } from "../../channel/WcMidiIn"
import { v4 as uuidv4 } from 'uuid'; 

export enum PresetMidiType {
    PRESET_OFF,
    PRESET_ON
   
}
export class PresetMidiControl {
    presetUuid: string;
    presetMidiType: PresetMidiType;
    port = -1;
    eventTypeId = 0;
    channel = -1;
    data1 = -1;
    data2 = -1;
    

    constructor(presetType: PresetMidiType, presetUuid: string){
        this.presetMidiType = presetType
        this.presetUuid = presetUuid;
    }

    isMidiParamsEqual(other: PresetMidiControl): boolean{
        let _ret = true;
        _ret = _ret && other.presetUuid === this.presetUuid
        _ret = _ret && other.port === this.port
        _ret = _ret && other.eventTypeId === this.eventTypeId
        _ret = _ret && other.channel === this.channel   
        _ret = _ret && other.data1 === this.data1
        _ret = _ret && other.data2 === this.data2
        return _ret;
    }

    getOnOffMidiRouterChains(inputIdx: number): MidiRouterChain[] {
        const ret: MidiRouterChain[] = [];

        if (this.port === -1 ||inputIdx !== this.port) return ret;

        let isAllDefault = true;

        let channelFilter = [[0, 16, 0]]
        if (this.channel !== -1) {
            isAllDefault = false
            channelFilter = [[this.channel]]
        }

        let eventFilter = [[0, 16, 0]]
        if (this.eventTypeId !== 0) {
            isAllDefault = false
            if (this.eventTypeId === 1) {
                eventFilter = [[EventTypes.noteoff], [EventTypes.noteon]]
            }
            else {
                eventFilter = [[dropdownMidiEventType[this.eventTypeId].eventTypes[0]]]
            }
        }

        let data1Filter = [[0,127,0]]
        let data2Filter = [[0,127,0]]

        if (this.data1 !== -1) {
            isAllDefault = false
            data1Filter = [[this.data1]]
        }

        if (this.data2 !== -1) {
            isAllDefault = false
            data2Filter = [[this.data2]]
        }

        const midiRouterChain = new MidiRouterChain("Easyconfig - Preset log");
        midiRouterChain.isEasyConfig = true   

        if (!isAllDefault){
            midiRouterChain.addFilterFilterAndTransform("EasyConfig",MIDI_FILTER_ACTION_IF_NOT.DELETE_IF_NOT,
                        JSON.stringify(channelFilter),
                        JSON.stringify(eventFilter),
                        JSON.stringify(data1Filter),
                        JSON.stringify(data2Filter)) 
          }

          midiRouterChain.addFilterToConsle(0, {action: "presetOnOff",data:JSON.stringify(this)});
          ret.push( midiRouterChain )
        return ret
    }

}

export class MidiRoutePreset {
    name: string;
    uuid = uuidv4();
    midiControlOn: PresetMidiControl = new PresetMidiControl(PresetMidiType.PRESET_ON, this.uuid)
    midiControlOff: PresetMidiControl = new PresetMidiControl(PresetMidiType.PRESET_OFF, this.uuid)

    midiRouteInputs: MidiRouteInput[] = []

    userControls: UserControl[] = []
    easyConfig = new EasyConfig();

    isEnabled = false;

    

    constructor(name: string) {
        this.name = name;
    }
    setVal(name: string, midiControlOn: PresetMidiControl, midiControlOff: PresetMidiControl) {
        this.name = name;
        this.midiControlOn = midiControlOn;
        this.midiControlOff = midiControlOff;
        this.midiControlOn.presetUuid = this.uuid;
        this.midiControlOff.presetUuid = this.uuid;
    }

    addUserControl() {
        this.userControls.push(new UserControl())
    }



}

