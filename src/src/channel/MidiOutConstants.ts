export const channelAll = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

/**
* [read-only] List of MIDI channel mode messages as defined in the official MIDI
* specification.
*
* @property MIDI_CHANNEL_MODE_MESSAGES
* @type Object
* @static
*
* @since 2.0.0
*/
export const enum MIDI_CHANNEL_MODE_MESSAGES {
    allsoundoff = 120,
    resetallcontrollers = 121,
    localcontrol = 122,
    allnotesoff = 123,
    omnimodeoff = 124,
    omnimodeon = 125,
    monomodeon = 126,
    polymodeon = 127
}

export const enum MIDI_REGISTERED_PARAMETER {
    pitchbendrange,
    channelfinetuning,
    channelcoarsetuning,
    tuningprogram,
    tuningbank,
    modulationrange,

    azimuthangle,
    elevationangle,
    gain,
    distanceratio,
    maximumdistance,
    maximumdistancegain,
    referencedistanceratio,
    panspreadangle,
    rollangle
}