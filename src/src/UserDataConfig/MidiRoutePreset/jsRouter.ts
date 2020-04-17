import { v4 as uuidv4 } from 'uuid'; 
import WebMidi from "webmidi"

import * as Connection from "../../connection";

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
        
        this.applayChanges()
    }

    removeJsToServer(uuid: string){
        this.jsToServers = this.jsToServers.filter( (row)=>{return row.id !== uuid})
        this.applayChanges()
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

            const serverPort = await Connection.connection.wcmidiout.port( tos.toInt )

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

    doOpen(){
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
