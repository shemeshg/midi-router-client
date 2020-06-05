import * as Connection from "../../../src/connection";

export class BaseMidiRouteInput {
    get midiInputId(): number{
        return Connection.loginStatus.getMidiInputIdByName(this.midiInputName)
    }
    midiInputName: string;
    constructor(midiInputName: string){
        this.midiInputName = midiInputName;
    }
}