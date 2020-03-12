import {UserControl} from "./userControl"

export class MidiRoutePreset{
    name: string;
    midiRouteInputs: MidiRouteInput[] = []

    userControls: UserControl[] = []

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

export class BaseMidiRouteInput {
    midiInputId: number;
    midiInputName: string;
    constructor(midiInputId: number, midiInputName: string){
        this.midiInputId = midiInputId;
        this.midiInputName = midiInputName;
    }
}

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

export enum FilterType {
    TO_MIDI_DESTINATION,
    TO_CONSOLE,
    TO_NETWORK,
    SCHEDULE_TO,
    FILTER_AND_TRANSFORM
}

export class MidiRoutersFilter {
    filterType: FilterType
    //filterObject!: FilterMidiDestination|FilterToConsle|FilterNetworkDestination|FilterSchedule|FilterAndTransform; //String here is just for testing
    name = "";
    constructor(filterType: FilterType){
        this.filterType = filterType;
    }    
}

export class FilterToConsle extends MidiRoutersFilter {
    logTo: number;
    constructor(logTo: number){
        super(FilterType.TO_CONSOLE);
        this.logTo = logTo;
        const d = ["Client","Server"]
        this.name = "Log to " + d[logTo];
    }

    setVal(logTo: number){
        this.logTo = logTo;
        const d = ["Client","Server"]
        this.name = "Log to " + d[logTo];     
    }
}


export class FilterSchedule extends MidiRoutersFilter {
    defferedType: number;
    defferedTo: number;
    readonly d = ["In SPP","In bar","At SPP, At bar", "Quantize SPP", "Quantize bar"]
    constructor(defferedType: number,defferedTo: number ){
        super(FilterType.SCHEDULE_TO);
        this.defferedType = defferedType;
        this.defferedTo = defferedTo;
        
        this.name = `Schedule ${this.d[defferedType]} ${defferedTo}`;
    }

    setVal(defferedType: number,defferedTo: number ){
        this.defferedType = defferedType;
        this.defferedTo = defferedTo;
        
        this.name = `Schedule ${this.d[defferedType]} ${defferedTo}`;
    }
}

export class FilterMidiDestination extends MidiRoutersFilter {
    baseMidiRouteInput: BaseMidiRouteInput;
    constructor(baseMidiRouteInput: BaseMidiRouteInput){
        super(FilterType.TO_MIDI_DESTINATION)
        //this.filterObject = this;
        this.baseMidiRouteInput = baseMidiRouteInput;
        this.name = `To midi ${baseMidiRouteInput.midiInputId}-${baseMidiRouteInput.midiInputName}`;
    }

    setVal(baseMidiRouteInput: BaseMidiRouteInput){
        this.baseMidiRouteInput = baseMidiRouteInput;
        this.name = `To midi ${baseMidiRouteInput.midiInputId}-${baseMidiRouteInput.midiInputName}`;        
    }
}

export class FilterNetworkDestination extends MidiRoutersFilter {
    baseMidiRouteInput: BaseMidiRouteInput;
    serverName: string;
    serverPort: number;
    constructor(serverName: string, serverPort: number,  baseMidiRouteInput: BaseMidiRouteInput){
        super(FilterType.TO_NETWORK)
        this.baseMidiRouteInput = baseMidiRouteInput;
        this.serverName = serverName;
        this.serverPort = serverPort;
        this.name = `To ${serverName}:${serverPort} ${baseMidiRouteInput.midiInputId}-${baseMidiRouteInput.midiInputName}`;
    }

    setVal(serverName: string, serverPort: number,  baseMidiRouteInput: BaseMidiRouteInput){
        this.baseMidiRouteInput = baseMidiRouteInput;
        this.serverName = serverName;
        this.serverPort = serverPort;
        this.name = `To ${serverName}:${serverPort} ${baseMidiRouteInput.midiInputId}-${baseMidiRouteInput.midiInputName}`;        
    }
}

export class FilterAndTransform extends MidiRoutersFilter {    
    conditionAction: number;
    filterChannel: string;
    filterEvents: string; 
    filterData1: string;
    filterData2: string;
    constructor(description: string, conditionAction: number, filterChannel: string, filterEvents: string, filterData1: string, filterData2: string){
        super(FilterType.FILTER_AND_TRANSFORM);
        this.name = description;
        this.conditionAction = conditionAction;
        this.filterChannel = filterChannel;
        this.filterEvents = filterEvents;
        this.filterData1 = filterData1;
        this.filterData2 = filterData2;
    }

    setVal(description: string, conditionAction: number, filterChannel: string, filterEvents: string, filterData1: string, filterData2: string){
        this.name = description;
        this.conditionAction = conditionAction;
        this.filterChannel = filterChannel;
        this.filterEvents = filterEvents;
        this.filterData1 = filterData1;
        this.filterData2 = filterData2;        
    }
}

export class MidiRouterChain {
    name: string;
    midiRoutersFilters: MidiRoutersFilter[] = []
    isEasyConfig = false
    constructor(name: string){
        this.name = name;
    }


    getFilterMidiDestination(idx: number): FilterMidiDestination{
        // eslint-disable-next-line
        const  i: any = this.midiRoutersFilters[idx];
        return i;
    }

    getFilterToConsle(idx: number): FilterToConsle{
        // eslint-disable-next-line
        const  i: any = this.midiRoutersFilters[idx];
        return i;
    }

    getFilterFilterAndTransform(idx: number): FilterAndTransform{
        // eslint-disable-next-line
        const  i: any = this.midiRoutersFilters[idx];
        return i;
    }

    getFilterNetworkDestination(idx: number): FilterNetworkDestination{
        // eslint-disable-next-line
        const  i: any = this.midiRoutersFilters[idx];
        return i;
    }

    getFilterSchedule(idx: number): FilterSchedule{
        // eslint-disable-next-line
        const  i: any = this.midiRoutersFilters[idx];
        return i;
    }

    addFilterMidiDestination( baseMidiRouteInput: BaseMidiRouteInput ){
        this.midiRoutersFilters.push( new FilterMidiDestination(baseMidiRouteInput) );
    }

    addFilterToConsle(logTo: number){
        this.midiRoutersFilters.push( new FilterToConsle(logTo) );
    }

    addFilterNetworkDestination(serverName: string, serverPort: number,  baseMidiRouteInput: BaseMidiRouteInput){
        this.midiRoutersFilters.push( new FilterNetworkDestination(serverName, serverPort, baseMidiRouteInput) );
    }

    addFilterSchedule(defferedType: number, defferedTo: number){
        this.midiRoutersFilters.push( new FilterSchedule(defferedType, defferedTo) );
    }

    addFilterFilterAndTransform(description: string, conditionAction: number, filterChannel: string, filterEvents: string, filterData1: string, filterData2: string ){
        this.midiRoutersFilters.push( new FilterAndTransform(description, conditionAction, filterChannel, filterEvents, filterData1, filterData2) );
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