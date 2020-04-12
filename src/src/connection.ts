import {Channel} from './channel/Channel';
import {UserDataConfig} from './userDataConfig';
import {LoginStatus} from './loginStatus'
import store from '../store'


export let loginStatus: LoginStatus = new LoginStatus("localhost",12345);


class AppChannel extends Channel {
    // eslint-disable-next-line
    userDataJsonChanged(obj: any){
        //console.log("from server json changed:")
        //console.log(obj);

        if (loginStatus.userDataConfig.uniqueId !== obj.uniqueId){
            store.commit('setLoginStatusRedirect', false);
        }
    }


    _onclose(){        
        store.commit('setLoginStatusRedirect', false);
    }
}


export let connection: AppChannel;



export async function login(serverName: string, port: number){
    loginStatus = new LoginStatus(serverName, port);
    connection = new AppChannel(serverName, port);
    try {
        await connection.open();
        loginStatus.isLoggedIn = true;
        loginStatus.inPorts = await connection.wcmidiin.getPorts();
        loginStatus.outPorts = await connection.wcmidiout.getPorts();
        
        const jsonData = await connection.wcuserdata.getJon();
        await loginStatus.resetUserDataConfig(jsonData);
    } catch(e){
        loginStatus.isLoggedIn = false;
        loginStatus.errMsg =  "Could not connect";
        throw(e);
    }
    return loginStatus;
}

export async function loginNoSingleTon(serverName: string, port: number){
    const l = new LoginStatus(serverName, port);
    const ac = new AppChannel(serverName, port);
    try {
        await ac.open();
        l.isLoggedIn = true;
        l.inPorts = await ac.wcmidiin.getPorts();
        l.outPorts = await ac.wcmidiout.getPorts();
        l.userDataConfig = new UserDataConfig(l.inPorts );
    } catch(e){
        l.isLoggedIn = false;
        l.errMsg =  "Could not connect";
    }
    return l;
}