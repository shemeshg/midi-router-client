import {BaseMidiRouteInput} from "./BaseMidiRouteInput"

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
    userdata: string;
    constructor(logTo: number, userdata: string){
        super(FilterType.TO_CONSOLE);
        this.logTo = logTo;
        const d = ["Client","Server"]
        this.name = "Log to " + d[logTo];
        this.userdata = userdata;
    }

    setVal(logTo: number, userdata: string){
        this.logTo = logTo;
        const d = ["Client","Server"]
        this.name = "Log to " + d[logTo];  
        this.userdata = userdata;   
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
