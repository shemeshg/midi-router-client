import {UserControl} from "../userControl"
import { EasyConfig } from "../Easyconfig"
import {MidiRouteInput} from "./MidiRouteInput"

export class MidiRoutePreset{
    name: string;
    midiRouteInputs: MidiRouteInput[] = []

    userControls: UserControl[] = []
    easyConfig = new EasyConfig();

    isEnabled = false;


    constructor(name: string){
        this.name = name;
    }
    setVal(name: string){
        this.name = name;
    }

    addUserControl(){
        this.userControls.push(new UserControl())
    }


}

