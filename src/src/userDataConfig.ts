import { v4 as uuidv4 } from 'uuid';
import { MidiRoutePreset, PresetMidiControl, PresetMidiType } from './UserDataConfig/MidiRoutePreset/MidiRoutePreset'
import * as MRF from './UserDataConfig/MidiRoutePreset/MidiRoutersFilter'
import { MidiRouteInput } from './UserDataConfig/MidiRoutePreset/MidiRouteInput'
import { UserControl } from "./UserDataConfig/userControl"
import { Channel } from './channel/Channel'
import { RangeMap } from './channel/WcMidiIn'
import { Dropdownlist } from "./UserDataConfig/dropdownlists"
import { ToConsoleUserdata } from './UserDataConfig/MidiRoutePreset/ToConsoleUserdata'
import * as Connection from "../src/connection";



export class UserDataConfig {
    _activePresetID = 0;

    set activePresetID(id: number) {
        this._activePresetID = id;
        for (let i = 0; i < this.midiRoutePresets.length; i++) {
            this.midiRoutePresets[i].isEnabled = (this._activePresetID === i)
        }
    }

    get activePresetID() {
        return this._activePresetID
    }

    midiRoutePresets = [new MidiRoutePreset("Default preset")];



    dropdownlists: Dropdownlist[] = []

    uniqueId = uuidv4();
    get computerUuid() {
        if (!localStorage.computerUuid) { localStorage.computerUuid = uuidv4(); }
        return localStorage.computerUuid;
    }

    virtualInPorts: string[] = []
    //virtualOutPorts: string[] = [];

    private inPorts: { [key: number]: string };
    constructor(inPorts: { [key: number]: string }) {
        this.inPorts = inPorts;
        this.midiRoutePresets[0].isEnabled = true;
    }


    setPresetOnOffByClientEvent(str: string) {
        const userData: ToConsoleUserdata = JSON.parse(JSON.parse(str).userdata)
        if (userData.action === "presetOnOff") {
            // eslint-disable-next-line 
            const userDataData: any = userData.data;
            const data: PresetMidiControl = JSON.parse(userDataData)
            const computerUuid = localStorage.computerUuid;
            const selectedPreset = this.midiRoutePresets.filter((row) => { return row.uuid === data.presetUuid })[0]

            if (selectedPreset.midiControlOn.isMidiParamsEqual(selectedPreset.midiControlOff)) {
                // ir nore OFF, use ON for toggle
                if (data.presetMidiType === PresetMidiType.PRESET_OFF) { return; }

                selectedPreset.isEnabled = !selectedPreset.isEnabled;
                if ( selectedPreset.computerUuid === computerUuid ) {
                    Connection.loginStatus.userDataConfig.applyChanges(Connection.connection);
                }                
                return;
            }

            if (selectedPreset.isEnabled && data.presetMidiType === PresetMidiType.PRESET_ON ||
                !selectedPreset.isEnabled && data.presetMidiType === PresetMidiType.PRESET_OFF) {
                return;
            }

            selectedPreset.isEnabled = (data.presetMidiType === PresetMidiType.PRESET_ON)
            if ( selectedPreset.computerUuid === computerUuid ) {
                Connection.loginStatus.userDataConfig.applyChanges(Connection.connection);
            }

        }
    }

    addPreset(name: string) {
        const newPreset = new MidiRoutePreset(name)
        this.midiRoutePresets.push(newPreset);
        return newPreset;
    }

    get activePreset() {
        return this.midiRoutePresets[this.activePresetID];
    }

    getMidiRouteInput(inputName: string, presetId = this.activePresetID): MidiRouteInput {
        const activePreset = this.midiRoutePresets[presetId];
        if (activePreset.midiRouteInputs[inputName] === undefined) {

            activePreset.midiRouteInputs[inputName] = new MidiRouteInput(inputName)
            activePreset.midiRouteInputs[inputName].addMidiRouterChain("First Chain")
        }
        return activePreset.midiRouteInputs[inputName];
    }



