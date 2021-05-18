import { v4 as uuidv4 } from 'uuid'; 
import WebMidi from "webmidi"

import * as Connection from "../../connection";
import { MidiRouterChain } from "./MidiRouterChain"
import { ToConsoleUserdata } from './ToConsoleUserdata'

export enum JS_TO_SERVER_TYPE {
    TO_SERVER,
    FROM_SERVER
}

class JsToServer {
    id = uuidv4();
    jsToServerType: JS_TO_SERVER_TYPE;
    fromInt: number;
    toInt: number;
    fromName: string;
    toName: string;
    computerUuid = Connection.loginStatus.userDataConfig.computerUuid
    constructor( jsToServerType: JS_TO_SERVER_TYPE, fromId: number, toId: number, fromName: string, toName: string){
        this.jsToServerType = jsToServerType
        this.fromInt = fromId;
        this.toInt = toId;
        this.fromName = fromName;
        this.toName = toName;        
    }


}

export class JsRouter {
    jsToServers: JsToServer[] = [];

     addJsServer( jsToServerType: JS_TO_SERVER_TYPE, fromId: number, toId: number, fromName: string, toName: string){
        if ( this.jsToServers.filter( (row)=>{ return row.fromInt === fromId && row.toInt === toId &&
                                                    row.computerUuid === Connection.loginStatus.userDataConfig.computerUuid}).length > 0) {return ;}
        this.jsToServers.push( new  JsToServer(jsToServerType, fromId, toId, fromName, toName) )
        
    }

    removeJsToServer(uuid: string){
        this.jsToServers = this.jsToServers.filter( (row)=>{return row.id !== uuid})
    }

    getMidiRouterChains(inputName: string): MidiRouterChain[] {
        const ret: MidiRouterChain[] = [];        

        const routeFromServer = this.jsToServers.filter( (row)=>{return row.jsToServerType === JS_TO_SERVER_TYPE.FROM_SERVER &&
                                            row.fromName === inputName})
        // the bullshit to correctn
        if (routeFromServer.length === 0 ) return ret;

        const midiRouterChain = new MidiRouterChain("Easyconfig - Preset log");
        midiRouterChain.isEasyConfig = true   

        midiRouterChain.addFilterToConsle(0, {action: "jsRoute",data:JSON.stringify(routeFromServer)});
        ret.push( midiRouterChain )
      
        return ret
    }

    async parseClientEvent(str: string) {
        const userData: ToConsoleUserdata = JSON.parse( JSON.parse(str).userdata )
        if (userData.action === "jsRoute"){  
            // eslint-disable-next-line          
            const data: JsToServer[] = JSON.parse( userData.data! )
            const clientData = data.filter( ( row )=>{ return row.computerUuid === Connection.loginStatus.userDataConfig.computerUuid})
            if (clientData.length === 0){return;}
            const ints = clientData.map( (row)=>{ return row.toInt})
            for (let i = 0; i<ints.length; i++){
                /* eslint-disable */ 
                const int: any = WebMidi.getOutputById(ints[i].toString());
                const midiData: number[] = JSON.parse(str).data
                int.send (midiData[0], midiData.slice(1))                                           
            }
 
        }
    }


    async applayChanges(){
        WebMidi.inputs.forEach ( (i)=>{
            i.removeListener();
        })

        const toServer = this.jsToServers.filter( (row)=>{return row.jsToServerType === JS_TO_SERVER_TYPE.TO_SERVER &&
            row.computerUuid === Connection.loginStatus.userDataConfig.computerUuid})

        for (let i=0;i<toServer.length;i++){
            const tos = toServer[i]
            // eslint-disable-next-line
            const int: any = WebMidi.getInputById(tos.fromInt.toString());

            const toInt = Connection.loginStatus.getMidiOutputIdByName(tos.toName)
            const serverPort = await Connection.connection.wcmidiout.port( toInt )

            // eslint-disable-next-line
            int.addListener("midimessage","all",(m: any)=>{  
                const msg: number[] = []
                for (let ic=0; ic<m.data.length;ic++){
                    msg.push( m.data[ic] )
                }              
                serverPort.sendMessage(msg)                
            })
        }
    }

    get inPorts(){
        return WebMidi.inputs.map( (r)=>{return {id: Number(r.id), name: r.name}})       
    }

    get outPorts(){
        return WebMidi.outputs.map( (r)=>{return {id: Number(r.id), name: r.name}})  
    }

    doOpen(): Promise<void> {
        return new Promise( (resolve, reject)=>{
            if (WebMidi.enabled) {
                resolve()
                return;
            }

            WebMidi.enable((err)=>{
                if (err) {
                    reject(err)
                }
                resolve()
                return;
            })

        });
    }
}
