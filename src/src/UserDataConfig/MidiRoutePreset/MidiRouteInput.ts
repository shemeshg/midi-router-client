import {MidiRouterChain} from "./MidiRouterChain"
import {BaseMidiRouteInput} from "./BaseMidiRouteInput"
import * as Connection from "../../connection"

export class MidiRouteClock {
    timeSig = 4
    timeSigDivBy = 4 
    fromSppPos = 0
    propegateInputs: BaseMidiRouteInput[] = []

}

export class Cc14Bit {
    channel: number;
    cc: number;
    constructor(channel: number, cc: number){
        this.channel = channel;
        this.cc = cc;
    }
}





export class MidiRouteInput extends BaseMidiRouteInput{

    ignoreTypes = {midiSysex: true, midiTime: true, midiSense: true};
    midiRouteClock = new MidiRouteClock;
    cc14bitAry: Cc14Bit[] = [];
    midiRouterChains: MidiRouterChain[] = [];

    get inPortsWithoutSelf(): BaseMidiRouteInput[] {
        const ret: BaseMidiRouteInput[] = []
        const inPorts = Connection.loginStatus.inPorts
        const keys = Object.keys(inPorts);
        keys.forEach(key => {
            if ( parseInt(key) !== this.midiInputId){
                ret.push( new BaseMidiRouteInput( parseInt(key), inPorts[parseInt(key)]))
            }
        })
        return ret;
    }


    constructor(midiInputId: number, midiInputName: string){
        super(midiInputId, midiInputName);


    }




    addCc14bitAry(channel: number, cc: number){
        this.cc14bitAry.push(new Cc14Bit(channel, cc));
    }

    addMidiRouterChain(name: string){
        const chain = new MidiRouterChain(name) 
        this.midiRouterChains.push( chain )
        return chain
    }


    addClockPropegateInput(midiIn: number){
        const name = this.inPortsWithoutSelf.filter( (row)=>{return row.midiInputId == midiIn})[0].midiInputName
        const cpi = new BaseMidiRouteInput(midiIn, name)
        this.midiRouteClock.propegateInputs.push( cpi );
    }
}