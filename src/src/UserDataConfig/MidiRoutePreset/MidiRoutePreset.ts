import {UserControl} from "../userControl"
import { EasyConfig } from "../Easyconfig"
import {MidiRouteInput} from "./MidiRouteInput"

export class PresetMidiControl {
    port = -1;
    eventTypeId = 0;
    channel = -1;
    data1 = -1;
    data2 = -1;
}

export class MidiRoutePreset{
    name: string;
    midiControlOn: PresetMidiControl = new PresetMidiControl()
    midiControlOff: PresetMidiControl = new PresetMidiControl()

    midiRouteInputs: MidiRouteInput[] = []

    userControls: UserControl[] = []
    easyConfig = new EasyConfig();

    isEnabled = false;



    constructor(name: string){
        this.name = name;
    }
    setVal(name: string, midiControlOn: PresetMidiControl, midiControlOff: PresetMidiControl){
        this.name = name;
        this.midiControlOn = midiControlOn;
        this.midiControlOff = midiControlOff;
    }

    addUserControl(){
        this.userControls.push(new UserControl())
    }


}

