import {UserDataConfig} from './userDataConfig';

export class LoginStatus {
    isLoggedIn = false
    serverName = ""
    serverPort =  0
    errMsg = ""
    inPorts: string[] = [];
    outPorts: string[] = [];
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

}



