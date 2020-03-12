import * as MRP from './UserDataConfig/MidiRoutePreset'
import { UserControl } from "./UserDataConfig/userControl"
import { Channel } from './channel/Channel'
import { RangeMap } from './channel/WcMidiIn'
import { EasyConfig } from "./UserDataConfig/Easyconfig"

export class UserDataConfig {
    activePresetID = 0;
    midiRoutePresets = [new MRP.MidiRoutePreset("Default preset")];
    easyConfig = new EasyConfig();

    uniqueId = (new Date()).getTime();

    virtualInPorts: string[] = []
    virtualOutPorts: string[] = [];

    private inPorts: string[];
    constructor(inPorts: string[]) {
        this.inPorts = inPorts;

    }



    addPreset(name: string) {
        this.midiRoutePresets.push(new MRP.MidiRoutePreset(name));
    }

    get activePreset() {
        return this.midiRoutePresets[this.activePresetID];
    }

    getMidiRouteInput(inputId: number, presetId = this.activePresetID): MRP.MidiRouteInput {
        const activePreset = this.midiRoutePresets[presetId];
        if (activePreset.midiRouteInputs[inputId] === undefined) {
            const inputName = this.inPorts[inputId];
            activePreset.midiRouteInputs[inputId] = new MRP.MidiRouteInput(this.inPorts, inputId, inputName)
            activePreset.midiRouteInputs[inputId].addMidiRouterChain("First Chain")
        }
        return activePreset.midiRouteInputs[inputId];
    }



    async postChanges(ch: Channel) {
        await ch.wcuserdata.setJon(this);
    }

    // eslint-disable-next-line
    setChanges(jsonData: any) {

        if (jsonData.easyConfig !== undefined) {
            const easyConfigRoutesKeys = Object.keys(jsonData.easyConfig.inputZonesAndRoutes)
            for (let easyConfigInputId = 0; easyConfigInputId < easyConfigRoutesKeys.length; easyConfigInputId++) {
                const inputID = parseInt(easyConfigRoutesKeys[easyConfigInputId])

                this.easyConfig.ensureEasyConfigInputExists(inputID)
                
                const keyboardSplitAry = jsonData.easyConfig.inputZonesAndRoutes[inputID].keyboardSplits
                for (let spltKdbId = 0; spltKdbId < keyboardSplitAry.length; spltKdbId++) {
                    this.easyConfig.addKeyboardSplit(inputID, keyboardSplitAry[spltKdbId].splitPosition);
                }


                this.easyConfig.inputZonesAndRoutes[inputID].zoneNames = jsonData.easyConfig.inputZonesAndRoutes[inputID].zoneNames

                const easyConfigRoutesAry = jsonData.easyConfig.inputZonesAndRoutes[inputID].easyConfigRoutes
                for (let easyConfigRoutesAryId = 0; easyConfigRoutesAryId < easyConfigRoutesAry.length; easyConfigRoutesAryId++) {
                    const easyConfigRoute = this.easyConfig.addRoute(inputID);
                    Object.assign(easyConfigRoute, easyConfigRoutesAry[easyConfigRoutesAryId])
                }


            }
        }
        
        if (jsonData.midiRoutePresets === undefined) { return; }

        this.virtualInPorts = jsonData.virtualInPorts;
        this.virtualOutPorts = jsonData.virtualOutPorts;
        this.activePresetID = jsonData.activePresetID




        for (let presetIdx = 0; presetIdx < jsonData.midiRoutePresets.length; presetIdx++) {

            const jsonPreset = jsonData.midiRoutePresets[presetIdx]
            if (this.midiRoutePresets[presetIdx] === undefined) { this.addPreset(""); }
            const midiRoutePreset = this.midiRoutePresets[presetIdx];
            midiRoutePreset.name = jsonPreset.name;


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

                        if (jsonFilter.filterType === MRP.FilterType.TO_MIDI_DESTINATION) {
                            configChain.addFilterMidiDestination(jsonFilter.baseMidiRouteInput);
                        }
                        if (jsonFilter.filterType === MRP.FilterType.TO_CONSOLE) {
                            configChain.addFilterToConsle(jsonFilter.logTo)
                        }
                        if (jsonFilter.filterType === MRP.FilterType.TO_NETWORK) {
                            configChain.addFilterNetworkDestination(jsonFilter.serverName, jsonFilter.serverPort, jsonFilter.baseMidiRouteInput)
                        }
                        if (jsonFilter.filterType === MRP.FilterType.SCHEDULE_TO) {
                            configChain.addFilterSchedule(jsonFilter.defferedType, jsonFilter.defferedTo)
                        }
                        if (jsonFilter.filterType === MRP.FilterType.FILTER_AND_TRANSFORM) {
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

        for (let i = 0; i < this.virtualInPorts.length; i++) {
            const p = this.virtualInPorts[i];
            ch.wcmidiin.openVirtualPort(p);
        }
        for (let i = 0; i < this.virtualOutPorts.length; i++) {
            const p = this.virtualOutPorts[i];
            ch.wcmidiout.openVirtualPort(p);
        }

        const keys = Object.keys(this.inPorts);
        for (let inputIdx = 0; inputIdx < keys.length; inputIdx++) {
            const configPort = this.getMidiRouteInput(inputIdx);
            const midiPort = await ch.wcmidiin.port(inputIdx)

            // Clear prevou
            configPort.midiRouterChains = configPort.midiRouterChains.filter((row) => { return !row.isEasyConfig })
            // routes from easy config
            if (this.easyConfig.inputZonesAndRoutes[inputIdx] !== undefined) {
                this.easyConfig.inputZonesAndRoutes[inputIdx].easyConfigRoutes.forEach((row) => {
                    configPort.midiRouterChains = configPort.midiRouterChains.concat(row.getMidiRouterChains)
                })
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

                    if (configFilter.filterType === MRP.FilterType.TO_MIDI_DESTINATION) {
                        const filter = configChain.getFilterMidiDestination(filterIdx);

                        await chain.routingActionAddSendPortByNumber(filter.baseMidiRouteInput.midiInputId);
                    }
                    if (configFilter.filterType === MRP.FilterType.TO_CONSOLE) {
                        const filter = configChain.getFilterToConsle(filterIdx);
                        await chain.routingActionAddLogData(filter.logTo)
                    }
                    if (configFilter.filterType === MRP.FilterType.TO_NETWORK) {
                        const filter = configChain.getFilterNetworkDestination(filterIdx);
                        await chain.routingActionAddSendRemoteServer(filter.serverName, filter.serverPort, filter.baseMidiRouteInput.midiInputId)
                    }
                    if (configFilter.filterType === MRP.FilterType.SCHEDULE_TO) {
                        const filter = configChain.getFilterSchedule(filterIdx);
                        await chain.routingActionAddDeferedEvent(filter.defferedType, filter.defferedTo)
                    }
                    if (configFilter.filterType === MRP.FilterType.FILTER_AND_TRANSFORM) {
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


    }

}





