import {UserDataConfig} from './userDataConfig';

export class LoginStatus {
    isLoggedIn = false
    serverName = ""
    serverPort =  0
    errMsg = ""
    inPorts: {[key: number]: string} = {};
    outPorts: {[key: number]: string} = {};
    userDataConfig!: UserDataConfig;
    constructor(serverName: string, serverPort: number){
        this.serverName = serverName;
        this.serverPort = serverPort;
    }

    // eslint-disable-next-line
    resetUserDataConfig(str: any){
        this.userDataConfig = new UserDataConfig(this.inPorts );
        try {
            this.userDataConfig.setChanges(str);
        } catch(err) {
            // eslint-disable-next-line
            console.error(err);
            throw (err)
        }
    }

    getMidiInputIdByName(midiInputName: string): number{
        const keys = Object.keys(this.inPorts);
        let _ret = -1
        keys.forEach( (el: string) => {
            if (this.inPorts[ Number( el) ] === midiInputName){
                _ret = Number(el);
            } 
        });
        return _ret;
    }

    getMidiOutputIdByName(midiOutputName: string): number{
        const keys = Object.keys(this.inPorts);
        let _ret = -1
        keys.forEach( (el: string) => {
            if (this.inPorts[ Number( el) ] === midiOutputName){
                _ret = Number(el);
            } 
        });
        return _ret;
    }    
}



