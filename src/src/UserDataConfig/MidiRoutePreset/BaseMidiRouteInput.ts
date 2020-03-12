export class BaseMidiRouteInput {
    midiInputId: number;
    midiInputName: string;
    constructor(midiInputId: number, midiInputName: string){
        this.midiInputId = midiInputId;
        this.midiInputName = midiInputName;
    }
}