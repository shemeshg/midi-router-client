import {Channel} from './Channel'

export class WcUserData {
    // eslint-disable-next-line
    private wcuserdataWs: any;
    private channel: Channel;

    // eslint-disable-next-line
    constructor(wcuserdata: any, channel: Channel) {
        this.wcuserdataWs = wcuserdata;
        this.channel = channel;
    }

    open() {
        // eslint-disable-next-line
        this.wcuserdataWs.userDataChanges.connect((obj: any) => {
            this._msgUserDataChanges(obj);
        });
    }

    // eslint-disable-next-line
    private _msgUserDataChanges(obj: any) {
        this.channel.userDataJsonChanged(obj);
    }

    // eslint-disable-next-line
    setJon(msg: any) {
        return new Promise((resolve) => {
            this.wcuserdataWs.setJon(msg, () => {
                resolve();
            })
        })
    }

    
    getJon() {
        return new Promise((resolve) => {
            // eslint-disable-next-line
            this.wcuserdataWs.getJon((msg:any) => {
                resolve(msg);
            })
        })
    }

    
    applicationQuit() {
        return new Promise((resolve) => {
            this.wcuserdataWs.applicationQuit(() => {
                resolve();
            })
        })
    }

}