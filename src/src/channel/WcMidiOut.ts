import * as MidiOutConstants from './MidiOutConstants'



class MidiOutPort {
    private portNumber: number;
    // eslint-disable-next-line
    private wcmidioutWs: any;

    // eslint-disable-next-line
    constructor(wcmidioutWs: any, portNumber: number) {
        this.portNumber = portNumber;
        this.wcmidioutWs = wcmidioutWs;
    }

    isPortOpen(): Promise<boolean> {
        return new Promise((resolve) => {
            this.wcmidioutWs.isPortOpen(this.portNumber, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    playNote(notes: string[], channels: number[] = MidiOutConstants.channelAll, velocity = 64) {
        return new Promise((resolve) => {
            this.wcmidioutWs.playNote(this.portNumber, notes, channels, velocity, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    stopNote(notes: string[], channels: number[] = MidiOutConstants.channelAll, velocity = 64) {
        return new Promise((resolve) => {
            this.wcmidioutWs.stopNote(this.portNumber, notes, channels, velocity, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendChannelMode(command: MidiOutConstants.MIDI_CHANNEL_MODE_MESSAGES, value: number, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendChannelMode(this.portNumber, command, value, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }


    sendKeyAftertouch(notes: string[], channels: number[] = MidiOutConstants.channelAll, pressure = 64) {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendKeyAftertouch(this.portNumber, notes, channels, pressure, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendChannelAftertouch(pressure = 64, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendChannelAftertouch(this.portNumber, pressure, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendPitchBend(bend: number, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendPitchBend(this.portNumber, bend, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendPitchBendLsbMsb(lsb: number, msb: number, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendPitchBendLsbMsb(this.portNumber, lsb, msb, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    decrementRegisteredParameter(parameter: MidiOutConstants.MIDI_REGISTERED_PARAMETER, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.decrementRegisteredParameter(this.portNumber, parameter, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    incrementRegisteredParameter(parameter: MidiOutConstants.MIDI_REGISTERED_PARAMETER, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.incrementRegisteredParameter(this.portNumber, parameter, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    setRegisteredParameter(parameter: MidiOutConstants.MIDI_REGISTERED_PARAMETER, data: number[], channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.setRegisteredParameter(this.portNumber, parameter, data, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    setModulationRange(semitones = 0, cents = 0, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.setModulationRange(this.portNumber, semitones, cents, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    setPitchBendRange(semitones = 0, cents = 0, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.setPitchBendRange(this.portNumber, semitones, cents, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendControlChange(controller = 0, value = 0, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendControlChange(this.portNumber, controller, value, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    setNonRegisteredParameter(parameter: number[], data: number[], channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.setNonRegisteredParameter(this.portNumber, parameter, data, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendMessage(message: number[]) {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendMessage(this.portNumber, message, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendActiveSensing() {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendActiveSensing(this.portNumber, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendClock() {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendClock(this.portNumber, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendContinue() {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendContinue(this.portNumber, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendReset() {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendReset(this.portNumber, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendStart() {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendStart(this.portNumber, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendStop() {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendStop(this.portNumber, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendTuningRequest() {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendTuningRequest(this.portNumber, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    //desired decimal adjustment value in semitones (-65 < x < 64)
    setMasterTuning(value = 0, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.setMasterTuning(this.portNumber, value, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendSongPosition(value = 0) {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendSongPosition(this.portNumber, value, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendSongSelect(value = 0) {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendSongSelect(this.portNumber, value, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendTimecodeQuarterFrame(value = 0) {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendTimecodeQuarterFrame(this.portNumber, value, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    setTuningBank(value = 0, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.setTuningBank(this.portNumber, value, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    setTuningProgram(value = 0, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.setTuningProgram(this.portNumber, value, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }
    sendProgramChange(program = 0, channels: number[] = MidiOutConstants.channelAll) {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendProgramChange(this.portNumber, program, channels, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    sendSysex(data: number[]) {
        return new Promise((resolve) => {
            this.wcmidioutWs.sendSysex(this.portNumber, data, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

}

export class WcMidiOut {
    // eslint-disable-next-line
    private wcmidioutWs: any;
    private _cashedOpenedPorts!: {[key: number]: string};

    // eslint-disable-next-line
    constructor(wcmidiout: any) {
        this.wcmidioutWs = wcmidiout;
    }

    open() {
        //connect to the changed signal of a property
        this.wcmidioutWs.msgToClient.connect((str: string) => {
            this._msgToClient(str);
        });
    }

    private _msgToClient(str: string) {
        // eslint-disable-next-line
        console.log("from server:" + str);
    }

    sendMsg(msg: string) {
        this.wcmidioutWs.msgToServer(msg);
    }

    restart(): Promise<void> {
        return new Promise((resolve) => {
            this.wcmidioutWs.restart(() => {
                this._cashedOpenedPorts = [];
                resolve();
            })
        })
    }

    getPortCount(): Promise<number> {
        return new Promise((resolve) => {
            this.wcmidioutWs.getPortCount((arg: number) => {
                resolve(arg);
            })
        })
    }

    getPortName(i: number): Promise<string> {
        return new Promise((resolve) => {
            this.wcmidioutWs.getPortName(i, (arg: string) => {
                resolve(arg);
            })
        });
    }

    getPortNumber(s: string): Promise<number> {
        return new Promise((resolve) => {
            this.wcmidioutWs.getPortNumber(s, (arg: number) => {
                resolve(arg);
            })
        });
    }

    openPort(portNumber: number): Promise<void>  {
        return new Promise((resolve) => {
            this.wcmidioutWs.openPort(portNumber, () => {
                resolve();
            })
        });
    }


    getPorts(): Promise<{[key: number]: string}> {
        return new Promise((resolve) => {
            this.wcmidioutWs.getPorts((arg: string[]) => {
                resolve(arg);
            })
        });
    }

   
    getOpenedPorts(): Promise<{[key: number]: string}> {
        return new Promise((resolve) => {
            this.wcmidioutWs.getOpenedPorts((arg: {[key: number]: string}) => {
                this._cashedOpenedPorts = arg;
                resolve(arg);
            });
        })
    }
    

    openVirtualPort(portName: string): Promise<void>  {
        return new Promise((resolve) => {
            this.wcmidioutWs.openVirtualPort(portName, () => {
                resolve();
            })
        })
    }

    async port(n: number) {
        if (this._isPortCashed(n)) {
            return new MidiOutPort(this.wcmidioutWs, n);
        }

        await this.getOpenedPorts();
        if (this._isPortCashed(n)) {
            return new MidiOutPort(this.wcmidioutWs, n);
        }
        await this.openPort(n);
        await this.getOpenedPorts();
        return new MidiOutPort(this.wcmidioutWs, n);
    }

    private _isPortCashed(n: number): boolean {
        if (this._cashedOpenedPorts) {
            if (Object.keys(this._cashedOpenedPorts).indexOf(n.toString()) > -1) {
                return true;
            }
        }
        return false;
    }



}