    async postChanges(ch: Channel) {
        await ch.wcuserdata.setJon(this);
    }

    // eslint-disable-next-line
    setChanges(jsonData: any) {



        if (jsonData.midiRoutePresets === undefined) { return; }

        this.virtualInPorts = jsonData.virtualInPorts;
        this.activePresetID = jsonData.activePresetID
        this.dropdownlists = jsonData.dropdownlists
        this._activePresetID = jsonData._activePresetID



        for (let presetIdx = 0; presetIdx < jsonData.midiRoutePresets.length; presetIdx++) {

            const jsonPreset = jsonData.midiRoutePresets[presetIdx]
            if (this.midiRoutePresets[presetIdx] === undefined) { this.addPreset(""); }
            const midiRoutePreset = this.midiRoutePresets[presetIdx];
            midiRoutePreset.name = jsonPreset.name;
            midiRoutePreset.isSendAllUserControls = jsonPreset.isSendAllUserControls;
            midiRoutePreset.uuid = jsonPreset.uuid;
            Object.assign(midiRoutePreset.midiControlOn, jsonPreset.midiControlOn)
            Object.assign(midiRoutePreset.midiControlOff, jsonPreset.midiControlOff)
            midiRoutePreset.jsRouter.jsToServers = jsonPreset.jsRouter.jsToServers
            midiRoutePreset.isEnabled = jsonPreset.isEnabled;

            if (jsonPreset.easyConfig !== undefined) {
                const easyConfigRoutesKeys = Object.keys(jsonPreset.easyConfig.inputZonesAndRoutes)
                for (let easyConfigInputId = 0; easyConfigInputId < easyConfigRoutesKeys.length; easyConfigInputId++) {
                    const inputName = easyConfigRoutesKeys[easyConfigInputId]

                    midiRoutePreset.easyConfig.ensureEasyConfigInputExists(inputName)
                    const keyboardSplitAry = jsonPreset.easyConfig.inputZonesAndRoutes[inputName].keyboardSplits
                    for (let spltKdbId = 0; spltKdbId < keyboardSplitAry.length; spltKdbId++) {
                        midiRoutePreset.easyConfig.addKeyboardSplit(inputName, keyboardSplitAry[spltKdbId].splitPosition);
                    }

                    midiRoutePreset.easyConfig.inputZonesAndRoutes[inputName].zoneNames = jsonPreset.easyConfig.inputZonesAndRoutes[inputName].zoneNames

                    const easyConfigRoutesAry = jsonPreset.easyConfig.inputZonesAndRoutes[inputName].easyConfigRoutes
                    for (let easyConfigRoutesAryId = 0; easyConfigRoutesAryId < easyConfigRoutesAry.length; easyConfigRoutesAryId++) {
                        const easyConfigRoute = midiRoutePreset.easyConfig.addRoute(inputName);
                        Object.assign(easyConfigRoute, easyConfigRoutesAry[easyConfigRoutesAryId])
                    }
                }
            }



            for (let i = 0; i < jsonPreset.userControls.length; i++) {
                const uc = new UserControl();
                Object.assign(uc, jsonPreset.userControls[i])
                midiRoutePreset.userControls.push(uc)
            }

            for (let inputIdx = 0; inputIdx < jsonPreset.midiRouteInputs.length; inputIdx++) {
                if (jsonPreset.midiRouteInputs[inputIdx] === null) {
                    continue;
                }

                const midiInputId = jsonPreset.midiRouteInputs[inputIdx].midiInputId
                const configPort = this.getMidiRouteInput(midiInputId, presetIdx);
                const jsonPort = jsonPreset.midiRouteInputs[midiInputId]

                configPort.ignoreTypes.midiSense = jsonPort.ignoreTypes.midiSense
                configPort.ignoreTypes.midiTime = jsonPort.ignoreTypes.midiTime
                configPort.ignoreTypes.midiSense = jsonPort.ignoreTypes.midiSense

                configPort.midiRouteClock.timeSig = jsonPort.midiRouteClock.timeSig
                configPort.midiRouteClock.timeSigDivBy = jsonPort.midiRouteClock.timeSigDivBy
                configPort.midiRouteClock.fromSppPos = jsonPort.midiRouteClock.fromSppPos

                // eslint-disable-next-line
                jsonPort.midiRouteClock.propegateInputs.forEach((element: any) => {
                    configPort.addClockPropegateInput(element.midiInputId)
                });
                // eslint-disable-next-line
                jsonPort.cc14bitAry.forEach((element: any) => {
                    configPort.addCc14bitAry(element.channel, element.cc);
                });
                for (let chainIdx = 0; chainIdx < jsonPort.midiRouterChains.length; chainIdx++) {
                    if (configPort.midiRouterChains[chainIdx] === undefined) {
                        configPort.addMidiRouterChain("");
                    }
                    const configChain = configPort.midiRouterChains[chainIdx];
                    const jsonChain = jsonPort.midiRouterChains[chainIdx];
                    configChain.name = jsonChain.name;
                    configChain.isEasyConfig = jsonChain.isEasyConfig;


                    for (let filterId = 0; filterId < jsonChain.midiRoutersFilters.length; filterId++) {
                        const jsonFilter = jsonChain.midiRoutersFilters[filterId]

                        if (jsonFilter.filterType === MRF.FilterType.TO_MIDI_DESTINATION) {
                            configChain.addFilterMidiDestination(jsonFilter.baseMidiRouteInput);
                        }
                        if (jsonFilter.filterType === MRF.FilterType.TO_CONSOLE) {
                            configChain.addFilterToConsle(jsonFilter.logTo, jsonFilter.userdata)
                        }
                        if (jsonFilter.filterType === MRF.FilterType.TO_NETWORK) {
                            configChain.addFilterNetworkDestination(jsonFilter.serverName, jsonFilter.serverPort, jsonFilter.baseMidiRouteInput)
                        }
                        if (jsonFilter.filterType === MRF.FilterType.SCHEDULE_TO) {
                            configChain.addFilterSchedule(jsonFilter.defferedType, jsonFilter.defferedTo)
                        }
                        if (jsonFilter.filterType === MRF.FilterType.FILTER_AND_TRANSFORM) {
                            configChain.addFilterFilterAndTransform(jsonFilter.name, jsonFilter.conditionAction, jsonFilter.filterChannel, jsonFilter.filterEvents, jsonFilter.filterData1, jsonFilter.filterData2)
                        }



                    }
                }
            }
        }
    }

