import {MidiRouterChain} from "./MidiRouterChain"
import {BaseMidiRouteInput} from "./BaseMidiRouteInput"


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

    inPortsWithoutSelf: BaseMidiRouteInput[] = [];


    constructor(inPorts: string[], midiInputId: number, midiInputName: string){
        super(midiInputId, midiInputName);

        const keys = Object.keys(inPorts);
        keys.forEach(key => {
            if ( parseInt(key) !== midiInputId){
                this.inPortsWithoutSelf.push( new BaseMidiRouteInput( parseInt(key), inPorts[parseInt(key)]))
            }
        })
    }




    addCc14bitAry(channel: number, cc: number){
        this.cc14bitAry.push(new Cc14Bit(channel, cc));
    }

    addMidiRouterChain(name: string){
        this.midiRouterChains.push( new MidiRouterChain(name) )
    }


    addClockPropegateInput(midiIn: number){
        const name = this.inPortsWithoutSelf.filter( (row)=>{return row.midiInputId == midiIn})[0].midiInputName
        const cpi = new BaseMidiRouteInput(midiIn, name)
        this.midiRouteClock.propegateInputs.push( cpi );
    }
}