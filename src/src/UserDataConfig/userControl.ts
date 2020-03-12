import * as Connection from "../connection";

export enum EventType {
    CC,
    PROGRAM_CHANGE
}

export const eventTypes = [
{id: EventType.CC, name: "CC"},
{id: EventType.PROGRAM_CHANGE, name: "Program Change"} ]

export class UserControl {
    eventType: EventType = EventType.CC;
    description = "Description"
    inputVal = "0"
    minVal = "0"
    maxVal = "127"
    is64Mode = false
    isEditMode = true
    channelId = "1"
    ccId = "7"
    outputPortId = ""
    isShowDropdown = false
    dropDownDecriptions = ""



    async doSend(){
        if (this.outputPortId === ""){return;}
        const port = await Connection.connection.wcmidiout.port(parseInt( this.outputPortId ))
        if (this.eventType === EventType.CC){
            await port.sendControlChange(parseInt(this.ccId),parseInt(this.inputVal),[parseInt(this.channelId)])
        }
        if (this.eventType === EventType.PROGRAM_CHANGE){
            await port.sendProgramChange(parseInt(this.inputVal),[parseInt(this.channelId)])
        }        
    }
}