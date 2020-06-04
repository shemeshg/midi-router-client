import store from '../../store'
import {ToConsoleUserdata} from "src/src/UserDataConfig/MidiRoutePreset/ToConsoleUserdata"


export enum LOG_TO {
    CLIENT,
    SERVER
}

export enum DEFFERED_EVENT_TYPE{
    IN_SPP,
    IN_BAR,
    AT_SPP,
    AT_BAR,
    QUANTIZE_SPP,
    QUANTIZE_BAR
}

export enum MIDI_FILTER_ACTION_IF_NOT {
    DO_NOT_DELETE,
    DELETE_IF_NOT,
    DELETE_IF_IS
}

type _RangeOfRangeMap = number[];
export class RangeMap {
    val: _RangeOfRangeMap[] = [];

    // eslint-disable-next-line
    addValues(fromStart: number, fromEnd?: number, toStart?: number, toEnd?: number) {
        // eslint-disable-next-line
        let ary: _RangeOfRangeMap = [];
        // eslint-disable-next-line
        for (let i = 0; i < arguments.length; i++) {
            // eslint-disable-next-line
            if (typeof arguments[i] === 'undefined') {
                // eslint-disable-next-line
                ary.push(arguments[i]);
            }
        }
        this.val.push(ary);
    }
}

class RoutingMidiChain {
    private portNumber: number;
    // eslint-disable-next-line
    private wcmidiinWs: any;
    private chainId: number;

    // eslint-disable-next-line
    constructor(wcmidioutWs: any, portNumber: number, chainId: number) {
        this.portNumber = portNumber;
        this.wcmidiinWs = wcmidioutWs;
        this.chainId = chainId;
    }


    routingActionAddSendPortByName(portName: string) {
        return new Promise((resolve) => {
            this.wcmidiinWs.routingActionAddSendPortByName(this.portNumber, this.chainId, portName, (arg: number) => {
                resolve(arg);
            })
        })
    }

    routingActionAddSendPortByNumber(portNumberOut: number) {
        return new Promise((resolve) => {
            this.wcmidiinWs.routingActionAddSendPortByNumber(this.portNumber, this.chainId, portNumberOut, (arg: number) => {
                resolve(arg);
            })
        })
    }

    routingActionAddSendRemoteServer(serverName: string, serverPort: number, remoteMidiPortNumber: number) {
        return new Promise((resolve) => {
            this.wcmidiinWs.routingActionAddSendRemoteServer(this.portNumber, this.chainId, serverName, serverPort, remoteMidiPortNumber, (arg: number) => {
                resolve(arg);
            })
        })
    }

    routingActionAddLogData(logto: LOG_TO, userdata: ToConsoleUserdata) {
        return new Promise((resolve) => {
            this.wcmidiinWs.routingActionAddLogData(this.portNumber, this.chainId, logto, JSON.stringify(userdata), (arg: number) => {
                resolve(arg);
            })
        })
    }

    routingActionAddDeferedEvent(defferedEventType: DEFFERED_EVENT_TYPE, defferedTo: number) {
        return new Promise((resolve) => {
            this.wcmidiinWs.routingActionAddDeferedEvent(this.portNumber, this.chainId, defferedEventType, defferedTo , (arg: number) => {
                resolve(arg);
            })
        })
    }    

    routingActionAddFilterMidiChannelMsg(channels: RangeMap, eventTypes: RangeMap, data1: RangeMap, data2: RangeMap,
        midiFilterActionIfNot: MIDI_FILTER_ACTION_IF_NOT) {
        return new Promise((resolve) => {
            this.wcmidiinWs.routingActionAddFilterMidiChannelMsg(this.portNumber, this.chainId,
                channels.val, eventTypes.val, data1.val, data2.val, midiFilterActionIfNot, (arg: number) => {
                    resolve(arg);
                })
        })
    }

}


class MidiInPort {
    private portNumber: number;
    // eslint-disable-next-line
    private wcmidiinWs: any;

    routingMidiChains: RoutingMidiChain[] = [];

    // eslint-disable-next-line
    constructor(wcmidioutWs: any, portNumber: number) {
        this.portNumber = portNumber;
        this.wcmidiinWs = wcmidioutWs;
    }

    isPortOpen(): Promise<boolean> {
        return new Promise((resolve) => {
            this.wcmidiinWs.isPortOpen(this.portNumber, (arg: boolean) => {
                resolve(arg);
            })
        })
    }

    ignoreTypes(midiSysex = true, midiTime = true, midiSense = true) {
        return new Promise((resolve) => {
            this.wcmidiinWs.ignoreTypes(this.portNumber, midiSysex, midiTime, midiSense, () => {
                resolve();
            })
        })
    }

    addCc14Bit(channel: number, cc: number) {
        return new Promise((resolve) => {
            this.wcmidiinWs.addCc14Bit(this.portNumber, channel, cc, () => {
                resolve();
            })
        })
    }