    async applyChanges(ch: Channel) {
        await this.postChanges(ch)
        await ch.wcmidiin.restart()
        await ch.wcmidiout.restart()
        Connection.loginStatus.inPorts = await ch.wcmidiin.getPorts()
        Connection.loginStatus.outPorts = await ch.wcmidiout.getPorts()
        this.inPorts = Connection.loginStatus.inPorts



        for (let i = 0; i < this.virtualInPorts.length; i++) {
            const p = this.virtualInPorts[i];

            if (Object.values(this.inPorts).indexOf(p) === -1) {
                await ch.wcmidiin.openVirtualInOutPort(p);
            }

        }


        const keys = Object.keys(this.inPorts);
        for (let inputIdx = 0; inputIdx < keys.length; inputIdx++) {
            const inputName = this.inPorts[inputIdx]
            const configPort = this.getMidiRouteInput(this.inPorts[inputIdx]);
            const midiPort = await ch.wcmidiin.port(inputIdx)

            // Clear prevou
            configPort.midiRouterChains = configPort.midiRouterChains.filter((row) => { return !row.isEasyConfig })
            // routes from easy config

            for (let presetId = 0; presetId < this.midiRoutePresets.length; presetId++) {
                // add preset onoff easyconfig                
                configPort.midiRouterChains =
                    configPort.midiRouterChains.concat(this.midiRoutePresets[presetId].midiControlOff.getOnOffMidiRouterChains(inputName));
                configPort.midiRouterChains =
                    configPort.midiRouterChains.concat(this.midiRoutePresets[presetId].midiControlOn.getOnOffMidiRouterChains(inputName));
                // jsRouting from server
                configPort.midiRouterChains =
                    configPort.midiRouterChains.concat(this.midiRoutePresets[presetId].jsRouter.getMidiRouterChains(inputName));

                // add easyconfig routes
                if (this.midiRoutePresets[presetId].isEnabled) {
                    const enabledPreset = this.midiRoutePresets[presetId]
                    if (enabledPreset.easyConfig.inputZonesAndRoutes[inputName] !== undefined) {
                        enabledPreset.easyConfig.inputZonesAndRoutes[inputName].easyConfigRoutes.forEach((row) => {
                            configPort.midiRouterChains = configPort.midiRouterChains.concat(row.getMidiRouterChains)
                        })
                    }
                }

            }

            await midiPort.ignoreTypes(configPort.ignoreTypes.midiSysex, configPort.ignoreTypes.midiTime, configPort.ignoreTypes.midiSense)
            await midiPort.setTimeSig(configPort.midiRouteClock.timeSig, configPort.midiRouteClock.timeSigDivBy, configPort.midiRouteClock.fromSppPos)
            for (let i = 0; i < configPort.midiRouteClock.propegateInputs.length; i++) {
                const p = configPort.midiRouteClock.propegateInputs[i];
                await midiPort.addPropegateClockPort(p.midiInputId);
            }
            for (let i = 0; i < configPort.cc14bitAry.length; i++) {
                const p = configPort.cc14bitAry[i];
                await midiPort.addCc14Bit(p.channel, p.cc)
            }
            for (let i = 0; i < configPort.midiRouterChains.length; i++) {
                const configChain = configPort.midiRouterChains[i];
                const chain = await midiPort.routingMidiChainsAaddChain();

                for (let filterIdx = 0; filterIdx < configChain.midiRoutersFilters.length; filterIdx++) {
                    const configFilter = configChain.midiRoutersFilters[filterIdx];

                    if (configFilter.filterType === MRF.FilterType.TO_MIDI_DESTINATION) {
                        const filter = configChain.getFilterMidiDestination(filterIdx);

                        await chain.routingActionAddSendPortByNumber(filter.baseMidiRouteInput.midiInputId);
                    }
                    if (configFilter.filterType === MRF.FilterType.TO_CONSOLE) {
                        const filter = configChain.getFilterToConsle(filterIdx);
                        await chain.routingActionAddLogData(filter.logTo, filter.userdata)
                    }
                    if (configFilter.filterType === MRF.FilterType.TO_NETWORK) {
                        const filter = configChain.getFilterNetworkDestination(filterIdx);
                        await chain.routingActionAddSendRemoteServer(filter.serverName, filter.serverPort, filter.baseMidiRouteInput.midiInputId)
                    }
                    if (configFilter.filterType === MRF.FilterType.SCHEDULE_TO) {
                        const filter = configChain.getFilterSchedule(filterIdx);
                        await chain.routingActionAddDeferedEvent(filter.defferedType, filter.defferedTo)
                    }
                    if (configFilter.filterType === MRF.FilterType.FILTER_AND_TRANSFORM) {
                        const filter = configChain.getFilterFilterAndTransform(filterIdx)

                        const channels = new RangeMap()
                        channels.val = JSON.parse(filter.filterChannel)
                        const eventTypes = new RangeMap()
                        eventTypes.val = JSON.parse(filter.filterEvents)
                        const data1 = new RangeMap()
                        data1.val = JSON.parse(filter.filterData1)
                        const data2 = new RangeMap()
                        data2.val = JSON.parse(filter.filterData2)

                        await chain.routingActionAddFilterMidiChannelMsg(channels, eventTypes, data1, data2, filter.conditionAction)
                    }


                }
            }


        }

        await this.activePreset.jsRouter.applayChanges()
        
        if (Connection.loginStatus.userDataConfig.activePreset.isSendAllUserControls){
            await Connection.loginStatus.userDataConfig.activePreset.sendAllUserControls()
        }
        
    }

}





