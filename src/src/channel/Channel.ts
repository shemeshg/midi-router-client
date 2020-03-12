import {QWebChannel} from 'qwebchannel'
import {WcMidiOut} from './WcMidiOut'
import {WcMidiIn} from './WcMidiIn'
import {WcUserData} from './WcUserdata'






export class Channel{
    private wsUri: string;
    private socket!: WebSocket;
    private channel!: QWebChannel;
    
    
    wcmidiout!: WcMidiOut;
    wcmidiin!: WcMidiIn;
    wcuserdata!: WcUserData;
    
    constructor (ipAddress = "localhost", port = 12345){
        this.wsUri  = `ws://${ipAddress}:${port}`;
    }

    open(): Promise<void>{
        this.socket = new WebSocket(this.wsUri);
        return new Promise<void>( (resolve, reject)=>{
            this.socket.onclose = ()=> {
                return this._onclose();
            };
            this.socket.onerror = (error) =>{
                reject(error);
                return this._onerror(error);                
            };
            
            this.socket.onopen = ()=>{
                this.channel  = new QWebChannel(this.socket, () => { 
                    this.wcmidiout = new WcMidiOut(this.channel.objects.wcmidiout);
                    this.wcmidiout.open();
                    this.wcmidiin = new WcMidiIn(this.channel.objects.wcmidiin);
                    this.wcmidiin.open();                    
                    this.wcuserdata = new WcUserData(this.channel.objects.wcuserdata, this);
                    this.wcuserdata.open();
                    resolve();            
                })
                
            }   
        });
      
    }


    close(){
        this.socket.close();
    }




     _onclose(){
         // eslint-disable-next-line
        console.error("web channel closed");
    }

    private _onerror(error: Event){
        // eslint-disable-next-line
        console.error("web channel error: " + error);
    }


    // eslint-disable-next-line
    userDataJsonChanged(obj:any){
        /*
        console.log("from server:")
        console.log(obj);
        */
    }

}


/*

g.open()
g.wcmidiin.port(1).then((p)=>{window.p = p})
p.ignoreTypes(false,false,false)
p.clearRoutingMidiChains()
p.routingMidiChainsAaddChain().then( (c) => {window.c  = c})
c.routingActionAddDeferedEvent(1,1)
c.routingActionAddLogData(1)

g.open()
g.wcmidiin.port(2).then((p)=>{window.p = p})
p.routingMidiChainsReset()
p.routingMidiChainsAaddChain().then( (c) => {window.c  = c})
c.outingActionAddSendRemoteServer("127.0.0.1", 12345, 1) 
//c.routingActionAddSendPortByName("IAC Driver Bus 1")


let g = new Channel();
g.open()
g.wcmidiin.port(2).then((p)=>{
    return p.routingMidiChainsAaddChain();
}).then(p=>{
    p.routingActionAddSendPortByName("IAC Driver Bus 1")
})
*/