    addPropegateClockPort(portNumberToPropegate: number) {
        return new Promise((resolve) => {
            this.wcmidiinWs.addCc14Bit(this.portNumber, portNumberToPropegate,  () => {
                resolve();
            })
        })
    }

    /* // Use clearRoutingMidiChains
    clearPropegateClockPort(channel:number, cc:number) {
        return new Promise((resolve) => {
            this.wcmidiinWs.clearPropegateClockPort(this.portNumber, (arg: any) => {
                resolve(arg);
            })
        })
    }

    clearCc14Bit(channel:number, cc:number) {
        return new Promise((resolve) => {
            this.wcmidiinWs.clearCc14Bit(this.portNumber, (arg: any) => {
                resolve(arg);
            })
    })
    }
    */



    clearRoutingMidiChains() {
        return new Promise((resolve) => {
            this.wcmidiinWs.clearRoutingMidiChains(this.portNumber, () => {
                this.routingMidiChains.length = 0;
                resolve();
            })
        })
    }
    
    setTimeSig(timeSig=4, timeSigDivBy=4, fromSppPos=0) {
        return new Promise((resolve) => {
            this.wcmidiinWs.setTimeSig(this.portNumber, timeSig, timeSigDivBy, fromSppPos,  () => {
                resolve();
            })
        })
    }

    routingMidiChainsAaddChain(): Promise<RoutingMidiChain> {
        return new Promise((resolve) => {
            this.wcmidiinWs.routingMidiChainsAaddChain(this.portNumber, (chainId: number) => {
                const rmc = new RoutingMidiChain(this.wcmidiinWs, this.portNumber, chainId);
                this.routingMidiChains.push(rmc)
                resolve(rmc);
            })
        })
    }
}

export class WcMidiIn {
    // eslint-disable-next-line
    private wcmidiinWs: any;
    private _cashedOpenedPorts!: {[key: number]: string};

    // eslint-disable-next-line
    constructor(wcmidiout: any) {
        this.wcmidiinWs = wcmidiout;
    }

    open() {
        //connect to the changed signal of a property
        this.wcmidiinWs.msgToClient.connect((str: string) => {
            this._msgToClient(str);
        });
        this.wcmidiinWs.dataToClient.connect((str: string) => {
            this._dataToClient(str);
        });
    }

    private _msgToClient(str: string) {
        // eslint-disable-next-line
        console.log("from server:" + str)
    }


    private _dataToClient(str: string) {
        store.commit("setDataToClient", str)
    }

    sendMsg(msg: string) {
        this.wcmidiinWs.msgToServer(msg);
    }



    restart(): Promise<void> {
        return new Promise((resolve) => {
            this.wcmidiinWs.restart(() => {
                this._cashedOpenedPorts = []
                resolve();
            })
        })
    }


    getPortCount(): Promise<number> {
        return new Promise((resolve) => {
            this.wcmidiinWs.getPortCount((arg: number) => {
                resolve(arg);
            })
        })
    }

    getPortName(i: number): Promise<string> {
        return new Promise((resolve) => {
            this.wcmidiinWs.getPortName(i, (arg: string) => {
                resolve(arg);
            })
        })
    }

    getPortNumber(s: string): Promise<number> {
        return new Promise((resolve) => {
            this.wcmidiinWs.getPortNumber(s, (arg: number) => {
                resolve(arg);
            })
        })
    }




    openPort(portNumber: number) {
        return new Promise((resolve) => {
            this.wcmidiinWs.openPort(portNumber, () => {
                resolve();
            })
        })
    }

    getPorts(): Promise<{[key: number]: string}> {  
        return new Promise((resolve) => {
            this.wcmidiinWs.getPorts((arg: string[]) => {
                resolve(arg);
            })
        })
    }

    getOpenedPorts(): Promise<{[key: number]: string}> {
        return new Promise((resolve) => {
            this.wcmidiinWs.getOpenedPorts((arg: {[key: number]: string}) => {
                this._cashedOpenedPorts = arg;
                resolve(arg);
            })
        })
    }



    openVirtualInOutPort(portName: string): Promise<void> {
        return new Promise((resolve) => {
            this.wcmidiinWs.openVirtualInOutPort(portName, () => {
                resolve();
            })
        })
    }


    openVirtualPort(portName: string) {
        return new Promise((resolve) => {
            this.wcmidiinWs.openVirtualPort(portName, () => {
                resolve();
            })
        })
    }

    async port(n: number) {
        if (this._isPortCashed(n)) {
            return new MidiInPort(this.wcmidiinWs, n);
        }

        await this.getOpenedPorts();
        if (this._isPortCashed(n)) {
            return new MidiInPort(this.wcmidiinWs, n);
        }
        await this.openPort(n);
        await this.getOpenedPorts();
        return new MidiInPort(this.wcmidiinWs, n);
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