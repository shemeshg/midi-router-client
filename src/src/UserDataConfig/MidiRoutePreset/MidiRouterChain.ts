import * as MRF from "./MidiRoutersFilter"
import {BaseMidiRouteInput} from "./BaseMidiRouteInput"
import {ToConsoleUserdata} from "src/src/UserDataConfig/MidiRoutePreset/ToConsoleUserdata"

export class MidiRouterChain {
    name: string;
    midiRoutersFilters: MRF.MidiRoutersFilter[] = []
    isEasyConfig = false
    constructor(name: string){
        this.name = name;
    }


    getFilterMidiDestination(idx: number): MRF.FilterMidiDestination{
        // eslint-disable-next-line
        const  i: any = this.midiRoutersFilters[idx];
        return i;
    }

    getFilterToConsle(idx: number): MRF.FilterToConsle{
        // eslint-disable-next-line
        const  i: any = this.midiRoutersFilters[idx];
        return i;
    }

    getFilterFilterAndTransform(idx: number): MRF.FilterAndTransform{
        // eslint-disable-next-line
        const  i: any = this.midiRoutersFilters[idx];
        return i;
    }

    getFilterNetworkDestination(idx: number): MRF.FilterNetworkDestination{
        // eslint-disable-next-line
        const  i: any = this.midiRoutersFilters[idx];
        return i;
    }

    getFilterSchedule(idx: number): MRF.FilterSchedule{
        // eslint-disable-next-line
        const  i: any = this.midiRoutersFilters[idx];
        return i;
    }

    addFilterMidiDestination( baseMidiRouteInput: BaseMidiRouteInput ){
        this.midiRoutersFilters.push( new MRF.FilterMidiDestination(baseMidiRouteInput) );
    }

    addFilterToConsle(logTo: number, userdata: ToConsoleUserdata){
        this.midiRoutersFilters.push( new MRF.FilterToConsle(logTo, userdata ));
    }

    addFilterNetworkDestination(serverName: string, serverPort: number,  baseMidiRouteInput: BaseMidiRouteInput){
        this.midiRoutersFilters.push( new MRF.FilterNetworkDestination(serverName, serverPort, baseMidiRouteInput) );
    }

    addFilterSchedule(defferedType: number, defferedTo: number){
        this.midiRoutersFilters.push( new MRF.FilterSchedule(defferedType, defferedTo) );
    }

    addFilterFilterAndTransform(description: string, conditionAction: number, filterChannel: string, filterEvents: string, filterData1: string, filterData2: string ){
        this.midiRoutersFilters.push( new MRF.FilterAndTransform(description, conditionAction, filterChannel, filterEvents, filterData1, filterData2) );
    }
}
