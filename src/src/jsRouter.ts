import { v4 as uuidv4 } from 'uuid'; 
import WebMidi from "webmidi"

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
        if ( this.jsToServers.filter( (row)=>{ return row.fromInt === fromId && row.toInt === toId }).length > 0) {return ;}
        this.jsToServers.push( new  JsToServer(jsToServerType, fromId, toId, fromName, toName) )
    }

    removeJsToServer(uuid: string){
        console.log(this.jsToServers.filter( (row)=>{return row.id !== uuid}).length )
        this.jsToServers = this.jsToServers.filter( (row)=>{return row.id !== uuid})
        console.log(this.jsToServers.filter( (row)=>{return row.id !== uuid}).length )
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
export const jsRouter = new JsRouter();