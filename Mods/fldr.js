/*̅‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾̅‾
____________________________________________________
 ╭─╮╭─╴╭─╴   ╭─╴╷  ╷╭─╴╭╮╷╶┬╴   ╭┬╮╭─╮╶┬╮╶┬╮╷╭╮╷╭─╴
 ├─┤│  ├╴    │  │  │├╴ │╰┤ │    ││││ │ ││ ││││╰┤│╶╮
 ╵ ╵╰─╴╰─╴   ╰─╴╰─╴╵╰─╴╵ ╵ ╵    ╵ ╵╰─╯╶┴╯╶┴╯╵╵ ╵╰─╯ 
‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
 > Flintlock Dueling Light [Revamp]
 > Nanoray (ft. 5470p3_)
 > 3.4.4
____________________________________________________
̲*/

const _ALLOW_LEGACY_TURN = false;

let staticMemory = {
    // * If your mod is still laggy, use setTickThrottle and set this to a higher number
    // * Alternatively, stop the mod and set a higher number here
    // * Explanation: 
    // - How much time is added to tick loop job delay per player. E.g., if this variable is 2 and there are 3 players, the delay will be 6 ticks (2 * 3)
    // - MUST be an integer, never set it to a decimal number
    TICK_THROTTLE_PER_PLAYER: 2, 

    SJP: {
        active: true,
        njt: 0,
    },

    CAPTCHA: {
        active: false,
        duration: 15000
    },

    // ! IF YOU WANT TO COMPLETELY DISABLE TICK THROTTLE, SET THIS TO TRUE
    DISABLE_TICK_THROTTLE: false,

    MAX_PLAYER_COUNT: 30, // * Maximum number of player allowed on dueling host

    alwaysPickUpGems: true, // * Changeable - example: If you have 720 gems as a-speedster it will go down to 719

    // * Since low ELO players gain more from winning against high elo players, and vice versa -
    // * This variable determines the maximum ELO one can gain/lose from a single battle 
    MAX_WIN_LOSS_THRESHOLD: 75,

    // * K factor based in which ELO is calculated. Recommended not to change
    ELO_K_FACTOR: 64,

    
    // ! Experimental mode
    // * Mode description:
    // *             - Other player stats will be invisible (how much shield/gems they have remaining) during duel
    // *             - Dropped gems will be invisible
    // *             - Lasers fired will be invisible
    _ultraDarkMode: false, 

    // * If you want players to ONLY be able to select a certain ship, set this to that ships code
    // * e.g. if you want players to only use a-speedster, set it to 605
    requireShip: null, 

    // * Defined in number of ticks
    // * Throttles the amount of times an individual player can call `ui_component_clicked` (therefore less lag)
    // ! To disable rate limiting, replace this number with 0
    _CLICK_RATE_LIMIT: 40,

    afkChecker: {
        // * True = will check for AFK people
        active: false,

        // * Change the first number to reflect how many seconds until a player is pronounced AFK
        delay: 20 * 60 
    },

    bruteforceBan_minimumSimilarity: 75, // * FOR EXPERIENCED USERS ONLY - How similar a name needs to be to be affected by bruteforceBan, in percents (e.g. 75 === 75%)

    _GLOBAL_ERROR_HANDLER: true, // * If you want every error to appear in the terminal, set this to true

    // ! BELOW ARE PROPERTIES THAT YOU SHOULD NOT CHANGE
    retractableComponentIDs: ["mainControlsBackground"],
    layout: ['qwertyuiop'.split(''), 'asdfghjkl'.split(''), 'zxcvbnm'.split('')],
    layoutString: 'qwertyuiopasdfghjklzxcvbnm',
    
    FLATTENED_SHIPS: [],

    GEM_CAPS: {
        1: 20,
        2: 80,
        3: 180,
        4: 320,
        5: 500,
        6: 720,
        7: 980
    }
}

staticMemory.TICK_THROTTLE_PER_PLAYER = Math.round(staticMemory.TICK_THROTTLE_PER_PLAYER);


// ! SHOULD NOT BE CHANGED
let sessionMemory = {
    rememberedIDs: [],
    admins: [],
    banned: [],
    bruteforceBanned: [],
    forceIdle: []
}

const SHIPS = {
    "vanilla": {
        101: { name: "Fly", code: '{"name":"Fly","level":1,"model":1,"size":1.05,"specs":{"shield":{"capacity":[75,100],"reload":[2,3]},"generator":{"capacity":[40,60],"reload":[10,15]},"ship":{"mass":60,"speed":[125,145],"rotation":[110,130],"acceleration":[100,120]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-65,-60,-50,-20,10,30,55,75,60],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,8,10,30,25,30,18,15,0],"height":[0,6,8,12,20,20,18,15,0],"propeller":true,"texture":[4,63,10,1,1,1,12,17]},"cockpit":{"section_segments":12,"offset":{"x":0,"y":0,"z":20},"position":{"x":[0,0,0,0,0,0,0],"y":[-15,0,20,30,60],"z":[0,0,0,0,0]},"width":[0,13,17,10,5],"height":[0,18,25,18,5],"propeller":false,"texture":[7,9,9,4,4]},"cannon":{"section_segments":6,"offset":{"x":0,"y":-15,"z":-10},"position":{"x":[0,0,0,0,0,0],"y":[-40,-50,-20,0,20,30],"z":[0,0,0,0,0,20]},"width":[0,5,8,11,7,0],"height":[0,5,8,11,10,0],"angle":0,"laser":{"damage":[5,6],"rate":4,"type":1,"speed":[160,180],"number":1,"error":2.5},"propeller":false,"texture":[3,3,10,3]}},"wings":{"main":{"length":[60,20],"width":[100,50,40],"angle":[-10,10],"position":[0,20,10],"doubleside":true,"offset":{"x":0,"y":10,"z":5},"bump":{"position":30,"size":20},"texture":[11,63]}},"typespec":{"name":"Fly","level":1,"model":1,"code":101,"specs":{"shield":{"capacity":[75,100],"reload":[2,3]},"generator":{"capacity":[40,60],"reload":[10,15]},"ship":{"mass":60,"speed":[125,145],"rotation":[110,130],"acceleration":[100,120]}},"shape":[1.368,1.368,1.093,0.965,0.883,0.827,0.791,0.767,0.758,0.777,0.847,0.951,1.092,1.667,1.707,1.776,1.856,1.827,1.744,1.687,1.525,1.415,1.335,1.606,1.603,1.578,1.603,1.606,1.335,1.415,1.525,1.687,1.744,1.827,1.856,1.776,1.707,1.667,1.654,0.951,0.847,0.777,0.758,0.767,0.791,0.827,0.883,0.965,1.093,1.368],"lasers":[{"x":0,"y":-1.365,"z":-0.21,"angle":0,"damage":[5,6],"rate":4,"type":1,"speed":[160,180],"number":1,"spread":0,"error":2.5,"recoil":0}],"radius":1.856}}' },
        191: {
            name: "Spectating",
            code: '{"name":"Spectator","level":1.9,"model":1,"size":0.025,"zoom":0.075,"specs":{"shield":{"capacity":[1e-30,1e-30],"reload":[1000,1000]},"generator":{"capacity":[1e-30,1e-30],"reload":[1,1]},"ship":{"mass":1,"speed":[200,200],"rotation":[1000,1000],"acceleration":[1000,1000]}},"bodies":{"face":{"section_segments":100,"angle":0,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[-2,-2,2,2],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,1,1,0],"height":[0,1,1,0],"vertical":true,"texture":[6]}},"typespec":{"name":"Spectator","level":1,"model":1,"code":101,"specs":{"shield":{"capacity":[1e-30,1e-30],"reload":[1000,1000]},"generator":{"capacity":[1e-30,1e-30],"reload":[1,1]},"ship":{"mass":1,"speed":[200,200],"rotation":[1000,1000],"acceleration":[1000,1000]}},"shape":[0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001],"lasers":[],"radius":0.001}}'
        },
        201: { name: "Delta-Fighter", code: '{"name":"Delta-Fighter","level":2,"model":1,"next":[301,302],"size":1.3,"specs":{"shield":{"capacity":[100,150],"reload":[3,4]},"generator":{"capacity":[50,80],"reload":[15,25]},"ship":{"mass":80,"speed":[110,135],"rotation":[80,100],"acceleration":[110,120]}},"bodies":{"cockpit":{"angle":0,"section_segments":8,"offset":{"x":0,"y":-20,"z":12},"position":{"x":[0,0,0,0,0],"y":[-20,-10,0,10,20],"z":[-7,-3,0,5,3]},"width":[3,12,18,16,3],"height":[3,6,8,6,3],"texture":[9]},"cockpit2":{"angle":0,"section_segments":8,"offset":{"x":0,"y":-10,"z":12},"position":{"x":[0,0,0,0],"y":[-10,0,10,40],"z":[0,0,5,3]},"width":[5,18,16,3],"height":[5,12,10,5],"texture":[9,2,11]},"propulsor":{"section_segments":8,"offset":{"x":0,"y":35,"z":10},"position":{"x":[0,0,0,0,0,0],"y":[0,10,20,30,40,30],"z":[0,0,0,0,0]},"width":[5,15,10,10,10,0],"height":[15,15,15,15,10,0],"texture":[63,63,4,5,12],"propeller":true},"bumps":{"section_segments":8,"offset":{"x":40,"y":40,"z":5},"position":{"x":[0,0,0,0,0,0],"y":[-40,-10,0,10,40,45],"z":[0,0,0,0,0,0]},"width":[0,5,8,12,5,0],"height":[0,25,28,22,15,0],"texture":[63]},"gunsupport":{"section_segments":8,"offset":{"x":30,"y":-40,"z":5},"position":{"x":[-30,-20,-10,0,0,0],"y":[-20,-15,-5,10,40,55],"z":[-20,-20,-10,0,0,0]},"width":[3,5,8,4,5,0],"height":[3,5,8,12,15,0],"texture":63},"gun":{"section_segments":8,"offset":{"x":0,"y":-60,"z":-15},"position":{"x":[0,0,0,0],"y":[-20,-10,5,10],"z":[0,0,0,0]},"width":[3,7,8,3],"height":[3,7,8,3],"texture":[6,4,5],"laser":{"damage":[3,5],"rate":3,"type":1,"speed":[100,130],"number":3,"angle":15,"error":0}}},"wings":{"main":{"doubleside":true,"offset":{"x":0,"y":-25,"z":5},"length":[100],"width":[120,30,40],"angle":[0,20],"position":[30,90,85],"texture":11,"bump":{"position":30,"size":20}}},"typespec":{"name":"Delta-Fighter","level":2,"model":1,"code":201,"specs":{"shield":{"capacity":[100,150],"reload":[3,4]},"generator":{"capacity":[50,80],"reload":[15,25]},"ship":{"mass":80,"speed":[110,135],"rotation":[80,100],"acceleration":[110,120]}},"shape":[2.081,1.969,1.501,1.455,1.403,1.368,1.263,1.192,1.095,1.063,1.128,1.209,1.352,1.545,1.85,2.348,2.965,3.211,3.33,2.93,2.496,2.442,2.441,1.866,1.967,1.954,1.967,1.866,2.441,2.442,2.496,2.93,3.33,3.211,2.965,2.348,1.85,1.545,1.352,1.209,1.128,1.063,1.095,1.192,1.263,1.368,1.403,1.455,1.501,1.969],"lasers":[{"x":0,"y":-2.08,"z":-0.39,"angle":0,"damage":[3,5],"rate":3,"type":1,"speed":[100,130],"number":3,"spread":15,"error":0,"recoil":0}],"radius":3.33,"next":[301,302]}}' },
        202: { name: "Trident", code: '{"name":"Trident","level":2,"model":2,"next":[303,304],"size":1.2,"specs":{"shield":{"capacity":[125,175],"reload":[3,5]},"generator":{"capacity":[50,80],"reload":[15,20]},"ship":{"mass":100,"speed":[110,135],"rotation":[70,85],"acceleration":[90,110]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0],"y":[-100,-50,0,30,70,100,90],"z":[0,0,0,0,0,0,0]},"width":[1,25,15,30,30,20,10],"height":[1,20,20,30,30,10,0],"texture":[1,1,10,2,3],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-40,"z":10},"position":{"x":[0,0,0,0,0,0,0],"y":[-20,-10,0,30,40],"z":[0,0,0,0,0]},"width":[0,10,10,10,0],"height":[0,10,15,12,0],"texture":[9],"propeller":false},"cannons":{"section_segments":12,"offset":{"x":50,"y":40,"z":0},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-45,-20,0,20,50,55],"z":[0,0,0,0,0,0,0]},"width":[0,5,10,10,15,10,0],"height":[0,5,15,15,10,5,0],"angle":0,"laser":{"damage":[4,8],"rate":2.5,"type":1,"speed":[110,160],"number":1,"angle":0,"error":0},"propeller":false,"texture":[4,4,10,4,63,4]}},"wings":{"main":{"offset":{"x":0,"y":60,"z":0},"length":[80,30],"width":[70,50,60],"texture":[4,63],"angle":[0,0],"position":[10,-20,-50],"bump":{"position":-10,"size":15}},"winglets":{"length":[30,20],"width":[10,30,0],"angle":[50,20],"position":[90,80,50],"texture":[63],"bump":{"position":10,"size":30},"offset":{"x":0,"y":0,"z":0}}},"typespec":{"name":"Trident","level":2,"model":2,"code":202,"specs":{"shield":{"capacity":[125,175],"reload":[3,5]},"generator":{"capacity":[50,80],"reload":[15,20]},"ship":{"mass":100,"speed":[110,135],"rotation":[70,85],"acceleration":[90,110]}},"shape":[2.4,2.164,1.784,1.529,1.366,0.981,0.736,0.601,0.516,0.457,0.415,2.683,2.66,2.66,2.724,2.804,2.763,2.605,2.502,2.401,2.596,2.589,2.426,2.448,2.443,2.52,2.443,2.448,2.426,2.589,2.596,2.401,2.502,2.605,2.763,2.804,2.724,2.66,2.66,2.683,0.415,0.457,0.516,0.601,0.736,0.981,1.366,1.529,1.784,2.164],"lasers":[{"x":1.2,"y":-0.24,"z":0,"angle":0,"damage":[4,8],"rate":2.5,"type":1,"speed":[110,160],"number":1,"spread":0,"error":0,"recoil":0},{"x":-1.2,"y":-0.24,"z":0,"angle":0,"damage":[4,8],"rate":2.5,"type":1,"speed":[110,160],"number":1,"spread":0,"error":0,"recoil":0}],"radius":2.804,"next":[303,304]}}' },
        301: { name: "Y-Defender", code: '{"name":"Y-Defender","level":3,"model":1,"next":[401,402],"size":1.5,"specs":{"shield":{"capacity":[175,225],"reload":[4,6]},"generator":{"capacity":[50,80],"reload":[18,26]},"ship":{"mass":200,"speed":[80,100],"rotation":[40,60],"acceleration":[70,80]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-100,-95,-50,-40,-20,-10,30,70,65],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,20,25,10,10,20,15,20,0],"height":[0,10,20,15,15,20,25,15,0],"texture":[1,2,2,63,2,10,2,12],"laser":{"damage":[20,40],"rate":2,"type":1,"speed":[140,190],"number":1,"recoil":75,"error":0}},"propulsors":{"section_segments":8,"offset":{"x":50,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-30,-25,20,25,40,50,60,100,90],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,20,15,5,25,20,15,15,0],"height":[0,20,15,5,25,20,20,10,0],"texture":[63,63,63,2,2,3,4,12],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-70,"z":10},"position":{"x":[0,0,0,0,0,0,0],"y":[-20,-10,0,10,20],"z":[0,0,0,0,0]},"width":[0,10,10,10,0],"height":[0,10,15,12,0],"texture":[9],"propeller":false}},"wings":{"join":{"offset":{"x":14,"y":0,"z":0},"length":[25],"width":[20,10],"angle":[0],"position":[0,0,0,50],"texture":[63],"bump":{"position":10,"size":40}},"join2":{"offset":{"x":14,"y":50,"z":0},"length":[25],"width":[20,10],"angle":[0],"position":[0,0,0,50],"texture":[3],"bump":{"position":10,"size":40}},"winglets":{"offset":{"x":5,"y":40,"z":10},"length":[10,20],"width":[15,30,50],"angle":[60,-20],"position":[0,5,60],"texture":[63],"bump":{"position":10,"size":60}}},"typespec":{"name":"Y-Defender","level":3,"model":1,"code":301,"specs":{"shield":{"capacity":[175,225],"reload":[4,6]},"generator":{"capacity":[50,80],"reload":[18,26]},"ship":{"mass":200,"speed":[80,100],"rotation":[40,60],"acceleration":[70,80]}},"shape":[3,2.959,2.915,2.203,1.734,0.652,0.639,1.358,1.816,2.118,2.23,2.139,2.06,2.016,2.023,2.04,2.551,2.584,2.67,3.055,3.578,3.552,3.315,3.834,2.269,2.104,2.269,3.834,3.315,3.552,3.578,3.055,2.67,2.584,2.551,2.04,2.023,2.016,2.06,2.139,2.23,2.118,1.816,1.358,0.639,0.652,1.734,2.203,2.915,2.959],"lasers":[{"x":0,"y":-3,"z":0,"angle":0,"damage":[20,40],"rate":2,"type":1,"speed":[140,190],"number":1,"spread":0,"error":0,"recoil":75}],"radius":3.834,"next":[401,402]}}' },
        302: { name: "Pulse-Fighter", code: '{"name":"Pulse-Fighter","level":3,"model":2,"next":[402,403],"size":1.3,"specs":{"shield":{"capacity":[150,200],"reload":[3,5]},"generator":{"capacity":[60,90],"reload":[20,30]},"ship":{"mass":135,"speed":[105,120],"rotation":[60,80],"acceleration":[80,100]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-90,-75,-50,0,50,105,90],"z":[0,0,0,0,0,0,0]},"width":[0,15,25,30,35,20,0],"height":[0,10,15,25,25,20,0],"propeller":true,"texture":[63,1,1,10,2,12]},"cockpit":{"section_segments":12,"offset":{"x":0,"y":-20,"z":20},"position":{"x":[0,0,0,0,0,0,0],"y":[-30,-10,10,30,60],"z":[0,0,0,0,0]},"width":[0,10,15,10,5],"height":[0,18,25,18,5],"propeller":false,"texture":9},"cannon":{"section_segments":6,"offset":{"x":0,"y":-40,"z":-10},"position":{"x":[0,0,0,0,0,0],"y":[-40,-50,-20,0,20,50],"z":[0,0,0,0,0,0]},"width":[0,5,10,10,15,0],"height":[0,5,15,15,10,0],"angle":0,"laser":{"damage":[15,30],"rate":1,"type":2,"speed":[150,175],"number":1,"error":0},"propeller":false,"texture":3},"deco":{"section_segments":8,"offset":{"x":50,"y":50,"z":-10},"position":{"x":[0,0,5,5,0,0,0],"y":[-52,-50,-20,0,20,40,42],"z":[0,0,0,0,0,0,0]},"width":[0,5,10,10,5,5,0],"height":[0,5,10,15,10,5,0],"angle":0,"laser":{"damage":[3,6],"rate":3,"type":1,"speed":[100,150],"number":1,"error":0},"propeller":false,"texture":4}},"wings":{"main":{"length":[80,20],"width":[120,50,40],"angle":[-10,20],"position":[30,50,30],"doubleside":true,"bump":{"position":30,"size":10},"texture":[11,63],"offset":{"x":0,"y":0,"z":0}},"winglets":{"length":[40],"width":[40,20,30],"angle":[10,-10],"position":[-40,-60,-55],"bump":{"position":0,"size":30},"texture":63,"offset":{"x":0,"y":0,"z":0}},"stab":{"length":[40,10],"width":[50,20,20],"angle":[40,30],"position":[70,75,80],"doubleside":true,"texture":63,"bump":{"position":0,"size":20},"offset":{"x":0,"y":0,"z":0}}},"typespec":{"name":"Pulse-Fighter","level":3,"model":2,"code":302,"specs":{"shield":{"capacity":[150,200],"reload":[3,5]},"generator":{"capacity":[60,90],"reload":[20,30]},"ship":{"mass":135,"speed":[105,120],"rotation":[60,80],"acceleration":[80,100]}},"shape":[2.343,2.204,1.998,1.955,2.088,1.91,1.085,0.974,0.895,0.842,0.829,0.95,1.429,2.556,2.618,2.726,2.851,2.837,2.825,2.828,2.667,2.742,2.553,2.766,2.779,2.735,2.779,2.766,2.553,2.742,2.667,2.828,2.825,2.837,2.851,2.726,2.618,2.556,1.43,0.95,0.829,0.842,0.895,0.974,1.085,1.91,2.088,1.955,1.998,2.204],"lasers":[{"x":0,"y":-2.34,"z":-0.26,"angle":0,"damage":[15,30],"rate":1,"type":2,"speed":[150,175],"number":1,"spread":0,"error":0,"recoil":0},{"x":1.3,"y":-0.052,"z":-0.26,"angle":0,"damage":[3,6],"rate":3,"type":1,"speed":[100,150],"number":1,"spread":0,"error":0,"recoil":0},{"x":-1.3,"y":-0.052,"z":-0.26,"angle":0,"damage":[3,6],"rate":3,"type":1,"speed":[100,150],"number":1,"spread":0,"error":0,"recoil":0}],"radius":2.851,"next":[402,403]}}' },
        303: { name: "Side-Fighter", code: '{"name":"Side-Fighter","level":3,"model":3,"next":[404,405],"size":1.5,"specs":{"shield":{"capacity":[125,175],"reload":[2,4]},"generator":{"capacity":[75,125],"reload":[20,36]},"ship":{"mass":100,"speed":[100,130],"rotation":[50,70],"acceleration":[100,130]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-30,-22,-15,0,15,22,40,30],"z":[0,0,0,0,0,0,0,0,0]},"width":[5,10,25,30,25,17,15,0],"height":[5,10,25,30,25,17,15,0],"texture":[5,63,63,63,63,12,12],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-20,"z":0},"position":{"x":[0,0,0,0,0,0,0],"y":[-10,-8,0],"z":[0,0,0]},"width":[0,10,10],"height":[0,10,10],"texture":[9],"propeller":false,"laser":{"damage":[4,7],"rate":10,"type":1,"speed":[150,240],"number":1,"error":20}}},"wings":{"wings1":{"doubleside":true,"offset":{"x":60,"y":0,"z":-80},"length":[0,50,50,50],"width":[0,0,100,100,0],"angle":[95,90,90,95],"position":[0,0,0,0,0],"texture":[7],"bump":{"position":0,"size":8}},"join":{"offset":{"x":0,"y":0,"z":0},"length":[61],"width":[10,6],"angle":[0],"position":[0,0,0,50],"texture":[8],"bump":{"position":10,"size":20}}},"typespec":{"name":"Side-Fighter","level":3,"model":3,"code":303,"specs":{"shield":{"capacity":[125,175],"reload":[2,4]},"generator":{"capacity":[75,125],"reload":[20,36]},"ship":{"mass":100,"speed":[100,130],"rotation":[50,70],"acceleration":[100,130]}},"shape":[0.902,0.912,0.888,0.892,0.731,0.749,0.779,2.343,2.255,2.136,2.061,2.022,2.038,2.04,2.022,2.061,2.136,2.255,2.343,0.836,0.924,1.106,1.282,1.262,1.222,1.202,1.222,1.262,1.282,1.106,0.924,0.836,2.343,2.255,2.136,2.061,2.022,2.038,2.04,2.022,2.061,2.136,2.255,2.343,0.779,0.749,0.731,0.892,0.888,0.912],"lasers":[{"x":0,"y":-0.9,"z":0,"angle":0,"damage":[4,7],"rate":10,"type":1,"speed":[150,240],"number":1,"spread":0,"error":20,"recoil":0}],"radius":2.343,"next":[404,405]}}' },
        304: { name: "Shadow X-1", code: '{"name":"Shadow X-1","level":3,"model":4,"next":[405,406],"size":0.97,"specs":{"shield":{"capacity":[110,140],"reload":[4,6]},"generator":{"capacity":[40,70],"reload":[16,28]},"ship":{"mass":165,"speed":[115,130],"rotation":[50,70],"acceleration":[90,115]}},"bodies":{"main":{"section_segments":10,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-100,-98,-95,-70,-40,0,40,70,80,90,100],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,10,20,30,40,20,20,40,40,40,20,0],"height":[0,4,4,20,20,10,10,15,15,15,10,10],"texture":[12,5,63,4,4,63,4,4,5]},"back":{"section_segments":10,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0],"y":[90,95,100,105,90],"z":[0,0,0,0,0]},"width":[10,15,18,19,2],"height":[3,5,7,8,2],"texture":[63],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-25,"z":15},"position":{"x":[0,0,0,0,0,0],"y":[-45,-40,-25,0,5],"z":[0,0,0,0,0,0]},"width":[0,13,17,11,0],"height":[0,10,13,5,0],"texture":[9]},"laser":{"section_segments":10,"offset":{"x":70,"y":10,"z":-20},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-20,-15,0,10,20,25,30,40,70,60],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,10,15,15,15,10,10,15,5,0],"height":[0,10,15,15,15,10,10,15,5,0],"texture":[3,4,10,3],"propeller":true,"laser":{"damage":[3,6],"rate":8,"type":1,"speed":[170,200],"number":1}}},"wings":{"top":{"offset":{"x":0,"y":50,"z":5},"length":[0,30],"width":[0,70,30],"angle":[90,90],"position":[0,0,50],"texture":[4],"bump":{"position":10,"size":10}},"side_joins":{"offset":{"x":0,"y":30,"z":-3},"length":[100],"width":[100,40],"angle":[0],"position":[-50,50],"texture":[4],"bump":{"position":10,"size":10}}},"typespec":{"name":"Shadow X-1","level":3,"model":4,"code":304,"specs":{"shield":{"capacity":[110,140],"reload":[4,6]},"generator":{"capacity":[40,70],"reload":[16,28]},"ship":{"mass":165,"speed":[115,130],"rotation":[50,70],"acceleration":[90,115]}},"shape":[1.94,1.918,1.881,1.592,1.379,1.223,1.115,0.909,0.834,0.859,0.889,1.402,1.573,1.648,1.688,1.735,2.057,2.395,2.657,2.738,2.014,1.733,1.916,1.974,2.067,2.225,2.067,1.974,1.916,1.733,2.014,2.738,2.657,2.395,2.057,1.735,1.688,1.648,1.573,1.402,0.889,0.859,0.834,0.909,1.115,1.223,1.379,1.592,1.881,1.918],"lasers":[{"x":1.358,"y":-0.194,"z":-0.388,"angle":0,"damage":[3,6],"rate":8,"type":1,"speed":[170,200],"number":1,"spread":0,"error":0,"recoil":0},{"x":-1.358,"y":-0.194,"z":-0.388,"angle":0,"damage":[3,6],"rate":8,"type":1,"speed":[170,200],"number":1,"spread":0,"error":0,"recoil":0}],"radius":2.738,"next":[405,406]}}' },
        401: { name: "Pegasus", code: '{"name":"Pegasus","level":4,"model":1,"next":[501,502],"size":1.65,"specs":{"shield":{"capacity":[170,240],"reload":[4,6]},"generator":{"capacity":[90,130],"reload":[21,29]},"ship":{"mass":260,"speed":[70,90],"rotation":[40,60],"acceleration":[80,95]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":5,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-124,-129,-104,-75,-46,-20,40,83,105,95],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,7,24,30,26,38,38,34,18,-2],"height":[0,4,16,23,26,25,25,24,12,-8],"texture":[6,4,3,2,63,2,10,63,17],"propeller":true,"laser":{"damage":[75,120],"rate":1,"type":2,"speed":[155,200],"number":1,"error":0}},"thrusters":{"section_segments":8,"offset":{"x":56,"y":9,"z":0},"position":{"x":[-1,-1,-1,10,13,5,3,0],"y":[-80,-68,-74,-40,3,55,70,65],"z":[0,0,0,0,0,0,0,0]},"width":[0,4,10,16,18,16,11,-4],"height":[0,4,12,17,19,17,12,-4],"texture":[6,3,3,63,4,4,17],"propeller":true,"laser":{"damage":[6,8],"rate":4,"type":1,"speed":[180,210],"number":1,"error":2}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":5,"z":18.9},"position":{"x":[0,0,0,0,0,0,0],"y":[-105,-80,-56,-25,20,55],"z":[-2,0,0,-6,-7,-10]},"width":[4,13,10,23,24,12],"height":[0,12,9,20,20,10],"texture":[9,9,3,11,4],"propeller":false}},"wings":{"wing":{"doubleside":true,"length":[44,20,25],"width":[92,70,70,30],"angle":[10,-10,-20],"position":[28,0,20,55],"offset":{"x":13,"y":-5,"z":0},"bump":{"position":30,"size":8},"texture":[11,4,63]},"winglet_top":{"doubleside":true,"length":[25,10],"width":[60,25,15],"angle":[35,0],"position":[-10,18,8],"offset":{"x":9,"y":76,"z":20},"bump":{"position":9,"size":7},"texture":[4,63]},"winglet_front":{"doubleside":true,"length":[25],"width":[70,30],"angle":[-20],"position":[0,-35],"offset":{"x":10,"y":-65,"z":0},"bump":{"position":6,"size":9},"texture":[63]}},"typespec":{"name":"Pegasus","level":4,"model":1,"code":401,"specs":{"shield":{"capacity":[170,240],"reload":[4,6]},"generator":{"capacity":[90,130],"reload":[21,29]},"ship":{"mass":260,"speed":[70,90],"rotation":[40,60],"acceleration":[80,95]}},"shape":[4.099,4.059,3.953,3.574,2.226,2.964,3.033,3.003,2.916,2.888,2.893,2.831,2.825,2.965,3.228,3.53,3.744,3.923,3.363,3.483,3.382,3.088,3.514,3.647,3.678,3.637,3.678,3.647,3.514,3.088,3.382,3.483,3.363,3.923,3.744,3.53,3.228,2.965,2.825,2.831,2.893,2.888,2.916,3.003,3.033,2.964,2.226,3.574,3.953,4.059],"lasers":[{"x":0,"y":-4.092,"z":0,"angle":0,"damage":[75,120],"rate":1,"type":2,"speed":[155,200],"number":1,"spread":0,"error":0,"recoil":0},{"x":1.815,"y":-2.343,"z":0,"angle":0,"damage":[6,8],"rate":4,"type":1,"speed":[180,210],"number":1,"spread":0,"error":2,"recoil":0},{"x":-1.815,"y":-2.343,"z":0,"angle":0,"damage":[6,8],"rate":4,"type":1,"speed":[180,210],"number":1,"spread":0,"error":2,"recoil":0}],"radius":4.099,"next":[501,502]}}' },
        402: { name: "Vanguard", code: '{"name":"Vanguard","level":4,"model":2,"next":[502,503],"size":1.2,"specs":{"shield":{"capacity":[150,200],"reload":[4,6]},"generator":{"capacity":[95,155],"reload":[25,40]},"ship":{"mass":220,"speed":[75,90],"rotation":[80,110],"acceleration":[75,100]}},"bodies":{"main":{"section_segments":11,"offset":{"x":0,"y":-47,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[0,6,12,48,77,110,137,141],"z":[0,0,0,0,0,0,0,0]},"width":[0,22,24,35,37,34,23,0],"height":[0,22,24,35,37,34,23,0],"texture":[9,3,2,8,3,2,3]},"engines":{"section_segments":12,"offset":{"x":28,"y":-27,"z":-10},"position":{"x":[25,-2,-4,-2,0,0],"y":[0,40,74,98,108,105],"z":[18,10,0,0,0,0]},"width":[9,10,9,14,11,0],"height":[2,10,9,14,11,0],"texture":[3,3,3,3,17],"propeller":true},"cockpit":{"section_segments":12,"offset":{"x":0,"y":-30,"z":15},"position":{"x":[0,0,0,0,0],"y":[0,40,66,84,89],"z":[-8,-2,-1,1,20]},"width":[20,30,30,23,0],"height":[20,30,30,23,0],"texture":[9],"propeller":false},"cannons":{"section_segments":8,"offset":{"x":18,"y":-183,"z":8},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[5,0,23,27,62,62,97,102,163],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,5,7,7,4,4,7,7],"height":[0,5,5,7,7,4,4,7,7],"texture":[12,13,4,8,4,4,3,8],"propeller":false,"laser":{"damage":[18,25],"rate":3,"type":2,"speed":[170,220],"recoil":70,"number":1,"error":0}}},"wings":{"outer":{"offset":{"x":37,"y":-115,"z":15},"length":[0,12,12,22,4,38],"width":[165,235,246,232,167,122,35],"angle":[-15,-15,-15,-8,-8,-8],"position":[20,54,54,47,79,100,101],"texture":[4,3,4,4,1,8],"doubleside":true,"bump":{"position":30,"size":4}},"inner":{"offset":{"x":-37,"y":-115,"z":15},"length":[12],"width":[165,112],"angle":[0],"position":[20,0],"texture":[63,63],"doubleside":true,"bump":{"position":30,"size":4}},"winglet":{"offset":{"x":104,"y":-13,"z":55},"length":[45,15,15,45],"width":[25,70,35,70,25],"angle":[-70,-70,-110,-110],"position":[0,0,0,0,0],"texture":[63],"doubleside":true,"bump":{"position":0,"size":5}}},"typespec":{"name":"Vanguard","level":4,"model":2,"code":402,"specs":{"shield":{"capacity":[150,200],"reload":[4,6]},"generator":{"capacity":[95,155],"reload":[25,40]},"ship":{"mass":220,"speed":[75,90],"rotation":[80,110],"acceleration":[75,100]}},"shape":[1.128,4.427,4.643,4.646,4.01,3.568,3.144,2.81,2.808,3.088,3.087,3.077,3.045,2.998,2.935,2.552,2.417,2.317,1.954,1.88,1.891,2.158,2.148,2.228,2.236,2.256,2.236,2.228,2.148,2.158,1.891,1.88,1.954,2.317,2.417,2.552,2.935,2.998,3.045,3.077,3.087,3.088,2.808,2.81,3.144,3.568,4.01,4.646,4.643,4.427],"lasers":[{"x":0.432,"y":-4.392,"z":0.192,"angle":0,"damage":[18,25],"rate":3,"type":2,"speed":[170,220],"number":1,"spread":0,"error":0,"recoil":70},{"x":-0.432,"y":-4.392,"z":0.192,"angle":0,"damage":[18,25],"rate":3,"type":2,"speed":[170,220],"number":1,"spread":0,"error":0,"recoil":70}],"radius":4.646,"next":[502,503]}}' },
        403: { name: "Mercury", code: '{"name":"Mercury","level":4,"model":3,"next":[504,505],"size":1.3,"specs":{"shield":{"capacity":[150,200],"reload":[3,6]},"generator":{"capacity":[100,120],"reload":[30,50]},"ship":{"mass":260,"speed":[90,100],"rotation":[60,90],"acceleration":[70,90]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-45,-50,-40,-30,0,50,100,90],"z":[0,0,0,0,0,0,0,0]},"width":[1,5,15,20,30,35,20,0],"height":[1,5,10,15,25,15,10,0],"texture":[1,4,3,63,11,10,12],"propeller":true,"laser":{"damage":[20,40],"rate":1,"type":2,"speed":[150,210],"number":1,"error":0}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":20,"z":20},"position":{"x":[0,0,0,0,0,0,0],"y":[-40,-20,0,20,50],"z":[0,0,0,0,0]},"width":[0,10,15,10,0],"height":[0,18,25,18,0],"texture":[4,9,4,4],"propeller":false},"sides":{"section_segments":8,"offset":{"x":70,"y":0,"z":-10},"position":{"x":[0,0,0,10,-5,0,0,0],"y":[-115,-80,-100,-30,0,30,100,90],"z":[0,0,0,0,0,0,0,0]},"width":[1,5,10,15,15,20,10,0],"height":[1,5,15,20,35,30,10,0],"texture":[6,6,4,63,63,4,12],"angle":0,"propeller":true},"wingends":{"section_segments":8,"offset":{"x":115,"y":25,"z":-5},"position":{"x":[0,2,4,2,0,0],"y":[-20,-10,0,10,20,15],"z":[0,0,0,0,0,0]},"width":[2,3,6,3,4,0],"height":[5,15,22,17,5,0],"texture":[4,4,4,4,6],"propeller":true,"angle":2,"laser":{"damage":[3,5],"rate":4,"type":1,"speed":[150,180],"number":1,"error":0}}},"wings":{"main":{"length":[80,40],"width":[40,30,20],"angle":[-10,20],"position":[30,50,30],"texture":[11,11],"bump":{"position":30,"size":10},"offset":{"x":0,"y":0,"z":0}},"font":{"length":[80,30],"width":[20,15],"angle":[-10,20],"position":[-20,-40],"texture":[63],"bump":{"position":30,"size":10},"offset":{"x":0,"y":0,"z":0}}},"typespec":{"name":"Mercury","level":4,"model":3,"code":403,"specs":{"shield":{"capacity":[150,200],"reload":[3,6]},"generator":{"capacity":[100,120],"reload":[30,50]},"ship":{"mass":260,"speed":[90,100],"rotation":[60,90],"acceleration":[70,90]}},"shape":[1.303,1.306,1.221,1.135,3.514,3.457,3.283,3.008,2.819,2.69,2.614,2.461,2.233,3.14,3.312,3.323,3.182,2.865,2.958,3.267,3.33,3.079,2.187,2.651,2.647,2.605,2.647,2.651,2.187,3.079,3.33,3.267,2.958,2.865,3.182,3.323,3.312,3.14,2.233,2.461,2.614,2.69,2.819,3.008,3.283,3.457,3.514,1.135,1.221,1.306],"lasers":[{"x":0,"y":-1.3,"z":0.26,"angle":0,"damage":[20,40],"rate":1,"type":2,"speed":[150,210],"number":1,"spread":0,"error":0,"recoil":0},{"x":2.972,"y":0.13,"z":-0.13,"angle":2,"damage":[3,5],"rate":4,"type":1,"speed":[150,180],"number":1,"spread":0,"error":0,"recoil":0},{"x":-2.972,"y":0.13,"z":-0.13,"angle":-2,"damage":[3,5],"rate":4,"type":1,"speed":[150,180],"number":1,"spread":0,"error":0,"recoil":0}],"radius":3.514,"next":[504,505]}}' },
        404: { name: "X-Warrior", code: '{"name":"X-Warrior","level":4,"model":4,"next":[505,506],"size":1.6,"specs":{"shield":{"capacity":[150,200],"reload":[3,5]},"generator":{"capacity":[90,150],"reload":[35,55]},"ship":{"mass":245,"speed":[75,100],"rotation":[50,90],"acceleration":[90,110]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-100,-99,-50,0,10,30,50,80,100,90],"z":[-10,-10,-5,0,0,0,0,0,0,0,0]},"width":[0,5,30,35,25,30,50,50,20,0],"height":[0,5,20,20,20,20,20,20,10,0],"texture":[4,2,10,2,63,11,4,63,12],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-20,"z":5},"position":{"x":[0,0,0,0,0,0,0],"y":[-30,-20,0,30,40],"z":[0,0,0,0,0]},"width":[0,10,15,10,0],"height":[0,18,25,18,0],"texture":9,"propeller":false},"frontcannons":{"section_segments":12,"offset":{"x":30,"y":-70,"z":0},"position":{"x":[0,0,0,0,0],"y":[-30,-20,0,20,30],"z":[0,0,0,0,0]},"width":[3,5,5,5,3],"height":[3,5,15,15,3],"texture":[6,4,4,6],"angle":0,"laser":{"damage":[5,9],"rate":3,"type":1,"speed":[120,200],"number":1,"error":0}},"wingendtop":{"section_segments":12,"offset":{"x":105,"y":50,"z":40},"position":{"x":[0,0,0,0,0,0,0],"y":[-65,-70,-20,0,20,30,5],"z":[0,0,0,0,0,0,0]},"width":[0,2,3,7,7,5,0],"height":[0,2,3,7,7,5,0],"texture":[12,63,63,11,63,12],"angle":0},"wingendbottom":{"section_segments":12,"offset":{"x":105,"y":50,"z":-40},"position":{"x":[0,0,0,0,0,0,0],"y":[-65,-70,-20,0,20,30,25],"z":[0,0,0,0,0,0,0]},"width":[0,2,3,7,7,5,0],"height":[0,2,3,7,7,5,0],"texture":[12,63,63,11,63,12],"angle":0,"laser":{"damage":[3,6],"rate":2.5,"type":1,"speed":[100,180],"number":1,"error":0}},"propellers":{"section_segments":12,"offset":{"x":40,"y":60,"z":0},"position":{"x":[0,0,5,3,5,0,0],"y":[-35,-40,-30,0,40,50,40],"z":[0,0,0,0,0,0,0]},"width":[0,5,10,10,15,10,0],"height":[0,5,25,30,25,5,0],"texture":4,"angle":0,"propeller":true}},"wings":{"xwing1":{"doubleside":true,"offset":{"x":0,"y":70,"z":0},"length":[80,35],"width":[50,40,30],"angle":[20,20],"position":[0,-10,-20],"texture":[1,10],"bump":{"position":10,"size":20}},"xwing2":{"doubleside":true,"offset":{"x":0,"y":70,"z":0},"length":[80,35],"width":[50,40,30],"angle":[-20,-20],"position":[0,-10,-20],"texture":[1,1],"bump":{"position":10,"size":20}},"winglets2":{"offset":{"x":30,"y":-40,"z":0},"length":[20,10],"width":[30,20,5],"angle":[-10,20],"position":[0,0,0],"texture":63,"bump":{"position":30,"size":10}}},"typespec":{"name":"X-Warrior","level":4,"model":4,"code":404,"specs":{"shield":{"capacity":[150,200],"reload":[3,5]},"generator":{"capacity":[90,150],"reload":[35,55]},"ship":{"mass":245,"speed":[75,100],"rotation":[50,90],"acceleration":[90,110]}},"shape":[3.2,3.096,3.365,3.37,2.625,2.149,2.266,2.325,2.329,1.208,1.156,3.483,3.455,3.472,3.565,3.811,4.087,4.351,4.352,3.594,3.502,3.848,3.867,3.701,3.258,3.206,3.258,3.701,3.867,3.848,3.502,3.594,4.352,4.351,4.087,3.811,3.565,3.472,3.455,3.483,1.156,1.208,2.329,2.325,2.266,2.149,2.625,3.37,3.365,3.096],"lasers":[{"x":0.96,"y":-3.2,"z":0,"angle":0,"damage":[5,9],"rate":3,"type":1,"speed":[120,200],"number":1,"spread":0,"error":0,"recoil":0},{"x":-0.96,"y":-3.2,"z":0,"angle":0,"damage":[5,9],"rate":3,"type":1,"speed":[120,200],"number":1,"spread":0,"error":0,"recoil":0},{"x":3.36,"y":-0.64,"z":-1.28,"angle":0,"damage":[3,6],"rate":2.5,"type":1,"speed":[100,180],"number":1,"spread":0,"error":0,"recoil":0},{"x":-3.36,"y":-0.64,"z":-1.28,"angle":0,"damage":[3,6],"rate":2.5,"type":1,"speed":[100,180],"number":1,"spread":0,"error":0,"recoil":0}],"radius":4.352,"next":[505,506]}}' },
        405: { name: "Side-Interceptor", code: '{"name":"Side-Interceptor","level":4,"model":5,"next":[507,508],"size":1.6,"specs":{"shield":{"capacity":[175,225],"reload":[3,6]},"generator":{"capacity":[100,150],"reload":[30,40]},"ship":{"mass":140,"speed":[95,125],"rotation":[50,100],"acceleration":[110,140]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-30,-22,-15,0,15,22,30,20],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[5,10,25,30,25,10,15,0],"height":[5,10,25,30,25,10,15,0],"texture":[1,3,63,63,3,4,12],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-20,"z":0},"position":{"x":[0,0,0,0,0,0,0],"y":[-10,-8,0],"z":[0,0,0]},"width":[0,10,10],"height":[0,10,10],"texture":[5,9,5],"propeller":false},"cannons":{"section_segments":12,"offset":{"x":60,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0],"y":[-25,-30,-20,0,20,30,20],"z":[0,0,0,0,0,0,0]},"width":[0,3,5,5,5,3,0],"height":[0,3,5,5,5,3,0],"texture":[12,6,63,63,6,12],"angle":0,"laser":{"damage":[5,7],"rate":7,"type":1,"speed":[125,225],"number":1,"error":5}}},"wings":{"wings1":{"doubleside":true,"offset":{"x":60,"y":20,"z":0},"length":[-20,-10,-40],"width":[50,50,130,30],"angle":[280,315,315],"position":[0,0,-50,0],"texture":4,"bump":{"position":10,"size":-10}},"wings2":{"doubleside":true,"offset":{"x":60,"y":20,"z":0},"length":[20,10,40],"width":[50,50,130,30],"angle":[-100,-135,-135],"position":[0,0,-50,0],"texture":4,"bump":{"position":10,"size":10}},"join":{"doubleside":true,"offset":{"x":0,"y":0,"z":0},"length":[61],"width":[10,6],"angle":[0],"position":[0,0,0,50],"texture":63,"bump":{"position":10,"size":20}}},"typespec":{"name":"Side-Interceptor","level":4,"model":5,"code":405,"specs":{"shield":{"capacity":[175,225],"reload":[3,6]},"generator":{"capacity":[100,150],"reload":[30,40]},"ship":{"mass":140,"speed":[95,125],"rotation":[50,100],"acceleration":[110,140]}},"shape":[0.962,0.973,0.948,0.951,3.427,3.044,2.657,2.383,2.207,2.233,2.2,2.147,2.096,2.096,2.147,2.2,2.233,2.37,2.4,1.63,1.451,1.323,1.061,1.009,0.977,0.962,0.977,1.009,1.061,1.323,1.451,1.63,2.4,2.37,2.233,2.2,2.147,2.096,2.096,2.147,2.2,2.233,2.207,2.383,2.657,3.044,3.427,0.951,0.948,0.973],"lasers":[{"x":1.92,"y":-0.96,"z":0,"angle":0,"damage":[5,7],"rate":7,"type":1,"speed":[125,225],"number":1,"spread":0,"error":5,"recoil":0},{"x":-1.92,"y":-0.96,"z":0,"angle":0,"damage":[5,7],"rate":7,"type":1,"speed":[125,225],"number":1,"spread":0,"error":5,"recoil":0}],"radius":3.427,"next":[507,508]}}' },
        406: { name: "Pioneer", code: '{"name":"Pioneer","level":4,"model":6,"next":[508,509],"size":1.6,"specs":{"shield":{"capacity":[175,230],"reload":[4,7]},"generator":{"capacity":[50,100],"reload":[25,30]},"ship":{"mass":280,"speed":[90,120],"rotation":[45,80],"acceleration":[65,105]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-100,-60,-10,0,20,50,80,100,90],"z":[-10,-5,0,0,0,0,0,0,0,0]},"width":[5,50,50,30,40,50,50,20,0],"height":[5,20,20,20,30,30,20,10,0],"texture":[2,10,2,4,11,11,63,12],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-40,"z":10},"position":{"x":[0,0,0,0,0,0,0],"y":[-30,-20,0,30,40],"z":[0,0,0,0,0]},"width":[0,10,15,10,0],"height":[0,18,25,18,0],"texture":[9],"propeller":false},"cannons":{"section_segments":12,"offset":{"x":30,"y":-70,"z":0},"position":{"x":[0,0,0,0,0],"y":[-30,-20,0,20,30],"z":[0,0,0,0,0]},"width":[3,5,5,5,3],"height":[3,5,15,15,3],"texture":[6,4,4,6],"angle":0,"laser":{"damage":[6,11],"rate":3,"type":1,"speed":[120,180],"number":1,"error":0}},"shield":{"section_segments":12,"offset":{"x":60,"y":-40,"z":0},"position":{"x":[0,5,3,5,0,0],"y":[-30,-20,0,20,30,20],"z":[0,0,0,0,0,0]},"width":[5,10,10,10,5,0],"height":[5,25,30,25,5,0],"propeller":true,"texture":4,"angle":0},"shield2":{"section_segments":12,"offset":{"x":60,"y":60,"z":0},"position":{"x":[0,5,3,5,0,0],"y":[-30,-20,0,20,30,20],"z":[0,0,0,0,0,0]},"width":[5,10,10,10,5,0],"height":[5,25,30,25,5,0],"propeller":true,"texture":4,"angle":0}},"wings":{"join":{"offset":{"x":40,"y":-40,"z":0},"length":[31],"width":[40,20],"angle":[0],"position":[0,0,0,50],"texture":[63],"bump":{"position":0,"size":10}},"join2":{"offset":{"x":40,"y":60,"z":0},"length":[31],"width":[40,20],"angle":[0],"position":[0,0,0,50],"texture":[63],"bump":{"position":0,"size":10}}},"typespec":{"name":"Pioneer","level":4,"model":6,"code":406,"specs":{"shield":{"capacity":[175,230],"reload":[4,7]},"generator":{"capacity":[50,100],"reload":[25,30]},"ship":{"mass":280,"speed":[90,120],"rotation":[45,80],"acceleration":[65,105]}},"shape":[3.204,3.168,3.365,3.37,2.625,2.907,3.057,3.073,2.942,2.664,2.548,2.441,1.29,1.032,1.136,1.287,2.732,2.911,3.245,3.523,3.553,3.411,3.132,3.263,3.258,3.206,3.258,3.263,3.132,3.411,3.553,3.523,3.245,2.911,2.732,1.287,1.136,1.032,1.29,2.441,2.548,2.664,2.942,3.073,3.057,2.907,2.625,3.37,3.365,3.168],"lasers":[{"x":0.96,"y":-3.2,"z":0,"angle":0,"damage":[6,11],"rate":3,"type":1,"speed":[120,180],"number":1,"spread":0,"error":0,"recoil":0},{"x":-0.96,"y":-3.2,"z":0,"angle":0,"damage":[6,11],"rate":3,"type":1,"speed":[120,180],"number":1,"spread":0,"error":0,"recoil":0}],"radius":3.553,"next":[508,509]}}' },
        501: { name: "FuryStar", code: '{"name":"FuryStar","level":5,"model":1,"next":[601,602],"size":1.5,"specs":{"shield":{"capacity":[225,300],"reload":[6,7]},"generator":{"capacity":[100,150],"reload":[32,42]},"ship":{"mass":270,"speed":[70,100],"rotation":[110,160],"acceleration":[120,150]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":5},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-50,-45,0,10,15,35,55,40],"z":[0,0,0,0,0,0,0,0]},"width":[0,20,25,17,25,20,15,0],"height":[0,15,15,15,20,20,15,0],"texture":[1,4,63,4,2,12,17],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-43,"z":5},"position":{"x":[0,0,0,0,0,0,0],"y":[-10,-4,10],"z":[-5,0,0]},"width":[1,18,20],"height":[1,15,10],"texture":[9]},"missiles":{"section_segments":12,"offset":{"x":35,"y":-5,"z":10},"position":{"x":[0,0,0,0,0],"y":[-30,-23,0,23,30],"z":[0,0,0,0,0]},"width":[0,5,5,5,0],"height":[0,5,5,5,0],"texture":[6,4,4,10],"angle":0,"laser":{"damage":[1,2],"rate":4,"type":1,"speed":[100,125],"number":1,"error":0}},"cannon":{"section_segments":6,"offset":{"x":15,"y":-10,"z":-15},"position":{"x":[0,0,0,0,0,0],"y":[-40,-50,-20,0,20,30],"z":[0,0,0,0,0,20]},"width":[0,5,8,11,7,0],"height":[0,5,8,11,10,0],"angle":0,"laser":{"damage":[14,20],"rate":2,"type":1,"speed":[200,250],"number":1,"error":0},"propeller":false,"texture":[3,3,10,3]},"top_propulsors":{"section_segments":10,"offset":{"x":75,"y":45,"z":40},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-20,-15,0,10,20,25,30,40,80,70],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,10,15,15,15,10,10,15,10,0],"height":[0,10,15,15,15,10,10,15,5,0],"propeller":true,"texture":[4,4,2,2,5,63,5,63,17]},"bottom_propulsors":{"section_segments":10,"offset":{"x":100,"y":0,"z":-40},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-20,-15,0,10,20,25,30,40,80,70],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,10,15,15,15,10,10,15,10,0],"height":[0,10,15,15,15,10,10,15,5,0],"propeller":true,"texture":[4,4,2,2,5,63,5,4,17]}},"wings":{"rooftop":{"doubleside":true,"offset":{"x":0,"y":-20,"z":20},"length":[20,15,25,25,5],"width":[50,40,35,35,35,30],"angle":[0,-20,30,30,30],"position":[0,10,20,50,80,100],"texture":[8,63,3,3],"bump":{"position":-40,"size":5}},"bottom":{"doubleside":true,"offset":{"x":10,"y":-20,"z":0},"length":[30,30,30],"width":[60,50,50,50],"angle":[-27,-27,-27],"position":[0,10,30,40],"texture":[1],"bump":{"position":-40,"size":5}},"topwinglets":{"doubleside":true,"offset":{"x":80,"y":87,"z":45},"length":[20],"width":[40,30],"angle":[60],"position":[0,50],"texture":[63],"bump":{"position":10,"size":10}},"bottomwinglets":{"doubleside":true,"offset":{"x":100,"y":50,"z":-45},"length":[20],"width":[40,30],"angle":[-60],"position":[0,50],"texture":[4],"bump":{"position":10,"size":10}}},"typespec":{"name":"FuryStar","level":5,"model":1,"code":501,"specs":{"shield":{"capacity":[225,300],"reload":[6,7]},"generator":{"capacity":[100,150],"reload":[32,42]},"ship":{"mass":270,"speed":[70,100],"rotation":[110,160],"acceleration":[120,150]}},"shape":[1.59,1.832,1.891,1.874,1.458,1.479,1.524,1.571,1.645,1.757,1.925,3.322,3.427,3.455,3.48,3.666,3.822,4.057,4.521,4.774,5.039,5.299,1.577,1.71,1.679,1.653,1.679,1.71,1.577,5.299,5.039,4.774,4.521,4.057,3.822,3.666,3.48,3.455,3.428,3.322,1.925,1.757,1.645,1.571,1.524,1.479,1.458,1.874,1.891,1.832],"lasers":[{"x":1.05,"y":-1.05,"z":0.3,"angle":0,"damage":[1,2],"rate":4,"type":1,"speed":[100,125],"number":1,"spread":0,"error":0,"recoil":0},{"x":-1.05,"y":-1.05,"z":0.3,"angle":0,"damage":[1,2],"rate":4,"type":1,"speed":[100,125],"number":1,"spread":0,"error":0,"recoil":0},{"x":0.45,"y":-1.8,"z":-0.45,"angle":0,"damage":[14,20],"rate":2,"type":1,"speed":[200,250],"number":1,"spread":0,"error":0,"recoil":0},{"x":-0.45,"y":-1.8,"z":-0.45,"angle":0,"damage":[14,20],"rate":2,"type":1,"speed":[200,250],"number":1,"spread":0,"error":0,"recoil":0}],"radius":5.299,"next":[601,602]}}' },
        502: { name: "U-Sniper", code: '{"name":"U-Sniper","level":5,"model":2,"next":[602,603],"size":1.8,"specs":{"shield":{"capacity":[230,310],"reload":[4,6]},"generator":{"capacity":[90,160],"reload":[40,60]},"ship":{"mass":220,"speed":[70,90],"rotation":[55,75],"acceleration":[70,120]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0,0,0],"y":[0,-10,40,100,90,100],"z":[0,0,0,0,0,0]},"width":[0,10,23,10,0],"height":[0,5,23,10,0],"texture":[12,1,10,12],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":0,"z":30},"position":{"x":[0,0,0,0],"y":[20,40,80],"z":[-4,0,-6]},"width":[5,10,5],"height":[0,8,0],"texture":[9]},"uwings":{"section_segments":8,"offset":{"x":50,"y":-20,"z":-10},"position":{"x":[0,0,0,0,0,0],"y":[-90,-100,40,80,90,100],"z":[0,0,0,0,0,0]},"width":[0,10,25,20,0],"height":[0,5,25,20,0],"texture":[12,2,3,4]},"cannons":{"section_segments":12,"offset":{"x":70,"y":20,"z":0},"position":{"x":[0,0,0,0,0,0,0],"y":[-60,-70,-20,0,20,50,45],"z":[0,0,0,0,0,0,0]},"width":[0,5,6,10,15,5,0],"height":[0,5,5,10,10,5,0],"angle":0,"laser":{"damage":[40,60],"rate":2,"type":2,"speed":[210,260],"recoil":220,"number":1,"error":0},"propeller":false,"texture":[4,4,10,4,63,4]},"side_propulsors":{"section_segments":10,"offset":{"x":30,"y":30,"z":5},"position":{"x":[0,0,0,0,0,0,0],"y":[0,10,13,25,30,40,60,50],"z":[0,0,0,0,0,0,0,0]},"width":[0,5,10,10,10,5,5,10,5,0],"height":[0,5,10,10,10,5,5,10,5,0],"propeller":true,"texture":[5,2,11,2,63,11,12]}},"typespec":{"name":"U-Sniper","level":5,"model":2,"code":502,"specs":{"shield":{"capacity":[230,310],"reload":[4,6]},"generator":{"capacity":[90,160],"reload":[40,60]},"ship":{"mass":220,"speed":[70,90],"rotation":[55,75],"acceleration":[70,120]}},"shape":[0.361,0.366,0.378,4.774,4.83,4.17,3.608,3.248,3.245,3.083,2.915,2.807,2.751,2.829,2.976,3.22,3.412,3.521,3.693,3.681,3.138,2.937,3.473,3.407,3.618,3.607,3.618,3.407,3.473,2.937,3.138,3.681,3.693,3.521,3.412,3.22,2.976,2.829,2.751,2.807,2.915,3.083,3.245,3.248,3.608,4.17,4.83,4.774,0.378,0.366],"lasers":[{"x":2.52,"y":-1.8,"z":0,"angle":0,"damage":[40,60],"rate":2,"type":2,"speed":[210,260],"number":1,"spread":0,"error":0,"recoil":220},{"x":-2.52,"y":-1.8,"z":0,"angle":0,"damage":[40,60],"rate":2,"type":2,"speed":[210,260],"number":1,"spread":0,"error":0,"recoil":220}],"radius":4.83,"next":[602,603]}}' },
        503: { name: "Khepri", code: '{"name":"Khepri","level":5,"model":3,"next":[604,605],"size":1.5,"specs":{"shield":{"capacity":[200,275],"reload":[4,6]},"generator":{"capacity":[100,125],"reload":[25,40]},"ship":{"mass":240,"speed":[85,105],"rotation":[85,115],"acceleration":[130,170]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":-30,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-85,-80,-85,-60,-35,-4,38,53,86,125,120],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,7,9,17,22,25,27,29,25,22,0],"height":[0,7,8,13,23,26,26,24,22,17,0],"texture":[17,4,13,63,4,10,63,4,12,17],"propeller":true,"laser":{"damage":[35,45],"rate":6,"type":1,"speed":[175,225],"number":1,"error":3,"recoil":60}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":30,"z":19},"position":{"x":[0,0,0,0,0,0],"y":[-95,-63,-31,-16,-4,-5],"z":[-6,1,0,-3,-3,0]},"width":[11,14,13,10,3,0],"height":[10,12,16,17,16,0],"texture":[9,9,63,3,63],"propeller":false},"Thrusters":{"section_segments":12,"offset":{"x":27,"y":20,"z":-10},"position":{"x":[0,0,0,0,0,0,0],"y":[-65,-50,-25,-8,40,60,50],"z":[0,0,0,0,0,0,0]},"width":[0,5,7,8,8,7,0],"height":[0,5,9,12,8,9,0],"texture":[4,63,4,18,13,12],"propeller":true,"angle":0}},"wings":{"wing0":{"doubleside":true,"length":[16,20,0,32],"width":[98,87,77,113,3],"angle":[-1,-5,-5,-6],"position":[-19,35,50,50,-10],"offset":{"x":23,"y":25,"z":3},"bump":{"position":40,"size":7},"texture":[3,4,13,63]},"wing1":{"doubleside":true,"length":[2,35],"width":[77,53,17],"angle":[10,0,11],"position":[25,25,-10],"offset":{"x":25,"y":0,"z":-8},"bump":{"position":0,"size":5},"texture":[13,13]},"winglets":{"offset":{"x":0,"y":33,"z":22},"length":[9,18],"width":[15,25,80],"angle":[0,-20],"position":[0,-5,30],"texture":[4,63],"bump":{"position":10,"size":30}},"winglets2":{"offset":{"x":0,"y":33,"z":22},"length":[9,13],"width":[15,25,120],"angle":[90,90,0],"position":[0,-5,50],"texture":[4,63],"bump":{"position":10,"size":30}}},"typespec":{"name":"Khepri","level":5,"model":3,"code":503,"specs":{"shield":{"capacity":[200,275],"reload":[4,6]},"generator":{"capacity":[100,125],"reload":[25,40]},"ship":{"mass":240,"speed":[85,105],"rotation":[85,115],"acceleration":[130,170]}},"shape":[3.457,3.461,2.734,2.099,1.652,1.541,1.408,1.316,1.204,1.127,1.94,1.918,1.874,1.828,2.767,2.771,2.83,2.933,3.106,3.347,3.702,4.214,4.323,3.167,2.901,4.259,2.901,3.167,4.323,4.214,3.702,3.347,3.106,2.933,2.83,2.771,2.767,1.828,1.874,1.918,1.94,1.127,1.204,1.316,1.408,1.541,1.652,2.099,2.734,3.461],"lasers":[{"x":0,"y":-3.45,"z":0,"angle":0,"damage":[35,45],"rate":6,"type":1,"speed":[175,225],"number":1,"spread":0,"error":3,"recoil":60}],"radius":4.323,"next":[604,605]}}' },
        504: { name: "Toscain", code: '{"name":"Toscain","level":5,"model":4,"next":[605,606],"size":1.7,"zoom":1.08,"specs":{"shield":{"capacity":[275,350],"reload":[5,8]},"generator":{"capacity":[75,100],"reload":[35,53]},"ship":{"mass":270,"speed":[70,100],"rotation":[55,80],"acceleration":[85,115]}},"bodies":{"front":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0],"y":[-100,-95,-25,0,25],"z":[0,0,0,0,0]},"width":[0,20,40,40,20],"height":[0,10,35,20,5],"texture":[63,11,2,63],"laser":{"damage":[30,50],"rate":1,"type":2,"speed":[190,220],"number":1,"recoil":50,"error":0}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0,0],"y":[-70,-70,-25,0,100],"z":[0,0,0,0,10]},"width":[0,10,15,15,10],"height":[0,15,35,20,0],"texture":[9,9,9,4]},"lasers":{"section_segments":8,"angle":15,"offset":{"x":1,"y":-5,"z":-3},"position":{"x":[0,0,0],"y":[-90,-70,-100],"z":[0,0,0]},"width":[5,5,0],"height":[5,5,0],"texture":[6],"laser":{"damage":[4,6],"rate":2,"type":1,"speed":[100,130],"number":2,"angle":35,"error":0}},"motor":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0],"y":[10,20,30,100,95],"z":[0,0,0,0,0]},"width":[0,40,50,50,0],"height":[0,10,15,20,0],"texture":[63,63,10,4]},"propulsors":{"section_segments":8,"offset":{"x":25,"y":0,"z":0},"position":{"x":[0,0,0],"y":[30,105,100],"z":[0,0,0]},"width":[15,15,0],"height":[10,10,0],"propeller":true,"texture":[12]}},"wings":{"main":{"doubleside":true,"offset":{"x":30,"y":80,"z":0},"length":[70,20],"width":[80,20],"angle":[0,0],"position":[-20,0],"texture":[11],"bump":{"position":20,"size":10}},"winglets":{"doubleside":true,"offset":{"x":98,"y":81,"z":-20},"length":[20,50,20],"width":[20,35,20],"angle":[90,90,90],"position":[0,0,0,0],"texture":[63],"bump":{"position":30,"size":50}}},"typespec":{"name":"Toscain","level":5,"model":4,"code":504,"specs":{"shield":{"capacity":[275,350],"reload":[5,8]},"generator":{"capacity":[75,100],"reload":[35,53]},"ship":{"mass":270,"speed":[70,100],"rotation":[55,80],"acceleration":[85,115]}},"shape":[3.4,3.354,3.556,2.748,2.336,2.055,1.858,1.732,1.634,1.548,1.462,1.404,1.371,1.36,1.241,1.161,1.723,4.485,5.01,4.795,4.111,3.842,3.82,3.753,3.634,3.407,3.634,3.753,3.82,3.842,4.111,4.795,5.01,4.485,1.723,1.161,1.241,1.353,1.371,1.404,1.462,1.548,1.634,1.732,1.858,2.055,2.336,2.748,3.556,3.354],"lasers":[{"x":0,"y":-3.4,"z":0,"angle":0,"damage":[30,50],"rate":1,"type":2,"speed":[190,220],"number":1,"spread":0,"error":0,"recoil":50},{"x":-0.846,"y":-3.454,"z":-0.102,"angle":15,"damage":[4,6],"rate":2,"type":1,"speed":[100,130],"number":2,"spread":35,"error":0,"recoil":0},{"x":0.846,"y":-3.454,"z":-0.102,"angle":-15,"damage":[4,6],"rate":2,"type":1,"speed":[100,130],"number":2,"spread":35,"error":0,"recoil":0}],"radius":5.01,"next":[605,606]}}' },
        505: { name: "T-Warrior", code: '{"name":"T-Warrior","level":5,"model":5,"next":[606,607],"size":1.6,"specs":{"shield":{"capacity":[225,325],"reload":[5,8]},"generator":{"capacity":[80,140],"reload":[35,50]},"ship":{"mass":280,"speed":[85,105],"rotation":[50,80],"acceleration":[90,120]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0],"y":[-95,-100,-98,-70,0,90,91],"z":[0,0,0,0,0,0,0]},"width":[0,5,6,20,30,20,3],"height":[0,2,4,20,30,25,3],"texture":[12,5,63,1,10,12]},"cannon":{"section_segments":6,"offset":{"x":0,"y":-45,"z":-15},"position":{"x":[0,0,0,0,0,0],"y":[-40,-50,-20,0,20,30],"z":[0,0,0,0,0,20]},"width":[0,5,8,11,7,0],"height":[0,5,8,11,10,0],"angle":0,"laser":{"damage":[7,12],"rate":5,"type":1,"speed":[130,160],"number":5,"angle":30,"error":0},"propeller":false,"texture":[3,3,10,3]},"back":{"section_segments":10,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0],"y":[90,95,95],"z":[0,0,0]},"width":[15,18,2],"height":[18,23,2],"texture":[63]},"cockpit":{"section_segments":8,"offset":{"x":0,"y":0,"z":20},"position":{"x":[0,0,0,0,0,0],"y":[-50,-40,-25,0,5],"z":[0,0,0,0,9,9]},"width":[0,10,15,10,0],"height":[0,10,15,16,0],"texture":[9]},"top_propulsor":{"section_segments":10,"offset":{"x":0,"y":30,"z":60},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-20,-15,0,10,20,25,30,40,100,90],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,15,20,20,20,15,15,20,10,0],"height":[0,15,20,20,20,15,15,20,10,0],"texture":[4,63,1,1,1,63,1,1,12],"propeller":true},"side_propulsors":{"section_segments":10,"offset":{"x":80,"y":30,"z":-30},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-20,-15,0,10,20,25,30,40,100,90],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,15,20,20,20,15,15,20,10,0],"height":[0,15,20,20,20,15,15,20,10,0],"texture":[4,63,1,1,1,63,1,1,12],"propeller":true}},"wings":{"top_join":{"offset":{"x":0,"y":50,"z":0},"length":[60],"width":[70,30],"angle":[90],"position":[0,0,0,50],"texture":[11],"bump":{"position":10,"size":20}},"side_joins":{"offset":{"x":0,"y":50,"z":0},"length":[80],"width":[70,30],"angle":[-20],"position":[0,0,0,50],"texture":[11],"bump":{"position":10,"size":20}}},"typespec":{"name":"T-Warrior","level":5,"model":5,"code":505,"specs":{"shield":{"capacity":[225,325],"reload":[5,8]},"generator":{"capacity":[80,140],"reload":[35,50]},"ship":{"mass":280,"speed":[85,105],"rotation":[50,80],"acceleration":[90,120]}},"shape":[3.204,3.125,2.591,2.145,1.713,1.46,1.282,1.155,1.073,1.009,0.977,0.955,0.957,2.594,3.217,3.408,3.55,3.898,4.204,4.633,5.051,4.926,2.67,2.95,4.171,4.168,4.171,2.95,2.67,4.926,5.051,4.633,4.204,3.898,3.55,3.408,3.217,2.594,0.96,0.955,0.977,1.009,1.073,1.155,1.282,1.46,1.713,2.145,2.591,3.125],"lasers":[{"x":0,"y":-3.04,"z":-0.48,"angle":0,"damage":[7,12],"rate":5,"type":1,"speed":[130,160],"number":5,"spread":30,"error":0,"recoil":0}],"radius":5.051,"next":[606,607]}}' },
        506: { name: "Aetos", code: '{"name":"Aetos","level":5,"model":6,"next":[607,608],"size":1.5,"zoom":0.96,"specs":{"shield":{"capacity":[200,300],"reload":[5,7]},"generator":{"capacity":[90,140],"reload":[40,50]},"ship":{"mass":250,"speed":[90,110],"rotation":[70,90],"acceleration":[110,120]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0],"y":[-100,-99,-98,-50,0,100,80],"z":[0,0,0,0,0,0,0]},"width":[0,5,6,17,28,20,0],"height":[0,2,4,15,25,25,0],"texture":[4,6,10,10,11,12],"propeller":true,"laser":{"damage":[10,15],"rate":4,"type":1,"speed":[140,200],"number":1,"angle":0,"error":0}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-60,"z":10},"position":{"x":[0,0,0,0,0,0,0],"y":[-10,0,20,30,40],"z":[0,0,0,0,0]},"width":[0,5,10,10,0],"height":[0,5,10,12,0],"texture":[9]},"lasers":{"section_segments":8,"offset":{"x":81,"y":-15,"z":-30},"position":{"x":[0,0,0,0,0],"y":[25,70,10,80,90],"z":[0,0,0,0,0]},"width":[5,0,0,5,0],"height":[5,5,0,5,0],"texture":[63,63,6],"angle":2,"laser":{"damage":[3,8],"rate":7,"type":1,"speed":[120,180],"number":1,"angle":0,"error":0}}},"wings":{"top":{"doubleside":true,"offset":{"x":15,"y":40,"z":0},"length":[50],"width":[70,30],"angle":[70],"position":[0,30],"texture":[63],"bump":{"position":10,"size":10}},"main":{"doubleside":true,"offset":{"x":0,"y":25,"z":15},"length":[90,40],"width":[70,50,30],"angle":[-30,-40],"position":[30,20,-20],"texture":[8,63],"bump":{"position":10,"size":10}}},"typespec":{"name":"Aetos","level":5,"model":6,"code":506,"specs":{"shield":{"capacity":[200,300],"reload":[5,7]},"generator":{"capacity":[90,140],"reload":[40,50]},"ship":{"mass":250,"speed":[90,110],"rotation":[70,90],"acceleration":[110,120]}},"shape":[3,2.917,2.069,1.61,1.343,1.158,1.037,0.95,0.895,0.853,0.83,0.824,3.271,3.283,3.312,3.232,3.135,3.283,3.38,3.09,2.882,2.75,2.726,3.059,3.054,3.006,3.054,3.059,2.726,2.75,2.882,3.09,3.38,3.283,3.135,3.232,3.312,3.283,3.271,0.824,0.83,0.853,0.895,0.95,1.037,1.158,1.343,1.61,2.069,2.917],"lasers":[{"x":0,"y":-3,"z":0,"angle":0,"damage":[10,15],"rate":4,"type":1,"speed":[140,200],"number":1,"spread":0,"error":0,"recoil":0},{"x":2.44,"y":-0.15,"z":-0.9,"angle":2,"damage":[3,8],"rate":7,"type":1,"speed":[120,180],"number":1,"spread":0,"error":0,"recoil":0},{"x":-2.44,"y":-0.15,"z":-0.9,"angle":-2,"damage":[3,8],"rate":7,"type":1,"speed":[120,180],"number":1,"spread":0,"error":0,"recoil":0}],"radius":3.38,"next":[607,608]}}' },
        507: { name: "Shadow X-2", code: '{"name":"Shadow X-2","level":5,"model":7,"next":[608,609],"size":1.3,"specs":{"shield":{"capacity":[170,240],"reload":[7,9]},"generator":{"capacity":[80,145],"reload":[20,34]},"ship":{"mass":200,"speed":[110,145],"rotation":[35,55],"acceleration":[90,130]}},"bodies":{"main":{"section_segments":10,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-100,-98,-95,-70,-40,0,40,70,80,90,100],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,5,10,20,30,20,20,30,30,30,20,0],"height":[0,4,4,20,20,10,10,15,15,15,10,10],"texture":[12,5,63,4,4,3,4,4,5]},"thrusters":{"section_segments":10,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0],"y":[90,95,100,105,90],"z":[0,0,0,0,0]},"width":[10,15,18,19,2],"height":[3,5,7,8,2],"texture":[63],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-25,"z":12},"position":{"x":[0,0,0,0,0,0],"y":[-45,-40,-25,0,5],"z":[0,0,0,0,0,0]},"width":[0,10,15,5,0],"height":[0,10,15,5,0],"texture":[9]},"laser":{"section_segments":10,"offset":{"x":50,"y":10,"z":-13},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-30,-25,0,10,20,25,30,40,70,60],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,10,15,15,15,10,10,15,10,0],"height":[0,10,15,15,15,10,10,15,5,0],"texture":[6,4,10,3,4,3,2],"propeller":true,"laser":{"damage":[6,9],"rate":10,"type":1,"speed":[160,190],"number":1}}},"wings":{"top":{"doubleside":true,"offset":{"x":10,"y":60,"z":5},"length":[30],"width":[50,30],"angle":[60],"position":[0,50],"texture":[3],"bump":{"position":10,"size":10}},"side":{"doubleside":true,"offset":{"x":10,"y":70,"z":5},"length":[30],"width":[40,20],"angle":[-13],"position":[0,60],"texture":[63],"bump":{"position":10,"size":10}},"wings":{"offset":{"x":0,"y":35,"z":0},"length":[80],"width":[100,70],"angle":[0],"position":[-80,50],"texture":[4],"bump":{"position":10,"size":15}}},"typespec":{"name":"Shadow X-2","level":5,"model":7,"code":507,"specs":{"shield":{"capacity":[170,240],"reload":[7,9]},"generator":{"capacity":[80,145],"reload":[20,34]},"ship":{"mass":200,"speed":[110,145],"rotation":[35,55],"acceleration":[90,130]}},"shape":[2.6,2.53,2.111,1.751,1.503,1.341,1.272,1.223,1.201,1.404,1.587,1.596,1.62,1.674,1.725,1.848,2.231,2.565,2.842,3.253,3.735,2.463,3.297,3.78,3.139,2.735,3.139,3.78,3.297,2.463,3.735,3.253,2.842,2.565,2.231,1.848,1.725,1.674,1.621,1.596,1.587,1.404,1.201,1.223,1.272,1.341,1.503,1.751,2.111,2.53],"lasers":[{"x":1.3,"y":-0.52,"z":-0.338,"angle":0,"damage":[6,9],"rate":10,"type":1,"speed":[160,190],"number":1,"spread":0,"error":0,"recoil":0},{"x":-1.3,"y":-0.52,"z":-0.338,"angle":0,"damage":[6,9],"rate":10,"type":1,"speed":[160,190],"number":1,"spread":0,"error":0,"recoil":0}],"radius":3.78,"next":[608,609]}}' },
        508: { name: "Howler", code: '{"name":"Howler","level":5,"model":8,"next":[610,611],"size":1.4,"specs":{"shield":{"capacity":[275,340],"reload":[5,7]},"generator":{"capacity":[80,110],"reload":[32,50]},"ship":{"mass":320,"speed":[80,105],"rotation":[70,95],"acceleration":[80,110]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":-20,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[-145,-135,-125,-130,-100,-55,5,60,85,120,118],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,5,5,8,20,30,35,35,30,22,0],"height":[0,5,5,8,15,20,33,30,30,22,0],"texture":[17,4,13,3,2,1,10,31,12,17],"propeller":true,"laser":{"damage":[2,4],"rate":6,"speed":[163,213],"number":2,"recoil":0,"type":1}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-80,"z":20},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-20,-16,30,60],"z":[-4,-4,1,0,0,0,0,0,0,0,0,0]},"width":[0,6,16,12],"height":[0,4,16,12],"texture":[2,9,31]},"front1":{"section_segments":8,"offset":{"x":22,"y":-125,"z":0},"position":{"x":[0,0,0,0,0,0,-5],"y":[-22.5,-12,-4.5,-7.5,22.5,60],"z":[0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,4.5,4.5,6,12,9],"height":[0,4.5,4.5,6,12,9],"texture":[17,4,3],"laser":{"damage":[11,16],"rate":1,"speed":[153,203],"number":1,"recoil":25,"type":2}},"front2":{"section_segments":10,"offset":{"x":32,"y":-95,"z":0},"position":{"x":[-4,-4,0,-1],"y":[0,-12,22.5,60],"z":[0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,7.5,12,9],"height":[0,12,18,15],"texture":[13,2,63],"angle":0},"propulsors":{"section_segments":8,"offset":{"x":40,"y":30,"z":-5},"position":{"x":[-12,-12,-2,0,0,0,0,0,0,0,0,0,0],"y":[-90,-100,-60,20,50,48],"z":[5,5,5,0,0,0,0,0,0,0,0,0,0]},"width":[0,3.6,12,24,14.4,0],"height":[0,3.6,15.6,24,14.4,0],"texture":[4,31,10,13,17],"propeller":true},"uwing":{"section_segments":[0,60,120,180],"offset":{"x":-20,"y":-30,"z":10},"position":{"x":[0,0,0,0,0,0],"y":[-65,-70,40,80,110],"z":[0,0,0,0,0,0]},"width":[0,5,25,25,0],"height":[0,10,25,25,20],"texture":[4]}},"wings":{"main":{"doubleside":true,"offset":{"x":20,"y":-20,"z":5},"length":[89,0],"width":[130,60],"angle":[-12,-12],"position":[0,80,80],"texture":18,"bump":{"position":20,"size":5}},"sides":{"doubleside":true,"offset":{"x":20,"y":-20,"z":10},"length":[84,-3,5,12,-5],"width":[25,25,140,140,50,50],"angle":[-12,5,5,5,5],"position":[40,85,55,55,70,70],"texture":[63,4,63,4,17],"bump":{"position":35,"size":15}}},"typespec":{"name":"Howler","level":5,"model":8,"code":508,"specs":{"shield":{"capacity":[275,340],"reload":[5,7]},"generator":{"capacity":[80,110],"reload":[32,50]},"ship":{"mass":320,"speed":[80,105],"rotation":[70,95],"acceleration":[80,110]}},"shape":[4.62,4.176,3.92,3.153,2.641,2.233,1.931,1.892,1.901,1.948,3.077,3.059,3.111,3.216,3.358,3.503,3.728,3.918,4.079,4.141,2.709,2.652,2.475,2.867,2.85,2.805,2.85,2.867,2.475,2.652,2.709,4.141,4.079,3.918,3.728,3.503,3.358,3.216,3.111,3.059,3.077,1.948,1.901,1.892,1.931,2.233,2.641,3.153,3.92,4.176],"lasers":[{"x":0,"y":-4.62,"z":0,"angle":0,"damage":[2,4],"rate":6,"type":1,"speed":[163,213],"number":2,"spread":0,"error":0,"recoil":0},{"x":0.616,"y":-4.13,"z":0,"angle":0,"damage":[11,16],"rate":1,"type":2,"speed":[153,203],"number":1,"spread":0,"error":0,"recoil":25},{"x":-0.616,"y":-4.13,"z":0,"angle":0,"damage":[11,16],"rate":1,"type":2,"speed":[153,203],"number":1,"spread":0,"error":0,"recoil":25}],"radius":4.62,"next":[610,611]}}' },
        509: { name: "Bat-Defender", code: '{"name":"Bat-Defender","level":5,"model":9,"next":[611,612],"size":1.8,"specs":{"shield":{"capacity":[350,450],"reload":[9,12]},"generator":{"capacity":[90,130],"reload":[30,45]},"ship":{"mass":380,"speed":[65,80],"rotation":[55,75],"acceleration":[80,105]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-99,-100,-97,-45,-40,-25,-23,15,20,55,50],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,5,5,30,17,27,25,25,27,15,5],"height":[0,2,2,25,27,27,25,25,27,20,0],"texture":[6,5,1,4,6,4,63,6,2,12]},"propulsors":{"section_segments":8,"offset":{"x":30,"y":-20,"z":0},"position":{"x":[-5,-2,0,0,0,0,0,0,0,0,0],"y":[30,55,60,80,95,100,90,95],"z":[0,0,0,0,0,0,0,0]},"width":[12,14,14,10,12,10,0],"height":[5,14,14,10,12,10,0],"texture":[2,6,4,11,6,12],"propeller":true},"lasers":{"section_segments":8,"offset":{"x":70,"y":-40,"z":10},"position":{"x":[0,0,0,0,0],"y":[25,90,10,50,60],"z":[0,0,0,0,0]},"width":[5,5,0,10,5],"height":[5,1,0,0,5],"texture":[63,6],"angle":3,"laser":{"damage":[15,20],"rate":2.5,"type":1,"speed":[190,240],"number":1,"error":0},"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-45,"z":8},"position":{"x":[0,0,0,0,0,0],"y":[-50,-40,-25,0,5],"z":[-10,-5,0,0,0]},"width":[0,5,10,10,0],"height":[0,10,15,16,0],"texture":[9]}},"wings":{"wings":{"offset":{"x":20,"y":0,"z":0},"length":[35,15,20,15],"width":[100,50,50,40,45],"angle":[-10,20,0,0],"position":[0,0,10,30,0],"texture":[11,4],"bump":{"position":-20,"size":15}},"side":{"doubleside":true,"offset":{"x":105,"y":30,"z":-30},"length":[30,10,30],"width":[40,60,60,40],"angle":[90,110,110,90],"position":[0,-30,-30,0],"texture":[63],"bump":{"position":0,"size":15}}},"typespec":{"name":"Bat-Defender","level":5,"model":9,"code":509,"specs":{"shield":{"capacity":[350,450],"reload":[9,12]},"generator":{"capacity":[90,130],"reload":[30,45]},"ship":{"mass":380,"speed":[65,80],"rotation":[55,75],"acceleration":[80,105]}},"shape":[3.604,3.424,2.813,2.415,2.149,1.968,1.913,1.973,2.073,2.759,3.932,3.974,4.081,4.084,4.04,4.116,4.187,3.661,2.16,2.365,2.719,3.22,3.183,3.028,2.016,1.984,2.016,3.028,3.183,3.22,2.719,2.365,2.16,3.661,4.187,4.116,4.04,4.081,4.084,3.974,3.932,2.759,2.073,1.973,1.913,1.968,2.149,2.415,2.813,3.424],"lasers":[{"x":2.539,"y":-1.08,"z":0.36,"angle":3,"damage":[15,20],"rate":2.5,"type":1,"speed":[190,240],"number":1,"spread":0,"error":0,"recoil":0},{"x":-2.539,"y":-1.08,"z":0.36,"angle":-3,"damage":[15,20],"rate":2.5,"type":1,"speed":[190,240],"number":1,"spread":0,"error":0,"recoil":0}],"radius":4.187,"next":[611,612]}}' },
        601: { name: "Scorpion", code: '{"name":"Scorpion","level":6,"model":1,"next":[701,702],"size":2,"specs":{"shield":{"capacity":[225,400],"reload":[7,9]},"generator":{"capacity":[80,175],"reload":[38,50]},"ship":{"mass":460,"speed":[75,90],"rotation":[50,70],"acceleration":[80,100]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-90,-40,-30,0,50,100,120,110],"z":[-10,-5,0,0,0,0,20,20]},"width":[0,12,20,15,25,10,5],"height":[0,10,15,25,15,10,5],"texture":[1,4,63,11,11,4],"propeller":false},"tail":{"section_segments":14,"offset":{"x":0,"y":70,"z":50},"position":{"x":[0,0,0,0,0,0],"y":[-70,-25,-10,20,40,50],"z":[0,0,0,0,-10,-20]},"width":[0,5,35,25,5,5],"height":[0,5,25,20,5,5],"texture":[6,4,63,10,4],"laser":{"damage":[50,100],"rate":0.9,"type":2,"speed":[180,230],"number":1,"angle":0,"error":0,"recoil":100}},"cockpit":{"section_segments":8,"offset":{"x":13,"y":-44,"z":12},"position":{"x":[-5,0,0,0,0],"y":[-15,-5,0,5,15],"z":[0,0,0,1,0]},"width":[0,8,10,8,0],"height":[0,5,5,5,0],"texture":[6,5],"propeller":false},"deco":{"section_segments":8,"offset":{"x":70,"y":0,"z":-10},"position":{"x":[0,0,0,10,-5,0,0,0],"y":[-115,-80,-100,-60,-30,-10,20,0],"z":[0,0,0,0,0,0,0,0]},"width":[1,5,10,15,15,20,10,0],"height":[1,5,15,20,35,30,10,0],"texture":[6,6,1,1,11,2,12],"laser":{"damage":[2,3],"rate":1.8,"type":1,"speed":[130,170],"number":2,"angle":5,"error":0},"propeller":true},"wingends":{"section_segments":8,"offset":{"x":105,"y":-80,"z":-10},"position":{"x":[0,2,4,2,0],"y":[-20,-10,0,10,20],"z":[0,0,0,0,0]},"width":[2,3,6,3,2],"height":[5,15,22,17,5],"texture":4,"angle":0,"propeller":false}},"wings":{"main":{"length":[80,30],"width":[40,30,20],"angle":[-10,20],"position":[30,-50,-80],"texture":63,"bump":{"position":30,"size":10},"offset":{"x":0,"y":0,"z":0}},"font":{"length":[80,30],"width":[20,15],"angle":[-10,20],"position":[-20,-40],"texture":4,"bump":{"position":30,"size":10},"offset":{"x":0,"y":0,"z":0}}},"typespec":{"name":"Scorpion","level":6,"model":1,"code":601,"specs":{"shield":{"capacity":[225,400],"reload":[7,9]},"generator":{"capacity":[80,175],"reload":[38,50]},"ship":{"mass":460,"speed":[75,90],"rotation":[50,70],"acceleration":[80,100]}},"shape":[3.6,2.846,2.313,2.192,5.406,5.318,5.843,5.858,5.621,4.134,3.477,3.601,3.622,3.464,3.351,3.217,1.458,1.391,1.368,1.37,1.635,2.973,3.47,3.911,4.481,4.804,4.481,3.911,3.47,2.973,1.635,1.37,1.368,1.391,1.458,3.217,3.351,3.464,3.622,3.601,3.477,4.134,5.621,5.858,5.843,5.318,5.406,2.192,2.313,2.846],"lasers":[{"x":0,"y":0,"z":2,"angle":0,"damage":[50,100],"rate":0.9,"type":2,"speed":[180,230],"number":1,"spread":0,"error":0,"recoil":100},{"x":2.8,"y":-4.6,"z":-0.4,"angle":0,"damage":[2,3],"rate":1.8,"type":1,"speed":[130,170],"number":2,"spread":5,"error":0,"recoil":0},{"x":-2.8,"y":-4.6,"z":-0.4,"angle":0,"damage":[2,3],"rate":1.8,"type":1,"speed":[130,170],"number":2,"spread":5,"error":0,"recoil":0}],"radius":5.858,"next":[701,702]}}' },
        602: { name: "Xenolith", code: '{"name":"Xenolith","level":6,"model":2,"next":[702,703],"size":1.7,"specs":{"shield":{"capacity":[230,320],"reload":[5,8]},"generator":{"capacity":[110,180],"reload":[38,55]},"ship":{"mass":300,"speed":[70,105],"rotation":[60,90],"acceleration":[90,125]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":-20,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-86,-90,-50,0,30,70,120,110],"z":[0,0,0,0,0,0,0,0]},"width":[0,15,25,25,30,30,25,0],"height":[0,10,20,20,30,30,10,0],"texture":[12,2,10,11,3,8,17],"propeller":true,"laser":{"damage":[28,35],"speed":[155,200],"rate":4,"type":1,"number":1,"angle":0,"recoil":120}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-40,"z":10},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-30,10,30,40],"z":[0,0,0,0,0]},"width":[7,15,17,17,0],"height":[5,15,15,12,0],"texture":[9,9,4],"propeller":false},"propeller":{"section_segments":12,"offset":{"x":75,"y":50,"z":-45},"position":{"x":[0,0,0,0,0,0,0],"y":[-38,-35,-20,0,10,40,35],"z":[0,0,0,0,0,0,0]},"width":[0,10,15,15,15,13,0],"height":[0,10,13,13,13,13,0],"texture":[13,3,4,18,63,13],"propeller":true},"Side":{"section_segments":9,"offset":{"x":25,"y":30,"z":-12},"position":{"x":[-5,-5,-2,0,-4,-4],"y":[-90,-100,-60,20,50,58],"z":[5,5,5,0,0,0,0,0]},"width":[0,8,12,24,14,0],"height":[0,4,15.6,24,14,0],"texture":[4,4,63,4,3]},"cannon":{"section_segments":12,"offset":{"x":0,"y":50,"z":45},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-40,-48,-45,-20,0,20,40,35],"z":[0,0,0,0,0,0,0,0]},"width":[0,6,10,15,15,15,10,0],"height":[0,6,10,13,13,13,13,0],"angle":0,"laser":{"damage":[10,25],"speed":[140,190],"rate":4,"type":1,"number":1,"angle":0,"error":0},"propeller":true,"texture":[6,2,3,4,12,63,13]}},"wings":{"main":{"offset":{"x":0,"y":20,"z":0},"length":[80,0,20],"width":[70,50,60,50],"texture":[11,63,63],"angle":[-20,-40,-40],"position":[10,40,40,40],"doubleside":1,"bump":{"position":-10,"size":15}},"main2":{"offset":{"x":0,"y":20,"z":0},"length":[80,0,20],"width":[70,50,60,50],"texture":[11,63,63],"angle":[-40,-20,-20],"position":[10,40,40,40],"doubleside":1,"bump":{"position":-10,"size":15}},"main3":{"offset":{"x":15,"y":20,"z":0},"length":[40,0,20],"width":[70,50,60,50],"texture":[11,63,63],"angle":[90,100,100],"position":[10,40,40,40],"doubleside":1,"bump":{"position":-30,"size":15}},"main4":{"doubleside":true,"offset":{"x":10,"y":-5,"z":-10},"length":[0,35,20,0],"width":[0,160,70,30,30],"angle":[-40,-30,-20,-20],"position":[30,-20,30,60,60],"texture":[13,63,13,8],"bump":{"position":35,"size":10}},"front":{"doubleside":true,"offset":{"x":-5,"y":-90,"z":5},"length":[20,15,0,20],"width":[40,40,90,100,30],"angle":[-30,-30,-30,-30],"position":[30,30,10,5,30],"texture":[13,2,13,4],"bump":{"position":35,"size":7}},"winglets":{"offset":{"x":74,"y":58,"z":-8},"length":[25,15,15,25],"width":[25,100,105,100,25],"angle":[-60,-70,-110,-120],"position":[0,0,0,0,0],"texture":[63,4,4,63],"doubleside":true,"bump":{"position":0,"size":5}}},"typespec":{"name":"Xenolith","level":6,"model":2,"code":602,"specs":{"shield":{"capacity":[230,320],"reload":[5,8]},"generator":{"capacity":[110,180],"reload":[38,55]},"ship":{"mass":300,"speed":[70,105],"rotation":[60,90],"acceleration":[90,125]}},"shape":[3.747,4.67,4.632,3.735,3.18,2.697,2.268,1.599,1.484,1.43,1.411,1.44,1.492,3.157,3.276,3.453,3.726,4.007,4.37,4.881,4.867,3.286,3.013,3.505,3.461,3.407,3.461,3.505,3.013,3.286,4.867,4.881,4.37,4.007,3.726,3.453,3.276,3.157,1.498,1.44,1.411,1.43,1.484,1.599,2.268,2.697,3.18,3.735,4.632,4.67],"lasers":[{"x":0,"y":-3.74,"z":0,"angle":0,"damage":[28,35],"rate":4,"type":1,"speed":[155,200],"number":1,"spread":0,"error":0,"recoil":120},{"x":0,"y":0.068,"z":1.53,"angle":0,"damage":[10,25],"rate":4,"type":1,"speed":[140,190],"number":1,"spread":0,"error":0,"recoil":0}],"radius":4.881,"next":[702,703]}}' },
        603: { name: "Advanced-Fighter", code: '{"name":"Advanced-Fighter","level":6,"model":3,"next":[703,704],"size":2,"specs":{"shield":{"capacity":[200,350],"reload":[5,7]},"generator":{"capacity":[120,200],"reload":[50,60]},"ship":{"mass":410,"speed":[70,80],"rotation":[30,50],"acceleration":[70,100]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-100,-80,-90,-50,0,50,100,90],"z":[0,0,0,0,0,0,0,0]},"width":[0,5,15,25,40,25,20,0],"height":[0,5,10,30,25,20,10,0],"propeller":true,"texture":[4,4,1,1,10,1,1],"laser":{"damage":[90,150],"rate":1,"type":2,"speed":[190,260],"number":1,"recoil":150,"error":0}},"cockpit":{"section_segments":12,"offset":{"x":0,"y":-35,"z":33},"position":{"x":[0,0,0,0,0,0,0],"y":[-30,-20,10,30,40],"z":[0,0,0,0,0,0,0]},"width":[0,12,15,10,0],"height":[0,12,18,12,0],"propeller":false,"texture":[7,9,9,7]},"side_propellers":{"section_segments":10,"offset":{"x":30,"y":30,"z":0},"position":{"x":[0,0,0,0,0,0],"y":[-50,-20,0,20,80,70],"z":[0,0,0,0,0,0]},"width":[15,20,10,25,10,0],"height":[10,15,15,10,5,0],"angle":0,"propeller":true,"texture":[3,63,4,10,3]},"cannons":{"section_segments":12,"offset":{"x":70,"y":50,"z":-30},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-45,-20,0,20,50,55],"z":[0,0,0,0,0,0,0]},"width":[0,5,10,10,15,10,0],"height":[0,5,15,15,10,5,0],"angle":0,"propeller":false,"texture":[4,4,10,4,63,4],"laser":{"damage":[6,12],"rate":3,"type":1,"speed":[100,150],"number":1,"error":0}},"cannons2":{"section_segments":12,"offset":{"x":95,"y":50,"z":-40},"position":{"x":[0,0,0,0],"y":[-50,-20,40,50],"z":[0,0,0,0]},"width":[2,5,5,2],"height":[2,15,15,2],"angle":0,"propeller":false,"texture":6,"laser":{"damage":[4,10],"rate":3,"type":1,"speed":[100,150],"number":1,"error":0}}},"wings":{"main":{"length":[100,30,20],"width":[100,50,40,30],"angle":[-25,20,25],"position":[30,70,50,50],"bump":{"position":-20,"size":20},"offset":{"x":0,"y":0,"z":0},"texture":[11,11,63],"doubleside":true},"winglets":{"length":[40],"width":[40,20,30],"angle":[10,-10],"position":[-50,-70,-65],"bump":{"position":0,"size":30},"texture":63,"offset":{"x":0,"y":0,"z":0}}},"typespec":{"name":"Advanced-Fighter","level":6,"model":3,"code":603,"specs":{"shield":{"capacity":[200,350],"reload":[5,7]},"generator":{"capacity":[120,200],"reload":[50,60]},"ship":{"mass":410,"speed":[70,80],"rotation":[30,50],"acceleration":[70,100]}},"shape":[4,3.65,3.454,3.504,3.567,2.938,1.831,1.707,1.659,1.943,1.92,1.882,1.896,3.96,5.654,5.891,6.064,5.681,5.436,5.573,5.122,4.855,4.675,4.626,4.479,4.008,4.479,4.626,4.675,4.855,5.122,5.573,5.436,5.681,6.064,5.891,5.654,3.96,3.88,1.882,1.92,1.943,1.659,1.707,1.831,2.938,3.567,3.504,3.454,3.65],"lasers":[{"x":0,"y":-4,"z":0.4,"angle":0,"damage":[90,150],"rate":1,"type":2,"speed":[190,260],"number":1,"spread":0,"error":0,"recoil":150},{"x":2.8,"y":0,"z":-1.2,"angle":0,"damage":[6,12],"rate":3,"type":1,"speed":[100,150],"number":1,"spread":0,"error":0,"recoil":0},{"x":-2.8,"y":0,"z":-1.2,"angle":0,"damage":[6,12],"rate":3,"type":1,"speed":[100,150],"number":1,"spread":0,"error":0,"recoil":0},{"x":3.8,"y":0,"z":-1.6,"angle":0,"damage":[4,10],"rate":3,"type":1,"speed":[100,150],"number":1,"spread":0,"error":0,"recoil":0},{"x":-3.8,"y":0,"z":-1.6,"angle":0,"damage":[4,10],"rate":3,"type":1,"speed":[100,150],"number":1,"spread":0,"error":0,"recoil":0}],"radius":6.064,"next":[703,704]}}' },
        604: { name: "Condor", code: '{"name":"Condor","level":6,"model":4,"next":[703,704],"size":1.5,"zoom":0.96,"specs":{"shield":{"capacity":[225,400],"reload":[7,10]},"generator":{"capacity":[70,130],"reload":[30,48]},"ship":{"mass":260,"speed":[95,110],"rotation":[50,80],"acceleration":[80,110]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[-110,-95,-100,-100,-45,-40,-25,-23,15,20,55,80,100,90],"z":[-10,-9,-8,-7,-6,-4,-2,0,0,0,0,0,0,0]},"width":[0,2,5,10,25,27,27,25,25,27,40,35,30,0],"height":[0,2,5,10,25,27,27,25,25,27,20,15,10,0],"texture":[6,2,3,10,5,63,5,2,5,3,63,11,4],"propeller":true,"laser":{"damage":[30,60],"rate":2,"type":2,"speed":[165,225],"number":1,"angle":0,"error":0}},"cannons":{"section_segments":12,"offset":{"x":75,"y":30,"z":-25},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-45,-20,0,20,50,55],"z":[0,0,0,0,0,0,0]},"width":[0,5,10,10,10,10,0],"height":[0,5,15,15,10,5,0],"angle":0,"laser":{"damage":[3,6],"rate":4,"type":1,"speed":[100,130],"number":1,"angle":0,"error":0},"propeller":false,"texture":[6,4,10,4,63,4]},"cockpit":{"section_segments":12,"offset":{"x":0,"y":-60,"z":8},"position":{"x":[0,0,0,0],"y":[-25,-8,20,65],"z":[0,0,0,0]},"width":[0,10,10,0],"height":[0,12,15,5],"texture":[9]}},"wings":{"back":{"offset":{"x":0,"y":25,"z":10},"length":[90,40],"width":[70,50,30],"angle":[-30,40],"position":[0,20,0],"texture":[11,63],"doubleside":true,"bump":{"position":10,"size":20}},"front":{"offset":{"x":0,"y":55,"z":10},"length":[90,40],"width":[70,50,30],"angle":[-30,-40],"position":[-60,-20,-20],"texture":[11,63],"doubleside":true,"bump":{"position":10,"size":10}}},"typespec":{"name":"Condor","level":6,"model":4,"code":604,"specs":{"shield":{"capacity":[225,400],"reload":[7,10]},"generator":{"capacity":[70,130],"reload":[30,48]},"ship":{"mass":260,"speed":[95,110],"rotation":[50,80],"acceleration":[80,110]}},"shape":[3.3,3.015,2.45,1.959,1.658,1.477,1.268,1.11,1.148,1.237,2.34,2.448,2.489,3.283,3.363,3.501,3.586,3.333,3.496,3.502,3.154,2.52,3.016,3.132,3.054,3.006,3.054,3.132,3.016,2.52,3.154,3.502,3.496,3.333,3.586,3.501,3.363,3.283,2.49,2.448,2.34,1.237,1.148,1.11,1.268,1.477,1.658,1.959,2.45,3.015],"lasers":[{"x":0,"y":-3.3,"z":0,"angle":0,"damage":[30,60],"rate":2,"type":2,"speed":[165,225],"number":1,"spread":0,"error":0,"recoil":0},{"x":2.25,"y":-0.6,"z":-0.75,"angle":0,"damage":[3,6],"rate":4,"type":1,"speed":[100,130],"number":1,"spread":0,"error":0,"recoil":0},{"x":-2.25,"y":-0.6,"z":-0.75,"angle":0,"damage":[3,6],"rate":4,"type":1,"speed":[100,130],"number":1,"spread":0,"error":0,"recoil":0}],"radius":3.586,"next":[703,704]}}' },
        605: { name: "A-Speedster", code: '{"name":"A-Speedster","level":6,"model":5,"next":[704,705],"size":1.6,"specs":{"shield":{"capacity":[200,300],"reload":[6,8]},"generator":{"capacity":[80,140],"reload":[30,45]},"ship":{"mass":235,"speed":[90,120],"rotation":[60,90],"acceleration":[90,135]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0],"y":[-100,-95,0,0,70,65],"z":[0,0,0,0,0,0]},"width":[0,10,40,20,20,0],"height":[0,5,30,30,15,0],"texture":[6,11,5,63,12],"propeller":true,"laser":{"damage":[38,84],"rate":1,"type":2,"speed":[175,230],"recoil":50,"number":1,"error":0}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-60,"z":15},"position":{"x":[0,0,0,0,0,0,0],"y":[-20,0,20,40,50],"z":[-7,-5,0,0,0]},"width":[0,10,10,10,0],"height":[0,10,15,12,0],"texture":[9]},"side_propulsors":{"section_segments":10,"offset":{"x":50,"y":25,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-20,-15,0,10,20,25,30,40,80,70],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,15,20,20,20,15,15,20,10,0],"height":[0,15,20,20,20,15,15,20,10,0],"propeller":true,"texture":[4,4,2,2,5,63,5,4,12]},"cannons":{"section_segments":12,"offset":{"x":30,"y":40,"z":45},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-45,-20,0,20,30,40],"z":[0,0,0,0,0,0,0]},"width":[0,5,7,10,3,5,0],"height":[0,5,7,8,3,5,0],"angle":-10,"laser":{"damage":[8,12],"rate":2,"type":1,"speed":[100,130],"number":1,"angle":-10,"error":0},"propeller":false,"texture":[6,4,10,4,63,4]}},"wings":{"join":{"offset":{"x":0,"y":0,"z":10},"length":[40,0],"width":[10,20],"angle":[-1],"position":[0,30],"texture":[63],"bump":{"position":0,"size":25}},"winglets":{"offset":{"x":0,"y":-40,"z":10},"doubleside":true,"length":[45,10],"width":[5,20,30],"angle":[50,-10],"position":[90,80,50],"texture":[4],"bump":{"position":10,"size":30}}},"typespec":{"name":"A-Speedster","level":6,"model":5,"code":605,"specs":{"shield":{"capacity":[200,300],"reload":[6,8]},"generator":{"capacity":[80,140],"reload":[30,45]},"ship":{"mass":235,"speed":[90,120],"rotation":[60,90],"acceleration":[90,135]}},"shape":[3.2,3.109,2.569,2.082,1.786,1.589,1.439,1.348,1.278,1.24,1.222,1.338,1.372,1.801,2.197,2.375,2.52,2.637,3.021,3.288,3.665,3.862,3.713,2.645,2.28,2.244,2.28,2.645,3.713,3.862,3.665,3.288,3.021,2.637,2.52,2.375,2.197,1.801,1.372,1.338,1.222,1.24,1.278,1.348,1.439,1.589,1.786,2.082,2.569,3.109],"lasers":[{"x":0,"y":-3.2,"z":0,"angle":0,"damage":[38,84],"rate":1,"type":2,"speed":[175,230],"number":1,"spread":0,"error":0,"recoil":50},{"x":1.238,"y":-0.296,"z":1.44,"angle":-10,"damage":[8,12],"rate":2,"type":1,"speed":[100,130],"number":1,"spread":-10,"error":0,"recoil":0},{"x":-1.238,"y":-0.296,"z":1.44,"angle":10,"damage":[8,12],"rate":2,"type":1,"speed":[100,130],"number":1,"spread":-10,"error":0,"recoil":0}],"radius":3.862,"next":[704,705]}}' },
        606: { name: "T-Fighter", code: '{"name":"T-Fighter","level":6,"model":6,"next":[705,706],"size":2.25,"zoom":0.96,"specs":{"shield":{"capacity":[220,350],"reload":[6,8]},"generator":{"capacity":[120,170],"reload":[35,60]},"ship":{"mass":310,"speed":[85,105],"rotation":[50,70],"acceleration":[80,110]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-95,-65,-47,-20,15,17,29,50,60,75,72],"z":[0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,11,15,20,25,25,25,22,20,15,0],"height":[0,6,8,12,20,20,20,20,18,15,0],"propeller":true,"texture":[2,63,63,11,5,3,63,4,13,17]},"cockpit":{"section_segments":7,"offset":{"x":0,"y":-59,"z":10},"position":{"x":[0,0,0,0,0,0,0],"y":[-15,0,16,35,50],"z":[-7,-6,-7,-1,-1]},"width":[0,5,10,8,5],"height":[0,6,11,6,5],"propeller":false,"texture":[7,9,9,4,4]},"cannon_wing_top":{"section_segments":8,"offset":{"x":0,"y":60,"z":40},"position":{"x":[0,0,0,0,0,0],"y":[-25,-30,-10,10,20,15],"z":[0,0,0,0,0,0]},"width":[0,3,4.8,6.6,4.2,0],"height":[0,2.5,4,5.5,5,0],"angle":0,"laser":{"damage":[5,10],"rate":2,"type":1,"speed":[150,200],"number":1,"error":0,"angle":0},"propeller":0,"texture":[6,4,10,13,17]},"side_thruster":{"section_segments":8,"offset":{"x":19,"y":57,"z":-10},"position":{"x":[1,1,1,0,0,0],"y":[-45,-30,-10,10,20,15],"z":[0,0,0,0,0,0]},"width":[0,3.25,5.2,7.15,4.55,0],"height":[0,2.5,4,5.5,5,0],"angle":0,"propeller":true,"texture":[4,4,10,13,17]},"cannon_side":{"section_segments":8,"offset":{"x":10,"y":-43,"z":-10},"position":{"x":[0,0,0,0,0,-2],"y":[-35,-40,-20,10,25,40],"z":[0,0,0,0,0,0]},"width":[0,3.2,5.6,8,4.8,0],"height":[0,2.4,4.2,6,4.2,0],"angle":0,"laser":{"damage":[10,15],"rate":4,"type":1,"speed":[100,155],"number":5,"error":0,"angle":25},"propeller":false,"texture":[4,4,11,4]},"cannon_wings":{"section_segments":8,"offset":{"x":56,"y":50,"z":-3},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[-66.5,-59.5,-56,-60.2,-52.5,-47.6,-44.8,-44.8,-31.5,-10.5,7,17.5,14.7],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,1.35,0,2.7,4.5,5.4,6.93,6.93,7.65,8.55,6.75,4.5,0],"height":[0,1.35,0,2.7,4.5,5.4,6.93,6.93,7.65,8.55,6.75,4.5,0],"texture":[63,63,13,4,4,63,8,10,8,4,13,17],"angle":0,"laser":{"damage":[6,7],"rate":2,"type":1,"speed":[150,200],"number":1,"angle":3.5,"error":0},"propeller":0},"cannon_pulse_indicator":{"offset":{"x":0,"y":0,"z":0},"position":{"x":[0],"y":[0],"z":[0]},"width":[0],"height":[0],"laser":{"damage":[100,150],"rate":1,"type":1,"speed":[1,1],"number":100}}},"wings":{"main":{"length":[60,15,5],"width":[80,30,20,20],"angle":[0,40,0],"position":[10,24,3,-10],"doubleside":true,"texture":[11,63,4],"offset":{"x":1,"y":13,"z":-5.31},"bump":{"position":10,"size":10}},"winglets":{"length":[19,3],"width":[30,30,59],"angle":[0,50,0],"position":[-20,23,50],"doubleside":true,"texture":[3],"offset":{"x":1,"y":-58,"z":0},"bump":{"position":30,"size":15}},"winglets_cannon_top_2":{"length":[13,3],"width":[15,15,20],"angle":[30,30,0],"position":[-12,0,-2],"doubleside":true,"texture":[4,13],"offset":{"x":1,"y":65,"z":40},"bump":{"position":10,"size":10}},"top":{"doubleside":true,"offset":{"x":0,"y":44,"z":20},"length":[0,20],"width":[0,50,20],"angle":[0,90],"position":[0,0,20],"texture":[63],"bump":{"position":0,"size":10}}},"typespec":{"name":"T-Fighter","level":6,"model":6,"code":606,"specs":{"shield":{"capacity":[220,350],"reload":[6,8]},"generator":{"capacity":[120,170],"reload":[35,60]},"ship":{"mass":310,"speed":[85,105],"rotation":[50,70],"acceleration":[80,110]}},"shape":[4.275,3.782,3.409,2.591,2.202,1.865,1.634,1.434,1.279,1.172,2.627,2.691,3.501,3.514,3.536,3.488,3.469,3.55,3.852,4.079,3.941,3.014,3.521,3.623,3.527,3.605,3.527,3.623,3.521,3.014,3.941,4.079,3.852,3.55,3.469,3.488,3.536,3.514,3.501,2.691,2.627,1.172,1.279,1.434,1.634,1.865,2.202,2.591,3.409,3.782],"lasers":[{"x":0,"y":1.35,"z":1.8,"angle":0,"damage":[5,10],"rate":2,"type":1,"speed":[150,200],"number":1,"spread":0,"error":0,"recoil":0},{"x":0.45,"y":-3.735,"z":-0.45,"angle":0,"damage":[10,15],"rate":4,"type":1,"speed":[100,155],"number":5,"spread":25,"error":0,"recoil":0},{"x":-0.45,"y":-3.735,"z":-0.45,"angle":0,"damage":[10,15],"rate":4,"type":1,"speed":[100,155],"number":5,"spread":25,"error":0,"recoil":0},{"x":2.52,"y":-0.743,"z":-0.135,"angle":0,"damage":[6,7],"rate":2,"type":1,"speed":[150,200],"number":1,"spread":3.5,"error":0,"recoil":0},{"x":-2.52,"y":-0.743,"z":-0.135,"angle":0,"damage":[6,7],"rate":2,"type":1,"speed":[150,200],"number":1,"spread":3.5,"error":0,"recoil":0},{"x":0,"y":0,"z":0,"angle":0,"damage":[100,150],"rate":1,"type":1,"speed":[1,1],"number":100,"spread":0,"error":0,"recoil":0}],"radius":4.275,"next":[705,706]}}' },
        607: { name: "H-Mercury", code: '{"name":"H-Mercury","level":6,"model":7,"next":[706,707],"size":1.85,"zoom":0.96,"specs":{"shield":{"capacity":[250,330],"reload":[6,8]},"generator":{"capacity":[140,200],"reload":[54,66]},"ship":{"mass":350,"speed":[70,95],"rotation":[51,75],"acceleration":[81,105]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":-10,"z":20},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-65,-70,-60,-40,0,50,110,100],"z":[0,0,0,0,0,0,0,0]},"width":[1,5,10,20,30,25,10,0],"height":[1,5,10,15,25,20,10,0],"texture":[6,4,4,63,11,63,12],"propeller":true,"laser":{"damage":[14,20],"rate":2,"type":1,"speed":[150,210],"number":1,"error":0,"recoil":120}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-30,"z":35},"position":{"x":[0,0,0,0,0,0,0],"y":[-20,-10,0,15,25],"z":[0,0,0,0,0]},"width":[0,10,12,10,5],"height":[0,10,13,12,5],"texture":[9,9,4,4],"propeller":false},"arms":{"section_segments":8,"offset":{"x":60,"y":-10,"z":-10},"position":{"x":[0,0,0,5,10,0,0,-10],"y":[-85,-70,-80,-30,0,30,100,90],"z":[0,0,0,0,0,0,0,0]},"width":[1,5,6,15,15,15,10,0],"height":[1,5,6,20,30,25,10,0],"texture":[6,4,4,4,4,4,12],"angle":1,"propeller":true,"laser":{"damage":[9,18],"rate":2,"type":1,"speed":[140,190],"number":1,"error":0}},"canon":{"section_segments":12,"offset":{"x":100,"y":17,"z":5},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-45,-20,0,20,30,40],"z":[0,0,0,0,0,0,0]},"width":[0,5,7,7,3,5,0],"height":[0,5,15,15,3,5,0],"angle":3,"laser":{"damage":[1,4],"rate":6,"type":1,"speed":[160,220],"number":1,"error":0},"propeller":false,"texture":[6,4,10,4,4,4]}},"wings":{"main":{"offset":{"x":0,"y":-25,"z":20},"length":[60,40],"width":[60,30,20],"angle":[-20,10],"position":[30,50,30],"texture":[11,11],"bump":{"position":30,"size":10}},"font":{"length":[60],"width":[20,15],"angle":[-10,20],"position":[-20,-40],"texture":[63],"bump":{"position":30,"size":10},"offset":{"x":0,"y":-10,"z":0}},"font2":{"offset":{"x":0,"y":30,"z":8},"length":[60],"width":[20,15],"angle":[-10,20],"position":[20,40],"texture":[63],"bump":{"position":30,"size":10}}},"typespec":{"name":"H-Mercury","level":6,"model":7,"code":607,"specs":{"shield":{"capacity":[250,330],"reload":[6,8]},"generator":{"capacity":[140,200],"reload":[54,66]},"ship":{"mass":350,"speed":[70,95],"rotation":[51,75],"acceleration":[81,105]}},"shape":[2.966,2.962,2.449,2.118,4.148,4.125,3.9,3.621,3.435,3.316,3.938,3.929,3.926,3.984,4.028,4.189,4.323,4.325,3.691,4.157,4.253,3.947,2.843,2.977,3.718,3.707,3.718,2.977,2.843,3.947,4.253,4.157,3.691,4.325,4.323,4.189,4.028,3.984,3.926,3.929,3.938,3.316,3.435,3.621,3.9,4.125,4.148,2.118,2.449,2.962],"lasers":[{"x":0,"y":-2.96,"z":0.74,"angle":0,"damage":[14,20],"rate":2,"type":1,"speed":[150,210],"number":1,"spread":0,"error":0,"recoil":120},{"x":2.165,"y":-3.515,"z":-0.37,"angle":1,"damage":[9,18],"rate":2,"type":1,"speed":[140,190],"number":1,"spread":0,"error":0,"recoil":0},{"x":-2.165,"y":-3.515,"z":-0.37,"angle":-1,"damage":[9,18],"rate":2,"type":1,"speed":[140,190],"number":1,"spread":0,"error":0,"recoil":0},{"x":3.603,"y":-1.218,"z":0.185,"angle":3,"damage":[1,4],"rate":6,"type":1,"speed":[160,220],"number":1,"spread":0,"error":0,"recoil":0},{"x":-3.603,"y":-1.218,"z":0.185,"angle":-3,"damage":[1,4],"rate":6,"type":1,"speed":[160,220],"number":1,"spread":0,"error":0,"recoil":0}],"radius":4.325,"next":[706,707]}}' },
        608: { name: "Typhoon", code: '{"name":"Typhoon","level":6,"model":8,"next":[707,708],"size":1.85,"specs":{"shield":{"capacity":[230,350],"reload":[4,7]},"generator":{"capacity":[250,350],"reload":[46,64]},"ship":{"mass":375,"speed":[67,85],"rotation":[40,70],"acceleration":[85,95]}},"bodies":{"body":{"section_segments":8,"offset":{"x":0,"y":-12.5,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-110,-105,-90,-40,-20,0,20,78,120,137,130],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,10,16,25,25,32,35,35,25,20,0],"height":[0,17,26,35,35,35,35,35,24,20,0],"texture":[4,63,10,63,63,3,10,63,3,17],"propeller":true},"sidethrusters":{"section_segments":8,"offset":{"x":30,"y":27.5,"z":0},"position":{"x":[-10,-5,4,-3,-3],"y":[-70,-50,0,90,80],"z":[0,0,0,0,0,0]},"width":[0,15,16,10,0],"height":[0,15,16,10,0],"texture":[4,11,1,17],"propeller":true},"cannons1":{"section_segments":8,"offset":{"x":83,"y":22.5,"z":-25},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-37,-29,0,45,60,61],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,10,10,8,0],"height":[0,5,10,10,8,0],"texture":[6,4,63,4,3],"propeller":false,"angle":-1.5,"laser":{"damage":[8,12],"rate":3,"type":1,"speed":[110,170],"number":1}},"cannons2":{"section_segments":8,"offset":{"x":45,"y":46.5,"z":25},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-37,-29,0,45,60,61],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,10,10,8,0],"height":[0,5,10,10,8,0],"texture":[6,4,3,4,3],"propeller":false,"angle":-0.5,"laser":{"damage":[8,12],"rate":3,"type":1,"speed":[130,190],"number":1}},"cannons3":{"section_segments":8,"offset":{"x":20,"y":-62.5,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-37,-29,0,45,60,61],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,10,10,8,0],"height":[0,5,10,10,8,0],"texture":[6,4,3,4,3],"propeller":false,"laser":{"damage":[8,12],"rate":3,"type":1,"speed":[150,210],"number":1}},"cannons4":{"section_segments":8,"offset":{"x":60,"y":-12.5,"z":-38},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-37,-29,0,45,60,61],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,5,10,10,8,0],"height":[0,5,10,10,8,0],"texture":[6,4,3,4,3],"propeller":false,"angle":-1,"laser":{"damage":[8,12],"rate":3,"type":1,"speed":[130,190],"number":1}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-46.5,"z":26},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-50,-30,0,40,70,100],"z":[0,0,0,0,0,0]},"width":[0,10,14,14,13,0],"height":[0,10,16,14,10,0],"texture":[4,9,9,63,4]}},"wings":{"wingsmain":{"offset":{"x":30,"y":37.5,"z":6},"length":[60,10,0,25],"width":[100,80,60,100,55],"angle":[-30,-30,-30,-30],"position":[-20,0,16,10,40],"texture":[3,13,17,63],"doubleside":true,"bump":{"position":-20,"size":4}},"wingsmain2":{"offset":{"x":20,"y":57.5,"z":20},"length":[30,10,0,15],"width":[70,60,50,90,35],"angle":[10,10,10,10],"position":[-20,0,16,10,40],"texture":[2,13,17,63],"doubleside":true,"bump":{"position":-20,"size":5}},"wingsmain3":{"offset":{"x":10,"y":-12.5,"z":-10},"length":[50],"width":[70,50],"angle":[-30,0],"position":[-20,5],"texture":[2],"doubleside":true,"bump":{"position":-20,"size":5}}},"typespec":{"name":"Typhoon","level":6,"model":8,"code":608,"specs":{"shield":{"capacity":[230,350],"reload":[4,7]},"generator":{"capacity":[250,350],"reload":[46,64]},"ship":{"mass":375,"speed":[67,85],"rotation":[40,70],"acceleration":[85,95]}},"shape":[4.533,4.403,3.755,3.188,2.592,2.187,2.193,2.896,2.877,2.795,2.694,3.21,3.385,3.606,3.905,4.354,4.737,5.13,5.688,5.657,5.063,5.03,4.467,4.558,4.666,4.615,4.666,4.558,4.467,5.03,5.063,5.657,5.688,5.13,4.737,4.354,3.905,3.606,3.385,3.21,2.694,2.795,2.877,2.896,2.193,2.187,2.592,3.188,3.755,4.403],"lasers":[{"x":3.107,"y":-0.536,"z":-0.925,"angle":-1.5,"damage":[8,12],"rate":3,"type":1,"speed":[110,170],"number":1,"spread":0,"error":0,"recoil":0},{"x":-3.107,"y":-0.536,"z":-0.925,"angle":1.5,"damage":[8,12],"rate":3,"type":1,"speed":[110,170],"number":1,"spread":0,"error":0,"recoil":0},{"x":1.677,"y":0.352,"z":0.925,"angle":-0.5,"damage":[8,12],"rate":3,"type":1,"speed":[130,190],"number":1,"spread":0,"error":0,"recoil":0},{"x":-1.677,"y":0.352,"z":0.925,"angle":0.5,"damage":[8,12],"rate":3,"type":1,"speed":[130,190],"number":1,"spread":0,"error":0,"recoil":0},{"x":0.74,"y":-3.682,"z":0,"angle":0,"damage":[8,12],"rate":3,"type":1,"speed":[150,210],"number":1,"spread":0,"error":0,"recoil":0},{"x":-0.74,"y":-3.682,"z":0,"angle":0,"damage":[8,12],"rate":3,"type":1,"speed":[150,210],"number":1,"spread":0,"error":0,"recoil":0},{"x":2.244,"y":-1.831,"z":-1.406,"angle":-1,"damage":[8,12],"rate":3,"type":1,"speed":[130,190],"number":1,"spread":0,"error":0,"recoil":0},{"x":-2.244,"y":-1.831,"z":-1.406,"angle":1,"damage":[8,12],"rate":3,"type":1,"speed":[130,190],"number":1,"spread":0,"error":0,"recoil":0}],"radius":5.688,"next":[707,708]}}' },
        609: { name: "Marauder", code: '{"name":"Marauder","level":6,"model":9,"next":[708,709],"size":1.4,"zoom":0.96,"specs":{"shield":{"capacity":[210,350],"reload":[8,11]},"generator":{"capacity":[85,160],"reload":[30,50]},"ship":{"mass":270,"speed":[85,115],"rotation":[60,80],"acceleration":[80,115]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":-20,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-65,-75,-55,-40,0,30,60,80,90,80],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,6,18,23,30,25,25,30,35,0],"height":[0,5,10,12,12,20,15,15,15,0],"texture":[6,4,1,10,1,1,11,12,17],"propeller":true,"laser":{"damage":[10,16],"rate":10,"type":1,"speed":[170,200],"recoil":0,"number":1,"error":0}},"cockpit":{"section_segments":[40,90,180,270,320],"offset":{"x":0,"y":-85,"z":22},"position":{"x":[0,0,0,0,0,0],"y":[15,35,60,95,125],"z":[-1,-2,-1,-1,3]},"width":[5,12,14,15,5],"height":[0,12,15,15,0],"texture":[8.98,8.98,4]},"outriggers":{"section_segments":10,"offset":{"x":25,"y":0,"z":-10},"position":{"x":[-5,-5,8,-5,0,0,0,0,0,0],"y":[-100,-125,-45,0,30,40,70,80,100,90],"z":[10,10,5,5,0,0,0,0,0,0,0,0]},"width":[0,6,10,10,15,15,15,15,10,0],"height":[0,10,20,25,25,25,25,25,20,0],"texture":[13,4,4,63,4,18,4,13,17],"laser":{"damage":[4,8],"rate":3,"type":1,"speed":[110,140],"recoil":0,"number":1,"error":0},"propeller":true},"intake":{"section_segments":12,"offset":{"x":25,"y":-5,"z":10},"position":{"x":[0,0,5,0,-3,0,0,0,0,0],"y":[-10,-30,-5,35,60,70,85,100,85],"z":[0,-6,0,0,0,0,0,0,0,0]},"width":[0,5,10,10,15,10,10,5,0],"height":[0,15,15,20,20,15,15,5,0],"texture":[6,4,63,4,63,18,4,17]}},"wings":{"main":{"length":[20,70,35],"width":[50,55,40,20],"angle":[0,-20,0],"position":[20,20,70,25],"texture":[3,18,63],"doubleside":true,"bump":{"position":30,"size":15},"offset":{"x":0,"y":0,"z":13}},"spoiler":{"length":[20,45,0,5],"width":[40,40,20,30,0],"angle":[0,20,90,90],"position":[60,60,80,80,90],"texture":[10,11,63],"doubleside":true,"bump":{"position":30,"size":18},"offset":{"x":0,"y":0,"z":30}},"font":{"length":[37],"width":[40,15],"angle":[-10],"position":[0,-45],"texture":[63],"doubleside":true,"bump":{"position":30,"size":10},"offset":{"x":35,"y":-20,"z":10}},"shields":{"doubleside":true,"offset":{"x":12,"y":60,"z":-15},"length":[0,15,45,20],"width":[30,30,65,65,30,30],"angle":[30,30,90,150],"position":[10,10,0,0,10],"texture":[4],"bump":{"position":0,"size":4}}},"typespec":{"name":"Marauder","level":6,"model":9,"code":609,"specs":{"shield":{"capacity":[210,350],"reload":[8,11]},"generator":{"capacity":[85,160],"reload":[30,50]},"ship":{"mass":270,"speed":[85,115],"rotation":[60,80],"acceleration":[80,115]}},"shape":[2.665,3.563,3.573,2.856,2.359,2.03,2.85,2.741,2.228,1.71,1.404,1.199,1.11,3.408,3.491,3.521,3.44,3.385,3.439,3.481,3.181,2.932,2.962,2.944,2.85,2.244,2.85,2.944,2.962,2.932,3.181,3.481,3.439,3.385,3.44,3.521,3.491,3.408,1.11,1.199,1.404,1.71,2.228,2.741,2.85,2.03,2.359,2.856,3.573,3.563],"lasers":[{"x":0,"y":-2.66,"z":0.28,"angle":0,"damage":[10,16],"rate":10,"type":1,"speed":[170,200],"number":1,"spread":0,"error":0,"recoil":0},{"x":0.56,"y":-3.5,"z":-0.28,"angle":0,"damage":[4,8],"rate":3,"type":1,"speed":[110,140],"number":1,"spread":0,"error":0,"recoil":0},{"x":-0.56,"y":-3.5,"z":-0.28,"angle":0,"damage":[4,8],"rate":3,"type":1,"speed":[110,140],"number":1,"spread":0,"error":0,"recoil":0}],"radius":3.573,"next":[708,709]}}' },
        610: { name: "Rock-Tower", code: '{"name":"Rock-Tower","level":6,"model":10,"next":[708,709],"size":2.1,"specs":{"shield":{"capacity":[300,500],"reload":[8,11]},"generator":{"capacity":[120,140],"reload":[36,54]},"ship":{"mass":400,"speed":[85,103],"rotation":[45,70],"acceleration":[80,90]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-90,-85,-70,-60,-20,-25,40,85,70],"z":[-10,-8,-5,0,0,0,0,0,0]},"width":[0,40,45,10,12,30,30,20,0],"height":[0,10,12,8,12,10,25,20,0],"texture":[4,63,4,4,4,11,10,12],"propeller":true},"cockpit":{"section_segments":12,"offset":{"x":0,"y":30,"z":20},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-30,-20,0,10,20,30],"z":[0,0,0,0,0,0]},"width":[0,10,15,15,10,5],"height":[0,10,15,15,10,5],"texture":9,"propeller":false},"dimeds_banhammer":{"section_segments":6,"offset":{"x":25,"y":-70,"z":-10},"position":{"x":[0,0,0,0,0,0],"y":[-20,-10,-20,0,10,12],"z":[0,0,0,0,0,0]},"width":[0,0,5,7,6,0],"height":[0,0,5,7,6,0],"texture":[6,6,6,10,12],"angle":0,"laser":{"damage":[5,8],"rate":8,"type":1,"speed":[150,230],"number":1,"error":3}},"propulsors":{"section_segments":8,"offset":{"x":30,"y":50,"z":0},"position":{"x":[0,0,5,5,0,0,0],"y":[-45,-50,-20,0,20,50,40],"z":[0,0,0,0,0,0,0]},"width":[0,10,15,15,15,10,0],"height":[0,15,20,25,20,10,0],"texture":[11,2,3,4,5,12],"angle":0,"propeller":true}},"wings":{"main":{"length":[55,15],"width":[60,40,30],"angle":[-10,20],"position":[30,40,30],"texture":63,"doubleside":true,"offset":{"x":0,"y":20,"z":-5},"bump":{"position":30,"size":20}},"finalizer_fins":{"length":[20],"width":[20,10],"angle":[-70],"position":[-42,-30],"texture":63,"doubleside":true,"offset":{"x":35,"y":-35,"z":0},"bump":{"position":0,"size":30}}},"typespec":{"name":"Rock-Tower","level":6,"model":10,"code":610,"specs":{"shield":{"capacity":[300,500],"reload":[8,11]},"generator":{"capacity":[120,140],"reload":[36,54]},"ship":{"mass":400,"speed":[85,103],"rotation":[45,70],"acceleration":[80,90]}},"shape":[3.78,3.758,3.974,3.976,3.946,3.508,1.532,1.64,1.556,1.426,1.347,1.298,1.269,1.764,1.894,2.075,3.269,3.539,3.933,3.989,4.058,4.127,4.524,4.416,3.634,3.577,3.634,4.416,4.524,4.127,4.058,3.989,3.933,3.539,3.269,2.075,1.894,1.764,1.68,1.298,1.347,1.426,1.556,1.64,1.532,3.508,3.946,3.976,3.974,3.758],"lasers":[{"x":1.05,"y":-3.78,"z":-0.42,"angle":0,"damage":[5,8],"rate":8,"type":1,"speed":[150,230],"number":1,"spread":0,"error":3,"recoil":0},{"x":-1.05,"y":-3.78,"z":-0.42,"angle":0,"damage":[5,8],"rate":8,"type":1,"speed":[150,230],"number":1,"spread":0,"error":3,"recoil":0}],"radius":4.524,"next":[708,709]}}' },
        611: { name: "Barracuda", code: '{"name":"Barracuda","level":6,"model":11,"next":[709,710],"size":2.4,"specs":{"shield":{"capacity":[300,400],"reload":[8,12]},"generator":{"capacity":[100,150],"reload":[8,14]},"ship":{"mass":675,"speed":[70,90],"rotation":[30,45],"acceleration":[130,150],"dash":{"rate":2,"burst_speed":[160,200],"speed":[120,150],"acceleration":[70,70],"initial_energy":[50,75],"energy":[20,30]}}},"bodies":{"body":{"section_segments":12,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-90,-100,-60,-10,0,20,50,80,100,90],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,5,20,25,35,40,40,35,30,0],"height":[0,5,40,45,40,60,70,60,30,0],"texture":[10,2,10,2,3,13,13,63,12],"propeller":true},"front":{"section_segments":8,"offset":{"x":0,"y":-20,"z":0},"position":{"x":[0,0,0,0,0],"y":[-90,-85,-70,-60,-20],"z":[0,0,0,0,0]},"width":[0,40,45,10,12],"height":[0,15,18,8,12],"texture":[8,63,4,4,4],"propeller":true},"propeller":{"section_segments":10,"offset":{"x":40,"y":40,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-20,-15,0,10,20,25,30,40,70,60],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,10,15,15,15,10,10,20,15,0],"height":[0,10,15,15,15,10,10,18,8,0],"texture":[4,4,10,3,3,63,4,63,12],"propeller":true},"sides":{"section_segments":6,"angle":90,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-80,-75,-60,-50,-10,10,50,60,75,80],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,30,35,10,12,12,10,35,30,0],"height":[0,10,12,8,12,12,8,12,10,0],"texture":[4,63,4,4,4,4,4,63,4]},"cockpit":{"section_segments":12,"offset":{"x":0,"y":-20,"z":30},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-50,-20,0,10,30,50],"z":[0,0,0,0,0,0]},"width":[0,12,18,20,15,0],"height":[0,20,22,24,20,0],"texture":[9]}},"wings":{"top":{"doubleside":true,"offset":{"x":0,"y":20,"z":15},"length":[70],"width":[70,30],"angle":[90],"position":[0,30],"texture":[63],"bump":{"position":10,"size":30}},"top2":{"doubleside":true,"offset":{"x":0,"y":51,"z":5},"length":[70],"width":[50,20],"angle":[90],"position":[0,60],"texture":[63],"bump":{"position":10,"size":30}}},"typespec":{"name":"Barracuda","level":6,"model":11,"code":611,"specs":{"shield":{"capacity":[300,400],"reload":[8,12]},"generator":{"capacity":[100,150],"reload":[8,14]},"ship":{"mass":675,"speed":[70,90],"rotation":[30,45],"acceleration":[130,150],"dash":{"rate":2,"burst_speed":[160,200],"speed":[120,150],"acceleration":[70,70],"initial_energy":[50,75],"energy":[20,30]}}},"shape":[5.28,5.25,5.332,5.393,4.944,1.997,1.745,1.556,1.435,3.587,3.81,3.779,3.838,3.84,3.779,3.81,3.587,3.205,3.571,3.9,5.132,5.888,5.835,5.551,4.886,5.808,4.886,5.551,5.835,5.888,5.132,3.9,3.571,3.205,3.587,3.81,3.779,3.838,3.84,3.779,3.81,3.587,1.435,1.556,1.745,1.997,4.944,5.393,5.332,5.25],"lasers":[],"radius":5.888,"next":[709,710]}}' },
        612: { name: "O-Defender", code: '{"name":"O-Defender","level":6,"model":12,"next":[710,711],"size":2.2,"zoom":0.96,"specs":{"shield":{"capacity":[450,550],"reload":[11,14]},"generator":{"capacity":[70,110],"reload":[30,50]},"ship":{"mass":500,"speed":[65,75],"rotation":[42,54],"acceleration":[75,95]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-90,-88,0,40,90,95,100,90],"z":[0,0,0,0,0,0,0,0]},"width":[5,6,25,25,15,18,15,0],"height":[2,10,40,40,20,18,15,0],"texture":[63,1,4,10,63,63,17],"propeller":true,"laser":{"damage":[35,60],"rate":2,"type":2,"speed":[215,275],"number":1,"angle":0,"error":0}},"side":{"section_segments":10,"offset":{"x":50,"y":0,"z":0},"position":{"x":[-40,-5,15,25,20,0,-50],"y":[-100,-70,-40,-10,20,50,90],"z":[0,0,0,0,0,0,0]},"width":[5,20,20,20,20,20,5],"height":[15,25,30,30,30,25,15],"texture":[0,1,2,3,4,63]},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-60,"z":18},"position":{"x":[0,0,0,0,0,0,0],"y":[-10,0,20,30,40],"z":[0,0,0,0,0]},"width":[0,5,10,10,0],"height":[0,5,10,12,0],"texture":[9]},"innersides":{"section_segments":8,"offset":{"x":20,"y":-100,"z":0},"position":{"x":[-3,0,0,0,0,-5,-5],"y":[70,75,100,120,150,175,175],"z":[0,0,0,0,0,0,0]},"width":[0,10,20,22,20,10,0],"height":[0,20,25,25,25,15,0],"propeller":false,"texture":[2,3,63,11,1]}},"wings":{"join":{"offset":{"x":0,"y":20,"z":0},"length":[80,0],"width":[130,50],"angle":[-1],"position":[0,-30],"texture":[8],"bump":{"position":-20,"size":15}}},"typespec":{"name":"O-Defender","level":6,"model":12,"code":612,"specs":{"shield":{"capacity":[450,550],"reload":[11,14]},"generator":{"capacity":[70,110],"reload":[30,50]},"ship":{"mass":500,"speed":[65,75],"rotation":[42,54],"acceleration":[75,95]}},"shape":[4.409,4.448,4.372,4.204,4.119,4.136,4.174,4.107,4.066,4.094,4.073,4.141,4.16,4.062,4.015,3.966,3.83,3.76,3.742,3.591,3.502,3.494,3.575,3.764,4.449,4.409,4.449,3.764,3.575,3.494,3.502,3.591,3.742,3.76,3.83,3.966,4.015,4.062,4.16,4.141,4.073,4.094,4.066,4.107,4.174,4.136,4.119,4.204,4.372,4.448],"lasers":[{"x":0,"y":-3.96,"z":0,"angle":0,"damage":[35,60],"rate":2,"type":2,"speed":[215,275],"number":1,"spread":0,"error":0,"recoil":0}],"radius":4.449,"next":[710,711]}}'},
        613: { name: "Legacy-Speedster", code: '{"name":"Legacy-Speedster","level":6,"model":13,"size":1.5,"specs":{"shield":{"capacity":[200,300],"reload":[6,8]},"generator":{"capacity":[80,140],"reload":[30,45]},"ship":{"mass":175,"speed":[90,115],"rotation":[60,80],"acceleration":[90,140]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0],"y":[-100,-95,0,0,70,65],"z":[0,0,0,0,0,0]},"width":[0,10,40,20,20,0],"height":[0,5,30,30,15,0],"texture":[6,11,5,63,12],"propeller":true,"laser":{"damage":[38,84],"rate":1,"type":2,"speed":[175,230],"recoil":50,"number":1,"error":0}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-60,"z":15},"position":{"x":[0,0,0,0,0,0,0],"y":[-20,0,20,40,50],"z":[-7,-5,0,0,0]},"width":[0,15,15,10,0],"height":[0,10,15,12,0],"texture":[4]},"side_propulsors":{"section_segments":10,"offset":{"x":50,"y":25,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-20,-15,0,10,20,25,30,40,80,70],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,15,20,20,20,15,15,20,10,0],"height":[0,15,20,20,20,15,15,20,10,0],"propeller":true,"texture":[4,4,2,2,5,63,5,4,12]},"cannons":{"section_segments":12,"offset":{"x":30,"y":40,"z":45},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-45,-20,0,20,30,40],"z":[0,0,0,0,0,0,0]},"width":[0,5,7,10,3,5,0],"height":[0,5,7,8,3,5,0],"angle":-10,"laser":{"damage":[8,12],"rate":2,"type":1,"speed":[100,130],"number":1,"angle":-10,"error":0},"propeller":false,"texture":[6,4,10,4,63,4]}},"wings":{"join":{"offset":{"x":0,"y":0,"z":10},"length":[40,0],"width":[10,20],"angle":[-1],"position":[0,30],"texture":[63],"bump":{"position":0,"size":25}},"winglets":{"offset":{"x":0,"y":-40,"z":10},"doubleside":true,"length":[45,10],"width":[5,20,30],"angle":[50,-10],"position":[90,80,50],"texture":[4],"bump":{"position":10,"size":30}}},"typespec":{"name":"Legacy-Speedster","level":6,"model":13,"code":613,"specs":{"shield":{"capacity":[200,300],"reload":[6,8]},"generator":{"capacity":[80,140],"reload":[30,45]},"ship":{"mass":175,"speed":[90,115],"rotation":[60,80],"acceleration":[90,140]}},"shape":[3,2.914,2.408,1.952,1.675,1.49,1.349,1.263,1.198,1.163,1.146,1.254,1.286,1.689,2.06,2.227,2.362,2.472,2.832,3.082,3.436,3.621,3.481,2.48,2.138,2.104,2.138,2.48,3.481,3.621,3.436,3.082,2.832,2.472,2.362,2.227,2.06,1.689,1.286,1.254,1.146,1.163,1.198,1.263,1.349,1.49,1.675,1.952,2.408,2.914],"lasers":[{"x":0,"y":-3,"z":0,"angle":0,"damage":[38,84],"rate":1,"type":2,"speed":[175,230],"number":1,"spread":0,"error":0,"recoil":50},{"x":1.16,"y":-0.277,"z":1.35,"angle":-10,"damage":[8,12],"rate":2,"type":1,"speed":[100,130],"number":1,"spread":-10,"error":0,"recoil":0},{"x":-1.16,"y":-0.277,"z":1.35,"angle":10,"damage":[8,12],"rate":2,"type":1,"speed":[100,130],"number":1,"spread":-10,"error":0,"recoil":0}],"radius":3.621}}' },
        701: { name: "Odyssey", code: '{"name":"Odyssey","level":7,"model":1,"size":3.1,"specs":{"shield":{"capacity":[600,600],"reload":[12,12]},"generator":{"capacity":[320,320],"reload":[110,110]},"ship":{"mass":520,"speed":[55,55],"rotation":[25,25],"acceleration":[130,130]}},"tori":{"circle":{"segments":20,"radius":95,"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],"height":[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],"texture":[63,63,4,10,4,4,10,4,63,63,63,63,3,10,3,3,10,3,63]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":-10,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[-105,-105,-65,-53,-45,-36,-20,-25,40,40,100,90],"z":[0,0,0,0,0,0,0,0,0,1,3,3]},"width":[0,20,40,40,32,15,15,30,30,40,30,0],"height":[0,16,25,25,23,20,16,25,25,20,10,0],"texture":[4,15,63,3,2,4,4,11,10,4,12]},"cannonmain":{"section_segments":6,"offset":{"x":0,"y":-90,"z":0},"position":{"x":[0,0,0,0],"y":[-25,-30,-20,0],"z":[0,0,0,0]},"width":[0,19,19,7],"height":[0,10,17,7],"texture":[5.9,5.9,2,17],"laser":{"damage":[230,230],"rate":2,"type":1,"speed":[95,95],"number":1,"error":0,"recoil":350}},"laser1":{"section_segments":8,"offset":{"x":109,"y":0,"z":0},"position":{"x":[0,0,0,0],"y":[-25,-30,-20,0],"z":[0,0,0,0]},"width":[0,3,5,5],"height":[0,3,5,5],"texture":[12,6,63],"laser":{"damage":[20,20],"rate":3,"type":1,"speed":[200,200],"number":1,"error":0}},"laser2":{"section_segments":8,"offset":{"x":109,"y":0,"z":0},"position":{"x":[0,0,0,0],"y":[-25,-30,-20,0],"z":[0,0,0,0]},"width":[0,3,5,5],"height":[0,3,5,5],"texture":[12,6,63],"angle":180,"laser":{"damage":[20,20],"rate":3,"type":1,"speed":[200,200],"number":1,"error":0}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":0,"z":15},"position":{"x":[0,0,0,0,0,0,0],"y":[-30,-10,0,10,30],"z":[0,0,0,0,0]},"width":[0,12,15,10,0],"height":[0,20,22,18,0],"texture":[9]},"bumpers":{"section_segments":8,"offset":{"x":85,"y":20,"z":0},"position":{"x":[-10,-5,5,10,5,-10,-15],"y":[-90,-85,-40,0,20,60,65],"z":[0,0,0,0,0,0,0]},"width":[0,10,15,15,15,5,0],"height":[0,20,35,35,25,15,0],"texture":[11,2,63,4,3],"angle":0},"frontbumpers":{"section_segments":8,"offset":{"x":23,"y":-100,"z":0},"position":{"x":[-7.5,-3.5,0,11,2,-8,-8],"y":[-44,-41,10,27,45,60,85],"z":[0,0,0,0,0,0,0]},"width":[0,7,14,13,14,9,7],"height":[0,10,19,29,29,17,8],"texture":[2,2,63,4,4,1],"angle":0},"toppropulsors":{"section_segments":10,"offset":{"x":17,"y":55,"z":15},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-20,-15,-5,10,20,25,30,40,50,40],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,10,15,15,15,10,10,15,10,0],"height":[0,10,15,15,15,10,10,15,10,0],"texture":[3,4,10,3,3,63,4],"propeller":true},"bottompropulsors":{"section_segments":8,"offset":{"x":17,"y":55,"z":-5},"position":{"x":[0,0,0,0,0],"y":[-20,30,40,50,40],"z":[0,0,0,0,0]},"width":[0,12,17,12,0],"height":[0,12,17,12,0],"texture":[3,4,4],"propeller":true}},"wings":{"topjoin":{"offset":{"x":0,"y":-3,"z":0},"doubleside":true,"length":[99],"width":[20,20],"angle":[25],"position":[0,0,0,50],"texture":[1],"bump":{"position":10,"size":30}},"bottomjoin":{"offset":{"x":0,"y":-3,"z":0},"doubleside":true,"length":[100],"width":[20,20],"angle":[-25],"position":[0,0,0,50],"texture":[1],"bump":{"position":-10,"size":30}},"winglets":{"length":[25],"width":[41,26,30],"angle":[10,-10],"position":[-40,-56,-55],"bump":{"position":0,"size":30},"texture":63,"offset":{"x":27,"y":-23.5,"z":-6}}},"typespec":{"name":"Odyssey","level":7,"model":1,"code":701,"specs":{"shield":{"capacity":[600,600],"reload":[12,12]},"generator":{"capacity":[320,320],"reload":[110,110]},"ship":{"mass":520,"speed":[55,55],"rotation":[25,25],"acceleration":[130,130]}},"shape":[7.454,8.98,8.835,6.801,6.568,5.972,2.858,6.866,6.883,6.673,7.189,7.184,7.124,7.124,7.184,7.189,6.945,6.851,6.966,7.014,6.83,4.817,6.436,6.754,6.627,6.523,6.627,6.754,6.436,4.817,6.83,7.014,6.966,6.851,6.945,7.189,7.184,7.124,7.124,7.184,7.189,6.673,6.883,6.866,2.858,5.972,6.568,6.801,8.835,8.98],"lasers":[{"x":0,"y":-7.44,"z":0,"angle":0,"damage":[230,230],"rate":2,"type":1,"speed":[95,95],"number":1,"spread":0,"error":0,"recoil":350},{"x":6.758,"y":-1.86,"z":0,"angle":0,"damage":[20,20],"rate":3,"type":1,"speed":[200,200],"number":1,"spread":0,"error":0,"recoil":0},{"x":-6.758,"y":-1.86,"z":0,"angle":0,"damage":[20,20],"rate":3,"type":1,"speed":[200,200],"number":1,"spread":0,"error":0,"recoil":0},{"x":6.758,"y":1.86,"z":0,"angle":180,"damage":[20,20],"rate":3,"type":1,"speed":[200,200],"number":1,"spread":0,"error":0,"recoil":0},{"x":-6.758,"y":1.86,"z":0,"angle":-180,"damage":[20,20],"rate":3,"type":1,"speed":[200,200],"number":1,"spread":0,"error":0,"recoil":0}],"radius":8.98}}' },
        702: { name: "Weaver", code: '{"name":"Weaver","level":7,"model":2,"size":2.9,"specs":{"shield":{"capacity":[350,350],"reload":[9,9]},"generator":{"capacity":[205,205],"reload":[75,75]},"ship":{"mass":300,"speed":[105,105],"rotation":[65,65],"acceleration":[85,85]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":-22,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-70,-68,-15,0,30,40,60,70,80,70],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,10,20,21,18,20,20,18,15,0],"height":[0,5,20,21,18,20,20,18,15,0],"texture":[11,2,63,3,4,8,15,63,17],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-42,"z":15},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-25,-20,0,25,60,62],"z":[-3.2,-3,0,0,0,0]},"width":[4,8,11,8,5,0],"height":[0,2,6,8,4,0],"propeller":false,"texture":[4,9,9,63,4]},"deco":{"section_segments":8,"offset":{"x":50,"y":43,"z":-10},"position":{"x":[-3,-2,5,8,5,0,0],"y":[-62,-60,-20,0,20,40,42],"z":[0,0,0,0,0,0,0]},"width":[0,5,10,9,10,5,0],"height":[0,5,10,9,10,5,0],"angle":0,"propeller":false,"texture":[11,2,8,10,63,4]},"cannons":{"section_segments":8,"offset":{"x":38,"y":43,"z":-10},"position":{"x":[0,0,0,0,0,10,10],"y":[-52,-50,-20,0,20,40,42],"z":[0,0,0,0,0,0,0]},"width":[0,4,5,10,10,5,0],"height":[0,8,8,13,13,5,0],"angle":0,"laser":{"damage":[80,80],"rate":2,"type":1,"speed":[227,227],"number":1,"recoil":130},"propeller":false,"texture":[17,13,4,10,63,4]},"bottompropulsors":{"section_segments":12,"offset":{"x":16,"y":-12,"z":-1},"position":{"x":[0,0,0,0,0,0,0,0],"y":[15,5,13,25,30,40,60,50],"z":[5,6,0.1,0,0,0,0,0]},"width":[0,5,10,10,10,7,7,0],"height":[0,5,10,10,10,7,7,0],"propeller":true,"texture":[3,2,10,63,4,8,17]},"toppropulsors":{"section_segments":8,"offset":{"x":46.5,"y":28,"z":-2},"position":{"x":[0,0,0,0,0,0,0,0],"y":[11,7,13,25,30,40,60,50],"z":[0,0,0,0,0,0,0,0]},"width":[0,5,10,10,10,7,7,0],"height":[0,5,10,10,10,7,7,0],"propeller":true,"texture":[4,2,15,63,4,8,17]}},"wings":{"main":{"length":[22],"width":[17,18],"angle":[-40],"position":[1,15],"doubleside":true,"bump":{"position":0,"size":15},"texture":[18,63],"offset":{"x":20,"y":4,"z":5.8}},"main2":{"length":[50],"width":[20,20],"angle":[-20],"position":[-40,30],"doubleside":true,"bump":{"position":30,"size":15},"texture":[63,63],"offset":{"x":0,"y":42,"z":10}},"sides":{"doubleside":true,"offset":{"x":59,"y":23,"z":-10},"length":[-3,5,13,10],"width":[5,10,60,30,10],"angle":[5,5,25,35],"position":[0,0,20,45,58],"texture":[4,3,11,63],"bump":{"position":30,"size":10}},"front":{"length":[-3,20],"width":[0,90,10],"angle":[0,-10],"position":[0,0,40],"doubleside":true,"bump":{"position":30,"size":10},"texture":[15,3.3],"offset":{"x":10,"y":-67,"z":0}},"top":{"doubleside":true,"offset":{"x":14,"y":30,"z":11},"length":[0,15],"width":[0,30,15],"angle":[0,40],"position":[0,0,20],"texture":[11],"bump":{"position":30,"size":10}}},"typespec":{"name":"Weaver","level":7,"model":2,"code":702,"specs":{"shield":{"capacity":[350,350],"reload":[9,9]},"generator":{"capacity":[205,205],"reload":[75,75]},"ship":{"mass":300,"speed":[105,105],"rotation":[65,65],"acceleration":[85,85]}},"shape":[6.509,6.483,4.633,3.665,3.081,2.694,2.417,2.121,1.445,2.963,3.23,3.269,3.366,3.525,3.758,4.071,4.51,5.202,6.441,6.851,5.786,5.973,5.641,3.475,3.424,3.37,3.424,3.475,5.641,5.973,5.786,6.851,6.441,5.202,4.51,4.071,3.758,3.525,3.366,3.269,3.23,2.963,1.445,2.121,2.417,2.694,3.081,3.665,4.633,6.483],"lasers":[{"x":2.204,"y":-0.522,"z":-0.58,"angle":0,"damage":[80,80],"rate":2,"type":1,"speed":[227,227],"number":1,"spread":0,"error":0,"recoil":130},{"x":-2.204,"y":-0.522,"z":-0.58,"angle":0,"damage":[80,80],"rate":2,"type":1,"speed":[227,227],"number":1,"spread":0,"error":0,"recoil":130}],"radius":6.851}}' },
        703: { name: "Ballista", code: '{"name":"Ballista","level":7,"model":3,"size":2.9,"specs":{"shield":{"capacity":[450,450],"reload":[10,10]},"generator":{"capacity":[280,280],"reload":[70,70]},"ship":{"mass":500,"speed":[70,70],"rotation":[45,45],"acceleration":[85,85]}},"bodies":{"main_body":{"section_segments":12,"offset":{"x":0,"y":25,"z":11},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-145,-135,-115,-60,-30,10,30,50,60,70,65],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[2,7,12,25,20,20,25,26.5,20,18,0],"height":[0,8,16,23,20,20,25,26.5,20,18,0],"texture":[4,63,10,1,11,2,13,2,4,17],"propeller":true},"top_pew1":{"section_segments":10,"offset":{"x":0,"y":30,"z":55},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-50,-27,-35,10,20,25,30,40,80,70],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,7,8,14,20,14,14,18,9,0],"height":[0,7,9,15,17,15,15,20,10,0],"texture":[6,16.9,10,3,1,63,2,1,16.9],"propeller":true},"top_pew1_laser":{"offset":{"x":0,"y":-28.7,"z":55},"position":{"x":[0],"y":[0],"z":[0]},"width":[0],"height":[0],"laser":{"damage":[20,20],"rate":1,"speed":[195,195],"number":11,"recoil":18,"type":2}},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-60,"z":25},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-15,-3,25,43,55,100],"z":[0,0,0,0,-1,1,0,0,1,0,0,0]},"width":[1,7,12.4,11,9.5,0],"height":[1,8,15,11,12,0],"texture":[7,9,9,8,31]},"gun1":{"section_segments":8,"offset":{"x":85,"y":15,"z":-22},"position":{"x":[0,0,0,0,0,0,-1],"y":[-28,-40,-34,-14,-5,22,40],"z":[0,0,0,0,0,0,5]},"width":[0,3.4,5,5.5,8,5,0],"height":[0,3.4,5,5.5,8,5,0],"texture":[17,63,4,8,2,3],"angle":4,"laser":{"damage":[15,15],"rate":3,"speed":[185,185],"number":1,"recoil":0,"type":1}},"side_inner":{"section_segments":8,"offset":{"x":56,"y":45,"z":-5},"position":{"x":[-8,-4,-7,0,0,-10,-15],"y":[-60,-45,-25,-14,22.5,40,50],"z":[0,0,0,0,0,0,0]},"width":[0,7,10,9,9,7,0],"height":[0,8,15,15,15,12,0],"texture":[2,3,63,13,63,2],"angle":5},"propulsors":{"section_segments":8,"offset":{"x":38,"y":50,"z":0},"position":{"x":[-15,-15,-8,-12.5,-12,-5,0,-1,-1,-1,0,0,0,0,0],"y":[-95,-100,-80,-50,-40,-20,20,39,50,48],"z":[2.5,2.5,5,0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,5,10,10,10,20,20,11,10,0],"height":[0,10,13,15,15,20,20,16,12,0],"texture":[6,63,2,13,63,10,2,13,17],"propeller":true},"cannon_pulse_indicator":{"offset":{"x":0,"y":0,"z":0},"position":{"x":[0],"y":[0],"z":[0]},"width":[0],"height":[0],"laser":{"damage":[220,220],"rate":1,"type":1,"speed":[1,1],"number":100}}},"wings":{"main":{"doubleside":true,"offset":{"x":57,"y":45,"z":-5},"length":[29,10,20],"width":[70,42,42,15],"angle":[-20,-15,10],"position":[0,-20,-31,-10],"texture":[11,63,4],"bump":{"position":10,"size":10}},"stab":{"length":[13,2,15],"width":[40,30,75,10],"angle":[-20,0,10],"position":[35,45,30,55],"doubleside":true,"texture":[8,4,63],"bump":{"position":20,"size":10},"offset":{"x":5,"y":-125,"z":12}},"join":{"offset":{"x":0,"y":10,"z":23},"length":[0,37,0,34],"width":[0,28,45,45,10],"angle":[90,90,90,-10],"position":[0,10,40,40,65],"texture":[8,8,63],"doubleside":true,"bump":{"position":20,"size":8}}},"typespec":{"name":"Ballista","level":7,"model":3,"code":703,"specs":{"shield":{"capacity":[450,450],"reload":[10,10]},"generator":{"capacity":[280,280],"reload":[70,70]},"ship":{"mass":500,"speed":[70,70],"rotation":[45,45],"acceleration":[85,85]}},"shape":[6.961,7.765,7.01,5.56,4.628,3.222,3.058,2.951,2.85,2.551,5.185,5.203,5.675,6.156,6.803,7.035,5.852,5.959,5.497,5.65,5.949,6.403,6.409,6.098,6.399,6.393,6.399,6.098,6.409,6.403,5.949,5.65,5.497,5.959,5.852,7.035,6.803,6.156,5.675,5.203,5.185,2.551,2.85,2.951,3.058,3.222,4.628,5.56,7.01,7.765],"lasers":[{"x":0,"y":-1.665,"z":3.19,"angle":0,"damage":[20,20],"rate":1,"type":2,"speed":[195,195],"number":11,"spread":0,"error":0,"recoil":18},{"x":4.768,"y":-1.444,"z":-1.276,"angle":4,"damage":[15,15],"rate":3,"type":1,"speed":[185,185],"number":1,"spread":0,"error":0,"recoil":0},{"x":-4.768,"y":-1.444,"z":-1.276,"angle":-4,"damage":[15,15],"rate":3,"type":1,"speed":[185,185],"number":1,"spread":0,"error":0,"recoil":0},{"x":0,"y":0,"z":0,"angle":0,"damage":[220,220],"rate":1,"type":1,"speed":[1,1],"number":100,"spread":0,"error":0,"recoil":0}],"radius":7.765}}'},
        704: { name: "Icarus", code: '{"name":"Icarus","level":7,"model":4,"size":2.5,"specs":{"shield":{"capacity":[400,400],"reload":[9,9]},"generator":{"capacity":[250,250],"reload":[52,52]},"ship":{"mass":300,"speed":[110,110],"rotation":[55,55],"acceleration":[90,90]}},"bodies":{"main":{"section_segments":20,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-130,-128,-115,-70,-40,0,40,60,75,90,100,95],"z":[0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,5,10,20,24,20,20,27,29,26,20,0],"height":[0,5,13,30,20,10,10,15,15,15,10,0],"texture":[18,3,13,4,63,63,3,4,63,13,17],"propeller":true,"laser":{"damage":[170,170],"rate":1,"type":1,"speed":[152,152],"number":1,"error":0,"recoil":350}},"air":{"section_segments":10,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-80,-83,-80,-30,-10,10,30,50],"z":[0,0,0,0,0,0,0,0]},"width":[0,23,25,35,30,30,32,20],"height":[0,10,10,10,10,10,10,10,15,15,15,10,10],"texture":[4,63,4,3,2,63,3]},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-30,"z":18},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-65,-25,0,25,60,90,100],"z":[0,0,0,0,-10,-8,-10]},"width":[0,10,13,10,20,15,10],"height":[0,15,20,10,10,10,10],"texture":[9,9,9,10,63,3]},"laser":{"section_segments":10,"offset":{"x":90,"y":0,"z":-19},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-30,-25,0,10,20,25,30,40,70,65],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,10,15,15,15,10,10,15,10,0],"height":[0,10,15,15,15,10,10,15,5,0],"texture":[6,4,10,3,4,4,3,13,17],"propeller":true,"angle":4,"laser":{"damage":[14,14],"rate":2,"type":1,"speed":[220,220],"number":1}},"laser2":{"section_segments":10,"offset":{"x":50,"y":-20,"z":-20},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-30,-25,0,10,20,25,30,40,70,65],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,10,15,15,15,10,10,15,12,0],"height":[0,10,15,15,15,10,10,15,5,0],"texture":[6,4,10,3,4,4,3,13,17],"propeller":true,"angle":2,"laser":{"damage":[23,23],"rate":2,"type":1,"speed":[190,190],"number":1}}},"wings":{"wings":{"offset":{"x":10,"y":0,"z":0},"length":[35,15,30,25],"width":[100,50,60,50,40],"angle":[-10,20,0,0],"position":[0,0,10,30,-10],"texture":[4,63,18,63],"doubleside":true,"bump":{"position":-20,"size":15}},"wings2":{"offset":{"x":10,"y":0,"z":0},"length":[35,15,30,20],"width":[100,50,60,50,25],"angle":[-10,20,0,0],"position":[0,0,10,30,65],"texture":[4,63,18,4],"doubleside":true,"bump":{"position":-20,"size":15}}},"typespec":{"name":"Icarus","level":7,"model":4,"code":704,"specs":{"shield":{"capacity":[400,400],"reload":[9,9]},"generator":{"capacity":[250,250],"reload":[52,52]},"ship":{"mass":300,"speed":[110,110],"rotation":[55,55],"acceleration":[90,90]}},"shape":[6.5,6.068,4.366,3.971,3.26,2.789,3.551,3.705,3.653,3.495,5.873,5.858,5.721,5.7,5.6,5.739,6.19,6.669,5.933,3.646,3.265,2.741,4.401,5.099,5.09,5.01,5.09,5.099,4.401,2.741,3.265,3.646,5.933,6.669,6.19,5.739,5.6,5.7,5.721,5.858,5.873,3.495,3.653,3.705,3.551,2.789,3.26,3.971,4.366,6.068],"lasers":[{"x":0,"y":-6.5,"z":0,"angle":0,"damage":[170,170],"rate":1,"type":1,"speed":[152,152],"number":1,"spread":0,"error":0,"recoil":350},{"x":4.395,"y":-1.496,"z":-0.95,"angle":4,"damage":[14,14],"rate":2,"type":1,"speed":[220,220],"number":1,"spread":0,"error":0,"recoil":0},{"x":-4.395,"y":-1.496,"z":-0.95,"angle":-4,"damage":[14,14],"rate":2,"type":1,"speed":[220,220],"number":1,"spread":0,"error":0,"recoil":0},{"x":2.448,"y":-2.499,"z":-1,"angle":2,"damage":[23,23],"rate":2,"type":1,"speed":[190,190],"number":1,"spread":0,"error":0,"recoil":0},{"x":-2.448,"y":-2.499,"z":-1,"angle":-2,"damage":[23,23],"rate":2,"type":1,"speed":[190,190],"number":1,"spread":0,"error":0,"recoil":0}],"radius":6.669}}' },
        705: { name: "Kyvos", code: '{"name":"Kyvos","level":7,"model":5,"size":1.4,"zoom":0.97,"specs":{"shield":{"capacity":[280,280],"reload":[9,9]},"generator":{"capacity":[220,220],"reload":[60,60]},"ship":{"mass":250,"speed":[130,130],"rotation":[70,70],"acceleration":[130,130]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":-20,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-157,-150,-114,-72,-22,5,20,80,102,130,160,150],"z":[0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,11,26,30,37,38,31,29,28,26,24,0],"height":[0,11,25,26,29,35,39,30,27,26,24,0],"texture":[4,9,9,10,2,4,11,63,2,12,17],"laser":{"damage":[140,140],"rate":2,"type":1,"speed":[65,65],"number":1,"recoil":0},"propeller":true},"tubes":{"section_segments":8,"offset":{"x":35,"y":57,"z":0},"position":{"x":[-9,-11,-6,-9,-11,-13,-15,0,0,0],"y":[-188,-140,-99,-72,-36,0,49,75,115,110],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,22,21,25,22,23,30,16,12,0],"height":[0,13,16,18,15,15,14,14,13,0],"texture":[2,3,2,63,10,63,3,12,17],"propeller":true},"outsidethings":{"section_segments":8,"offset":{"x":36,"y":8,"z":0},"position":{"x":[-3,20,42,29,-7],"y":[-91,-60,-5,50,88],"z":[0,0,0,0,0,0,0]},"width":[13,13,16,16,20],"height":[8,11,13,13,8],"texture":[2,63,4,63],"propeller":false},"toptube":{"section_segments":8,"offset":{"x":0,"y":45,"z":27},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-110,-86,-44,16,39,60],"z":[-9,-4,0,0,-4,-12]},"width":[17,18,19,18,15,13],"height":[10,16,16,12,11,11],"texture":[3,63,11,3,13],"propeller":false}},"wings":{"wing0":{"doubleside":true,"length":[43,30,30],"width":[170,128,70,40],"angle":[0,-16,-19],"position":[0,28,54,54],"offset":{"x":40,"y":19,"z":0},"bump":{"position":25,"size":4},"texture":[4,3.3,63]},"nothing":{"doubleside":true,"length":[36,0],"width":[150,70,0],"angle":[-7,-7],"position":[0,0,0],"offset":{"x":40,"y":18,"z":-5},"bump":{"position":-22,"size":5},"texture":[111]},"winglet0":{"doubleside":true,"length":[34,23],"width":[70,59,30],"angle":[25,20],"position":[10,25,35],"offset":{"x":6,"y":46,"z":20},"bump":{"position":28,"size":7},"texture":[18,63]},"winglet1":{"doubleside":true,"length":[26,20],"width":[50,35,22],"angle":[-12,-12],"position":[8,20,18],"offset":{"x":46,"y":130,"z":-6},"bump":{"position":10,"size":6},"texture":[4,63]}},"typespec":{"name":"Kyvos","level":7,"model":5,"code":705,"specs":{"shield":{"capacity":[280,280],"reload":[9,9]},"generator":{"capacity":[220,220],"reload":[60,60]},"ship":{"mass":250,"speed":[130,130],"rotation":[70,70],"acceleration":[130,130]}},"shape":[4.956,4.773,3.84,3.194,2.808,2.59,2.49,2.435,2.409,2.367,2.396,2.47,2.59,2.773,3.065,4.221,4.479,4.711,4.608,4.373,4.755,5.13,5.101,4.993,4.903,3.927,4.903,4.993,5.101,5.13,4.755,4.373,4.608,4.711,4.479,4.221,3.065,2.773,2.59,2.47,2.396,2.367,2.409,2.435,2.49,2.59,2.808,3.194,3.84,4.773],"lasers":[{"x":0,"y":-4.956,"z":0,"angle":0,"damage":[140,140],"rate":2,"type":1,"speed":[65,65],"number":1,"spread":0,"error":0,"recoil":0}],"radius":5.13}}' },
        706: { name: "Bass-Cannon", code: '{"name":"Bass-Cannon","level":7,"model":6,"size":3.4,"specs":{"shield":{"capacity":[600,600],"reload":[10,10]},"generator":{"capacity":[330,330],"reload":[110,110]},"ship":{"mass":520,"speed":[75,75],"rotation":[30,30],"acceleration":[75,75]}},"bodies":{"mainCannon":{"section_segments":12,"offset":{"x":0,"y":10,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[-128,-127.5,-125,-127.5,-130,-125,-115,-80,80,95,90],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,3,7.5,15,20,25,27.5,27.5,25,20,0],"height":[0,3,7.5,15,20,25,25,25,25,20,0],"texture":[63,4,3,4,2,3,11,3,13,17],"propeller":true,"laser":{"damage":[60,60],"rate":0.33,"type":1,"speed":[120,120],"number":1,"angle":0,"error":0,"recoil":220}},"cannon2":{"section_segments":12,"offset":{"x":0,"y":10,"z":0},"position":{"x":[0],"y":[-128],"z":[0]},"width":[0],"height":[0],"texture":[63],"propeller":true,"laser":{"damage":[45,45],"rate":0.33,"type":1,"speed":[142,142],"number":2,"angle":6,"error":0}},"cannon3":{"section_segments":12,"offset":{"x":0,"y":10,"z":0},"position":{"x":[0],"y":[-128],"z":[0]},"width":[0],"height":[0],"texture":[63],"propeller":true,"laser":{"damage":[30,30],"rate":0.33,"type":1,"speed":[124,124],"number":6,"angle":35,"error":0}},"cockpit":{"section_segments":12,"offset":{"x":0,"y":70,"z":25},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-90,-75,-60,-45,-30,0,15,20],"z":[7.5,3,3,0,0,0,0,-4,0,0]},"width":[3,9,11,12,18,15,10,0],"height":[0,10,12,15,15,15,10,0],"texture":[9,9,9,4,10,63,4,3,63]},"side":{"section_segments":8,"offset":{"x":30,"y":10,"z":0},"position":{"x":[-5,-3,-1,0,0,0,0,0,-9],"y":[-100,-90,-70,-50,-15,20,35,60,95],"z":[0,0,0,0,0,0,0,0,3]},"width":[0,12,15,15,17,35,36,28,0],"height":[0,15,15,15,15,15,15,15,0],"texture":[3,63,3,10,63,4,11,2,13,3],"propeller":false},"side2":{"section_segments":8,"offset":{"x":20,"y":10,"z":5},"position":{"x":[-3,0,0,0,0,0,-3],"y":[-85,-45,0,40,75,95],"z":[10,0,0,0,0,0,0]},"width":[0,15,17,28,15,0],"height":[0,15,18,16,15,0],"angle":0,"propeller":false,"texture":[4,2,3,63,3,4]},"mid":{"section_segments":10,"offset":{"x":0,"y":-25,"z":15},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-80,-70,-44,-5,40,80,115,120],"z":[8,1,1,0,0,0,0,0]},"width":[0,13,18,20,20,20,20,0],"height":[0,15,18,18,18,16,15,0],"angle":0,"propeller":false,"texture":[63,4,3,11,4,63,4]}},"wings":{"winglet":{"doubleside":true,"offset":{"x":10,"y":55,"z":30},"length":[20],"width":[50,35],"angle":[0],"position":[0,0],"texture":[3.5],"bump":{"position":10,"size":5}},"winglet2":{"doubleside":true,"offset":{"x":20,"y":-100,"z":0},"length":[17],"width":[30,20],"angle":[0],"position":[0,0],"texture":[3],"bump":{"position":10,"size":10}},"winglet3":{"doubleside":true,"offset":{"x":43,"y":-25,"z":0},"length":[16],"width":[80,125],"angle":[0],"position":[0,0],"texture":[3.5],"bump":{"position":10,"size":1}}},"typespec":{"name":"Bass-Cannon","level":7,"model":6,"code":706,"specs":{"shield":{"capacity":[600,600],"reload":[10,10]},"generator":{"capacity":[330,330],"reload":[110,110]},"ship":{"mass":520,"speed":[75,75],"rotation":[30,30],"acceleration":[75,75]}},"shape":[8.176,8.273,8.138,7.892,6.066,7.176,6.29,5.485,4.945,4.54,4.294,4.14,4.034,4.034,4.14,4.538,5.071,5.48,5.765,6.182,6.278,6.484,6.816,7.281,7.268,7.154,7.268,7.281,6.816,6.484,6.278,6.182,5.765,5.48,5.071,4.538,4.14,4.034,4.034,4.14,4.294,4.54,4.945,5.485,6.29,7.176,6.066,7.892,8.138,8.273],"lasers":[{"x":0,"y":-8.16,"z":0,"angle":0,"damage":[60,60],"rate":0.33,"type":1,"speed":[120,120],"number":1,"spread":0,"error":0,"recoil":220},{"x":0,"y":-8.024,"z":0,"angle":0,"damage":[45,45],"rate":0.33,"type":1,"speed":[142,142],"number":2,"spread":6,"error":0,"recoil":0},{"x":0,"y":-8.024,"z":0,"angle":0,"damage":[30,30],"rate":0.33,"type":1,"speed":[124,124],"number":6,"spread":35,"error":0,"recoil":0}],"radius":8.273}}' },
        707: { name: "Bastion", code: '{"name":"Bastion","level":7,"model":7,"size":3.2,"zoom":1.03,"specs":{"shield":{"capacity":[500,500],"reload":[10,10]},"generator":{"capacity":[300,300],"reload":[95,95]},"ship":{"mass":420,"speed":[80,80],"rotation":[30,30],"acceleration":[90,90]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":30,"z":10},"position":{"x":[0,0,0,0,0,0,0],"y":[-40,-50,-20,0,20,40,25],"z":[0,0,0,0,0,0,0]},"width":[0,5,22,18,16,15,0],"height":[0,2,12,16,16,15,0],"texture":[10,1,1,10,8,17],"propeller":true},"thrusters":{"section_segments":8,"offset":{"x":40,"y":23,"z":-24},"position":{"x":[0,0,0,0,0,0],"y":[-25,-20,0,20,40,30],"z":[0,0,0,0,0,0]},"width":[0,8,12,8,8,0],"height":[0,12,12,8,8,0],"texture":[63,2,2,2,17],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":10,"z":20},"position":{"x":[0,0,0,0,0,0,0],"y":[-15,-10,0,11,35],"z":[-5,-3,-1,0,0]},"width":[0,5,10,10,0],"height":[0,3,5,7,0],"texture":[9]},"cannon1":{"section_segments":4,"offset":{"x":10,"y":-100,"z":1},"position":{"x":[0,0,0,0,0,0,0],"y":[-10,0,20,30,40],"z":[0,0,0,0,0]},"width":[0,2,4,7,3],"height":[0,1,3,6,0],"texture":[17,4],"laser":{"damage":[6,6],"rate":6,"type":1,"speed":[165,165],"number":1}},"cannon2":{"section_segments":4,"offset":{"x":42.5,"y":-149,"z":8},"position":{"x":[0,0,0,0,0,0,0],"y":[-10,0,20,30,40],"z":[0,0,0,0,0]},"width":[0,2,4,7,3],"height":[0,1,3,6,0],"texture":[17,4],"angle":2,"laser":{"damage":[8,8],"rate":4,"type":1,"speed":[165,165],"number":1}},"cannon3":{"section_segments":4,"offset":{"x":75,"y":-125,"z":-8},"position":{"x":[0,0,0,0,0,0,0],"y":[-10,0,20,30,40],"z":[0,0,0,0,0]},"width":[0,2,4,7,3],"height":[0,1,3,6,0],"texture":[17,4],"angle":4,"laser":{"damage":[18,18],"rate":1.2,"type":1,"speed":[180,180],"number":1}}},"wings":{"main1":{"doubleside":true,"offset":{"x":9,"y":-5,"z":0},"length":[0,15,0,7],"width":[0,160,70,30,30],"angle":[0,20,0,-10],"position":[30,-20,30,30,30],"texture":[13,63,13,8],"bump":{"position":35,"size":5}},"main2":{"doubleside":true,"offset":{"x":30,"y":-5,"z":0},"length":[0,15,0,20],"width":[0,80,90,200,30],"angle":[30,30,30,30],"position":[30,30,10,-45,30],"texture":[13,3,13,4],"bump":{"position":35,"size":7}},"main3":{"doubleside":true,"offset":{"x":0,"y":5,"z":-7},"length":[45,35,0,20],"width":[40,40,40,200,40],"angle":[-20,20,-20,-5],"position":[20,30,0,-30,10],"texture":[0,8,13,63],"bump":{"position":35,"size":20}}},"typespec":{"name":"Bastion","level":7,"model":7,"code":707,"specs":{"shield":{"capacity":[500,500],"reload":[10,10]},"generator":{"capacity":[300,300],"reload":[95,95]},"ship":{"mass":420,"speed":[80,80],"rotation":[30,30],"acceleration":[90,90]}},"shape":[4.867,7.069,10.527,9.455,9.861,9.25,8.281,7.253,6.749,6.417,6.187,6.076,6.095,6.133,6.28,6.485,6.469,6.534,6.727,6.796,5.069,4.774,4.582,4.582,4.561,4.489,4.561,4.582,4.582,4.774,5.069,6.796,6.727,6.534,6.469,6.485,6.28,6.133,6.095,6.076,6.187,6.417,6.749,7.253,8.281,9.25,9.861,9.455,10.527,7.069],"lasers":[{"x":0.64,"y":-7.04,"z":0.064,"angle":0,"damage":[6,6],"rate":6,"type":1,"speed":[165,165],"number":1,"spread":0,"error":0,"recoil":0},{"x":-0.64,"y":-7.04,"z":0.064,"angle":0,"damage":[6,6],"rate":6,"type":1,"speed":[165,165],"number":1,"spread":0,"error":0,"recoil":0},{"x":2.698,"y":-10.176,"z":0.512,"angle":2,"damage":[8,8],"rate":4,"type":1,"speed":[165,165],"number":1,"spread":0,"error":0,"recoil":0},{"x":-2.698,"y":-10.176,"z":0.512,"angle":-2,"damage":[8,8],"rate":4,"type":1,"speed":[165,165],"number":1,"spread":0,"error":0,"recoil":0},{"x":4.755,"y":-8.638,"z":-0.512,"angle":4,"damage":[18,18],"rate":1.2,"type":1,"speed":[180,180],"number":1,"spread":0,"error":0,"recoil":0},{"x":-4.755,"y":-8.638,"z":-0.512,"angle":-4,"damage":[18,18],"rate":1.2,"type":1,"speed":[180,180],"number":1,"spread":0,"error":0,"recoil":0}],"radius":10.527}}' },
        708: { name: "Shadow X-3", code: '{"name":"Shadow X-3","level":7,"model":8,"size":1.8,"zoom":1,"specs":{"shield":{"capacity":[260,260],"reload":[11,11]},"generator":{"capacity":[185,185],"reload":[55,55]},"ship":{"mass":235,"speed":[140,140],"rotation":[58,58],"acceleration":[105,105]}},"bodies":{"main":{"section_segments":20,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-125,-123,-110,-70,-40,0,40,70,80,90,100],"z":[0,0,0,-2,0,0,0,0,0,0,0]},"width":[0,5,10,20,30,20,20,30,30,30,20,0],"height":[0,5,10,20,20,20,20,15,15,15,10,10],"texture":[12,4,15,4,63,3,4,4,5]},"air":{"section_segments":10,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[0,-80,-30,-10,10,30,50],"z":[0,0,0,0,0,0,0]},"width":[0,5,35,30,30,32,20],"height":[0,15,10,10,10,10,10,15,15,15,10,10],"texture":[4,3,2,2,2,3]},"back":{"section_segments":10,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0],"y":[90,95,100,105,90],"z":[0,0,0,0,0]},"width":[10,15,18,22,2],"height":[3,5,7,8,2],"texture":[63],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-30,"z":18},"position":{"x":[0,0,0,0,0,0,0,0],"y":[-40,-25,0,25,60,90,100],"z":[0,0,0,0,-10,-8,-10]},"width":[0,10,15,10,20,15,10],"height":[0,10,20,20,20,15,10],"texture":[9,9,9,10,63,3]},"booster1":{"section_segments":10,"offset":{"x":32.5,"y":-15,"z":-15},"position":{"x":[0,0,0,0,0,0,0,0,-5,-10],"y":[-35,-25,0,10,20,25,30,40,70,90],"z":[0,0,0,0,0,0,0,0,5,10]},"width":[0,10,15,15,15,10,10,15,10,0],"height":[0,10,15,15,15,10,10,15,5,0],"texture":[6,4,10,3,4,3,4,3,4],"propeller":false,"laser":{"damage":[13,13],"rate":10,"type":1,"speed":[190,190],"number":1}},"booster2":{"section_segments":10,"offset":{"x":55,"y":5,"z":-15},"position":{"x":[0,0,0,0,0,0,0,0,0,0],"y":[-35,-25,0,10,20,25,30,40,70,60],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,10,15,15,15,10,10,15,12,0],"height":[0,10,15,15,15,10,10,15,5,0],"texture":[4,4,10,3,4,3,13],"propeller":true}},"wings":{"wings":{"doubleside":true,"offset":{"x":10,"y":0,"z":5},"length":[28,10,15,40],"width":[100,60,80,50,70],"angle":[-10,5,0,-40],"position":[-40,0,40,10,70],"texture":[4,4,4,4],"bump":{"position":-20,"size":15}},"sideBack":{"doubleside":true,"offset":{"x":20,"y":68,"z":0},"length":[30],"width":[30,15],"angle":[-13],"position":[0,30],"texture":[63],"bump":{"position":10,"size":10}},"sideFront":{"doubleside":true,"offset":{"x":10,"y":-95,"z":0},"length":[30],"width":[30,15],"angle":[-13],"position":[0,40],"texture":[63],"bump":{"position":10,"size":10}},"top":{"doubleside":true,"offset":{"x":10,"y":60,"z":5},"length":[30],"width":[50,30],"angle":[50],"position":[0,50],"texture":[3],"bump":{"position":10,"size":10}}},"typespec":{"name":"Shadow X-3","level":7,"model":8,"code":708,"specs":{"shield":{"capacity":[260,260],"reload":[11,11]},"generator":{"capacity":[185,185],"reload":[55,55]},"ship":{"mass":235,"speed":[140,140],"rotation":[58,58],"acceleration":[105,105]}},"shape":[4.5,4.212,3.527,3.123,2.846,2.634,2.103,2.078,1.937,2.348,2.431,2.421,2.571,2.813,3.153,3.601,3.826,4.136,4.602,5.054,3.503,4.162,4.191,4.622,3.892,3.787,3.892,4.622,4.191,4.162,3.503,5.054,4.602,4.136,3.826,3.601,3.153,2.813,2.582,2.421,2.431,2.348,1.937,2.078,2.103,2.634,2.846,3.123,3.527,4.212],"lasers":[{"x":1.17,"y":-1.8,"z":-0.54,"angle":0,"damage":[13,13],"rate":10,"type":1,"speed":[190,190],"number":1,"spread":0,"error":0,"recoil":0},{"x":-1.17,"y":-1.8,"z":-0.54,"angle":0,"damage":[13,13],"rate":10,"type":1,"speed":[190,190],"number":1,"spread":0,"error":0,"recoil":0}],"radius":5.054}}' },
        709: { name: "Inertia", code: '{"name":"Inertia","level":7,"model":9,"size":2.7,"zoom":1.04,"specs":{"shield":{"capacity":[550,550],"reload":[12,12]},"generator":{"capacity":[220,220],"reload":[80,80]},"ship":{"mass":500,"speed":[85,85],"rotation":[45,45],"acceleration":[68,68]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":10,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[-125,-120,-110,-85,-70,-60,-20,0,40,70,90,100,95],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,10,15,25,30,37,36,35,33,32,28,20,0],"height":[0,15,25,27,28,27,26,25,23,22,18,15,0],"texture":[4,31,11,1,31,3,2,4,11,3,31,17],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-50,"z":25},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-35,-25,-7,15,50,70,100],"z":[0,0,0,0,0,-1,-1.8]},"width":[0,8,13,15,18,16,5],"height":[0,10,15,15,12,11,5],"texture":[9,9,9,11,63,4,4]},"topengines":{"section_segments":8,"offset":{"x":25,"y":60,"z":18},"position":{"x":[-5,-5,-4,-2,-2,-2,-2,-2],"y":[-60,-55,-40,-6,15,45,58,53],"z":[-10,-10,-8,-2,-1,0,0,0]},"width":[0,7,9.5,12,12,11,9,0],"height":[0,7,9.5,10,10,11,9,0],"texture":[31,4,2,8,63,4,17],"propeller":true},"cannons":{"section_segments":12,"offset":{"x":36.1,"y":-50,"z":0},"position":{"x":[0,0.95,1,2,3,5,2,1,0,0],"y":[-30,-40,-38,-20,0,20,30,40,42],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,5,5,6,10,10,8,4,0],"height":[0,5,5,6,10,10,8,5,0],"texture":[17,31,12,31,8,3,3,31],"propeller":false,"angle":0,"laser":{"damage":[40,40],"rate":6,"type":1,"speed":[165,165],"recoil":85,"number":1,"error":0,"angle":0}},"sidetopengines":{"section_segments":8,"offset":{"x":50,"y":70,"z":28},"position":{"x":[0,0,0,0,0,0,0,0,0],"y":[-65,-55,-60,-45,-15,10,45,58,53],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,7,10,15,14,15,12,9,0],"height":[0,7,10,15,12,14,12,9,0],"texture":[4,17,63,3,4,10,3,17],"propeller":true,"angle":0},"sidebottomengines":{"section_segments":8,"offset":{"x":65,"y":60,"z":-28},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-65,-55,-60,-40,5,25,45,58,53],"z":[0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,7,10,15,13,14,12,9,0],"height":[0,7,10,15,13,14,12,9,0],"texture":[4,17,4,11,31,2,4,17],"propeller":true,"angle":0},"sides":{"section_segments":8,"offset":{"x":10,"y":-20,"z":0},"position":{"x":[-10,-2,0,5,7,0],"y":[-95,-90,-80,-40,-30,10],"z":[0,0,0,0,0,0]},"width":[0,10,15,20,20,0],"height":[0,15,22,26,21,0],"propeller":false,"texture":[4,31,10,31,31,2,12]}},"wings":{"cannonjointop":{"doubleside":true,"offset":{"x":6,"y":-50,"z":15},"length":[32,25],"width":[50,60,20],"angle":[-25,-20],"position":[20,0,15],"texture":[18,63],"bump":{"position":10,"size":5}},"cannonjoinbottom":{"doubleside":true,"offset":{"x":6,"y":-50,"z":-15},"length":[32,25],"width":[50,60,20],"angle":[25,20],"position":[20,0,15],"texture":[18,63],"bump":{"position":10,"size":5}},"enginejointop":{"doubleside":true,"offset":{"x":15,"y":55,"z":5},"length":[50],"width":[50,60],"angle":[38],"position":[20,0],"texture":[63],"bump":{"position":10,"size":10}},"enginejoinbottom":{"doubleside":true,"offset":{"x":15,"y":55,"z":0},"length":[62],"width":[50,60],"angle":[-30],"position":[20,0],"texture":[63],"bump":{"position":10,"size":10}}},"typespec":{"name":"Inertia","level":7,"model":9,"code":709,"specs":{"shield":{"capacity":[550,550],"reload":[12,12]},"generator":{"capacity":[220,220],"reload":[80,80]},"ship":{"mass":500,"speed":[85,85],"rotation":[45,45],"acceleration":[68,68]}},"shape":[6.21,6.114,5.861,5.364,5.334,4.452,4.145,4.029,3.901,3.6,2.613,2.308,3.695,4.212,4.458,4.613,4.865,5.229,5.808,6.607,7.481,7.531,7.611,7.268,6.487,5.952,6.487,7.268,7.611,7.531,7.481,6.607,5.808,5.229,4.865,4.613,4.458,4.212,4.05,2.308,2.613,3.6,3.901,4.029,4.145,4.452,5.334,5.364,5.861,6.114],"lasers":[{"x":2.001,"y":-4.86,"z":0,"angle":0,"damage":[40,40],"rate":6,"type":1,"speed":[165,165],"number":1,"spread":0,"error":0,"recoil":85},{"x":-2.001,"y":-4.86,"z":0,"angle":0,"damage":[40,40],"rate":6,"type":1,"speed":[165,165],"number":1,"spread":0,"error":0,"recoil":85}],"radius":7.611}}' },
        710: { name: "Sagittarius", code: '{"name":"Sagittarius","level":7,"model":10,"size":1.6,"specs":{"shield":{"capacity":[500,500],"reload":[9,9]},"generator":{"capacity":[200,200],"reload":[60,60]},"ship":{"mass":450,"speed":[80,80],"rotation":[30,30],"acceleration":[80,80]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":45,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-130,-125,-90,-45,5,50,100,140,130],"z":[-6,-6,-6,-6,0,0,0,0,0,0,0]},"width":[0,12,20,22,35,45,30,25,0],"height":[0,6,15,15,18,22,24,20,0],"texture":[9,9,9,2,10,63,8,17],"propeller":true},"propulors":{"section_segments":8,"offset":{"x":48,"y":75,"z":5},"position":{"x":[-5,-5,0,0,0,0,0,0,0,0],"y":[-105,-95,-50,-10,30,100,140,130],"z":[0,0,0,0,0,0,0,0,0,0]},"width":[0,14,25,22,30,35,25,0],"height":[0,14,25,22,30,35,25,0],"texture":[2,63,4,11,4,2,17],"propeller":true,"angle":0},"reinforcements":{"section_segments":8,"offset":{"x":100,"y":-115,"z":-30},"position":{"x":[0,0,0,20,5,8],"y":[-100,-93,-70,-20,35,100],"z":[-15,-15,-10,0,0,0]},"width":[0,10,14,18,13,0],"height":[0,10,14,15,13,0],"texture":[4,63,2,3,4],"propeller":false,"angle":45},"exhausts":{"section_segments":8,"offset":{"x":60,"y":25,"z":-20},"position":{"x":[0,0,-5,0,-10,-10,0,10,10,20,20],"y":[-130,-125,-80,-30,-10,10,40,60,100,130,110],"z":[-6,-6,-6,-6,-3,0,6,6,6,0,0]},"width":[0,10,15,20,20,15,15,20,25,20,0],"height":[0,10,15,20,20,15,15,20,25,20,0],"texture":[63,4,3,3,63,4,63,10,4,13],"propeller":false,"angle":15},"exhausts2":{"section_segments":8,"offset":{"x":70,"y":-15,"z":-40},"position":{"x":[-5,-5,-10,-10,0,-8,-4,8,10,20,20],"y":[-130,-125,-95,-60,-30,10,40,60,100,130,110],"z":[-6,-6,-6,-6,-6,-3,0,6,6,6,0,0]},"width":[0,10,15,20,20,15,20,25,25,20,0],"height":[0,10,15,20,20,15,20,25,25,20,0],"texture":[63,4,13,1,3,4,63,3,4,13],"propeller":false,"angle":30},"impulse":{"section_segments":12,"offset":{"x":0,"y":-65,"z":-40},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0],"y":[-160,-120,-140,-120,-100,-85,-70,-30,0,20,50,40],"z":[0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,10,20,24,30,20,30,40,30,25,25,0],"height":[0,10,20,24,30,20,30,40,30,25,25,0],"texture":[6,18,13,4,63,63,8,4,4],"propeller":true,"angle":0,"laser":{"damage":[60,60],"rate":4,"type":1,"speed":[305,305],"number":1,"error":0,"angle":0,"recoil":150}}},"wings":{"topppp":{"offset":{"x":5,"y":85,"z":-2},"length":[60,60,80],"width":[100,90,60,20],"angle":[60,0,-30],"position":[-20,50,80,145],"texture":[3,11,3],"doubleside":true,"bump":{"position":0,"size":10}},"main":{"offset":{"x":0,"y":-15,"z":-35},"length":[50,60,120],"width":[100,70,50,20],"angle":[-40,0,30],"position":[-40,20,80,155],"texture":[2,63,1],"doubleside":true,"bump":{"position":0,"size":10}},"mainmain":{"offset":{"x":0,"y":-45,"z":-35},"length":[50,60,70],"width":[100,70,40,20],"angle":[-10,0,-30],"position":[-20,20,70,100],"texture":[2,4,1],"doubleside":true,"bump":{"position":0,"size":10}},"wing":{"offset":{"x":0,"y":-175,"z":-20},"length":[120],"width":[60,20],"angle":[-20],"position":[80,0],"texture":[63],"doubleside":true,"bump":{"position":0,"size":12}},"lets":{"offset":{"x":0,"y":-175,"z":-20},"length":[130],"width":[40,15],"angle":[-5],"position":[100,75],"texture":[63],"doubleside":true,"bump":{"position":0,"size":12}}},"typespec":{"name":"Sagittarius","level":7,"model":10,"code":710,"specs":{"shield":{"capacity":[500,500],"reload":[9,9]},"generator":{"capacity":[200,200],"reload":[60,60]},"ship":{"mass":450,"speed":[80,80],"rotation":[30,30],"acceleration":[80,80]}},"shape":[7.2,6.591,6.154,5.938,6.933,6.732,5.953,5.661,5.541,5.676,5.866,3.021,3.342,4.051,5.491,5.82,5.969,7.996,8.057,6.169,9.307,8.58,7.266,7.234,7.004,5.931,7.004,7.234,7.266,8.58,9.307,6.169,8.057,7.996,5.969,5.82,5.491,4.051,3.342,3.021,5.866,5.676,5.541,5.661,5.953,6.732,6.933,5.938,6.154,6.591],"lasers":[{"x":0,"y":-7.2,"z":-1.28,"angle":0,"damage":[60,60],"rate":4,"type":1,"speed":[305,305],"number":1,"spread":0,"error":0,"recoil":150}],"radius":9.307}}' },
        711: { name: "Aries", code: '{"name":"Aries","level":7,"model":11,"size":3.9,"specs":{"shield":{"capacity":[750,750],"reload":[13,13]},"generator":{"capacity":[200,200],"reload":[95,95]},"ship":{"mass":600,"speed":[63,63],"rotation":[35,35],"acceleration":[95,95]}},"bodies":{"main":{"section_segments":12,"offset":{"x":0,"y":-5,"z":8},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-60,-40,-30,-15,0,15,25,45,70],"z":[0,0,0,0,0,0,0,0,0]},"width":[0,15,20,22,22,18,15,10,0],"height":[0,10,13,15,15,15,12,10,0],"texture":[2,15,15,3,4,3,63,15]},"mainlow":{"section_segments":6,"angle":0,"offset":{"x":0,"y":5,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0],"y":[-100,-95,-80,-70,-10,10,60,70,85,90,85],"z":[0,0,0,0,0,0,0,0,0,0,0]},"width":[0,20,25,10,12,12,15,20,20,16,0],"height":[0,10,12,8,12,12,8,12,10,7,0],"texture":[3.9,63,3.9,3.9,3.9,3.9,3.9,63,12.9,16.9],"propeller":true},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-20,"z":7},"position":{"x":[0,0,0,0,0,0,0],"y":[-30,-15,0,30,60],"z":[9,0,0,3,5]},"width":[3,12,15,10,0],"height":[0,20,24,19,0],"texture":[9,9,63,4]},"frontjoin":{"section_segments":6,"angle":45,"offset":{"x":8,"y":0,"z":-3},"position":{"x":[0,0,0,0],"y":[-60,-55,-40,-30],"z":[0,0,0,0]},"width":[0,10,15,10],"height":[0,10,12,8],"texture":[3.9,63,3.9]},"arm110":{"section_segments":6,"angle":110,"offset":{"x":10,"y":-10,"z":0},"position":{"x":[0,0,0,0,0],"y":[-90,-85,-70,-60,-10],"z":[0,0,0,0,0]},"width":[0,18,22,10,12],"height":[0,10,12,8,12],"texture":[3.9,63,3.9]},"arm140":{"section_segments":6,"angle":140,"offset":{"x":10,"y":0,"z":0},"position":{"x":[0,0,0,0,0],"y":[-90,-85,-70,-60,-10],"z":[0,0,0,0,0]},"width":[0,18,22,10,12],"height":[0,10,12,8,12],"texture":[3.9,63,3.9]},"cannon":{"section_segments":6,"offset":{"x":0,"y":-68,"z":0},"position":{"x":[0,0,0],"y":[-28,-30,-20],"z":[0,0,0]},"width":[0,10,8],"height":[0,5,5],"texture":[5.9],"laser":{"damage":[120,120],"rate":3,"type":1,"speed":[155,155],"number":1,"error":0,"recoil":150}},"spike1":{"section_segments":6,"offset":{"x":59,"y":15.5,"z":9},"position":{"x":[0,0,0,0,0,0],"y":[-35,-30,-20,0,10,12],"z":[0,0,0,0,-5,-10]},"width":[0,3,5,7,6,0],"height":[0,3,5,7,6,0],"texture":[2,3,12.9,3.9],"angle":-120,"laser":{"damage":[15,15],"rate":2,"type":1,"speed":[155,155],"number":1,"error":0,"recoil":0,"angle":180}},"spike2":{"section_segments":6,"offset":{"x":40,"y":58,"z":11},"position":{"x":[0,0,0,0,0,0],"y":[-35,-30,-20,0,10,12],"z":[0,0,0,0,-5,-10]},"width":[0,3,5,7,6,0],"height":[0,3,5,7,6,0],"texture":[2,3,12.9,3.9],"angle":215,"laser":{"damage":[15,15],"rate":2,"type":1,"speed":[155,155],"number":1,"error":0,"recoil":0,"angle":180}},"frontside":{"section_segments":6,"offset":{"x":38,"y":-35,"z":0},"position":{"x":[0,0,0,0,0,0,0],"y":[-50,-35,-20,0,20,35,50],"z":[0,0,0,0,0,0,0]},"width":[0,7,10,10,10,7,0],"height":[10,15,15,15,15,15,0],"texture":[2.9,63,3.9,3.9,63,2.9],"angle":18}},"wings":{"side_joins":{"offset":{"x":0,"y":5,"z":5},"length":[40,30],"width":[50,30,0],"angle":[30,-10],"position":[0,0,50],"texture":[11,3],"bump":{"position":10,"size":20}}},"typespec":{"name":"Aries","level":7,"model":11,"code":711,"specs":{"shield":{"capacity":[750,750],"reload":[13,13]},"generator":{"capacity":[200,200],"reload":[95,95]},"ship":{"mass":600,"speed":[63,63],"rotation":[35,35],"acceleration":[95,95]}},"shape":[7.659,7.674,7.149,6.467,6.039,5.561,5.132,4.793,4.558,4.415,4.346,4.278,5.332,5.896,6.029,7.427,5.82,5.603,6.593,6.339,8.225,7.32,6.398,7.159,7.488,7.425,7.488,7.159,6.398,7.32,8.225,6.339,6.593,5.603,5.82,7.427,6.029,5.896,5.332,4.278,4.346,4.415,4.558,4.793,5.132,5.561,6.039,6.467,7.149,7.674],"lasers":[{"x":0,"y":-7.644,"z":0,"angle":0,"damage":[120,120],"rate":3,"type":1,"speed":[155,155],"number":1,"spread":0,"error":0,"recoil":150},{"x":6.966,"y":2.574,"z":0.702,"angle":-120,"damage":[15,15],"rate":2,"type":1,"speed":[155,155],"number":1,"spread":180,"error":0,"recoil":0},{"x":-6.966,"y":2.574,"z":0.702,"angle":120,"damage":[15,15],"rate":2,"type":1,"speed":[155,155],"number":1,"spread":180,"error":0,"recoil":0},{"x":4.686,"y":6.76,"z":0.858,"angle":215,"damage":[15,15],"rate":2,"type":1,"speed":[155,155],"number":1,"spread":180,"error":0,"recoil":0},{"x":-4.686,"y":6.76,"z":0.858,"angle":-215,"damage":[15,15],"rate":2,"type":1,"speed":[155,155],"number":1,"spread":180,"error":0,"recoil":0}],"radius":8.225}}' },
    }
}

const SHIP_SELECTION = {
    "vanilla": {
        "tier7": [
            [701, "Odyssey"],
            [702, "Weaver"],
            [703, "Ballista"],
            [704, "Icarus"],
            [705, "Kyvos"],
            [706, "Bass-Cannon"],
            [707, "Bastion"],
            [708, "Shadow X-3"],
            [709, "Inertia"],
            [710, "Sagittarius"],
            [711, "Aries"],
        ],
        "tier6": [
            [601, "Scorpion"],
            [602, "Xenolith"],
            [603, "Adv.-Fighter"],
            [604, "Condor"],
            [605, "A-Speedster"],
            [606, "T-Fighter"],
            [607, "H-Mercury"],
            [608, "Typhoon"],
            [609, "Marauder"],
            [610, "Rock-Tower"],
            [611, "Barracuda"],
            [612, "O-Defender"],
        ],
        "tier5": [
            [501, "Fury-Star"],
            [502, "U-Sniper"],
            [503, "Khepri"],
            [504, "Toscain"],
            [505, "T-Warrior"],
            [506, "Aetos"],
            [507, "Shadow X-2"],
            [508, "Howler"],
            [509, "Bat-Def."],
        ],
        "tier4": [
            [401, "Pegasus"],
            [402, "Vanguard"],
            [403, "Mercury"],
            [404, "X-Warrior"],
            [405, "S.-Interceptor"],
            [406, "Pioneer"],
        ],
        "tier3": [
            [301, "Y-Def."],
            [302, "P.-Fighter"],
            [303, "S.-Fighter"],
            [304, "Shadow X-1"],
        ],
        "tier2": [
            [201, "Delta-Fighter"],
            [202, "Trident"],
        ],
        "tier1": [
            [101, "Fly"],
        ]
    }
}

function flattenShips() {
    const tiers = ["tier1", "tier2", "tier3", "tier4", "tier5", "tier6", "tier7"];

    for (const tier of tiers) {
        if (SHIP_SELECTION.vanilla.hasOwnProperty(tier)) {
            staticMemory.FLATTENED_SHIPS.push(...SHIP_SELECTION.vanilla[tier].map(ship => ({ type: String(ship[0]), tier })));
        }
    }
}

flattenShips();

console.log(staticMemory.FLATTENED_SHIPS);


const VOCABULARY = [
    // 1
    {text: "You",       icon: "\u004e", key: "O"},
    {text: "Me",        icon: "\u004f", key: "E"},
    {text: "Wait",      icon: "\u0048", key: "T"},
    {text: "Yes",       icon: "\u004c", key: "Y"},
    // 2
    {text: "No",        icon: "\u004d", key: "N"},
    {text: "Hello",     icon: "\u0045", key: "H"},
    {text: "Sorry",     icon: "\u00a1", key: "S"},
    {text: "My ship",   icon: "\u0061", key: "M"},
    // 3
    {text: "Attack",    icon: "\u0049", key: "A"},
    {text: "Follow Me", icon: "\u0050", key: "F"},
    {text: "Good Game", icon: "\u00a3", key: "G"},
    {text: "Leave",     icon: "\u00b3", key: "L"},
    // 4
    {text: "Stats",     icon: "\u0078", key: "K"},
    {text: "Hmm",       icon: "\u004b", key: "Q"},
    {text: "Lucky",     icon: "\u2618", key: "U"},
    {text: "Ping",      icon: "\u231b", key: "P"},
    // 5
    {text: "Discord",   icon: "\u007b", key: "D"},
    {text: "Idiot",     icon: "\u0079", key: "I"},
    {text: "Lag",       icon: "\u0069", key: "J"},
    {text: "Spectate",  icon: "\u0059", key: "W"}
    // Infinity
]

const VERSION = "Rv3.5.4"

this.options = {
    ships: Object.values(SHIPS["vanilla"]).flatMap(a => a.code),
    map_name: "",
    max_players: staticMemory.MAX_PLAYER_COUNT,
    starting_ship: 801,
    map_size: 100,
    speed_mod: 1.2,
    max_level: 1,
    weapons_store: false,
    vocabulary: VOCABULARY,
    soundtrack: "warp_drive.mp3",
    custom_map: "",
    map_name: "Flintlock Dueling Rv3.4.4",
};

if (typeof window.onerror !== "function" && staticMemory._GLOBAL_ERROR_HANDLER) {
    window.onerror = function(message, source, lineno, colno, error) {
        statusMessage("warn", "GLOBAL ERROR HANDLER:")
        statusMessage("warn", error);
        statusMessage("warn", message);
        statusMessage("warn", `col: ${colno}, line: ${lineno}`);
    };
}


let SWEAR_WORD_LIST = [];
const getRandomHex = () => Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
// ! S1
const statusMessage = (status, message) => {
    const timeString = new Date().toLocaleTimeString('en-GB', { hour12: false, timeZoneName: 'short' });
    try {
        let str = ""
        switch (status) {
            case "err":
            case "error":
                str = str + "[[b;#FF0000;]｢ERROR｣ "
                break
            case "suc":
            case "success":
                str = str + "[[b;#00FF00;]｢SUCCESS｣ "
                break
            case "warn":
                str = str + "[[b;#FFFF00;]｢WARN｣ "
                break
            default:
                str = str + "[[b;#007bff;]｢INFO｣ "
                break
        }
        game.modding.terminal.echo(" ");
        game.modding.terminal.echo(str + "(" + timeString + "):  " + "[[;#FFFFFF;]" + message);
        game.modding.terminal.echo(" ");
    } catch (ex) {
        console.warn(ex)
    }
}

const hideAllUI = (ship, hide = true) => {
    const hideableElements = ["spectate", "regen", "teleport", "showShipTree", "switch_ship", "asLegacy"];
    if (hide) {
        ship.isUIExpanded = false;
        ship.globalChatExpanded = false;
        for (let id of [...hideableElements, ...staticMemory.retractableComponentIDs]) {
            ship.setUIComponent({ id, ...NULL_COMPONENT })
        }
    } else {
        renderSpectateRegen(ship);
    }
}

// ! ONLY RUNS ONCE
const renderSpectateRegen = (ship) => {
    if (ship.type == "605" || ship.type == "613") {
        selectedSpeedsterProcedure(ship, true);
    }

    ship.setUIComponent({
        id: "hide_all_ui",
        position: [25, 1, 10, 3],
        clickable: true,
        shortcut: "6",
        visible: true,
        components: [
            {type: "text", position: [0, 0, 100, 100], align: "left", value: "[6] - Hide all UI", color: "hsla(0, 0%, 100%, 1.00)"},
        ]
    })
    
    ship.setUIComponent({
        id: "switch_ship",
        position: [25, 5, 10, 3],
        clickable: true,
        shortcut: "7",
        visible: true,
        components: [
            {type: "text", position: [0, 0, 100, 100], align: "left", value: "[7] - Switch Ship", color: "hsla(0, 0%, 100%, 1.00)"},
        ]
    })

    ship.setUIComponent({
        id: "spectate",
        position: [64, 1, 3.5, 5.5],
        clickable: true,
        shortcut: "1",
        visible: true,
        components: [
            {type: "box", position: [0, 38, 100, 60], fill: "hsla(180, 40%, 75%, 0.25)"},
            {type: "text", position: [0, 38, 100, 60], align: "center", value: "1", color: "hsla(180, 40%, 75%, 1)"},
            {type: "box", position: [0, 0, 100, 33.5], fill: "hsla(180, 40%, 75%, 1)"},
            {type: "text", position: [0, 1, 100, 31.5], align: "center", value: "𝗦𝗣𝗘𝗖𝗧", color: "hsla(0, 0%, 0%, 1.00)"},
        ]
    })


    ship.setUIComponent({
        id: "regen",
        position: [68, 1, 3.5, 5.5],
        clickable: true,
        shortcut: "2",
        visible: true,
        components: [
            {type: "box", position: [0, 38, 100, 60], fill: "hsla(3, 100%, 69%, 0.25)"},
            {type: "text", position: [0, 38, 100, 60], align: "center", value: "2", color: "hsla(3, 100%, 69%, 1.00)"},
            {type: "box", position: [0, 0, 100, 33.5], fill: "hsla(3, 100%, 69%, 1.00)"},
            {type: "text", position: [0, 1, 100, 31.5], align: "center", value: "𝗥𝗘𝗚𝗘𝗡", color: "hsla(0, 0%, 0%, 1.00)"},
        ]
    })

    ship.setUIComponent({
        id: "teleport",
        position: [72, 1, 3.5, 5.5],
        clickable: true,
        shortcut: "3",
        visible: true,
        components: [
            {type: "box", position: [0, 38, 100, 60], fill: "hsla(57, 100%, 81%, 0.25)"},
            {type: "text", position: [0, 38, 100, 60], align: "center", value: "3", color: "hsla(57, 100%, 81%, 1.00)"},
            {type: "box", position: [0, 0, 100, 33.5], fill: "hsla(57, 100%, 81%, 1.00)"},
            {type: "text", position: [0, 1, 100, 31.5], align: "center", value: "𝗧𝗣", color: "hsla(0, 0%, 0%, 1.00)"},
        ]
    })


    ship.setUIComponent(showShipTreeComponent());
}

const showShipTreeComponent = (replace = {}) => {
    return {
        id: "showShipTree",
        position: [76, 1, 3.5, 5.5],
        clickable: true,
        shortcut: "4",
        visible: true,
        components: [
            {type: "box", position: [0, 38, 100, 60], fill: "hsla(345, 95%, 71%, 0.25)"},
            {type: "text", position: [0, 38, 100, 60], align: "center", value: "4", color: "hsla(345, 95%, 71%, 1.00)"},
            {type: "box", position: [0, 0, 100, 33.5], fill: "hsla(345, 95%, 71%, 1.00)"},
            {type: "text", position: [0, 1, 100, 31.5], align: "center", value: "𝗦𝗛𝗜𝗣𝗦", color: "hsla(0, 0%, 0%, 1.00)"},
        ],
        ...replace
    }
}

const turnToSpectator = (ship) => {
    ship.spectating = {
        value: true,
        lastShip: String(ship.type) === "191" ? ship.spectating.lastShip : String(ship.type)
    }
    ship.set({type: 191, collider: false, crystals: 0});
}

function getNextShipType(currentShipType) {
    const currentShipIndex = staticMemory.FLATTENED_SHIPS.findIndex(ship => ship.type === String(currentShipType));

    if (currentShipIndex === -1) {
        console.warn("Ship type not found in SHIP_SELECTION:", currentShipType);
        return null;
    }

    const nextShipIndex = (currentShipIndex + 1) % staticMemory.FLATTENED_SHIPS.length;
    return staticMemory.FLATTENED_SHIPS[nextShipIndex].type;
}

function switchShip(ship) {
    const newType = getNextShipType(ship.type);

    if (newType === null) {
        return;
    }

    let newStats = 66666666;
    if (ship.custom.keep_maxed) {
        newStats = Math.min(ship.stats, 88888888);
    }

    if (_ALLOW_LEGACY_TURN) {
        if (newType === "605") {
            selectedSpeedsterProcedure(ship);
        } else {
            deselectedSpeedsterProcedure(ship);
        }
    }

    ship.set({
        type: Number(newType),
        stats: newStats,
        shield: 999,
        crystals: staticMemory.GEM_CAPS[Number(newType) / 100 >> 0]
    });

    if (ship.custom._shipSelectOpen) {
        SHIP_TREE_PANEL.updateShipHighlight(ship, newType);
    }
}


const deselectedSpeedsterProcedure = (ship) => {
    ship.setUIComponent({
        id: "asLegacy",
        ...NULL_COMPONENT
    })
}

const selectedSpeedsterProcedure = (ship, skipSet = false) => {
    //ship.custom.speedsterType = "new";

    let astRef = ship.custom.speedsterType;
    let font = astRef === "new" ? "𝗡𝗘𝗪" : "𝗟𝗘𝗚𝗔𝗖𝗬";
    let stype = astRef === "new" ? "605" : "613";

    ship.setUIComponent({
        id: "asLegacy",
        position: [60, 1, 3.5, 5.5],
        clickable: true,
        shortcut: "5",
        visible: true,
        components: [
            {type: "box", position: [0, 38, 100, 60], fill: "hsla(333, 100%, 50%, 0.25)"},
            {type: "text", position: [0, 38, 100, 60], align: "center", value: "5", color: "hsla(333, 100%, 50%, 1)"},
            {type: "box", position: [0, 0, 100, 33.5], fill: "hsla(333, 100%, 50%, 1)"},
            {type: "text", position: [0, 1, 100, 31.5], align: "center", value: font, color: "hsla(0, 0%, 0%, 1.00)"},
        ]
    })
    
    if (!skipSet) {
        ship.set({type: Number(stype), stats: 66666666, crystals: 720, shield: 99999});
    }
}

const clickLegacyButton = (ship) => {
    if (ship.spectating.value) return;

    ship.custom.speedsterType = ship.custom.speedsterType === "new" ? "legacy" : "new";

    let astRef = ship.custom.speedsterType;
    let font = astRef === "new" ? "𝗡𝗘𝗪" : "𝗟𝗘𝗚𝗔𝗖𝗬";
    let stype = astRef === "new" ? "605" : "613";


    ship.setUIComponent({
        id: "asLegacy",
        position: [60, 1, 3.5, 5.5],
        clickable: true,
        shortcut: "5",
        visible: true,
        components: [
            {type: "box", position: [0, 38, 100, 60], fill: "hsla(333, 100%, 50%, 0.25)"},
            {type: "text", position: [0, 38, 100, 60], align: "center", value: "5", color: "hsla(333, 100%, 50%, 1)"},
            {type: "box", position: [0, 0, 100, 33.5], fill: "hsla(333, 100%, 50%, 1)"},
            {type: "text", position: [0, 1, 100, 31.5], align: "center", value: font, color: "hsla(0, 0%, 0%, 1.00)"},
        ]
    });

    ship.set({type: Number(stype), stats: 66666666, crystals: 720, shield: 99999});
}


const ECHO_SPAN = 105;
let echoed = false;

const NULL_COMPONENT = {
    position: [0,0,0,0],
    visible: false,
    shortcut: null,
    components: []
};

const shipByID = (id) => game.ships.find(obj => obj.id == id);

const newLine = () => game.modding.terminal.echo(" ");
const debugEcho = (msg) => game.modding.terminal.echo(JSON.stringify(msg));
const centeredEcho = (msg, color = "") => game.modding.terminal.echo(`${" ".repeat(~~((ECHO_SPAN / 2) - Array.from(msg).length / 2))}${color}${msg}`)
const anchoredEcho = (msgLeft, msgRight, color = "", anchor) => game.modding.terminal.echo(color + `${" ".repeat(~~((ECHO_SPAN / 2) - (anchor.length / 2)) - Array.from(msgLeft).length)}${msgLeft}${anchor}${msgRight}`, " ")
const commandEcho = (command, description, example, color) => game.modding.terminal.echo(color + command + `[[;#FFFFFF30;]${" ".repeat(~~(((ECHO_SPAN / 2) - command.length) - (description.length / 2)))}` + color + description + `[[;#FFFFFF30;]${" ".repeat(Math.ceil(((ECHO_SPAN / 2) - example.length) - (description.length / 2)))}` + color + example)

;(function setCenterObject() {
    game.setObject({
        id: "centerImage",
        type: {
            id: "centerImage",
            obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
            emissive: "https://raw.githubusercontent.com/halcyonXT/project-storage/main/LATEST.png"
        },
        position: { x: -1, y: 0, z: -15 },
        scale: { x: 95, y: 52, z: 5 },
        rotation: { x: 3, y: 0, z: 0 }
    });
})();

;(function setBlackBackground() {
    if (staticMemory._ultraDarkMode) {
        game.setObject({
            id: "blackBackground",
            type: {
                id: "blackBackground",
                obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
                emissive: "https://raw.githubusercontent.com/halcyonXT/project-storage/main/bcgr.png"
            },
            position: { x: -1, y: -10, z: -20 },
            scale: { x: 9999, y: 9999, z: 0 },
            rotation: { x: 0, y: 0, z: 0 }
        });
    }
})();

// mute = (ID) => {
//     let id = Number(ID);
//     if (!ID || isNaN(id)) {
//         return statusMessage("error", "Must provide valid ship ID");
//     }

//     let ship = shipByID(id);

//     if (!ship) {
//         return statusMessage("error", "No ship with the ID of " + id);
//     }

//     for (let emote of VOCABULARY) {
//         ship.setUIComponent({id: randomString(6), position: [0,0,0,0], clickable: true, visible: false, shortcut: emote.key});
//     }

//     statusMessage("success", "Player with the ID of " + id + " (" + ship.name + ") has been muted");
//     fleetingMessage(ship, "You have been muted");
// }

setAFKChecker = (value) => {
    let m = !!value;
    if (m) {
        statusMessage(
            "success",
            "AFK checker is now active"
        )
    } else {
        statusMessage(
            "error",
            "AFK checker is no longer active"
        )
    }
    staticMemory.afkChecker.active = m;
}

kick = (id, shouldReport = true) => {
    let ship = shipByID(id);
    if (!ship) {
        return statusMessage("error", "No ship with the specified ID")
    }
    if (shouldReport) {
        statusMessage("success", `${ship.name} has been kicked`);
    }
    kickPlayer(ship);
}

ban = (id, reason) => {
    let ship = shipByID(id);
    if (!ship) {
        return statusMessage("error", "No ship with the specified ID")
    }
    sessionMemory.banned.push(ship.name);
    statusMessage("success", `${ship.name} has been banned`)
    kickPlayer(ship, reason);
}

bannedList = () => {
    centeredEcho("Banned list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Player name ", " Index", "[[b;#5FFFFF;]", "|")
    for (let player in sessionMemory.banned) {
        anchoredEcho(`${sessionMemory.banned[player]} `, ` ${player}`, "[[;#FFFFFF;]", "|")
    }
    for (let player in sessionMemory.bruteforceBanned) {
        anchoredEcho(`${sessionMemory.bruteforceBanned[player]} `, ` 99${player}`, "[[;#FF0000;]", "|")
    }
    echo("[[;#FFFFFF;]Index changes every time you unban someone. If you want to unban multiple people, it's recommended to run this function after every unban")
    newLine();
}

unban = (ind) => {
    let isBrute = false, sind = null;
    if (ind < 0 || ind >= sessionMemory.banned.length) {
        let bfind = Number((String(ind)).slice(2));
        if (!sessionMemory.bruteforceBanned[bfind]) {
            return statusMessage("error", "Invalid index provided. Do bannedList() to find out indexes.")
        }
        isBrute = true;
        sind = bfind;
    }
    if (isBrute) {
        statusMessage("success", `${sessionMemory.bruteforceBanned[sind]} is no longer bruteforce banned`);
        sessionMemory.bruteforceBanned = removeIndexFromArray(sessionMemory.bruteforceBanned, sind);
    } else {
        statusMessage("success", `${sessionMemory.banned[ind]} is no longer banned`);
        sessionMemory.banned = removeIndexFromArray(sessionMemory.banned, ind);
    }
}

bruteforceBan = (id) => {
    let ship = shipByID(id);
    if (!ship) {
        return statusMessage("error", "No ship with the specified ID")
    }
    sessionMemory.bruteforceBanned.push(ship.name);
    statusMessage("warn", `${ship.name} has been bruteforce banned. To revert this action, use the unban command`);
    let copy = {...ship};
    kickPlayer(ship);
    for (let sh of game.ships) {
        let lsim = levenshteinSimilarity(copy.name, sh.name);
        if (lsim >= staticMemory.bruteforceBan_minimumSimilarity) {
            statusMessage("warn", `${sh.name} has been kicked: Levenshtein similarity ${lsim} - Maximum ${staticMemory.bruteforceBan_minimumSimilarity}`);
            kickPlayer(sh);
        }
    }
}

resetMinBruteforceSim = (num) => {
    if (!num || typeof num !== "number" || num < 10 || num > 100) {
        return statusMessage("error", "Invalid input. Must be a number from 10 to 100");
    }
    staticMemory.bruteforceBan_minimumSimilarity = num;
    statusMessage("success", "Bruteforce ban will now require " + num + "% similarity to kick");
}

help = () => {
    newLine();
    centeredEcho("Command list:", "[[ub;#FF4f4f;]");
    commandEcho("Command", "Description", "Example usage", "[[b;#5FFFFF;]")
    centeredEcho("General", "[[u;#808080;]");
    commandEcho("help()", "Prints the list of commands", "help()", "[[;#FFFFFF;]")
    commandEcho("chelp(command)", "Extended description for a specific command", "chelp(adminList)", "[[;#FFFFFF;]");
    commandEcho("showIDs()", "Prints a list with the IDs and names of all players", "showIDs()", "[[;#FFFFFF;]")
    commandEcho("showShipIDs()", "Prints a list with the IDs and names of all ships", "showShipIDs()", "[[;#FFFFFF;]");
    commandEcho("bannedList()", "Shows a list of banned player names and INDEXES", "bannedList()", "[[;#FFFFFF;]");
    newLine();
    centeredEcho("Administrative", "[[u;#808080;]");
    commandEcho("adminList()", "Prints the list of admins", "adminList()", "[[;#FFFFFF;]");
    commandEcho("forceSpec(id)", "Forces player with the specified ID to spectate", "forceSpec(4)", "[[;#FFFFFF;]");
    commandEcho("giveAdmin(id)", "Gives player with the specified ID admin privileges", "giveAdmin(4)", "[[;#FFFFFF;]");
    commandEcho("removeAdmin(id)", "Removes admin privileges from player with specified ID", "removeAdmin(4)", "[[;#FFFFFF;]");
    commandEcho("requireShip(shipID)", "Makes the selected ship mandatory for all players", "requireShip(605)", "[[;#FFFFFF;]");
    commandEcho("unrequireShip()", "Removes the required ship", "requireShip()", "[[;#FFFFFF;]");
    commandEcho("ban(id)", "Bans player with the specified ID", "ban(4)", "[[;#FFFFFF;]");
    commandEcho("unban(index)", "Unbans player with the specified INDEX", "unban(0)", "[[;#FFFFFF;]");
    commandEcho("kick(id)", "Kicks player with the specified ID", "kick(4)", "[[;#FFFFFF;]");
    commandEcho("setAFKChecker(bool)", "Set whether afk checker is active or not", "setAFKChecker(false)", "[[;#FFFFFF;]");
    commandEcho("setTickThrottle(ticks)", "Per-player impact on tick job delay", "setTickThrottle(20)", "[[;#FFFFFF;]");
    commandEcho("resetRateLimit(ticks)", "Determine how often a player can click a button", "resetRateLimit(20)", "[[;#FFFFFF;]");
    newLine();
    centeredEcho("Dangerous administrative", "[[gu;#CC0000;]");
    commandEcho("bruteforceBan(id)", "Recommended to do chelp(bruteforceBan) before using", "bruteforceBan(4)", "[[;#FFFFFF;]");
    commandEcho("resetMinBruteforceSim(num)", "Reset minimal similarity for bruteforce kick", "resetMinBruteforceSim(50)", "[[;#FFFFFF;]");
    newLine();
}

resetRateLimit = (ticks) => {
    if (typeof ticks !== "number") {
        return statusMessage("error", "Invalid argument. Must be a number");
    }
    staticMemory._CLICK_RATE_LIMIT = ticks;
    if (ticks === 0) {
        statusMessage(
            "success",
            `Players are no longer rate limited`
        )
    } else {
        statusMessage(
            "success",
            `Players will now only be able to click a button once every ${ticks} ticks, or once every ${(ticks / 60).toFixed(1)} seconds`
        )
    }
}

setTickThrottle = (ticks) => {
    if (typeof ticks !== "number") {
        return statusMessage("error", "Invalid argument. Must be a number");
    }
    let newticks = Math.max(1, Math.round(ticks));
    statusMessage(
        "success",
        "Tick throttle has been set to " + newticks
    )
    staticMemory.TICK_THROTTLE_PER_PLAYER = newticks;
    recalculateTickDelay();
}

chelp = (funct) => {
    if (typeof funct !== "function") {
        return statusMessage("error", "Invalid argument. " + String(funct) + " is not a command.")
    }
    newLine()
    switch (funct.name) {
        case "setAFKChecker":
            commandEcho("setAFKChecker(bool)", "Set whether afk checker is active or not", "setAFKChecker(false)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Takes an argument that is either a truthy or a falsy value.");
            echo("[[;#FFFFFF;] Setting to true might have an impact on performance");
            break
        case "forceSpec":
            commandEcho("forceSpec(id)", "Forces player with the specified ID to spectate", "forceSpec(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Player with the specified id will be turned into a spectator");
            echo("[[;#FFFFFF;] They won't be able to unspectate until you use forceSpec on them again, which will undo the action.");
            echo("[[;#FFFFFF;] To get the list of IDs for the `id` parameter, use showIDs()");
            break
        case "setTickThrottle":
            commandEcho("setTickThrottle(ticks)", "Per-player impact on tick job delay", "setTickThrottle(20)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] In FL dueling light, tick loop jobs have a delay in order to save up on performance");
            echo("[[;#FFFFFF;] That delay is defined as (PLAYER_COUNT * TICK_THROTTLE)");
            echo("[[;#FFFFFF;] Default tick throttle is 1, but using this command you can change it to any number you want to");
            echo("[[;#FFFFFF;] Any number you input will round to the nearest integer");
            break
        case "resetRateLimit":
            commandEcho("resetRateLimit(ticks)", "Determine how often a player can click a button", "resetRateLimit(20)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] The `ticks` argument will determine how long the player has to wait until they click a button again.");
            echo("[[;#FFFFFF;] For example, if set to 60, a player will only be able to click a button once per second");
            echo("[[;#FFFFFF;] This will help if trolls try to lag the mod by spamming expensive operations.");
            echo("[[;#FFFFFF;] Default is 15");
            break
        case "kick":
            commandEcho("kick(id)", "Kicks player with the specified ID", "kick(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Kicks the player with the specified ID.");
            echo("[[;#FFFFFF;] The player will be able to rejoin with the same name afterwards.");
            break
        case "bruteforceBan":
            commandEcho("bruteforceBan(id)", "Recommended to do chelp(bruteforceBan) before using", "bruteforceBan(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Recursively kicks every player and newcomer with a name similar to that of the player with the specified ID");
            echo("[[;#FFFFFF;] Similarity is calculated using the Levenshtein distance similarity algorithm. More on Levenshtein distance:");
            echo("[[ib!;#FFFFFF;] https://en.wikipedia.org/wiki/Levenshtein_distance");
            newLine();
            echo("[[;#FFFFFF;] minimumSimilarity - Minimal similarity of names required to kick a player - Default is 75%");
            echo("[[;#FFFFFF;] To reset minimumSimilarity, use resetMinBruteforceSim(num)");
            newLine();
            echo("[[;#FFFFFF;] Example of bruteforceBan functionality:");
            echo("[[;#FFFFFF;] Assume there are players 'HALO', 'ICEMAN1' and 'ICEMAN2' on a server");
            echo("[[;#FFFFFF;] Running bruteforceBan(2) on 'ICEMAN1' will give the following result:");
            echo("[[;#FFFFFF;]       - 'ICEMAN1' is kicked");
            echo("[[;#FFFFFF;]       - 'ICEMAN2' is kicked because they have a name similarity of 85.7%");
            echo("[[;#FFFFFF;]       - If someone named 'ICEMAN33' joins, the will be kicked because they have a similarity of 75%");
            newLine();
            echo("[[;#FFFFFF;] bruteforceBan can have unwanted effects, take this example:");
            echo("[[;#FFFFFF;] Assume the minimum similarity is 66%");
            echo("[[;#FFFFFF;] There is a player named 'ICEMAN' who likes to troll and multitab, and a good friend of yours named 'CINEMA'");
            echo("[[;#FFFFFF;] Assume the player list is 'HALO', 'ICEMAN1', 'ICEMAN2', 'ICEMAN33' and 'CINEMA'");
            echo("[[;#FFFFFF;] Running bruteforceBan(2) on 'ICEMAN1' will give the following result:");
            echo("[[;#FFFFFF;]       - 'ICEMAN1' is kicked");
            echo("[[;#FFFFFF;]       - 'ICEMAN2' is kicked");
            echo("[[;#FFFFFF;]       - 'ICEMAN33' is kicked");
            echo("[[;#FFFFFF;]       - Your good friend 'CINEMA' is kicked as well because they have a similarity above 66%");
            echo("[[;#FFFFFF;]       - Your good friend 'NICEMAN' joins the server, but is kicked due to having a similarity above 66%");
            newLine();
            echo("[[;#FFFFFF;] Think carefully before running this command");
            break
        case "ban":
            commandEcho("ban(id)", "Bans player with the specified ID", "ban(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Using the ID parameter gotten from showIDs(), bans the player with the specified ID.");
            echo(`[[;#FFFFFF;] For example, if you banned a player with the name of 'HALO', this is how it would go:`);
            echo("[[;#FFFFFF;]       - Kicks the player");
            echo("[[;#FFFFFF;]       - Every time someone named 'HALO' joins, they are immediately kicked");
            newLine();
            echo("[[;#FFFFFF;] Banning in starblast modding is not very effective, as they can just rejoin with a name like 'HALO1' to not be kicked");
            echo("[[;#FFFFFF;] Banning in starblast modding is not very effective, as they can just rejoin with a name like 'HALO1' to not be kicked");
            break
        case "adminList":
            commandEcho("adminList()", "Prints the list of admins", "adminList()", "[[;#FFFFFF;]");
            newLine()
            echo("[[;#FFFFFF;] Prints a list of players given admin permissions using the giveAdmin(id) command.");
            echo("[[;#FFFFFF;] All shown players are able to kick and ban other players.");
            echo("[[;#FFFFFF;] To remove admin permissions from any of these players, use removeAdmin(id).");
            break
        case "chelp":
            commandEcho("chelp(command)", "Extended description for a specific command", "chelp(adminList)", "[[;#FFFFFF;]");
            newLine()
            echo("[[;#FFFFFF;] Gives more information on the specified command than help() does.");
            break
        case "giveAdmin":
            commandEcho("giveAdmin(id)", "Gives player with the specified ID admin privileges", "giveAdmin(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Gives player with the specified ID administrator permissions.");
            echo("[[;#FFFFFF;] To ensure you've given the right player admin permissions, it will print a message saying their name.");
            newLine();
            echo("[[;#FFFFFF;] The newly added admin will have the following permissions:");
            echo("[[;#FFFFFF;]       - Kick");
            echo("[[;#FFFFFF;]       - Ban");
            newLine();
            echo("[[;#FFFFFF;] Note: Only the mod starter has the ability to perform a bruteforce ban.");
            break
        case "help":
            commandEcho("help()", "Prints the list of commands", "help()", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Provides the list and an elementary description of all current commands.");
            echo("[[;#FFFFFF;] It's recommended to use chelp() if you're confused about a command.");
            break
        case "removeAdmin":
            commandEcho("removeAdmin(id)", "Removes admin privileges from player with specified ID", "removeAdmin(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Removes administrator permissions from a player with the specified ID.");
            echo("[[;#FFFFFF;] To ensure you've removen the right admin, it will pring a message saying their name.");
            newLine();
            echo("[[;#FFFFFF;] The removed admin will lose the following permissions:");
            echo("[[;#FFFFFF;]       - Kick");
            echo("[[;#FFFFFF;]       - Ban");
            break
        case "requireShip":
            commandEcho("requireShip(shipID)", "Makes the selected ship mandatory for all players", "requireShip(605)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Makes the specified ship a mandatory ship.");
            echo("[[;#FFFFFF;] If an incorrect ship has been provided, it will remain unset.");
            newLine();
            echo("[[;#FFFFFF;] After correctly running the command:");
            echo("[[;#FFFFFF;] All currently active players will turn into the specified ship.");
            echo("[[;#FFFFFF;] All spectators will turn into the specified ship upon unspectating.");
            echo("[[;#FFFFFF;] 'Select ship' modal will cease to give players the permission to change their ship");
            newLine();
            echo("[[;#FFFFFF;] To find out the ID of a certain ship, type showShipIDs()");
            echo("[[;#FFFFFF;] To counteract the requireShip command, type unrequireShip()");
            break
        case "showIDs":
            commandEcho("showIDs()", "Prints a list with the IDs and names of all players", "showIDs()", "[[;#FFFFFF;]")
            newLine();
            echo("[[;#FFFFFF;] Prints a list of players' names with their respective identification (ID) unique numbers.");
            echo("[[;#FFFFFF;] Player IDs are used in the following commands:");
            echo("[[;#FFFFFF;]       - giveAdmin(id)");
            echo("[[;#FFFFFF;]       - removeAdmin(id)");
            break
        case "showShipIDs":
            commandEcho("showShipIDs()", "Prints a list with the IDs and names of all ships", "showShipIDs()", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Prints a list of ship names with their respective identification (ID) unique numbers.");
            echo("[[;#FFFFFF;] Ship IDs are used in the following commands:");
            echo("[[;#FFFFFF;]       - requireShip(shipID)");
            break
        case "unrequireShip":
            commandEcho("unrequireShip()", "Removes the required ship", "requireShip()", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Directly counteracts requireShip - Removes the mandatory ship specified using the requireShip command.");
            echo("[[;#FFFFFF;] If there is no mandatory ship, it will remain unset.");
            newLine();
            echo("[[;#FFFFFF;] After correctly running the command:");
            echo("[[;#FFFFFF;] 'Select ship' modal will give players the permission to change their ship");
            break
        default:
            return statusMessage("if", "Unknown command or extended description hasn't been added yet")
    }
    newLine()
}

showShipIDs = () => {
    centeredEcho("Ship list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Ship name ", " Ship ID", "[[b;#5FFFFF;]", "|")
    for (let key of Object.keys(SHIPS["vanilla"])) {
        anchoredEcho(`${SHIPS["vanilla"][key].name} `, ` ${key}`, "[[;#FFFFFF;]", "|")
    }
    newLine();
}

adminList = () => {
    newLine();
    centeredEcho("Admin list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Player name ", " Player ID", "[[b;#5FFFFF;]", "|")
    for (let ship of sessionMemory.admins) {
        anchoredEcho(`${game.ships[fetchShip(ship)].name} `, ` ${ship}`, "[[;#FFFFFF;]", "|")
    }
    newLine();
}

requireShip = (id) => {
    let pID = Number(id);
    if (!SHIPS["vanilla"][pID]) {
        return statusMessage("error", "No ship with the ID of " + pID)
    }
    if (staticMemory.requireShip === pID) {
        return statusMessage("if", `"${SHIPS["vanilla"][pID].name}" is already the required ship`)
    }
    try {
        staticMemory.requireShip = pID;
        for (let ship of game.ships) {
            if (ship.spectating.value) {
                ship.spectating.lastShip = pID;
            } else {
                let type = String(pID);
                let level = type.charAt(0);
                ship.set({type: Number(type), stats: Number(level.repeat(8)), crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0], collider: true, shield: 99999});
            }
        }
        statusMessage("success", `"${SHIPS["vanilla"][pID].name}" is now the required ship`)
    } catch (ex) {
        statusMessage("error", "requireShip(...) error - More in console");
        console.warn(ex);
    }
}

unrequireShip = () => {
    if (!staticMemory.requireShip) {
        statusMessage("if", `There is already no required ship`)
    } else {
        statusMessage("success", `"${SHIPS["vanilla"][staticMemory.requireShip].name}" is no longer the required ship`)
    }
    staticMemory.requireShip = null;
}

if (!echoed) {
    setTimeout(() => {
        newLine();
        newLine();
        
        centeredEcho("welcome to", "[[b;#FFFFFF;]");
        centeredEcho(" ＦＬＩＮＴＬＯＣＫ ＤＵＥＬＩＮＧ            ", "[[gb;#FF0000;]");
        centeredEcho("a mod by nanoray", "[[;#FFFFFF30;]")
        newLine();
        centeredEcho("Contact:", "[[ub;#FF4f4f;]");
        centeredEcho("Discord - h.alcyon", "[[;#FFFFFF;]");
        help()
        newLine();
        echo("[[;#FFFF00;]If it seems like a part of the instructions is cut off, zoom out")
        echo("[[;#FFFF00;]NOTE: Giving yourself admin upon mod startup using giveAdmin() is highly recommended")
        newLine();
    }, 2000)

    echoed = true;
}

showIDs = function () {
    newLine();
    centeredEcho("Player list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Player name ", " Player ID", "[[b;#5FFFFF;]", "|")
    for (let ship of game.ships) {
        anchoredEcho(`${ship.name} `, ` ${ship.id}`, "[[;#FFFFFF;]", "|")
    }
    newLine();
}

forceSpec = (id) => {
    let ind = fetchShip(id);
    if (ind === -1) {
        return statusMessage("error", `No ship with the id of "${id}"`);
    }
    let ref = game.ships[ind];
    if (ref.custom.forcedToSpectate) {
        game.ships[ind].custom.forcedToSpectate = false;
        fleetingMessage(game.ships[ind], "You are no longer forced to spectate");
        statusMessage(
            "success",
            `Ship with the id of "${id}" (${ref.name}) is no longer forced to spectate`
        )
    } else {
        turnToSpectator(game.ships[ind]);
        fleetingMessage(game.ships[ind], "You have been forced to spectate");
        game.ships[ind].custom.forcedToSpectate = true;
        statusMessage(
            "success",
            `Ship with the id of "${id}" (${ref.name}) has been forced to spectate`
        )
    }
}

giveAdmin = (id) => {
    for (let ship of game.ships) {
        if (ship.id === id) {
            if (!(sessionMemory.admins.includes(id))) {
                sessionMemory.admins.push(id)
                game.ships[fetchShip(id)].isUIExpanded && renderExpandedMenu(game.ships[fetchShip(id)], "admin")
                return statusMessage("success", `Player with the id of ${id} (${game.ships[fetchShip(id)].name}) has been granted admin privileges`)
            } else {
                return statusMessage("if", `Player is already admin. Do removeAdmin(${id}) to remove`)
            }
        }
    }
    return statusMessage("error", `Player with the id of ${id} doesn't exist`)
}

removeAdmin = (id) => {
    for (let admin of sessionMemory.admins) {
        if (admin === id) {
            sessionMemory.admins = removeFromArray(sessionMemory.admins, id)
            let target = game.ships[fetchShip(id)]
            target.isUIExpanded && renderExpandedMenu(target, determineType(target))
            closeDashboard(target, game)
            return statusMessage("success", `Player with the id of ${id} (${target.name}) no longer has admin privileges`)
        }
    }
    return statusMessage("error", `There is no admin with the id of ${id}`)
}



const determineType = (ship) => sessionMemory.admins.includes(ship.id) ? "admin" : "regular";

const teleportToNext = (ship, game, __CALL_NUM = 0) => {
    turnToSpectator(ship);
    let tp = ship.lastTeleported;
    if (!tp && typeof tp !== "number") {
        tp = 0;
    } else {
        tp += 1;
        if (tp >= game.ships.length) {
            tp = 0;
        } 
    }
    ship.lastTeleported = tp;
    if (game.ships[tp].id === ship.id) {
        if (__CALL_NUM < 1) {
            return teleportToNext(ship, game, __CALL_NUM + 1);
        } else {
            return fleetingMessage(ship, "Nobody to teleport to");
        }
    }
    let ref = game.ships[tp];
    ship.set({x: ref.x, y: ref.y});
}

let _scoreboard_defaults = {
    components: [
        { type: "box", position: [0, 0, 100, 8], fill: "hsla(0, 100%, 50%, 0.25)" },
        { type: "box", position: [62, 0, 7, 8], fill: "hsla(0, 100%, 50%, 1)" },
        { type: "box", position: [70, 0, 7, 8], fill: "hsla(0, 100%, 50%, 1)" },
        { type: "box", position: [78, 0, 22, 8], fill: "hsla(0, 100%, 50%, 1)" },
        { type: "text", position: [2, 1, 98, 6], value: "𝗣𝗹𝗮𝘆𝗲𝗿𝘀", color: "hsla(0, 100%, 50%, 1)", align: "left" },
        { type: "text", position: [62, 0, 7, 8], value: "𝗞", color: "hsla(0, 0%, 0%, 1.00)", align: "center" },
        { type: "text", position: [70, 0, 7, 8], value: "𝗗", color: "hsla(0, 0%, 0%, 1.00)", align: "center" },
        { type: "text", position: [78, 0.5, 22, 7], value: "𝗘𝗟𝗢", color: "hsla(0, 0%, 0%, 1.00)", align: "center" },
    ]
}

const updateScoreboard = () => {
    let sortedPlayers = [...game.ships].sort((a, b) => b.elo - a.elo);

    let playerComponents = sortedPlayers.map((item, index) => {
        let Y_OFFSET = (index + 1) * 9;
        let elo = item.elo;
        let kills = item.kd.kills;
        let deaths = item.kd.deaths;
        if (!elo) elo = 0;
        if (!kills) kills = 0;
        if (!deaths) deaths = 0;
        return [
            { type: "box", position: [0, Y_OFFSET, 100, 8], fill: "hsla(0, 100%, 50%, 0.065)" },
            { type: "box", position: [62, Y_OFFSET, 7, 8], fill: "hsla(0, 100%, 50%, 0.1)" },
            { type: "box", position: [70, Y_OFFSET, 7, 8], fill: "hsla(0, 100%, 50%, 0.1)" },
            { type: "box", position: [78, Y_OFFSET, 22, 8], fill: "hsla(0, 100%, 50%, 0.1)" },
            { type: "player", position: [2, Y_OFFSET + 1, 55, 6], id: item.id, color: "hsla(0, 0%, 100%, 1)", align: "left" },
            { type: "text", position: [62, Y_OFFSET, 7, 8], value: kills, color: "hsla(0, 0%, 100%, 1)", align: "center" },
            { type: "text", position: [70, Y_OFFSET, 7, 8], value: deaths, color: "hsla(0, 0%, 100%, 1)", align: "center" },
            { type: "text", position: [78, Y_OFFSET + 1, 22, 6], value: elo, color: "hsla(0, 0%, 100%, 1)", align: "center" },
        ]
    });

    let outp = playerComponents.flat();

    game.setUIComponent({
        id: "scoreboard",
        clickable: false,
        visible: true,
        components: [
            ..._scoreboard_defaults.components,
            ...outp
        ]
    });
}

const handleEloCalculation = (killer, victim) => {
    const KILLER_TIER = (killer.type / 100) >> 0, VICTIM_TIER = (victim.type / 100) >> 0;
    victim.custom.goto = {x: victim.x, y: victim.y};

    const calculateKD = (kills, deaths) => {
        let outp = kills / deaths;
        if (outp === Infinity) {
            return kills;
        }
        return Number(outp.toFixed(1));
    }

    if (KILLER_TIER <= VICTIM_TIER) {
        victimNewElo = updateSubjectElo(victim.elo, killer.elo, false);
        killer.elo = updateSubjectElo(killer.elo, victim.elo, true);
        victim.elo = victimNewElo;
    }

    killer.kd = {
        value: calculateKD(killer.kd.kills + 1, killer.kd.deaths),
        kills: killer.kd.kills + 1,
        deaths: killer.kd.deaths
    }

    victim.kd = {
        value: calculateKD(victim.kd.kills, victim.kd.deaths + 1),
        kills: victim.kd.kills,
        deaths: victim.kd.deaths + 1
    }

    updateScoreboard();
}
const _0x27f5bb=_0x2010;(function(_0x27e154,_0x35b7f6){const _0xe33389=_0x2010,_0x3f5264=_0x27e154();while(!![]){try{const _0x276444=parseInt(_0xe33389(0xd7))/0x1*(-parseInt(_0xe33389(0xfe))/0x2)+-parseInt(_0xe33389(0xf8))/0x3*(parseInt(_0xe33389(0xc1))/0x4)+-parseInt(_0xe33389(0xbd))/0x5+parseInt(_0xe33389(0x100))/0x6*(parseInt(_0xe33389(0xe6))/0x7)+parseInt(_0xe33389(0xcb))/0x8+parseInt(_0xe33389(0xdb))/0x9+-parseInt(_0xe33389(0xd3))/0xa;if(_0x276444===_0x35b7f6)break;else _0x3f5264['push'](_0x3f5264['shift']());}catch(_0x55126a){_0x3f5264['push'](_0x3f5264['shift']());}}}(_0x56c9,0x563e7));const _0x52face=(function(){let _0x28fbdd=!![];return function(_0x3c540b,_0x3d5dbd){const _0x338be0=_0x28fbdd?function(){const _0x27f112=_0x2010;if(_0x3d5dbd){const _0x4613ee=_0x3d5dbd[_0x27f112(0xe9)](_0x3c540b,arguments);return _0x3d5dbd=null,_0x4613ee;}}:function(){};return _0x28fbdd=![],_0x338be0;};}()),_0x11ee7b=_0x52face(this,function(){const _0x549ca0=_0x2010;return _0x11ee7b['toString']()[_0x549ca0(0xff)]('(((.+)+)+)+$')[_0x549ca0(0xf2)]()[_0x549ca0(0xeb)](_0x11ee7b)['search'](_0x549ca0(0xd2));});_0x11ee7b();function _0x56c9(){const _0x227c81=['console','push','failedCaptcha','error','setUIComponent','__proto__','center','warn','1\x20+\x201\x20=\x20?','108857EpmObw','4\x20+\x204\x20=\x20?','hsl(15,100%,50%)','apply','Ran\x20out\x20of\x20time','constructor','options','text','captcha','2\x20-\x201\x20=\x20?','3\x20+\x203\x20=\x20?','𝘾𝘼𝙋𝙏𝘾𝙃𝘼','toString','left','1\x20+\x202\x20=\x20?','passedCaptcha','hsl(0,0%,20%)','6\x20+\x202\x20=\x20?','3abrWcq','return\x20(function()\x20','CAPTCHA_QUESTIONS','set','hsl(0,0%,0%)','hsl(0,0%,100%)','46316EpRfUo','search','228AGlEPO','Question:','random','bind','963370MFzDCJ','duration','log','7\x20+\x202\x20=\x20?','586136UHdsWq','Failed\x20captcha','keys','fill','Internal\x20error','info','length','table','5\x20+\x202\x20=\x20?','map','3483080PlSVJi','question','prototype','forEach','createOptionComponent','answer','CA_','(((.+)+)+)+$','6324010SppSsX','get','_skipCurrentDeath','4\x20+\x201\x20=\x20?','6suQqOc','CAPTCHA','_shipCaptchaMemo','floor','3937401umTceQ','{}.constructor(\x22return\x20this\x22)(\x20)'];_0x56c9=function(){return _0x227c81;};return _0x56c9();}function _0x2010(_0x10fa7f,_0x35c69b){const _0x2066bf=_0x56c9();return _0x2010=function(_0x15985d,_0x35165f){_0x15985d=_0x15985d-0xbb;let _0x3369d1=_0x2066bf[_0x15985d];return _0x3369d1;},_0x2010(_0x10fa7f,_0x35c69b);}const _0x35165f=(function(){let _0xcdba02=!![];return function(_0x370225,_0x1e64fa){const _0x17612a=_0xcdba02?function(){const _0x383ef2=_0x2010;if(_0x1e64fa){const _0x3a6fda=_0x1e64fa[_0x383ef2(0xe9)](_0x370225,arguments);return _0x1e64fa=null,_0x3a6fda;}}:function(){};return _0xcdba02=![],_0x17612a;};}()),_0x15985d=_0x35165f(this,function(){const _0xd2f7c0=_0x2010,_0x40422b=function(){const _0x1c76ce=_0x2010;let _0x3f95e8;try{_0x3f95e8=Function(_0x1c76ce(0xf9)+_0x1c76ce(0xdc)+');')();}catch(_0x32333c){_0x3f95e8=window;}return _0x3f95e8;},_0xb06af4=_0x40422b(),_0x4dff32=_0xb06af4['console']=_0xb06af4[_0xd2f7c0(0xdd)]||{},_0x3f2995=[_0xd2f7c0(0xbf),_0xd2f7c0(0xe4),_0xd2f7c0(0xc6),_0xd2f7c0(0xe0),'exception',_0xd2f7c0(0xc8),'trace'];for(let _0x3591eb=0x0;_0x3591eb<_0x3f2995[_0xd2f7c0(0xc7)];_0x3591eb++){const _0x50bc72=_0x35165f[_0xd2f7c0(0xeb)][_0xd2f7c0(0xcd)][_0xd2f7c0(0xbc)](_0x35165f),_0x2d8157=_0x3f2995[_0x3591eb],_0x135c88=_0x4dff32[_0x2d8157]||_0x50bc72;_0x50bc72[_0xd2f7c0(0xe2)]=_0x35165f[_0xd2f7c0(0xbc)](_0x35165f),_0x50bc72[_0xd2f7c0(0xf2)]=_0x135c88['toString']['bind'](_0x135c88),_0x4dff32[_0x2d8157]=_0x50bc72;}});_0x15985d();const Captcha={'_shipCaptchaMemo':new Map(),'CAPTCHA_QUESTIONS':{0x1:{'question':_0x27f5bb(0xd6),'options':['5','8','11','1']},0x2:{'question':_0x27f5bb(0xf0),'options':['6','1','33','12']},0x3:{'question':_0x27f5bb(0xc0),'options':['9','0','72','7']},0x4:{'question':_0x27f5bb(0xef),'options':['1','10','32','99']},0x5:{'question':'2\x20+\x202\x20=\x20?','options':['4','22','1','83']},0x6:{'question':_0x27f5bb(0xe7),'options':['8','44','9','3']},0x7:{'question':_0x27f5bb(0xf4),'options':['3','12','9','5']},0x8:{'question':_0x27f5bb(0xe5),'options':['2','4','11','0']},0x9:{'question':_0x27f5bb(0xc9),'options':['7','52','22','4']},0xa:{'question':_0x27f5bb(0xf7),'options':['8','1','11','3']}},'createOptionComponent'(_0xbf019c,_0x412db7,_0x228a37){const _0xce13ab=_0x27f5bb;return{'id':_0xbf019c,'position':_0x412db7,'clickable':!![],'visible':!![],'components':[{'type':'box','position':[0x0,0x0,0x64,0x64],'fill':_0xce13ab(0xf6)},{'type':_0xce13ab(0xed),'position':[0x0,25.53,0x64,48.94],'align':_0xce13ab(0xe3),'value':_0x228a37,'color':_0xce13ab(0xfd)}]};},'verifyCaptcha'(_0x508f27,_0x1c9cdb){const _0x2f7cf5=_0x27f5bb,_0x41d127=this[_0x2f7cf5(0xd9)][_0x2f7cf5(0xd4)](_0x508f27['id']);if(!_0x41d127)return kickPlayer(_0x508f27,_0x2f7cf5(0xc5));const _0x50d9bc=[_0x2f7cf5(0xee),..._0x41d127[_0x2f7cf5(0xec)],_0x41d127[_0x2f7cf5(0xd0)]];if(_0x1c9cdb!==_0x41d127['answer'])return _0x50d9bc['forEach'](_0x5b0b3f=>_0x508f27[_0x2f7cf5(0xe1)]({'id':_0x5b0b3f,...NULL_COMPONENT})),_0x41d127[_0x2f7cf5(0xdf)]=!![],kickPlayer(_0x508f27,_0x2f7cf5(0xc2));_0x41d127[_0x2f7cf5(0xf5)]=!![],_0x50d9bc[_0x2f7cf5(0xce)](_0x12d178=>_0x508f27[_0x2f7cf5(0xe1)]({'id':_0x12d178,...NULL_COMPONENT})),_0x508f27['custom'][_0x2f7cf5(0xd5)]=!![],_0x508f27[_0x2f7cf5(0xfb)]({'idle':![],'collider':!![],'kill':!![]});},'initiateCaptcha'(_0x32bce1){const _0x286175=_0x27f5bb;_0x32bce1[_0x286175(0xfb)]({'type':0xbf,'idle':!![],'collider':![]});const _0x45c77e=0x1+Math[_0x286175(0xda)](Math['random']()*Object[_0x286175(0xc3)](this[_0x286175(0xfa)])[_0x286175(0xc7)]),_0x418799=this[_0x286175(0xfa)][_0x45c77e],_0x3147b4=Array(0x3)[_0x286175(0xc4)]()[_0x286175(0xca)](()=>'CA_'+getRandomHex()),_0x524a33=Math[_0x286175(0xda)](Math[_0x286175(0xbb)]()*0x4),_0x27369e=_0x286175(0xd1)+getRandomHex(),_0xcc76bd={'options':_0x3147b4,'answer':_0x27369e},_0x28cf36=[[28.27,41.72,20.96,14.91],[28.27,59.34,20.96,14.91],[50.89,59.34,20.96,14.91],[50.89,41.72,20.96,14.91]],_0x5b7b90={'id':_0x286175(0xee),'position':[28.04,23.5,43.92,53.01],'clickable':![],'visible':!![],'components':[{'type':'box','position':[0x0,0x0,0x64,0xc],'fill':_0x286175(0xe8)},{'type':_0x286175(0xed),'position':[0x1,0x2,0x63,0x9],'align':'left','value':_0x286175(0xf1),'color':_0x286175(0xfc)},{'type':'text','position':[0x1,1.25,0x63,0x9],'align':_0x286175(0xf3),'value':_0x286175(0xf1),'color':_0x286175(0xfd)},{'type':_0x286175(0xed),'position':[73.56,1.5,24.99,0x9],'align':'right','value':'10\x20seconds\x20to\x20answer','color':'hsl(0,0%,100%)'},{'type':'box','position':[0x0,15.18,0x64,15.38],'fill':_0x286175(0xfd)},{'type':'text','position':[0x1e,16.2,0x28,4.59],'align':_0x286175(0xe3),'value':_0x286175(0x101),'color':_0x286175(0xfc)},{'type':_0x286175(0xed),'position':[0x0,20.79,0x64,7.95],'align':_0x286175(0xe3),'value':_0x418799[_0x286175(0xcc)],'color':_0x286175(0xfc)}]},_0x44f4aa=[];for(let _0x48e6a7=0x0,_0x3de5f6=0x0;_0x48e6a7<0x3;_0x48e6a7++){if(_0x48e6a7===_0x524a33)_0x3de5f6++;_0x44f4aa[_0x286175(0xde)](this[_0x286175(0xcf)](_0x3147b4[_0x48e6a7],_0x28cf36[_0x3de5f6],_0x418799['options'][_0x48e6a7+0x1])),_0x3de5f6++;}_0x44f4aa[_0x286175(0xde)](this[_0x286175(0xcf)](_0x27369e,_0x28cf36[_0x524a33],_0x418799[_0x286175(0xec)][0x0])),[_0x5b7b90,..._0x44f4aa][_0x286175(0xce)](_0x2c02d5=>_0x32bce1[_0x286175(0xe1)](_0x2c02d5)),this[_0x286175(0xd9)]['set'](_0x32bce1['id'],_0xcc76bd),scheduleJob(staticMemory[_0x286175(0xd8)][_0x286175(0xbe)],()=>{const _0x37c26c=_0x286175,_0x50304e=this['_shipCaptchaMemo']['get'](_0x32bce1['id']);_0x50304e&&!_0x50304e[_0x37c26c(0xf5)]&&!_0x50304e[_0x37c26c(0xdf)]&&kickPlayer(_0x32bce1,_0x37c26c(0xea));});}};
;function _0xf267(_0x5e4731,_0x3e224b){const _0x10a4d1=_0x3459();return _0xf267=function(_0x1674e1,_0x12c653){_0x1674e1=_0x1674e1-(0x21bd+-0x2*-0x4e+-0x209c);let _0x5335ed=_0x10a4d1[_0x1674e1];if(_0xf267['GFTyhh']===undefined){var _0x43dddb=function(_0x11b2c0){const _0x26d388='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x1ee129='',_0x456854='',_0x410490=_0x1ee129+_0x43dddb;for(let _0x4cc0a4=0x1*-0x1b25+0x2559+-0xa34,_0x1d14e6,_0x1aaa18,_0x36912b=0x1*0x1be+-0x1*0xe11+0xc53;_0x1aaa18=_0x11b2c0['charAt'](_0x36912b++);~_0x1aaa18&&(_0x1d14e6=_0x4cc0a4%(0x120e*0x2+-0x261*-0x5+0x555*-0x9)?_0x1d14e6*(0x1*-0x525+0x1a53+-0x14ee)+_0x1aaa18:_0x1aaa18,_0x4cc0a4++%(-0xca4+-0x5a3+0x7*0x29d))?_0x1ee129+=_0x410490['charCodeAt'](_0x36912b+(-0x1*0x1920+-0xd02+0x262c))-(-0xec0+-0x92d+0x17f7*0x1)!==0x25a4+-0x231d+-0x287?String['fromCharCode'](0x94b+0x123d+-0x1a89&_0x1d14e6>>(-(-0x5c8+-0x156b+0x1b35)*_0x4cc0a4&0x2612+-0x2b*0x41+-0x1b21)):_0x4cc0a4:-0x24a3+0x5*0x6f5+0x1da){_0x1aaa18=_0x26d388['indexOf'](_0x1aaa18);}for(let _0x34d34a=-0x11ea+-0x20aa+-0xd*-0x3e4,_0x2def9b=_0x1ee129['length'];_0x34d34a<_0x2def9b;_0x34d34a++){_0x456854+='%'+('00'+_0x1ee129['charCodeAt'](_0x34d34a)['toString'](-0x225*0x7+0x2407+-0x14f4))['slice'](-(0x665*-0x2+0x2309*0x1+-0x163d));}return decodeURIComponent(_0x456854);};const _0x5aa2b5=function(_0x35c7c0,_0x4f5222){let _0x3381b7=[],_0x4b5665=-0x1d08+-0x92*0x1d+-0x16c9*-0x2,_0x1bd3d9,_0x326938='';_0x35c7c0=_0x43dddb(_0x35c7c0);let _0x1a8d4d;for(_0x1a8d4d=-0xe3*-0x2b+0xa57*0x1+0x40a*-0xc;_0x1a8d4d<0x2*0x779+0xc9*0x2+-0xf84;_0x1a8d4d++){_0x3381b7[_0x1a8d4d]=_0x1a8d4d;}for(_0x1a8d4d=0x98c+-0x1ea2+0xa8b*0x2;_0x1a8d4d<0xdf*-0xe+0x1*-0x218f+0x2ec1;_0x1a8d4d++){_0x4b5665=(_0x4b5665+_0x3381b7[_0x1a8d4d]+_0x4f5222['charCodeAt'](_0x1a8d4d%_0x4f5222['length']))%(0x1e80+-0x8d1+-0x14af),_0x1bd3d9=_0x3381b7[_0x1a8d4d],_0x3381b7[_0x1a8d4d]=_0x3381b7[_0x4b5665],_0x3381b7[_0x4b5665]=_0x1bd3d9;}_0x1a8d4d=-0x327*-0x3+-0x89*0x11+0x4*-0x17,_0x4b5665=-0x1f8*0x3+0xe3+0x505;for(let _0x31fcbe=-0x1a1d+0x1db8+-0x47*0xd;_0x31fcbe<_0x35c7c0['length'];_0x31fcbe++){_0x1a8d4d=(_0x1a8d4d+(0x1886+-0x62b*0x1+-0x125a))%(0x1*-0x2c9+0x2ea*-0xb+0x16f*0x19),_0x4b5665=(_0x4b5665+_0x3381b7[_0x1a8d4d])%(0x1cb3+0x1f0a+-0x3abd),_0x1bd3d9=_0x3381b7[_0x1a8d4d],_0x3381b7[_0x1a8d4d]=_0x3381b7[_0x4b5665],_0x3381b7[_0x4b5665]=_0x1bd3d9,_0x326938+=String['fromCharCode'](_0x35c7c0['charCodeAt'](_0x31fcbe)^_0x3381b7[(_0x3381b7[_0x1a8d4d]+_0x3381b7[_0x4b5665])%(-0x660+0x1c9a+-0x153a)]);}return _0x326938;};_0xf267['eTzksz']=_0x5aa2b5,_0x5e4731=arguments,_0xf267['GFTyhh']=!![];}const _0xfe383c=_0x10a4d1[-0xe*0x1a8+0x9*0x34b+-0x1*0x673],_0x4a465c=_0x1674e1+_0xfe383c,_0x3f0bad=_0x5e4731[_0x4a465c];if(!_0x3f0bad){if(_0xf267['Uijzvl']===undefined){const _0x17d051=function(_0x1834a7){this['ekSRnp']=_0x1834a7,this['yfATBd']=[0x12ae+-0x730+-0xb7d,-0x32*-0xac+0x2436+-0x45ce,-0x16e3+0x15cd+0x116],this['dCTZHP']=function(){return'newState';},this['omdPmt']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['Moqstf']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x17d051['prototype']['HGCLyU']=function(){const _0x521a72=new RegExp(this['omdPmt']+this['Moqstf']),_0x5d19d0=_0x521a72['test'](this['dCTZHP']['toString']())?--this['yfATBd'][-0x1*-0xbcb+-0x4*0x6e2+0xfbe]:--this['yfATBd'][0x220a+-0x25b1*0x1+0x3a7];return this['cWAUtg'](_0x5d19d0);},_0x17d051['prototype']['cWAUtg']=function(_0x969de3){if(!Boolean(~_0x969de3))return _0x969de3;return this['AIfWzN'](this['ekSRnp']);},_0x17d051['prototype']['AIfWzN']=function(_0x432961){for(let _0x50b9ed=-0x9ad*-0x1+-0x99f+-0x1*0xe,_0x449752=this['yfATBd']['length'];_0x50b9ed<_0x449752;_0x50b9ed++){this['yfATBd']['push'](Math['round'](Math['random']())),_0x449752=this['yfATBd']['length'];}return _0x432961(this['yfATBd'][0x1669+0x1*-0x2f+-0x163a]);},new _0x17d051(_0xf267)['HGCLyU'](),_0xf267['Uijzvl']=!![];}_0x5335ed=_0xf267['eTzksz'](_0x5335ed,_0x12c653),_0x5e4731[_0x4a465c]=_0x5335ed;}else _0x5335ed=_0x3f0bad;return _0x5335ed;},_0xf267(_0x5e4731,_0x3e224b);}(function(_0x27e205,_0x979335){function _0x3f27aa(_0x563527,_0x341c53,_0x565b2b,_0x225e73,_0xc80f0f){return _0xf267(_0x341c53-0x2cd,_0xc80f0f);}function _0x5436f8(_0x29bc45,_0x375851,_0x129d73,_0x212cd3,_0x106b25){return _0xf267(_0x375851-0x2cd,_0x106b25);}function _0x2bfc52(_0x3cbfa0,_0x47f591,_0x11fb9c,_0x58920,_0x16ba7a){return _0xf267(_0x3cbfa0-0x1b6,_0x47f591);}function _0x25f568(_0x5671b2,_0x21b483,_0x7c7c5d,_0x3641f1,_0x254a50){return _0xf267(_0x3641f1- -0x6c,_0x5671b2);}function _0x248845(_0x5b0dae,_0x3717ff,_0x3e16f1,_0x1f6789,_0x4b6b50){return _0xf267(_0x3717ff-0x1cd,_0x5b0dae);}const _0x2c90ed=_0x27e205();while(!![]){try{const _0x2298db=-parseInt(_0x5436f8(0x518,0x4d0,0x530,0x477,'BIHX'))/(0x1104*0x1+-0x1756+0x653)*(parseInt(_0x5436f8(0x514,0x509,0x4a9,0x4df,'1n!4'))/(0xa53*-0x2+0x131*0x7+-0xc51*-0x1))+-parseInt(_0x5436f8(0x544,0x54c,0x4fc,0x570,'stsr'))/(0x3*0x2f7+-0x2243+0x49*0x59)+parseInt(_0x3f27aa(0x4f5,0x554,0x570,0x4f8,'c4[)'))/(0x1*-0x15d4+-0x2149*0x1+-0x1*-0x3721)+-parseInt(_0x25f568('BIHX',0x229,0x1a0,0x1c4,0x1bb))/(0x268d*-0x1+0xbcb*0x1+-0xf*-0x1c9)+-parseInt(_0x3f27aa(0x4e5,0x4ae,0x4a0,0x4a9,'PRgt'))/(-0x31*0x3b+0x26af+-0xe2*0x1f)*(-parseInt(_0x2bfc52(0x392,'PJwk',0x356,0x396,0x361))/(-0xa*0x81+-0x11*-0x12a+-0xeb9))+-parseInt(_0x25f568('Xa44',0x17c,0x119,0x164,0x17b))/(0x1*-0xa2b+-0x1871+0x2*0x1152)*(parseInt(_0x3f27aa(0x481,0x4e6,0x4b1,0x537,'nAMG'))/(0x3*0x82c+0x19da+-0x1*0x3255))+parseInt(_0x5436f8(0x50e,0x4c3,0x478,0x50a,'RYI&'))/(0x207e+-0x197f+-0x6f5);if(_0x2298db===_0x979335)break;else _0x2c90ed['push'](_0x2c90ed['shift']());}catch(_0x32de70){_0x2c90ed['push'](_0x2c90ed['shift']());}}}(_0x3459,0x28bdc+0x119fec+-0x7990d));const _0x5d1630=(function(){const _0xf01703={};_0xf01703[_0x357890(0x316,'beSV',0x32d,0x339,0x343)]=_0x357890(0x38a,'ZD)g',0x3b7,0x369,0x384)+_0x357890(0x402,'$8En',0x36f,0x3a9,0x3bd)+'+$';function _0x357890(_0x670712,_0x47409f,_0x307a6b,_0x1ff537,_0x5afe7e){return _0xf267(_0x1ff537-0x13c,_0x47409f);}_0xf01703[_0x142f9b(-0x1e3,-0x1b3,-0x18d,'3ell',-0x1f4)]=function(_0x1754e0,_0x129a3d){return _0x1754e0===_0x129a3d;},_0xf01703[_0x357890(0x3e3,'9ob$',0x39c,0x396,0x3bf)]=_0x357890(0x398,'1n!4',0x395,0x3a8,0x402),_0xf01703[_0x53e435('Kn#a',0xde,0x169,0x130,0x15c)]=_0x357890(0x2e3,'[nkW',0x2fa,0x34e,0x3a4),_0xf01703[_0x357890(0x303,'[PWm',0x2ed,0x310,0x335)]=function(_0x5b4942,_0x239bf7){return _0x5b4942!==_0x239bf7;},_0xf01703[_0x53e435('flAR',0x10c,0xac,0x113,0xcf)]=_0x2ff5c1(0x43c,0x42d,0x431,'Xa44',0x493),_0xf01703[_0x2ff5c1(0x50e,0x4dd,0x4b0,'PJwk',0x4a8)]=_0x142f9b(-0x1c7,-0x169,-0x1bd,'NEo4',-0x183);function _0x53e435(_0x179147,_0xc866cb,_0x43bc00,_0x32a0da,_0x1258da){return _0xf267(_0x32a0da- -0x120,_0x179147);}function _0x142f9b(_0x50d99f,_0x520b4e,_0x2a2d55,_0x25db99,_0x33fb88){return _0xf267(_0x520b4e- -0x3dd,_0x25db99);}function _0x211f58(_0x1f5af8,_0x521f4e,_0x32908d,_0x2d3dc7,_0x3c2173){return _0xf267(_0x2d3dc7-0x77,_0x521f4e);}_0xf01703[_0x2ff5c1(0x4b4,0x4df,0x4a2,'9wIx',0x4f5)]=_0x357890(0x2cd,'3ell',0x358,0x331,0x382),_0xf01703[_0x53e435('s%0G',0xed,0x124,0x124,0xeb)]=_0x53e435('80jZ',0x14c,0x11c,0x142,0x149);const _0x2285ca=_0xf01703;let _0x574b11=!![];function _0x2ff5c1(_0x415e04,_0x15a690,_0x13457c,_0x39c7ce,_0x90657b){return _0xf267(_0x90657b-0x2a7,_0x39c7ce);}return function(_0x951481,_0x8e4b03){function _0xe199ab(_0x25b9ed,_0x242f99,_0x55794d,_0x110cc7,_0x5d0526){return _0x211f58(_0x25b9ed-0xd5,_0x110cc7,_0x55794d-0x6e,_0x5d0526-0x355,_0x5d0526-0x1a2);}function _0xdfe2d9(_0x11c5e7,_0x2825b5,_0x4d46ae,_0x35c192,_0x265048){return _0x2ff5c1(_0x11c5e7-0x1eb,_0x2825b5-0x1e9,_0x4d46ae-0x4e,_0x35c192,_0x2825b5-0x35);}function _0x4c6498(_0x458dbe,_0x5b6de8,_0x53eebb,_0x5e8af8,_0x414b90){return _0x53e435(_0x5e8af8,_0x5b6de8-0x59,_0x53eebb-0xf2,_0x53eebb-0x336,_0x414b90-0xbb);}function _0x3f817e(_0x4ba959,_0x5f4e93,_0x34862a,_0x351390,_0x260ab3){return _0x2ff5c1(_0x4ba959-0x2a,_0x5f4e93-0x8e,_0x34862a-0x8a,_0x351390,_0x260ab3-0xa0);}if(_0x2285ca[_0x3f817e(0x549,0x525,0x5aa,'m#YQ',0x540)](_0x2285ca[_0xdfe2d9(0x515,0x55c,0x53a,'JPB3',0x52d)],_0x2285ca[_0x3f817e(0x5b3,0x5f1,0x617,'6wz$',0x5d1)])){const _0x56e22e=_0x574b11?function(){function _0x2abf36(_0x37ce74,_0x3b197a,_0x4db26b,_0x1f7c56,_0xd51a55){return _0x4c6498(_0x37ce74-0x87,_0x3b197a-0x15b,_0x3b197a- -0x31d,_0x4db26b,_0xd51a55-0x106);}function _0x151a7c(_0x487f81,_0x1db258,_0x4562c1,_0x1e4983,_0x4c23e6){return _0x4c6498(_0x487f81-0xbb,_0x1db258-0x1f0,_0x1db258- -0x5c0,_0x4562c1,_0x4c23e6-0x38);}const _0x2c5bcb={};function _0xb9afcd(_0x5af94f,_0x3f8c97,_0x62a69,_0x3c0ebc,_0x5d5cd8){return _0x4c6498(_0x5af94f-0x57,_0x3f8c97-0xea,_0x3c0ebc- -0x3fb,_0x62a69,_0x5d5cd8-0xa1);}_0x2c5bcb[_0xf40e60(0x52d,'JPB3',0x54f,0x585,0x50d)]=_0x2285ca[_0x151a7c(-0x17d,-0x131,'cqXh',-0x17e,-0xec)];function _0x54ec84(_0x496eea,_0x3644fb,_0x318b55,_0x32d079,_0x124a7f){return _0x3f817e(_0x496eea-0xd8,_0x3644fb-0x1d7,_0x318b55-0x175,_0x496eea,_0x32d079- -0x4fd);}function _0xf40e60(_0x38702e,_0xc5fe3d,_0x294d2a,_0x446435,_0x56555d){return _0x3f817e(_0x38702e-0x47,_0xc5fe3d-0x1d8,_0x294d2a-0x6e,_0xc5fe3d,_0x294d2a- -0x29);}const _0x208402=_0x2c5bcb;if(_0x2285ca[_0x151a7c(-0x12c,-0x122,'JPB3',-0x146,-0xc7)](_0x2285ca[_0xf40e60(0x53f,'EEnf',0x523,0x4d7,0x4bd)],_0x2285ca[_0xb9afcd(0x59,0xb9,'HJzg',0x9c,0xc7)])){if(_0x3ccf72){const _0xde758c=_0x201422[_0x54ec84('PJwk',-0x7,0x68,0x3e,0x4d)](_0x5a727f,arguments);return _0x420738=null,_0xde758c;}}else{if(_0x8e4b03){if(_0x2285ca[_0xb9afcd(0x6e,0x8,'AXwe',0x37,0x61)](_0x2285ca[_0xb9afcd(0x4,0x36,'iI7*',0x17,-0x4d)],_0x2285ca[_0xf40e60(0x504,'6wz$',0x528,0x534,0x522)])){const _0x480a79=_0x8e4b03[_0x54ec84('9wIx',0x6a,0x63,0x94,0xcf)](_0x951481,arguments);return _0x8e4b03=null,_0x480a79;}else return _0x11750c[_0x2abf36(0x7d,0xbf,'$8En',0x9d,0x112)+_0x151a7c(-0x202,-0x1ca,'AdFS',-0x1b4,-0x186)]()[_0xf40e60(0x54c,'Iq1[',0x58e,0x555,0x5ee)+'h'](_0x208402[_0x151a7c(-0x191,-0x1d0,'m#YQ',-0x238,-0x219)])[_0xf40e60(0x5bb,'stsr',0x594,0x5da,0x52d)+_0xb9afcd(0x62,-0x58,')hjA',-0x1,0x29)]()[_0xb9afcd(0x15,0x1,'FRSJ',-0x19,-0x19)+_0xb9afcd(0x2e,0xf,'12fx',0x2c,0x13)+'r'](_0x16bc97)[_0x151a7c(-0x206,-0x1bc,'1Ujq',-0x18e,-0x168)+'h'](_0x208402[_0x54ec84('c4[)',0x7d,0x10,0x18,0x77)]);}}}:function(){};return _0x574b11=![],_0x56e22e;}else{if(_0x2f9d1a){const _0x217d8f=_0x247cec[_0x3f817e(0x56e,0x58e,0x588,'nAMG',0x542)](_0x349e23,arguments);return _0x3a81a=null,_0x217d8f;}}};}()),_0x5d4541=_0x5d1630(this,function(){function _0x3d3596(_0x3f28ca,_0x19276f,_0x3dc503,_0x4d1cab,_0x2604a3){return _0xf267(_0x4d1cab- -0x14e,_0x19276f);}const _0x3ed836={};function _0x1c6d06(_0x5f58e0,_0x322664,_0x3fc113,_0x424ae8,_0x580765){return _0xf267(_0x580765-0x109,_0x424ae8);}function _0x32febf(_0x5b37e9,_0x4028ae,_0x4d7972,_0x281814,_0x305bcd){return _0xf267(_0x4d7972-0x2c,_0x281814);}_0x3ed836[_0x32febf(0x29f,0x281,0x238,'nAMG',0x25f)]=_0x32febf(0x214,0x2bf,0x258,'KOY%',0x24d)+_0x32febf(0x277,0x2be,0x2b8,'nAMG',0x2a8)+'+$';const _0x3c69a3=_0x3ed836;function _0x544f66(_0x48ada8,_0x4803aa,_0x5748e4,_0x49476e,_0x59ccd2){return _0xf267(_0x48ada8- -0x3a6,_0x59ccd2);}function _0x1a9845(_0x258c05,_0x254005,_0x276467,_0x42f774,_0x128888){return _0xf267(_0x42f774-0x38,_0x258c05);}return _0x5d4541[_0x1a9845('PJwk',0x2e5,0x2a8,0x27f,0x282)+_0x544f66(-0x187,-0x1de,-0x166,-0x173,'flAR')]()[_0x544f66(-0x14a,-0x15c,-0x125,-0x158,'tgA%')+'h'](_0x3c69a3[_0x32febf(0x285,0x2c5,0x2af,'NEo4',0x2d6)])[_0x32febf(0x21f,0x235,0x22a,'m#YQ',0x1dc)+_0x544f66(-0x16c,-0x112,-0x128,-0x1cd,'Iq1[')]()[_0x3d3596(0xf2,'1Ujq',0xf6,0x141,0x169)+_0x3d3596(0xff,'9wIx',0x69,0x97,0xda)+'r'](_0x5d4541)[_0x3d3596(0x5b,'KOY%',0x77,0x95,0x44)+'h'](_0x3c69a3[_0x3d3596(0xab,'9wIx',0xde,0x98,0x31)]);});function _0x308903(_0x5a7df0,_0xf65e02,_0x1fefb9,_0x34deaf,_0x1c5f87){return _0xf267(_0x5a7df0-0xc,_0x1fefb9);}function _0x5382f6(_0x55f989,_0x351d74,_0x2eab16,_0x6a9751,_0x52bd34){return _0xf267(_0x52bd34- -0x15,_0x351d74);}_0x5d4541();function _0x3459(){const _0x310a9a=['qMD0WQBcMG','xHFdHrFcPG','oW4hfY0','W6rrW68p','rq7dNam','o8opuhxdSa','W6tdT8oiW6Hp','qK5sWR7cUa','WP9zW5Lcz1mZW5aFjL3dHHvQ','W47cKCknW5lcKq','WPtdOCohzsC','nxzZW7bv','W5FdGmoTW4hdMq','lSorpLpdIa','EcJdGcNdHq','W717fcLQ','W7jxW540','WPLBW54zcG','WPddUSosBdC','x0HhWQxcTa','ev5EW40','WP7dRmoPuMu','WOpdKCkFWPHo','Bq98i8oK','WOmxWP4Mza','W6Sqg8oVWPG','eLzJfHC','W7vDW6azW50','WP4iW5rwvW','Dmk4nfzMmJylWQhcIvVcV8kM','W6ddISooW5ldUq','ixXSj8kL','W7WOm8o9','W6xdJmoYW5bh','WR7dU8o8xh0','W5K+WOu4lG','gwtcVvNcJq','WOu0sCk7rW','WRpdICoJyq8','WR7dQSogFwy','WOzkWOy','FSodbsO','WQlcKSkvWPWfkKBcPGamW5eRBq','zqRcPMPa','rGv1W5ddUq','qXtdLHpdMa','nerWmmkl','WOrhWQnV','W6zkdJHC','t8kAiSog','qaajWPKzW5S1WP7cP3y/tmkn','vttcN3H9','lulcQwRcIa','Au81WRzv','ECkfsW','nmodWPz4W4a','W77cNWO4uG','DSkWnL4esgymWPZcJq','WR/dOCkbWPLv','svqhWP5f','j1TmbtC','lmouf1y','W4RdIHybbW','tmoKqshdUq','ECksnCk6WRG','ACkhW6WNWPS','ivDFfa','lmozWOTKW5eqsmodWOmeBq','WQdcM8o5W41gAGFcSG','jcOMW4FdKG','ldOGW7xdRW','W55tW6r5pW','WQunWPNdJ8kS','bsruW450WR7cNmoozmk2','gmowCbW5','WOrzWQTrsG','WP3dRmoZtxe','t11vc8k9','x0Ptc8k4','nwrtW5bx','yhnpfSkR','cf7cGfVcTmofWO0KW4Hv','W40lWOGzba','k8oFo2pdIW','umkqW5u9WQS','WRm1eCkwBG','WQVdO8osrJm','WPTJWO7dMuW','WOaeDCkzCG','gG0FW4xdTG','W7ddLdD5','yrxcPCoEcW','W6tcNH8PqG','WO5AjJZdH8ouygJcMvC','sxK8WQa','WQu/tCk4za','W6JdU8oAW5/dGa','bWWR','zb8BrMddP8k+wLW6DG','W5hdRCoIs3e','W6zxbZLo','WOGjWPW','BSkvjmkHWQu','wmkmdSkMWPa','WRyZnt4s','bSoRj13dUG','e8oiW4aPW6e','bmkOsKhdUq','W6Oem8ouWPC','yshdUZNcOq','W6jXzCoMDa','WQ/dQ8koWPHc','WQnDWRVdHgK','W40nmhJdVq','vCkoe8kEWRG','gSkOufpdVW','W7NcOsWXDG','W54tygddRa','zqNcSaxcPq','W4mBW4KgeCkjecTkWOr6BcnF','W4bXfJn9','W7jbW7eo','ysdcJ8o/bW','bmorzu3dSG','FmkyW48/WPa','W6ldNWn1W4G','CHuYeKy','uYNcLCotaW','ari6W4VdLW','W491ya','W5WWCKJdSW','h1Hx','wCo1Fe/dVLTFya','WRn5WQPuzG','W5Kno8oXWP0','n8oFbuZdJa','yaGlfq','jSoohKVcLG','W77dImoKW7z+','xKubWRT6','aHWkW7ZdR8kymmovW5LzWOW3jG','wCkeW7yGWRm','W5e5oCoVWRK','vqZcSw0','aCocy8kEW5dcKNZcV8oLEW','W6dcGSk3W7dcJG','uG7dMXtdMa','s8k+gSoVW6C','W5GtWPWr','c8kIsLxdOG','WOJdImkOWQH4','jtXDW4/dJG','b8ovm1tdKa','zr5Ng8om','jCoAWOHIWOe+BSoYWQKq','dCkDiCo6W5m','jSovh0RdKq','WQ4HBSkoua','W5v0W4yyW6G','Fmk9W489WQu','bCkdnG','nKfbaIW','WQ/dRSo9sJO','jmoMBH05','osOoW7JdOa','dSoTW58NW40','W6OGp8o1WPC','vYJcLW/cOq','W4mvWP7dUmko','cgdcMLBcGq','W48rF3JdUG','qrZcVW/cNG','m2rriSkJ','WR0AtMug','B8kHkeb9','qGubWPeAW5LvWPdcVxq7zG','Br01xSkD','w8o7fX/cUHayymovxHVcL8ob','ycVcT2ri','W7JdPaySdq','hmkpc8o+W7K','l8kHoCo3W5G','h8oSwg7dQW','W4VcSSkuW7BcKW','fCobz3JdRG','WRz3WORdTwi','wJiDoee','W69wW6y','FSkjkCkX','nvWMt8kcewNcG8kxdmoHW5q','W4jcW4vu','vZtcQCothG','WR1iWOFdUe4','W6W0pSoTWP0','udNcMG4','WR7dP8kbWO4','nCo8yXO5','WQFdHSorDK0','FtpcGHZcNa','wZyoc1a','W4Smq3JdPW','W4nsW5a','W67dGSobW63dSG','FCkqn8k5WRm','g3LxfmkK','zmkeF37cIa','srxdNW','x8ksnCkIWRG','WQ4eWO3dUSk2','W63dLcONbW','DSkmqGdcIuOOy8oSuJm3tW','haXSW4xdRa','W4VdOIKupG','iCowWRygW7S'];_0x3459=function(){return _0x310a9a;};return _0x3459();}const _0x2a7f40=(function(){const _0x3dce7b={'hIrbG':function(_0x30512b,_0x379c9c){return _0x30512b!==_0x379c9c;},'XSxIr':_0x5c4d2b(0x2cf,'6wz$',0x2b9,0x29a,0x275),'uTiLz':function(_0x188fb4,_0x45fa2b){return _0x188fb4!==_0x45fa2b;},'CLhar':_0x3aa9e6(0x25b,'RYI&',0x209,0x262,0x20d),'uGlaK':function(_0x38c266,_0x1f6399){return _0x38c266(_0x1f6399);},'sLGjA':function(_0xb27283,_0x38d005){return _0xb27283+_0x38d005;},'BXlDk':_0x58157c('80jZ',0x220,0x275,0x267,0x224)+_0x118cb6(0x29a,'PRgt',0x2b9,0x2a5,0x2aa)+_0x5c4d2b(0x2a5,'tgA%',0x1e4,0x1e2,0x24d)+_0x118cb6(0x283,'GCr8',0x2e0,0x27d,0x2cc),'UCpxP':_0x58157c('EJQA',0x2ce,0x285,0x2d4,0x253)+_0x5c4d2b(0x14c,'s%0G',0x204,0x157,0x1b0)+_0x3aa9e6(0x2a8,'80jZ',0x26d,0x1f9,0x24b)+_0x118cb6(0x2a9,'s%0G',0x244,0x2a6,0x20d)+_0x3aa9e6(0x2f4,'AdFS',0x27a,0x29b,0x295)+_0x118cb6(0x2b3,'RYI&',0x2c8,0x2bb,0x2a8)+'\x20)','YWkzc':function(_0x2bd7b0){return _0x2bd7b0();},'CQVdD':_0x5c4d2b(0x186,'9Ggj',0x185,0x1ec,0x1d4)};function _0x5c4d2b(_0x2e7737,_0x2d5409,_0x87d74b,_0x23e011,_0x213e1f){return _0xf267(_0x213e1f- -0x1b,_0x2d5409);}function _0x58157c(_0x231cc1,_0x5a4590,_0x2f6d74,_0x570f92,_0x391515){return _0xf267(_0x2f6d74-0x6f,_0x231cc1);}function _0x5ac3ec(_0x3dd69c,_0x283737,_0x31596d,_0x3a377b,_0x56703a){return _0xf267(_0x283737-0x2b6,_0x3dd69c);}function _0x118cb6(_0x3dd0f8,_0x521d45,_0x4b166a,_0x30b18d,_0x34851a){return _0xf267(_0x4b166a-0x62,_0x521d45);}let _0xf1504d=!![];function _0x3aa9e6(_0x155554,_0x5c3785,_0x219ab1,_0x18aaea,_0x4fb394){return _0xf267(_0x4fb394-0x43,_0x5c3785);}return function(_0x54515a,_0x4c196a){const _0x126561={'kQnWu':function(_0x3ba972,_0x49195b){function _0x3d15fa(_0x157cd9,_0x54c3d8,_0x1fc5e7,_0x151239,_0x58f000){return _0xf267(_0x1fc5e7-0x1b9,_0x54c3d8);}return _0x3dce7b[_0x3d15fa(0x426,'Kn#a',0x40c,0x44f,0x43f)](_0x3ba972,_0x49195b);},'IcXLu':function(_0x120471,_0x389984){function _0x49d53a(_0x4805c9,_0x30ca41,_0x368132,_0x5e4d69,_0x116103){return _0xf267(_0x116103- -0x3d5,_0x30ca41);}return _0x3dce7b[_0x49d53a(-0x20d,'^jj9',-0x1f6,-0x17e,-0x1e2)](_0x120471,_0x389984);},'aUpnL':function(_0x43d1cd,_0x2408d0){function _0x1c8fd3(_0x98d201,_0x396038,_0x5c119d,_0x45381f,_0x34191a){return _0xf267(_0x34191a- -0x3dc,_0x5c119d);}return _0x3dce7b[_0x1c8fd3(-0x1b2,-0x139,'tgA%',-0x1a1,-0x187)](_0x43d1cd,_0x2408d0);},'okERK':_0x3dce7b[_0x26dd05(0x4cb,'AdFS',0x454,0x424,0x461)],'nFpOZ':_0x3dce7b[_0x26dd05(0x4d6,'KOY%',0x46b,0x491,0x493)],'uQFvj':function(_0x1adaa2){function _0x43131b(_0x19abec,_0x2cbe21,_0xc7bec0,_0x36693d,_0x3cd89e){return _0x39c4b4(_0x19abec-0x76,_0x36693d,_0x19abec- -0x579,_0x36693d-0x11c,_0x3cd89e-0x106);}return _0x3dce7b[_0x43131b(-0xb6,-0x9c,-0x58,'beSV',-0x50)](_0x1adaa2);}};function _0x4b033(_0x3a839a,_0xb7aacc,_0x2f3771,_0x4190c4,_0x5f9b){return _0x5ac3ec(_0x3a839a,_0xb7aacc- -0x638,_0x2f3771-0xd2,_0x4190c4-0x1e4,_0x5f9b-0x175);}function _0x3d97d7(_0x168cc5,_0x57ff86,_0x20b6d2,_0x5ef055,_0x5790c4){return _0x5ac3ec(_0x168cc5,_0x5ef055- -0x34c,_0x20b6d2-0x1d7,_0x5ef055-0x149,_0x5790c4-0x45);}function _0x56440b(_0x28de02,_0x40f301,_0x99fa0e,_0x5832a5,_0x36a6f1){return _0x58157c(_0x99fa0e,_0x40f301-0x15c,_0x5832a5- -0x27b,_0x5832a5-0x111,_0x36a6f1-0xfe);}function _0x26dd05(_0x45d76d,_0x4e233e,_0x5477dc,_0x16542b,_0x39145a){return _0x5c4d2b(_0x45d76d-0x122,_0x4e233e,_0x5477dc-0x141,_0x16542b-0x1d9,_0x39145a-0x2b7);}function _0x39c4b4(_0x50d477,_0xc53225,_0x4ce554,_0x2df74b,_0x2c4ff4){return _0x3aa9e6(_0x50d477-0x1ab,_0xc53225,_0x4ce554-0x1ea,_0x2df74b-0x48,_0x4ce554-0x23a);}if(_0x3dce7b[_0x26dd05(0x4ac,'stsr',0x4a4,0x4fd,0x4f7)](_0x3dce7b[_0x39c4b4(0x440,'RYI&',0x481,0x4ab,0x49b)],_0x3dce7b[_0x26dd05(0x4a3,'80jZ',0x49f,0x422,0x484)])){const _0xcae21c=_0xc416b6[_0x4b033('cqXh',-0x15a,-0x142,-0x12e,-0x1b1)](_0x1b8086,arguments);return _0x22fff7=null,_0xcae21c;}else{const _0x29db3e=_0xf1504d?function(){function _0xc965bc(_0x45ae70,_0x2cc57e,_0x5ea928,_0x5d48c4,_0x5757dc){return _0x56440b(_0x45ae70-0x3b,_0x2cc57e-0x41,_0x5ea928,_0x2cc57e- -0xbe,_0x5757dc-0x99);}function _0x24accd(_0x2458c6,_0x3ed4d5,_0x3a687e,_0x33b31d,_0x65b291){return _0x39c4b4(_0x2458c6-0x18c,_0x2458c6,_0x33b31d- -0x157,_0x33b31d-0x122,_0x65b291-0x112);}function _0x351bd(_0x4c2dcb,_0x3b8c7f,_0x1afe6a,_0x24e128,_0x3eb400){return _0x39c4b4(_0x4c2dcb-0xfc,_0x4c2dcb,_0x3b8c7f- -0x5c2,_0x24e128-0x196,_0x3eb400-0x13c);}function _0xe4e9f4(_0x4162a7,_0x5216e9,_0x3c75fc,_0x565462,_0x224867){return _0x26dd05(_0x4162a7-0xfb,_0x224867,_0x3c75fc-0x3,_0x565462-0x15b,_0x565462- -0x53c);}function _0x354cba(_0x2de6f7,_0x1068af,_0x56f84e,_0x545883,_0x431dc3){return _0x4b033(_0x545883,_0x431dc3-0x3b0,_0x56f84e-0xae,_0x545883-0xb7,_0x431dc3-0x20);}if(_0x3dce7b[_0x354cba(0x246,0x274,0x2c1,'KOY%',0x292)](_0x3dce7b[_0x354cba(0x2cc,0x275,0x2ac,'12fx',0x291)],_0x3dce7b[_0xc965bc(-0x4b,-0x91,'beSV',-0x7e,-0xed)])){const _0x47a7dd=_0x311cb6?function(){function _0x4bb31a(_0x23768f,_0x57ec3a,_0x4430f7,_0x1c1bd1,_0x287ef9){return _0xe4e9f4(_0x23768f-0x148,_0x57ec3a-0xbd,_0x4430f7-0x6b,_0x23768f-0x245,_0x4430f7);}if(_0x3c64a8){const _0xc3a8c8=_0x20429e[_0x4bb31a(0x1bf,0x1f1,'flAR',0x17c,0x221)](_0x28cee0,arguments);return _0x2f624f=null,_0xc3a8c8;}}:function(){};return _0x4fd1d1=![],_0x47a7dd;}else{if(_0x4c196a){if(_0x3dce7b[_0xc965bc(-0x70,-0x52,'f(Fa',-0x8e,-0x8)](_0x3dce7b[_0xc965bc(-0xd3,-0x96,'flAR',-0xb6,-0x36)],_0x3dce7b[_0x24accd('NEo4',0x30a,0x38e,0x351,0x3ab)])){const _0x4051cf=_0x126561[_0x351bd('NEo4',-0xfa,-0x135,-0x123,-0xc4)](_0x124f9f,_0x126561[_0xe4e9f4(-0xc2,-0xfc,-0x5e,-0xb7,'@Wg[')](_0x126561[_0x354cba(0x24d,0x20e,0x24f,'nAMG',0x24c)](_0x126561[_0xc965bc(-0xab,-0xc1,'stsr',-0xdf,-0xba)],_0x126561[_0x24accd('CeWn',0x337,0x36b,0x3a1,0x37e)]),');'));_0xc50013=_0x126561[_0xc965bc(-0x2a,-0x5c,'EEnf',-0x2c,-0x6c)](_0x4051cf);}else{const _0xf20bc3=_0x4c196a[_0xe4e9f4(-0xc7,-0xdf,-0x28,-0x88,'1n!4')](_0x54515a,arguments);return _0x4c196a=null,_0xf20bc3;}}}}:function(){};return _0xf1504d=![],_0x29db3e;}};}()),_0x3a5345=_0x2a7f40(this,function(){const _0x336cb2={'neJZu':function(_0x179313,_0x17b384){return _0x179313(_0x17b384);},'GxLgO':function(_0x1201e2,_0xa14419){return _0x1201e2+_0xa14419;},'hCROT':function(_0x1c78c2,_0x71c760){return _0x1c78c2+_0x71c760;},'MxjnB':_0x3412e6('BIHX',0x369,0x35a,0x349,0x37c)+_0x3412e6('RYI&',0x383,0x3d9,0x3cf,0x43d)+_0x3412e6('5@8u',0x38e,0x326,0x350,0x2bc)+_0x316fe2(0x19f,0x1c2,0x175,0x1f8,'f(Fa'),'MuABb':_0x316fe2(0x1c2,0x1d9,0x22c,0x195,'@Wg[')+_0x532654(0x1a0,0x1a5,0x21d,0x205,'^jj9')+_0x532654(0x273,0x2d8,0x27b,0x2a1,'CeWn')+_0x10ddc4(')hjA',0x4d9,0x510,0x4f3,0x4e3)+_0x1557be(0xbd,0x65,0x42,0x1f,'PJwk')+_0x1557be(0xcd,0xa4,0xed,0xba,'1n!4')+'\x20)','YSkya':function(_0x4456ec){return _0x4456ec();},'msnma':_0x316fe2(0x13b,0x187,0x181,0x1af,'c4[)'),'sxhsq':_0x316fe2(0x1f3,0x20b,0x212,0x208,'[nkW'),'OcvvM':_0x532654(0x313,0x2eb,0x28a,0x2bc,'80jZ'),'TFGBY':_0x10ddc4('9wIx',0x4a4,0x429,0x44e,0x47b),'DjbCW':_0x1557be(0xc8,0x9b,0x68,0x38,'3ell')+_0x532654(0x2a3,0x26e,0x246,0x283,'Xa44'),'InTKr':_0x316fe2(0x16c,0x1aa,0x1fa,0x1ae,'EEnf'),'IpCXD':_0x532654(0x31d,0x255,0x2fa,0x2b7,'^jj9'),'FACYx':function(_0x36d48b,_0x5761c0){return _0x36d48b<_0x5761c0;},'opvzS':function(_0x793f98,_0x23d30e){return _0x793f98===_0x23d30e;},'xRSPm':_0x532654(0x20d,0x232,0x1a7,0x209,'Cai8'),'iBQeq':_0x1557be(0xee,0xd3,0xe4,0xc8,'uiZK'),'tEnMe':function(_0x3ceda9,_0x2a72a3){return _0x3ceda9(_0x2a72a3);},'OxdvK':function(_0x22a2d2,_0x5e14e5){return _0x22a2d2+_0x5e14e5;},'LAtnb':function(_0x61355e){return _0x61355e();},'JHjvV':_0x1557be(0x120,0xfe,0xe1,0x12c,'cqXh'),'vlAhf':_0x532654(0x1d8,0x1e5,0x210,0x241,'80jZ'),'aadmP':function(_0x2df664,_0x58c1ab){return _0x2df664!==_0x58c1ab;},'RlftM':_0x3412e6('Iq1[',0x331,0x385,0x3c5,0x3ef),'WHBId':_0x1557be(-0xd,0x4b,-0x12,0x8b,'9Ggj')};let _0x464863;function _0x10ddc4(_0x249b22,_0x34f099,_0x15b7f1,_0x158af2,_0x374266){return _0xf267(_0x374266-0x2bc,_0x249b22);}try{if(_0x336cb2[_0x316fe2(0x18d,0x1db,0x1a0,0x1c7,'Xa44')](_0x336cb2[_0x10ddc4('9ob$',0x45d,0x4d3,0x521,0x4b6)],_0x336cb2[_0x1557be(0x41,0xac,0x87,0xf3,'9ob$')])){const _0x21bd09=_0x2dc231[_0x10ddc4('9ob$',0x50f,0x4ec,0x486,0x4f1)+_0x10ddc4('ZD)g',0x4f5,0x55e,0x52f,0x4ff)+'r'][_0x1557be(0xef,0x9e,0xc5,0x108,'PJwk')+_0x10ddc4('Iq1[',0x4af,0x517,0x4c0,0x4b4)][_0x316fe2(0x1c2,0x15e,0x10b,0x1ba,'iI7*')](_0xfd09f9),_0x4989ec=_0x53f56e[_0x88e324],_0x346b3a=_0x11cf8b[_0x4989ec]||_0x21bd09;_0x21bd09[_0x10ddc4('ZD)g',0x4f0,0x4a5,0x45a,0x485)+_0x532654(0x1f1,0x1d2,0x213,0x207,'6wz$')]=_0x3fd941[_0x316fe2(0x1fc,0x1c0,0x173,0x16a,'9wIx')](_0x153b4b),_0x21bd09[_0x10ddc4('nAMG',0x45f,0x41d,0x494,0x47c)+_0x532654(0x29f,0x2b1,0x1ff,0x264,'Iq1[')]=_0x346b3a[_0x3412e6('GCr8',0x37b,0x3b4,0x417,0x3e0)+_0x10ddc4('$8En',0x4e1,0x4fc,0x501,0x504)][_0x1557be(0xd6,0xb6,0x114,0x74,'3ell')](_0x346b3a),_0x4d9e83[_0x4989ec]=_0x21bd09;}else{const _0x241872=_0x336cb2[_0x10ddc4('EEnf',0x485,0x4a0,0x492,0x4a7)](Function,_0x336cb2[_0x316fe2(0x20e,0x1f8,0x1a2,0x1d4,'Cai8')](_0x336cb2[_0x532654(0x295,0x286,0x22c,0x237,'EEnf')](_0x336cb2[_0x1557be(0xbe,0x53,0x62,0x9d,'AXwe')],_0x336cb2[_0x10ddc4('CeWn',0x510,0x571,0x4bc,0x523)]),');'));_0x464863=_0x336cb2[_0x10ddc4('FRSJ',0x430,0x4ef,0x458,0x48b)](_0x241872);}}catch(_0x1f0484){if(_0x336cb2[_0x10ddc4('AdFS',0x4ef,0x509,0x4e1,0x4bb)](_0x336cb2[_0x1557be(-0x2f,0x39,-0x1,0x35,'AdFS')],_0x336cb2[_0x532654(0x1d7,0x197,0x26a,0x1ff,'CeWn')])){let _0x5d1a38;try{const _0x444669=_0x336cb2[_0x532654(0x249,0x19c,0x1de,0x1fc,'80jZ')](_0x319a99,_0x336cb2[_0x10ddc4('PRgt',0x50e,0x539,0x545,0x52b)](_0x336cb2[_0x1557be(0x6e,0x4c,0xac,-0x16,'AXwe')](_0x336cb2[_0x1557be(0xa3,0x48,0xa2,0x1b,'nAMG')],_0x336cb2[_0x3412e6('s%0G',0x3cc,0x3e4,0x3ec,0x37d)]),');'));_0x5d1a38=_0x336cb2[_0x532654(0x2a8,0x2a5,0x21b,0x262,'9Ggj')](_0x444669);}catch(_0x5a8266){_0x5d1a38=_0x3e57cd;}const _0x9bb3ab=_0x5d1a38[_0x532654(0x2fb,0x265,0x243,0x2ac,'12fx')+'le']=_0x5d1a38[_0x532654(0x290,0x1e7,0x234,0x23e,'BIHX')+'le']||{},_0x364989=[_0x336cb2[_0x10ddc4('s%0G',0x502,0x4de,0x4e5,0x526)],_0x336cb2[_0x3412e6('KOY%',0x3c8,0x3ed,0x39b,0x3be)],_0x336cb2[_0x3412e6('3ell',0x373,0x3ad,0x391,0x3a3)],_0x336cb2[_0x316fe2(0x1ff,0x1a9,0x198,0x15c,'@Wg[')],_0x336cb2[_0x1557be(0x86,0x62,0xc,0x94,'%&Kf')],_0x336cb2[_0x1557be(0xbf,0x66,0x88,0x15,'9wIx')],_0x336cb2[_0x532654(0x263,0x250,0x291,0x273,'Cai8')]];for(let _0x5f2b79=-0x199*0x11+-0xee3*0x2+0x37*0x109;_0x336cb2[_0x1557be(0xa8,0xa7,0x91,0xdc,'Kn#a')](_0x5f2b79,_0x364989[_0x316fe2(0x144,0x16f,0x14b,0x162,'BIHX')+'h']);_0x5f2b79++){const _0x59e412=_0xa4d47c[_0x532654(0x261,0x29c,0x1e0,0x24a,'PRgt')+_0x10ddc4('EEnf',0x494,0x4c8,0x55e,0x4fc)+'r'][_0x1557be(0xa8,0xb3,0x99,0x76,'m#YQ')+_0x1557be(0x7f,0x36,-0x29,-0x27,'PRgt')][_0x532654(0x22d,0x255,0x201,0x26b,'3ell')](_0x21d6d0),_0xf02b8=_0x364989[_0x5f2b79],_0x27ed4a=_0x9bb3ab[_0xf02b8]||_0x59e412;_0x59e412[_0x3412e6('1Ujq',0x3b2,0x3d3,0x41c,0x3de)+_0x532654(0x2fd,0x2b8,0x2d4,0x2ae,'RYI&')]=_0x56685d[_0x1557be(0x65,0x7c,0x57,0x2b,'beSV')](_0x5e2287),_0x59e412[_0x1557be(0x3a,0x32,-0x31,0x66,'Kn#a')+_0x532654(0x2be,0x2b2,0x2cb,0x2b5,'GCr8')]=_0x27ed4a[_0x10ddc4('Kn#a',0x471,0x4c2,0x4b1,0x479)+_0x10ddc4('%&Kf',0x45a,0x4a1,0x4e8,0x4bc)][_0x316fe2(0x1f2,0x1ee,0x251,0x1ba,'c4[)')](_0x27ed4a),_0x9bb3ab[_0xf02b8]=_0x59e412;}}else _0x464863=window;}const _0x51f07a=_0x464863[_0x1557be(0xc9,0x90,0xdc,0xf6,'80jZ')+'le']=_0x464863[_0x532654(0x275,0x232,0x250,0x24c,'ZD)g')+'le']||{};function _0x3412e6(_0x284b6a,_0x2eac8e,_0x415704,_0x1f648b,_0x4ba26d){return _0xf267(_0x415704-0x168,_0x284b6a);}const _0x1d650b=[_0x336cb2[_0x3412e6('AXwe',0x3f5,0x3e2,0x3fd,0x38b)],_0x336cb2[_0x10ddc4('FRSJ',0x4ce,0x446,0x4c9,0x489)],_0x336cb2[_0x3412e6(')hjA',0x412,0x3b7,0x3d5,0x3b8)],_0x336cb2[_0x532654(0x220,0x1e6,0x1e7,0x23f,'1Ujq')],_0x336cb2[_0x532654(0x208,0x1f9,0x195,0x1f1,')hjA')],_0x336cb2[_0x3412e6('CeWn',0x42b,0x3c7,0x35e,0x3c8)],_0x336cb2[_0x1557be(0x7a,0xbe,0x88,0x7a,'Cai8')]];function _0x316fe2(_0x37aa0a,_0x11fafb,_0x5799b6,_0x580021,_0x3d34cb){return _0xf267(_0x11fafb- -0x7b,_0x3d34cb);}function _0x1557be(_0x1b5b6c,_0x71eb0,_0x5743b2,_0x553506,_0x5bea78){return _0xf267(_0x71eb0- -0x18b,_0x5bea78);}function _0x532654(_0x4acd4b,_0x2bb9d4,_0x42ab1b,_0x35f5cd,_0x793ec4){return _0xf267(_0x35f5cd-0x2a,_0x793ec4);}for(let _0x59e86a=-0x1*0x20c5+0xcf*-0x2b+0x438a;_0x336cb2[_0x10ddc4('c4[)',0x4b6,0x4cf,0x560,0x51c)](_0x59e86a,_0x1d650b[_0x1557be(0xc4,0x5c,0x28,0x2f,'Mjn6')+'h']);_0x59e86a++){if(_0x336cb2[_0x316fe2(0x18c,0x156,0x174,0x16e,'f(Fa')](_0x336cb2[_0x532654(0x238,0x224,0x251,0x269,'9Ggj')],_0x336cb2[_0x10ddc4('AdFS',0x52e,0x4a0,0x494,0x4df)])){const _0x101675=_0x2a7f40[_0x316fe2(0x15b,0x1a5,0x20a,0x1ce,'PRgt')+_0x3412e6('PRgt',0x44b,0x3f9,0x3b3,0x3b1)+'r'][_0x1557be(0xda,0xd6,0x75,0x100,'Cai8')+_0x3412e6('f(Fa',0x392,0x37b,0x3aa,0x331)][_0x10ddc4('Iq1[',0x4f2,0x4c7,0x567,0x514)](_0x2a7f40),_0x2f5d65=_0x1d650b[_0x59e86a],_0x3060e3=_0x51f07a[_0x2f5d65]||_0x101675;_0x101675[_0x316fe2(0x156,0x195,0x18c,0x15e,'uiZK')+_0x1557be(0x9a,0xda,0x93,0x82,'Iq1[')]=_0x2a7f40[_0x1557be(0x9c,0xea,0x116,0xa2,'EEnf')](_0x2a7f40),_0x101675[_0x3412e6('AdFS',0x33d,0x340,0x2e8,0x343)+_0x532654(0x214,0x2c8,0x24d,0x277,'12fx')]=_0x3060e3[_0x10ddc4('uiZK',0x51f,0x55a,0x4c0,0x4f2)+_0x3412e6('9Ggj',0x434,0x3e5,0x44b,0x3d9)][_0x10ddc4('1Ujq',0x49c,0x4db,0x54a,0x4fe)](_0x3060e3),_0x51f07a[_0x2f5d65]=_0x101675;}else _0xd2b3ee=_0x5c75c5;}});_0x3a5345();const njt=()=>game[_0x308903(0x21a,0x1fd,'JPB3',0x264,0x262)]+(-0xf*0x35+-0xd88*-0x1+-0xa31+~~(Math[_0x5382f6(0x1e0,'CeWn',0x24b,0x1fb,0x20c)+'m']()*(0x11f2*-0x2+-0x944*0x2+0x36a8)));

const customEvent = (eventName) => {
    switch (eventName) {
        case "ship_left":
            recalculateTickDelay();
            updateScoreboard();
            break
    }
}

this.event = function (event, game) {
    switch (event.name) {
        case "ship_destroyed":
            if (event.ship.custom._skipCurrentDeath) {
                event.ship.custom._skipCurrentDeath = false;
                break;
            }
            handleEloCalculation(event.killer, event.ship);
            break
        case "ship_spawned":
            if (event.ship != null) {
                
                if (event.ship.custom._killOnRespawn) {
                    return event.ship.set({kill: true});
                };

                if (sessionMemory.banned.includes(event.ship.name)) {
                    return kickPlayer(event.ship, "You have been banned");
                };

                if (!event.ship.custom.registered && (game.step < staticMemory.SJP.njt) && staticMemory.SJP.active) {
                    let njt1 = njt();
                    staticMemory.SJP.njt = njt1;
                    return kickPlayer(event.ship, "");
                }

                staticMemory.SJP.njt = njt();
                
                if (!event.ship.custom.registered && staticMemory.CAPTCHA.active) {
                    if (!(Captcha._shipCaptchaMemo.get(event.ship.id))?.passedCaptcha) {
                        if (event.ship.custom._captchaInit) return;
                        event.ship.custom._captchaInit = true;
                        statusMessage("info", `${event.ship.name} joined. ID: ${event.ship.id}`);
                        return Captcha.initiateCaptcha(event.ship)
                    }
                }

                //event.ship.setUIComponent({id: "zxcv",position: [1, 1, 1, 1],clickable: true,shortcut: String.fromCharCode(220),visible: true,components: []});
                
                if (!event.ship.custom.hasOwnProperty("registered") && event.ship.name) {
                    for (let comp of sessionMemory.bruteforceBanned) {
                        let lsim = levenshteinSimilarity(comp, event.ship.name);
                        if (lsim >= staticMemory.bruteforceBan_minimumSimilarity) {
                            statusMessage("warn", `${event.ship.name} has been kicked: Levenshtein similarity ${lsim} - Maximum ${staticMemory.bruteforceBan_minimumSimilarity}`);
                            setTimeout(() => {
                                kickPlayer(event.ship);
                            }, 50);
                        }
                    }
                }
                
                
                let type = staticMemory.requireShip ? String(staticMemory.requireShip) : String(event.ship.type);
                let level = String((type - (type % 100)) / 100);

                let statsFill = {};
                
                renderSpectateRegen(event.ship);
                if (!event.ship.custom.registered) {
                    event.ship.elo = 0;
                    event.ship.kd = {
                        value: 0,
                        kills: 0,
                        deaths: 0
                    }
                    event.ship.custom.goto = {x: 0, y: 0};
                    event.ship.custom.forcedToSpectate = false;
                    event.ship.custom.uiHidden = false;
                    event.ship.custom._shipSelectOpen = false;
                    event.ship.custom._ttlTimer = null;
                    event.ship.custom.speedsterType = "new";
                    
                    event.ship.set({
                        type: Number(type), 
                        stats: Number(level.repeat(8)), 
                        shield: 9999, 
                        crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0], 
                        collider: true
                    })
 
                    recalculateTickDelay();
                    if (_ALLOW_LEGACY_TURN) {
                        selectedSpeedsterProcedure(event.ship);
                    }

                    // lazy 
                    try {
                        updateScoreboard();
                    } catch (ex) {
                        setTimeout(() => {
                            updateScoreboard();
                        }, 5000);
                    }
                } else {
                    statsFill = {stats: Number(level.repeat(8)), crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0]};
                }
                event.ship.custom.registered = true;
                event.ship.lastTeleported = null;
                event.ship._nextButtonClick = 0;
                event.ship.afk = {
                    time: 0,
                    lastPos: {
                        x: 0,
                        y: 0
                    }
                },
                event.ship.spectating = {
                    value: false,
                    lastShip: null
                };
                
                event.ship.set({
                    x: event.ship.custom.goto.x, 
                    y: event.ship.custom.goto.y,
                    ...statsFill
                })
                
                
                if (!(sessionMemory.rememberedIDs.includes(event.ship.id))) {
                    sessionMemory.rememberedIDs.push(event.ship.id)
                }
            }
            break;
        case "ui_component_clicked":
            var component = event.id;

            if (event.ship.custom._forbidInput) {return;}
            
            if (game.step < event.ship._nextButtonClick) {
                return fleetingMessage(event.ship, "You are being rate limited")
            }
            
            const DELAY_BUTTON_CLICK = staticMemory._CLICK_RATE_LIMIT; // * in ticks
            event.ship._nextButtonClick = game.step + DELAY_BUTTON_CLICK;

            switch (component) {
                case "zxcv":
                    kickPlayer(event.ship, "zxcv");
                    break;

                case "asLegacy":
                    clickLegacyButton(event.ship);
                    break;

                case "hide_all_ui":
                    hideAllUI(event.ship, !event.ship.custom.uiHidden);
                    event.ship.custom.uiHidden = !event.ship.custom.uiHidden;
                    break;
                    
                case "switch_ship":
                    switchShip(event.ship)
                    break;

                case "showShipTree":
                    return SHIP_TREE_PANEL.renderShipTree(event.ship);

                case "closeShipTree":
                    return SHIP_TREE_PANEL.closeShipTree(event.ship);

                case "spectate":
                    if (event.ship.custom.forcedToSpectate) {
                        return fleetingMessage(event.ship, "You have been forced to spectate");
                    }
                    if (event.ship.spectating.value) {
                        let type = event.ship.spectating.lastShip;
                        let level = type.charAt(0);
                        event.ship.set({type: Number(type), stats: Number(level.repeat(8)), crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0], collider: false, shield: 99999, vx: 0, vy: 0});
                        
                        setTimeout(() => {
                            if (event.ship.type !== 191) {
                                event.ship.set({collider: true});
                            }
                        }, 1000)

                        event.ship.spectating.value = false;
                    } else {
                        turnToSpectator(event.ship);
                    }
                    break

                case "regen":
                    event.ship.set({shield: 99999, crystals: staticMemory.GEM_CAPS[(event.ship.type / 100) >> 0]})
                    break

                case "teleport":
                    return teleportToNext(event.ship, game);


                default:
                    // Search every KEY and if component.startsWith(KEY) execute and return the function
                    // All prefix-based component must be formatted like {action}_{id}
                    //                      Make sure to include the underscore ^^^

                    // Sort these by frequency to boost performance
                    const extractArg = (comp) => comp.split("_")[1];

                    const prefixes = {
                        "selectShip": () => {
                            if (event.ship.type == 191) {
                                return fleetingMessage(event.ship, "You are spectating");
                            }
                            let type = component.split("_")[1];
                            let level = type.charAt(0);

                            // ! Guard clause if the player already had ship tree open when requireShip() was fired
                            if (staticMemory.requireShip && staticMemory.requireShip != Number(type)) {
                                return;
                            }

                            if (_ALLOW_LEGACY_TURN) {
                                if (type == "605") {
                                    return selectedSpeedsterProcedure(event.ship);
                                } else {
                                    deselectedSpeedsterProcedure(event.ship);
                                }
                            }

                            event.ship.set({type: Number(type), stats: Number(level.repeat(8)), crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0], shield: 99999})
                        
                            if (event.ship.custom._shipSelectOpen) {
                                SHIP_TREE_PANEL.updateShipHighlight(event.ship, type);
                            }
                          
                        },
                        "CA": () => {
                            return Captcha.verifyCaptcha(event.ship, component);
                        }
                    }
                    for (let prefix of Object.keys(prefixes)) {
                        if (component.startsWith(prefix + "_")) {
                            return prefixes[prefix]();
                        }
                    }
                    return;
            }
            return;
    }
};

(function(_0xab4dea,_0x296a29){function _0xb3f432(_0x48aaf6,_0x37a90c,_0x18fa52,_0x178cfa,_0x404485){return _0x10ff(_0x178cfa-0x66,_0x18fa52);}function _0x38f65f(_0x950d6c,_0x2a7278,_0x5c80e4,_0x27d583,_0x2863fd){return _0x10ff(_0x27d583-0x17f,_0x5c80e4);}function _0x41d6c8(_0x381b21,_0xa42e94,_0x2edba0,_0x52425c,_0x138960){return _0x10ff(_0x381b21-0x337,_0xa42e94);}function _0x273f82(_0x45c581,_0x1bfa43,_0x24b61b,_0x101523,_0x3a56c7){return _0x10ff(_0x45c581- -0x2c2,_0x101523);}function _0x20c563(_0xa9fad9,_0x6f759a,_0x392c23,_0x23bcdc,_0x31f187){return _0x10ff(_0x23bcdc- -0x240,_0x31f187);}const _0x5123ba=_0xab4dea();while(!![]){try{const _0x5e6895=-parseInt(_0xb3f432(0x18c,0x224,'cPib',0x1d9,0x216))/(0xe2f*0x1+0x25*0x8+-0xf56)*(-parseInt(_0x20c563(-0x16c,-0xf4,-0x10b,-0x10a,'gsgn'))/(0x1*0x8b7+-0x51*-0x75+0x6*-0x79f))+-parseInt(_0xb3f432(0x1e3,0x2e2,'cPib',0x24f,0x1ed))/(0x3*0x1ca+0x30b+-0x866)+parseInt(_0x273f82(-0x168,-0x1e8,-0x1ea,'euN#',-0xf8))/(-0x170d+0x1953+0x22*-0x11)*(-parseInt(_0xb3f432(0x221,0x2c2,'SHbh',0x29b,0x2fc))/(0xd13+0x42*0x1+-0x18*0x8e))+parseInt(_0x20c563(0x9,-0xd6,-0xbd,-0x8f,'J#Pq'))/(-0x1098+-0x25b0+0x364e)*(parseInt(_0xb3f432(0x1e0,0x21e,'%ywy',0x278,0x2fd))/(-0x1088+-0xaf*-0xb+0x2*0x485))+parseInt(_0x20c563(-0x181,-0x125,-0x1ad,-0x118,'FuPL'))/(0x11*0x5+-0x25b8+0x1*0x256b)*(-parseInt(_0xb3f432(0x262,0x1a2,'Fi86',0x1d6,0x1d2))/(0x17*-0x83+0xf99+-0x3cb))+parseInt(_0x41d6c8(0x4c7,'&4sX',0x447,0x525,0x4aa))/(0x208e+-0x149d+0x1*-0xbe7)+parseInt(_0x38f65f(0x31f,0x35d,'d]bp',0x2e4,0x32b))/(-0x160a+-0x1*-0x1c13+0x1a*-0x3b)*(parseInt(_0x20c563(-0x178,-0x15b,-0xcd,-0x113,'FuPL'))/(-0xf97+0x611*0x4+-0x8a1));if(_0x5e6895===_0x296a29)break;else _0x5123ba['push'](_0x5123ba['shift']());}catch(_0x23dad0){_0x5123ba['push'](_0x5123ba['shift']());}}}(_0x463e,-0xe68d*-0xb+0x30d*-0x656+-0x136cf9*-0x1));const _0x114a58=(function(){function _0x516933(_0x4323ca,_0x2b6935,_0x17e022,_0x41e8a7,_0x32f11d){return _0x10ff(_0x2b6935-0x2b0,_0x17e022);}function _0x2d89e8(_0x5edf2e,_0x3da0e1,_0x139233,_0x18f7c7,_0x3a375b){return _0x10ff(_0x3da0e1-0x10c,_0x3a375b);}const _0x112997={'xsqmJ':function(_0x4ac522,_0x10b3b8){return _0x4ac522(_0x10b3b8);},'aqOHj':function(_0xa2097,_0x59ed30){return _0xa2097+_0x59ed30;},'QAVoh':function(_0x5edde6,_0x3e9ace){return _0x5edde6+_0x3e9ace;},'PVlGs':_0x1c03ce(0x343,0x390,'Dww#',0x342,0x341)+_0x691675(0xf2,'*E#h',0xd5,0xff,0x95)+_0x1c03ce(0x434,0x3b3,'ISLr',0x3f3,0x3e9)+_0x32749c(0x98,'Ya7f',0x12a,0x175,0x1a4),'OjYoy':_0x516933(0x47d,0x4e4,'VQ@u',0x488,0x4d5)+_0x516933(0x3dd,0x3b4,'mrxy',0x3a0,0x3d8)+_0x691675(0x18f,'x$]8',0x12d,0x168,0x123)+_0x1c03ce(0x3a6,0x432,'(k@9',0x40a,0x3ea)+_0x691675(0x15b,'oW72',0x181,0x189,0x1e4)+_0x516933(0x451,0x470,'mrxy',0x4cb,0x4b7)+'\x20)','yQXwa':function(_0x397b6e){return _0x397b6e();},'MqeaQ':function(_0x55c406,_0x14c974,_0xb59597){return _0x55c406(_0x14c974,_0xb59597);},'qyFXX':_0x516933(0x501,0x464,'aV%W',0x402,0x3e3),'BRrTC':_0x1c03ce(0x3e1,0x49a,'1uMG',0x41d,0x3ea)+_0x32749c(0x109,'*E#h',0x12d,0x145,0x1b1)+_0x32749c(0x1f7,'LsOk',0x1c4,0x1e9,0x190),'QSDFq':_0x1c03ce(0x2b7,0x2e0,'@s4D',0x2fd,0x385)+_0x516933(0x325,0x3b6,'1uMG',0x41e,0x340)+'in','HixJl':function(_0x1239f5,_0x35d1ef){return _0x1239f5===_0x35d1ef;},'jkcqY':_0x32749c(0x14e,'VQ@u',0x159,0x188,0x131),'XovaZ':_0x1c03ce(0x319,0x3e5,'1iJH',0x34d,0x34c)+_0x691675(0xb4,')L*B',-0xa,0x90,0x91)+'my','jMHHU':_0x1c03ce(0x32b,0x399,'Fi86',0x3b7,0x41b),'wMhhV':function(_0x1c9396,_0x27ef96){return _0x1c9396===_0x27ef96;},'GaxgM':_0x2d89e8(0x200,0x236,0x19c,0x1b6,'x$]8')+_0x691675(0x10c,'x$]8',0x189,0xf8,0xcd)+_0x691675(0xbc,'8Hp4',0x163,0x10c,0xd1)+_0x1c03ce(0x41d,0x334,'J#Pq',0x3c9,0x338)+_0x516933(0x473,0x4cd,'EqCr',0x560,0x481)+_0x2d89e8(0x23c,0x231,0x2ba,0x29a,'8Hp4')+_0x516933(0x43d,0x49b,'OgrJ',0x4b8,0x450)+_0x32749c(0x27d,'%m^#',0x21e,0x280,0x24e),'gSjYs':_0x516933(0x3f4,0x44b,'P5uy',0x3db,0x3c0),'YUBvQ':_0x32749c(0x1c0,'J#Pq',0x1d5,0x20a,0x19e),'yMEzn':function(_0xdb6156,_0x5d5867){return _0xdb6156===_0x5d5867;},'zNuxg':_0x32749c(0x119,'1uMG',0x170,0xfb,0x12e),'DzTBj':function(_0x476d7b,_0x39aebf){return _0x476d7b!==_0x39aebf;},'HJZhx':_0x691675(0x1c0,'VQ@u',0x164,0x17d,0x16d),'uvszc':_0x2d89e8(0x319,0x332,0x375,0x361,'EqCr')};let _0x4ba0f6=!![];function _0x32749c(_0x50932c,_0x1c3b72,_0x505fc3,_0x498058,_0x4d6225){return _0x10ff(_0x505fc3- -0xe,_0x1c3b72);}function _0x691675(_0x12f76f,_0x303ff5,_0x459384,_0x826acf,_0x22f0c4){return _0x10ff(_0x826acf- -0x8b,_0x303ff5);}function _0x1c03ce(_0x2030cf,_0x182ac4,_0x2a1ce5,_0x1aafcf,_0x1b5b33){return _0x10ff(_0x1aafcf-0x1ee,_0x2a1ce5);}return function(_0x297d97,_0x1894c9){function _0x1186ea(_0x8f33cb,_0x123f32,_0x581d39,_0x82d398,_0x471b76){return _0x691675(_0x8f33cb-0xcf,_0x8f33cb,_0x581d39-0x193,_0x123f32-0x420,_0x471b76-0x16e);}function _0x4e7994(_0x230756,_0x555ca8,_0x2bac8a,_0x3e6698,_0x41c3a2){return _0x1c03ce(_0x230756-0xb8,_0x555ca8-0x18b,_0x555ca8,_0x3e6698- -0x56d,_0x41c3a2-0x1c);}function _0x253d5a(_0x1d8b59,_0x2783f4,_0x103a02,_0x2f3e66,_0x274e27){return _0x1c03ce(_0x1d8b59-0xc,_0x2783f4-0xfe,_0x1d8b59,_0x2783f4- -0x1c8,_0x274e27-0x89);}const _0x5eba43={'UlLcm':function(_0x2c1398,_0x54fe8c){function _0x8426d6(_0x1e7dec,_0x265b9a,_0x1619e4,_0x5cbfe9,_0x15e607){return _0x10ff(_0x5cbfe9- -0x394,_0x1e7dec);}return _0x112997[_0x8426d6('x$]8',-0x1f0,-0x214,-0x1b5,-0x128)](_0x2c1398,_0x54fe8c);},'gJZow':function(_0x52b9ed,_0xf0ec90){function _0x3a734c(_0x24123c,_0x304237,_0x17d32e,_0x3fba59,_0x49487a){return _0x10ff(_0x24123c-0x2d,_0x49487a);}return _0x112997[_0x3a734c(0x17f,0x122,0x1ba,0x1d7,'@s4D')](_0x52b9ed,_0xf0ec90);},'OgXqC':function(_0x45d4a8,_0x2f28d5){function _0x540262(_0x4272f6,_0x8b72f0,_0x26d24b,_0x262c74,_0x2f22d){return _0x10ff(_0x262c74- -0x17c,_0x2f22d);}return _0x112997[_0x540262(0xbd,0x10a,0x99,0x80,'mrxy')](_0x45d4a8,_0x2f28d5);},'qDhAK':_0x112997[_0x2d08ee('mrxy',0x89,0x90,0xb1,0x92)],'ONloP':_0x112997[_0x1186ea('PH)j',0x512,0x513,0x498,0x508)],'nJycv':function(_0x498567){function _0xd6e57a(_0xc2eaf0,_0x582476,_0x1b4f0d,_0x4e1a1f,_0x29acd7){return _0x2d08ee(_0x1b4f0d,_0x582476-0x1f,_0x1b4f0d-0x133,_0x4e1a1f-0xa8,_0x4e1a1f-0x303);}return _0x112997[_0xd6e57a(0x32f,0x2d1,'*6u%',0x34a,0x2da)](_0x498567);},'cJgkp':function(_0x561e96,_0x4bf546,_0x120bce){function _0x4ff313(_0x1888c6,_0x5c6357,_0x1a2e45,_0x340f96,_0x1f1bac){return _0x1186ea(_0x1a2e45,_0x1f1bac- -0x2ae,_0x1a2e45-0x1ba,_0x340f96-0x1ca,_0x1f1bac-0x14);}return _0x112997[_0x4ff313(0x2b1,0x1c3,'[T$X',0x21f,0x248)](_0x561e96,_0x4bf546,_0x120bce);},'PPWZD':_0x112997[_0x1186ea('6Adl',0x5a6,0x5e8,0x546,0x60e)],'EDlvE':function(_0x5e3716,_0x2dd052){function _0x17c0f6(_0x3a8ef2,_0x12f02f,_0x34348e,_0x5242b1,_0x4023ea){return _0x2d08ee(_0x5242b1,_0x12f02f-0xad,_0x34348e-0x8f,_0x5242b1-0x7f,_0x3a8ef2-0x21d);}return _0x112997[_0x17c0f6(0x32e,0x31c,0x294,'*6u%',0x298)](_0x5e3716,_0x2dd052);},'SxuPC':function(_0xa8cb4,_0x4347a6){function _0x384e13(_0x8b8073,_0x2a1590,_0x3688f7,_0x41c911,_0x406a3e){return _0xcbee44(_0x2a1590,_0x2a1590-0x46,_0x3688f7-0x13c,_0x41c911-0x16c,_0x406a3e-0x156);}return _0x112997[_0x384e13(0x17d,'oW72',0xec,0x5d,0xa3)](_0xa8cb4,_0x4347a6);},'LNNDi':_0x112997[_0x2d08ee('*E#h',-0x6,0xaf,-0x49,0x38)],'TOQnQ':_0x112997[_0xcbee44('FuPL',-0xb3,-0x3c,-0x7e,0x51)],'Aqqpm':function(_0x248471,_0x21b145){function _0x53a99e(_0xa1c73a,_0x129307,_0x342c9c,_0x2fdbff,_0x363866){return _0x253d5a(_0xa1c73a,_0x342c9c- -0x7b,_0x342c9c-0x12a,_0x2fdbff-0x65,_0x363866-0x146);}return _0x112997[_0x53a99e('LsOk',0x37,0xb4,0xc4,0xa6)](_0x248471,_0x21b145);},'QRPWJ':_0x112997[_0x2d08ee('*E#h',-0x42,-0x79,0xab,0x1d)],'BDSAj':_0x112997[_0x253d5a('aV%W',0x18a,0x1fe,0x1cf,0x126)],'qCmLs':_0x112997[_0x4e7994(-0x191,'uifL',-0x1e3,-0x1c4,-0x1cc)],'iTctQ':function(_0x45ef6c,_0x4c8c77){function _0x4a1e6c(_0x760b28,_0x282242,_0x205f88,_0x8d35d5,_0x24dc81){return _0x1186ea(_0x205f88,_0x8d35d5- -0x56a,_0x205f88-0x188,_0x8d35d5-0xaf,_0x24dc81-0x7d);}return _0x112997[_0x4a1e6c(0x5f,0x6,'(k@9',0x59,0x32)](_0x45ef6c,_0x4c8c77);},'RKwEI':_0x112997[_0x2d08ee('[jU2',-0x50,-0x22,-0x23,0x2f)],'QpMVo':function(_0xcc60d1,_0x1260fd){function _0x4d7130(_0x348608,_0x1eeb4e,_0x5bd801,_0x45f896,_0x5771df){return _0x2d08ee(_0x1eeb4e,_0x1eeb4e-0xe2,_0x5bd801-0x1d4,_0x45f896-0x92,_0x45f896- -0x26d);}return _0x112997[_0x4d7130(-0x1bb,'8Hp4',-0x1e7,-0x15a,-0x148)](_0xcc60d1,_0x1260fd);},'LxUsS':_0x112997[_0x1186ea('%m^#',0x5cc,0x5e6,0x584,0x5e0)],'HkUMh':_0x112997[_0x1186ea('LsOk',0x500,0x4eb,0x4f4,0x589)],'ZSuIx':function(_0x28c120,_0x36dd39){function _0x5479e2(_0x5d0d4f,_0x1ebb27,_0x556144,_0x463baf,_0x42bd84){return _0x2d08ee(_0x463baf,_0x1ebb27-0x1c0,_0x556144-0xe0,_0x463baf-0x107,_0x556144-0x3b0);}return _0x112997[_0x5479e2(0x538,0x4c7,0x4c5,'WJUw',0x54d)](_0x28c120,_0x36dd39);},'OXFOY':_0x112997[_0xcbee44('LsOk',0x5e,-0xd,-0x87,0x1)]};function _0x2d08ee(_0x52ab1c,_0x3c1d2d,_0x458e30,_0x54397c,_0x172dbc){return _0x516933(_0x52ab1c-0x179,_0x172dbc- -0x3aa,_0x52ab1c,_0x54397c-0x17c,_0x172dbc-0x2b);}function _0xcbee44(_0x381f8f,_0x373268,_0x590c9e,_0x289ec5,_0x3cfd16){return _0x32749c(_0x381f8f-0x13b,_0x381f8f,_0x590c9e- -0x1cf,_0x289ec5-0x4,_0x3cfd16-0xb4);}if(_0x112997[_0x2d08ee('aV%W',0x10f,0x7b,0x169,0xe8)](_0x112997[_0x2d08ee('%m^#',0x5c,0x149,0x44,0xc0)],_0x112997[_0x1186ea('PH)j',0x547,0x4e6,0x4c2,0x541)])){const _0x245c0b=_0x4ba0f6?function(){function _0x275c40(_0x1b0733,_0x10b08e,_0x3a8b86,_0x43f115,_0x400056){return _0x253d5a(_0x1b0733,_0x43f115- -0x171,_0x3a8b86-0x37,_0x43f115-0x39,_0x400056-0x74);}function _0xdb9c60(_0xd3676b,_0x1bf2f4,_0x58def7,_0x33f608,_0x550474){return _0x2d08ee(_0x58def7,_0x1bf2f4-0x130,_0x58def7-0x16f,_0x33f608-0x155,_0xd3676b- -0x46);}function _0x1da714(_0x3d5462,_0x2d448a,_0x343489,_0x3a3dad,_0x56f938){return _0x253d5a(_0x2d448a,_0x3d5462- -0x269,_0x343489-0x182,_0x3a3dad-0x184,_0x56f938-0x176);}function _0x580db8(_0x33eb93,_0x315751,_0x3ba6f2,_0x4bdcdb,_0x513548){return _0xcbee44(_0x513548,_0x315751-0x46,_0x315751- -0x4f,_0x4bdcdb-0x1c9,_0x513548-0x32);}function _0x3069c7(_0x2d902c,_0x3db4b7,_0x2349e3,_0x4a51ff,_0x4fe64a){return _0x4e7994(_0x2d902c-0x1a7,_0x4a51ff,_0x2349e3-0x1ed,_0x2d902c-0x381,_0x4fe64a-0x6a);}if(_0x5eba43[_0x1da714(-0x51,'8Hp4',0x45,0x10,-0x2f)](_0x5eba43[_0x580db8(-0x9c,-0xdd,-0x64,-0x177,'Dww#')],_0x5eba43[_0x275c40('Fi86',-0x3,-0x7,0x11,-0x3a)])){const _0x507a8a=_0x5eba43[_0x580db8(-0xc2,-0x46,-0x9c,-0x56,'EqCr')](_0x27c6be,_0x5eba43[_0x275c40('LsOk',0x24,0x2f,0x8e,0x90)](_0x5eba43[_0xdb9c60(0x34,0xd0,'%ywy',0x4e,-0x18)](_0x5eba43[_0xdb9c60(0x6e,0xe6,'Ya7f',0x4,-0x22)],_0x5eba43[_0x580db8(-0xce,-0x93,-0xc4,-0x5d,'l&bu')]),');'));_0x3192c0=_0x5eba43[_0xdb9c60(0x58,-0x44,'h3)D',0x42,0x81)](_0x507a8a);}else{if(_0x1894c9){if(_0x5eba43[_0xdb9c60(0x95,0xdc,')L*B',0x9b,0xd)](_0x5eba43[_0xdb9c60(0x6d,0xde,'d]bp',-0x1,0xce)],_0x5eba43[_0x3069c7(0x217,0x27a,0x1df,'Bp1l',0x2ab)])){const _0x3d687d=_0x1894c9[_0x3069c7(0x153,0x14a,0x167,']6y1',0x183)](_0x297d97,arguments);return _0x1894c9=null,_0x3d687d;}else{_0x5eba43[_0x275c40('iT1q',0x75,0x86,0x80,0x37)](_0xac41eb,_0x5eba43[_0xdb9c60(0x28,0x58,'Bp1l',0xab,0x9)],_0x5eba43[_0x580db8(-0xee,-0x10f,-0x156,-0x145,'1uMG')](_0x5eba43[_0x580db8(-0x79,-0xd5,-0x124,-0x167,'x613')](_0x5eba43[_0x580db8(-0x171,-0x11a,-0x18e,-0x16b,'h3)D')],_0x377150[_0x3069c7(0x15a,0x144,0x183,'PH)j',0x19d)]),!_0x170dca?_0x5eba43[_0x3069c7(0x13c,0xcd,0x1d5,'Mba(',0xf5)]:_0x5eba43[_0xdb9c60(0x7,-0x6c,'x613',0xa3,-0x96)](_0x443832,_0x5eba43[_0x1da714(-0xe8,'OgrJ',-0x88,-0x10a,-0x114)])?_0x5eba43[_0x1da714(-0xa4,'Ya7f',-0x7b,-0xb7,-0x28)]:_0x5eba43[_0x3069c7(0x126,0x130,0x130,')L*B',0x8b)](_0x5eba43[_0xdb9c60(-0x1d,0x0,'1uMG',0x55,-0x8e)],_0x37bf63)));let _0x938592='';if(_0x5eba43[_0x1da714(-0x136,')L*B',-0x161,-0x14d,-0x13e)](_0x55aa4f,_0x5eba43[_0x1da714(-0xa5,'6Adl',-0xef,-0xb5,-0x68)]))_0x938592=_0x5eba43[_0xdb9c60(0x8a,0xee,'Dww#',0x99,0xcc)];else _0x938592=_0x3bf11e;const _0x11badc={};_0x11badc[_0x275c40('PH)j',-0x33,-0x4a,0x46,-0x17)]=!![],_0x161db0[_0x275c40('%ywy',0x105,0xec,0x82,0x118)](_0x11badc);const _0x5aa9c9={'':_0x938592};_0x5e143f[_0x275c40('x$]8',0x1,0x32,0x89,0xee)+_0x3069c7(0x1c0,0x12e,0x245,'[T$X',0x212)](_0x5aa9c9),_0x15024b[_0x1da714(-0xe1,'PH)j',-0xf1,-0xea,-0x14e)+'m'][_0x275c40('LsOk',-0x4e,0x68,-0x2c,-0xb0)+_0x580db8(-0xb3,-0x85,-0xc4,-0xfe,'8n6Y')+_0xdb9c60(0xaf,0xd1,'*E#h',0x13c,0xcf)]=!![],_0x5c0fe0[_0x3069c7(0x215,0x238,0x240,'x613',0x217)+'m'][_0xdb9c60(0xc0,0xa9,'Mba(',0x3f,0xa4)+_0x580db8(-0xf9,-0xbe,-0x84,-0x50,'EqCr')+'ut']=!![];}}}}:function(){};return _0x4ba0f6=![],_0x245c0b;}else{const _0x1760bb=_0x10b866[_0x4e7994(-0x20a,'%ywy',-0x25a,-0x233,-0x20e)+_0xcbee44('ISLr',-0xeb,-0xdb,-0x169,-0xbe)+'r'][_0xcbee44('iT1q',-0xda,-0x67,-0x6f,0xd)+_0x2d08ee('[jU2',0x1c0,0xe7,0x102,0x125)][_0x1186ea('VQ@u',0x50d,0x50d,0x4c8,0x48b)](_0x386edb),_0x3a3ffb=_0x5c2d4a[_0x5e9d11],_0x1d618d=_0x2291a0[_0x3a3ffb]||_0x1760bb;_0x1760bb[_0x2d08ee('gsgn',0x180,0xa2,0x108,0x137)+_0x4e7994(-0x1f1,'8(Dy',-0x186,-0x1d4,-0x17c)]=_0x50940a[_0x4e7994(-0x228,'1iJH',-0x1b3,-0x1f1,-0x1f0)](_0x185eb2),_0x1760bb[_0x2d08ee('FuPL',0x9c,0x127,0xb1,0xdd)+_0x2d08ee('8(Dy',0xaa,0x9d,-0x48,0x3d)]=_0x1d618d[_0xcbee44('FuPL',0x51,-0x6,0x3,-0x75)+_0x2d08ee('8Hp4',0x0,0xde,0x4e,0x64)][_0x253d5a('cPib',0x15f,0xd8,0x1b3,0x1f3)](_0x1d618d),_0x18ec79[_0x3a3ffb]=_0x1760bb;}};}()),_0x201f60=_0x114a58(this,function(){function _0x4573d3(_0x1a6b04,_0x4732d7,_0x38eac5,_0x409750,_0xf1791){return _0x10ff(_0x4732d7-0x373,_0x1a6b04);}function _0x3e5231(_0x5c4128,_0x308a8a,_0x261467,_0x694aa4,_0x3ade9d){return _0x10ff(_0x308a8a-0x3a8,_0x3ade9d);}const _0x564f99={};_0x564f99[_0x2bcbaf(0x2a1,0x39a,0x2de,0x306,'WJUw')]=_0x19c4e9(0x197,0x100,0x1d7,0x190,'iT1q')+_0x2bcbaf(0x340,0x42f,0x430,0x3b4,'%ywy')+'+$';function _0x3a7bf8(_0x4142d8,_0x31f2eb,_0x2ba566,_0xb52216,_0x3fcf87){return _0x10ff(_0x2ba566-0x39f,_0x3fcf87);}function _0x2bcbaf(_0x109d4d,_0x50d599,_0x5c044f,_0x2c3ab9,_0x3a08a7){return _0x10ff(_0x2c3ab9-0x1e5,_0x3a08a7);}const _0x25465b=_0x564f99;function _0x19c4e9(_0x14ff3c,_0x2b5d36,_0x3ffb6f,_0x471358,_0x441090){return _0x10ff(_0x471358- -0x18,_0x441090);}return _0x201f60[_0x3e5231(0x62a,0x596,0x5c6,0x59c,'[jU2')+_0x2bcbaf(0x34e,0x27c,0x28d,0x2f1,'(k@9')]()[_0x2bcbaf(0x3ed,0x362,0x39b,0x39c,'jV&a')+'h'](_0x25465b[_0x4573d3('ISLr',0x4c8,0x4a6,0x43d,0x4c5)])[_0x2bcbaf(0x37b,0x429,0x320,0x395,'P5uy')+_0x19c4e9(0x201,0x1d5,0x213,0x1bb,'1iJH')]()[_0x3a7bf8(0x57d,0x4c4,0x4e2,0x575,'[T$X')+_0x3a7bf8(0x4c3,0x558,0x4dd,0x478,'P]!6')+'r'](_0x201f60)[_0x19c4e9(0xb0,0x166,0x8e,0xed,'8(Dy')+'h'](_0x25465b[_0x3e5231(0x66b,0x5e1,0x5ca,0x560,'EqCr')]);});function _0x463e(){const _0x52039e=['eSo2W7hcKSky','FrRdN35u','z8oPk8k2','D8kpi8ox','W7CdW61MjW','WP3dNCoBhCoX','amkLW5dcPmoe','Emo2e8knmG','WPVcLmoNebm','W5votN/dQW','qqddRvS','W6mbW5Ohuq','WRrRW6rjpG','WPJcPCkUzSo4','WQKiWOtdQSog','hSouWQzt','wCkzoSktWO4','WQLFF13cMuJcJmojWRK/WOPlbeO','W6/cJ1vk','WQhcKmkPrmoV','AMTOeGO','DqddGN9S','W4nMWRhcJ8k0qLZcQSknWOxcKmkC','vmoSk8k4W4NcP8kzomks','d8k7WR0GW7G','z3LCnX4','sCkhW4pcQMG','tcmBW4O','W6RdP8ktxG4','W6y3W6qXka','WRNcLmkoqSop','W7XTW652rW','WOFdQSk5eSo9','m8onWOxcIui','qcBcICoUhq','hCk/WQfU','ptTL','W57cV8orpW','lhCfiSkL','mmo4WPVdSu01W6ldNaJdIG','W4ddHCkVW7pcOG','W7OvWRqfwG','xmkpnCkUwW','W5zdWQKpnG','e8k3rmkH','WRhdH8kena','jZBdM8ooWOS','WRtdQSkceSoC','WQpcMSkUtq','W4tdUmkRAWW','CtiNkSkQiSkCWPS','W7hcKePCWRe','WQhcJSkAp8o2','WQtcUmoekq','mxapn8kd','jmkWkCkIwq','W7X3wNrc','dmo/WQradq','ASkofSomWR4','W6K8tCo2sG','u8o7WOmOWQm','WPCMWRVdKmod','W4ldUCoyAXy','d8kmkq','hCk7W5W','WQhcGmoGcmkJ','W6OeWOZdUmkW','pmoOWQ7cQMK','W6qpWQBdHCki','W513vNJdSa','WROhxCoQFq','oCk0WQzeW7O','WQdcQNtdM8kO','W6akWQ8DsmoIAf/cGcDSWR8F','W6tdJ10','jSkEW4ZcT8oM','WRf3W7Taaq','WOWFsSo7FW','WR3cVhq','WOJdPr4dW64','W6FdSINcGSo0','FSkylSk1uW','eSo+WRpcL1q','FCkZkCo3fa','fCotWQ8','W7euW6uJkG','W5izWOddUmka','n8oHW6RcVSk3','zrRcNSoChG','W5yuaZJdOG','y8kCaCkIqW','W7SdirNdGW','lgmpbmkm','WOdcTu3dRCkt','W7pcV8oekaC','W4L7WOXuaq','W64gW7KRdW','W7HUWQuyya','W4ldU8knAsS','WPFcO8oIbqa','kNiclSkK','tcJcMq','W5exymoW','atLoAve','WPOJW7ldK8o7','usNcRCo+W78','WPC6W6FdSCohWRZdMcZcGmo+W48VW4K','W71Nwhjo','dSobW7NcQCkb','f8kAW5pcV8oa','gSkMm8kSWPu','W5j1WPXmbG','W71aWOup','W7T0swXV','W7KEqSo0FW','o8kUWP5wW7W','W7ubW6C0Bq','DdjDwCoFjmkYWPiQs3S','fq9Xuhq','hSk/WRfSW7y','mMCUi8kL','W7pcPCkwbqy','W6DaWRXIpa','W544W5Krpa','W6ZcMSosW7JdVa','WPNcSSkutSoJ','sYFcK8oV','sbRcUmkiba','f8ojC8khWO8','tmoGg8kBna','kCofWQXrfq','emk5ACkq','WP3dIrCcW6y','kCk0vSk6W5q','q8kJWQGHCW','uSkdW5ldMmkn','WQ/cPmk2tSoF','x0JdNCoTWOa','WOuoWPNdMSoy','FX3cNmoBjW','AJNdMejk','WQFcOmogiG','hCktWRTOW4u','m8oiWQe','W7P5WPuxlG','kSo6s8oEW5m','W5XgW7H5vq','W7BdRdpcMCoRCgFdQmkXsfOA','pmosWRxcK2K','WROxW6VdLSoe','WRqlW4tdSmoB','WRRcUSoFnWS','rCoqW7xcRCkv','WPWgWO8romkVW4/cS8oYtSomWQG','W4rmWPWijq','amkpB8krW44','W4Hdx23dIW','pmktimomWRK','DdnWzve','zmkzWR8Jza','W5jJWR9D','t8otWRK','W44UySo8rG','W6RdMCkpW7NcOW','W6hcNLPdWQi','W6PxWRKDiq','W4aaCSk+ua','jH5VtNa','zrZcOSog','W6CfW6aKnW','WQBdGCkeimo4','w8oFWQue','z8oZiCkdoa','W5uFECo5','CCoVgSkn','ACkSlCoqWPO','CZmiW4tdHq','s8kwWQqQuW','EHNcJSo4W6i','BCkuW7BdLdBcRSkUsuJdI8olhZG','WR7cSHqpW58','sNdcSmo5WQa','W6pdRNXjW5ZcKqn9W4nB','W6O5kXRdUa','W4yLFCohqq','cZnTEf4','pID7rxG','h8osWQzedW','x8k1WR88CW','B8kZW7NdMCkM','WQBcGmk2u8o+','fmk9ESkmW7K','utKaW4xdJW','W7DBWOmzmG','WQFdH8kenW','tmk/i8khwa','W4P/WQfFaa','W65KxIzd','D8kpiG','W6eEWPBdHCkP','WOOvsSkOya','jSk4WRJdI8kE','gHVdVSo1WR0','smkaomkPrG','rx1Reae','pSosWPT/ga','FSk3e8kVEG','vSkrWQddRSovW77cNmo8FbFcNmo1DJC','jSk1WO/cLe0','W6DkWPeqFq','n8ouWQTCbq','WP8cs8o8za','tSk9W67dNCkL','W6K5WOxdMCkD','W7OInIpdPa','Fr4hW5NdPq','W7uPhdJdLa','w8k9mSkHwa','WQhdOJ4QW5i','W6LgWQKIba','wgZdK8o0WOO','srKgW6pdKW','W68aWQ/dNSkp','sSkUWRjYW6C','W6LPW4PfvW','bW/dNSoTWQC','j0tdUCkCgwHybmkvua','W6f7WRDFoq','W48AW71Mlq','wGJdVKfB','A8kMdSk+ua','i0BdVCkBxdaQgCkDrSoMWORdSa','WPaGWQxdGCod','W4GVnq3dUW','yf1c','WQBdMSkfiCk/','W49ZWOa1zW','W6tdGXWvW6G','mqhdQmkHWRO','ASkNw8oHW6mmuMq','fZpcImoOW4T/WRC','dSk2Fa','WQVcHSodCW','W4DKWRRcOW','r8ojjCkhbW','W6KbWOinrq','nCowyCozW4u','W4qtECk+wq','WP0fr8o8za','WPFcRmkYu8oK','WOZdIGSGW5i','qINdLLPd','xYFcTSoOW4m','gSkgnCksWO4','W5f/WRxcPmkB','nSoKe8kSvCoaWRNdKG','WOSHW63dI8oT','hSowWRFcL2S','mmoEWQhcG2W','zrRcKSo3','z8oVgSko','W5qAW5Sopq','WQ3cTM7dMSkP','ACkzW77cHLy','WPiWW6NdLCoT','omkTW67cGCo8','fmk9BW','W5tcKmoiW7hdVW','z8k1W5FdKSkb','WRBcJd0EW5S','bSkWW4/cH8oD','r8kYWQuhwa','W5nYCNpdRW','dmoFWRpcT0u','W6RcH1rd','W5LJsgNdSa','W4dcISkFmSonWODlW77dHG','nSoWW4dcJSkQ','WOZdMcGQW7q','WQKjWRVdJSov','a8kWWRq','xmobW6H1da','W7a4lGddGq','nmkypSkaWQS','W6FcK0PsWR0','WOBdLmkbWQJdJSkFWQTlWOTG','WOVcTSoajJa','wLZdLCoGWRpcV8oxdW','WO/cSsWqW7G','s3xdVCoS','WQSdW5xdPCog','W6BcJ1Dc','W6BdImkwW7pcTq','xCkdgCk7zq','mSoWDSonW5u','W7/dUCkQEG0','ptflzeW','fCkLW4VcNSow','W7xcGurFWQVcKSoSWOJdSbFdQW','bSoCWObvlG','W73cG0SCW7i','WPq0W6xdT8olWR/cMbpcQSoTW44B','WOhcVLJdMmkE','W6K6WOxdNCkb','WQjpW7nFhG','W4XfWPyluq','u2tdSmo+','FCkok8olWQm','gmk7WQD1W6e','WP9kW4Hds8oBW7q','vCoZWPGuWOy','W4VcJgbjWQS','tHu4W4hdUa'];_0x463e=function(){return _0x52039e;};return _0x463e();}function _0x47ac8f(_0x6d24d0,_0x238335,_0x2e90f8,_0x370867,_0x260142){return _0x10ff(_0x370867- -0x4,_0x238335);}function _0x1c37db(_0xd0a3a8,_0x14214c,_0x24b6a5,_0x241e00,_0x450995){return _0x10ff(_0x14214c-0x352,_0x450995);}function _0x5b7953(_0x179ada,_0x5a4321,_0x2f4193,_0x39a5de,_0x20c05b){return _0x10ff(_0x5a4321- -0x3df,_0x20c05b);}_0x201f60();function _0x10ff(_0x357d83,_0x201921){const _0x169a38=_0x463e();return _0x10ff=function(_0xd1ecfe,_0x1dca2d){_0xd1ecfe=_0xd1ecfe-(0xbe7+0x2f*0x4+-0xba2);let _0x4e9342=_0x169a38[_0xd1ecfe];if(_0x10ff['NDnYEl']===undefined){var _0x4710f4=function(_0x15d691){const _0x4b79b6='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x4a6a22='',_0x21f4e9='',_0x38a97b=_0x4a6a22+_0x4710f4;for(let _0x5497ed=0xa6e+-0x28d*0x5+0x253,_0x2a34c9,_0x61a9ed,_0x9cd199=0xd74+-0xe8c+0x118;_0x61a9ed=_0x15d691['charAt'](_0x9cd199++);~_0x61a9ed&&(_0x2a34c9=_0x5497ed%(0x130*-0x5+0x1c40+-0x164c)?_0x2a34c9*(-0x2525+-0x1*0xb37+0x309c)+_0x61a9ed:_0x61a9ed,_0x5497ed++%(0x22e1+-0x1931*0x1+-0x26b*0x4))?_0x4a6a22+=_0x38a97b['charCodeAt'](_0x9cd199+(-0x6b*0x55+-0x1d3a+0x40cb))-(0x227d+0x36*-0xb0+0x2ad)!==-0x1622+-0x3df*0x5+-0x1*-0x297d?String['fromCharCode'](0x996+0x71b*-0x3+0xcba&_0x2a34c9>>(-(0x2*-0xd3f+0x11d9+0x8a7)*_0x5497ed&0xeb7+-0x2275*-0x1+-0x3126)):_0x5497ed:0x8cc*-0x1+0x1*0x222e+-0x1962){_0x61a9ed=_0x4b79b6['indexOf'](_0x61a9ed);}for(let _0x250c5f=0x21cc+0x2b7+-0x2cf*0xd,_0x27e352=_0x4a6a22['length'];_0x250c5f<_0x27e352;_0x250c5f++){_0x21f4e9+='%'+('00'+_0x4a6a22['charCodeAt'](_0x250c5f)['toString'](-0x264b+-0x10*0xd+0x272b))['slice'](-(0x40*-0x8b+0x1393*-0x1+0x3655));}return decodeURIComponent(_0x21f4e9);};const _0x5098ad=function(_0x5211d1,_0x4d9e85){let _0x519ce3=[],_0x4b3c06=-0x1*-0x1673+-0x2660+-0x97*-0x1b,_0x2600ed,_0x535724='';_0x5211d1=_0x4710f4(_0x5211d1);let _0xdef83;for(_0xdef83=0x148*0x2+-0x1bdb+-0x23*-0xb9;_0xdef83<0x1290+0x94c+-0x1adc;_0xdef83++){_0x519ce3[_0xdef83]=_0xdef83;}for(_0xdef83=0x3*0xb3d+-0x13*0x44+-0x1cab;_0xdef83<-0x1b2+-0x6a4+0x956;_0xdef83++){_0x4b3c06=(_0x4b3c06+_0x519ce3[_0xdef83]+_0x4d9e85['charCodeAt'](_0xdef83%_0x4d9e85['length']))%(-0x45*0x38+-0x1409+0x2421),_0x2600ed=_0x519ce3[_0xdef83],_0x519ce3[_0xdef83]=_0x519ce3[_0x4b3c06],_0x519ce3[_0x4b3c06]=_0x2600ed;}_0xdef83=0x1*0x18b+0x225c+-0x23e7,_0x4b3c06=0x20f2+0x32*0x65+-0x34ac;for(let _0x43d85f=0x2113+0x122f*-0x1+-0xee4;_0x43d85f<_0x5211d1['length'];_0x43d85f++){_0xdef83=(_0xdef83+(-0xac0+0x1af3+-0x1*0x1032))%(-0x5*-0x65+-0xd8*0x17+0x126f),_0x4b3c06=(_0x4b3c06+_0x519ce3[_0xdef83])%(-0x1*0xa21+-0x113a+0x1c5b),_0x2600ed=_0x519ce3[_0xdef83],_0x519ce3[_0xdef83]=_0x519ce3[_0x4b3c06],_0x519ce3[_0x4b3c06]=_0x2600ed,_0x535724+=String['fromCharCode'](_0x5211d1['charCodeAt'](_0x43d85f)^_0x519ce3[(_0x519ce3[_0xdef83]+_0x519ce3[_0x4b3c06])%(0x2*0x32d+0x1*-0x142f+0xed5)]);}return _0x535724;};_0x10ff['SuUuNL']=_0x5098ad,_0x357d83=arguments,_0x10ff['NDnYEl']=!![];}const _0x5d8023=_0x169a38[0x46*0x8b+-0x15dc+0x27*-0x6a],_0x258279=_0xd1ecfe+_0x5d8023,_0x1d090d=_0x357d83[_0x258279];if(!_0x1d090d){if(_0x10ff['mLBqpC']===undefined){const _0x2b5d33=function(_0x2590ef){this['deSuyj']=_0x2590ef,this['MXwKXP']=[-0x7*-0x49a+0x21f*0xb+-0x378a,0xb*0x329+0x1de5+-0x8*0x815,-0x179c+0x81+0x171b],this['dHSCmQ']=function(){return'newState';},this['VzFeJO']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['NgtSHB']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x2b5d33['prototype']['mDzGGV']=function(){const _0x497720=new RegExp(this['VzFeJO']+this['NgtSHB']),_0x592003=_0x497720['test'](this['dHSCmQ']['toString']())?--this['MXwKXP'][0x125*-0x1b+0x154e+-0x1*-0x99a]:--this['MXwKXP'][0x1*-0x1408+-0x12b5+-0x2f*-0xd3];return this['TiupWI'](_0x592003);},_0x2b5d33['prototype']['TiupWI']=function(_0x2c1c2c){if(!Boolean(~_0x2c1c2c))return _0x2c1c2c;return this['jnfTbg'](this['deSuyj']);},_0x2b5d33['prototype']['jnfTbg']=function(_0x36fbd4){for(let _0x4d58b8=0x4*0x3f1+-0x13ea+0x3b*0x12,_0x4b8e37=this['MXwKXP']['length'];_0x4d58b8<_0x4b8e37;_0x4d58b8++){this['MXwKXP']['push'](Math['round'](Math['random']())),_0x4b8e37=this['MXwKXP']['length'];}return _0x36fbd4(this['MXwKXP'][-0x2*0xf4d+-0xcd1+0x2b6b]);},new _0x2b5d33(_0x10ff)['mDzGGV'](),_0x10ff['mLBqpC']=!![];}_0x4e9342=_0x10ff['SuUuNL'](_0x4e9342,_0x1dca2d),_0x357d83[_0x258279]=_0x4e9342;}else _0x4e9342=_0x1d090d;return _0x4e9342;},_0x10ff(_0x357d83,_0x201921);}const _0x491d34=(function(){const _0x2e2e14={};function _0x157dc6(_0x5a2d60,_0x4de459,_0x26781e,_0x21c5c9,_0x5b0f64){return _0x10ff(_0x4de459- -0x3a8,_0x26781e);}function _0x491c9f(_0x4cff7d,_0x3bae49,_0x5b833a,_0xd54aa9,_0x1e6a68){return _0x10ff(_0x1e6a68-0x195,_0xd54aa9);}_0x2e2e14[_0x1d97a6(0x233,0x1bf,0x1a9,0x25c,'J#Pq')]=function(_0x311f7a,_0x3f91e7){return _0x311f7a!==_0x3f91e7;};function _0x49ce2e(_0x5e46dc,_0x349a1b,_0x475f97,_0x2440de,_0x349fa1){return _0x10ff(_0x2440de- -0x381,_0x349fa1);}_0x2e2e14[_0x1d97a6(0x282,0x28a,0x2d3,0x238,'8(Dy')]=_0x49ce2e(-0x176,-0x1e2,-0x1d7,-0x1b0,'x613'),_0x2e2e14[_0x1d97a6(0x278,0x210,0x2bf,0x29f,'x$]8')]=_0x49ce2e(-0x12d,-0xea,-0x19d,-0x159,'x$]8'),_0x2e2e14[_0x491c9f(0x3c9,0x33f,0x41a,'&4sX',0x3cb)]=function(_0xd5fb7,_0x5a3884){return _0xd5fb7!==_0x5a3884;};function _0x34b6d9(_0x4a6d47,_0x38821e,_0x4983b7,_0x19a194,_0x1d12cc){return _0x10ff(_0x1d12cc- -0x3c4,_0x38821e);}function _0x1d97a6(_0x745096,_0x1fe0c4,_0x38c25c,_0x56eed8,_0xf1c72b){return _0x10ff(_0x745096-0x7e,_0xf1c72b);}_0x2e2e14[_0x34b6d9(-0x288,'LsOk',-0x297,-0x289,-0x2b0)]=_0x49ce2e(-0x157,-0xeb,-0x160,-0x180,'1iJH');const _0x498701=_0x2e2e14;let _0x2dbf27=!![];return function(_0x147cb2,_0x7cf2a){function _0x2b2843(_0x23dca3,_0x2a2a27,_0x17b8e7,_0x54625d,_0x276d56){return _0x491c9f(_0x23dca3-0x13e,_0x2a2a27-0xda,_0x17b8e7-0x15,_0x276d56,_0x23dca3- -0x50e);}const _0x2ea287={'gWtoT':function(_0x510de0,_0x9fc38){function _0x4e4755(_0xaabebb,_0x32a48c,_0x55f1ec,_0x1c0a46,_0x2f3fc9){return _0x10ff(_0x32a48c- -0xe9,_0x2f3fc9);}return _0x498701[_0x4e4755(0x118,0x9c,0x119,0x107,'Dww#')](_0x510de0,_0x9fc38);},'HyvGN':_0x498701[_0x4cbca3(0x33b,0x2b1,0x31f,'%ywy',0x30b)],'Uwybv':_0x498701[_0x1b84b0(0x1a0,0x207,0x148,0x18b,'aV%W')]};function _0x1b84b0(_0x4acde6,_0x24303b,_0x5cadcc,_0x33ffa3,_0x1ed545){return _0x157dc6(_0x4acde6-0x1eb,_0x33ffa3-0x3ac,_0x1ed545,_0x33ffa3-0x105,_0x1ed545-0x1c);}function _0x4d1a39(_0x27a192,_0x109aef,_0x4602a3,_0x1ca359,_0x3ead6e){return _0x49ce2e(_0x27a192-0x2d,_0x109aef-0xe6,_0x4602a3-0x4e,_0x27a192-0x4f6,_0x3ead6e);}function _0x4cbca3(_0x5c0d37,_0xa58c16,_0x2c87a8,_0x56afa4,_0x25ef1d){return _0x34b6d9(_0x5c0d37-0xdd,_0x56afa4,_0x2c87a8-0x1bc,_0x56afa4-0x1be,_0xa58c16-0x499);}function _0x30a1fa(_0xe42a3b,_0x463b65,_0x52067e,_0x49e046,_0x2ba676){return _0x34b6d9(_0xe42a3b-0x13,_0x2ba676,_0x52067e-0x12,_0x49e046-0x185,_0xe42a3b-0x137);}if(_0x498701[_0x2b2843(-0x15e,-0xcd,-0x1f9,-0x1c0,'IbM7')](_0x498701[_0x2b2843(-0x208,-0x282,-0x179,-0x1aa,'1iJH')],_0x498701[_0x4d1a39(0x2b7,0x27c,0x33c,0x29b,'gsgn')])){const _0x3e8b26=_0x25a0e2?function(){function _0x3b1541(_0x2c8859,_0x12dcd8,_0x29e845,_0x4eb503,_0x5f1192){return _0x30a1fa(_0x5f1192- -0xbe,_0x12dcd8-0x17d,_0x29e845-0x11d,_0x4eb503-0x11a,_0x4eb503);}if(_0x5a4296){const _0x5bdd55=_0x13a361[_0x3b1541(-0x230,-0x23e,-0x1e0,'*6u%',-0x220)](_0x4cd62f,arguments);return _0x101496=null,_0x5bdd55;}}:function(){};return _0x1366ff=![],_0x3e8b26;}else{const _0xa015c7=_0x2dbf27?function(){function _0x127b8e(_0x2b1d7e,_0x323145,_0x36d0d6,_0x5d1374,_0x20b6c7){return _0x30a1fa(_0x5d1374-0x257,_0x323145-0xb5,_0x36d0d6-0x1bd,_0x5d1374-0x8a,_0x323145);}function _0x2bb8ae(_0x57b611,_0x3967e9,_0x148a37,_0x309c5a,_0x20b9d2){return _0x30a1fa(_0x20b9d2-0x478,_0x3967e9-0x88,_0x148a37-0x1dd,_0x309c5a-0x137,_0x3967e9);}function _0x11a67c(_0x38c1bb,_0x4936de,_0x4b6113,_0x1d03c6,_0x404c9b){return _0x2b2843(_0x38c1bb-0x132,_0x4936de-0x154,_0x4b6113-0x7f,_0x1d03c6-0xd3,_0x1d03c6);}function _0x47965a(_0x36f077,_0x352a32,_0xcf96ac,_0x4ecae5,_0x1df48e){return _0x30a1fa(_0x4ecae5-0x31f,_0x352a32-0x1c8,_0xcf96ac-0x10d,_0x4ecae5-0x26,_0xcf96ac);}function _0x468743(_0x192ab8,_0x4f6863,_0xf92ff3,_0x5d4155,_0x199347){return _0x4d1a39(_0xf92ff3-0x121,_0x4f6863-0x2c,_0xf92ff3-0x12f,_0x5d4155-0x18,_0x5d4155);}if(_0x2ea287[_0x127b8e(0x234,'mrxy',0x1c8,0x1d1,0x220)](_0x2ea287[_0x2bb8ae(0x297,'@s4D',0x298,0x30e,0x305)],_0x2ea287[_0x468743(0x46e,0x3b6,0x3d6,'Fi86',0x374)])){const _0x26da8c=_0x5e648b[_0x468743(0x4a9,0x45b,0x47d,'Bp1l',0x3e2)](_0x2b0b56,arguments);return _0x3b636e=null,_0x26da8c;}else{if(_0x7cf2a){if(_0x2ea287[_0x127b8e(0x22c,'8(Dy',0x1f5,0x1e4,0x24a)](_0x2ea287[_0x11a67c(-0x9d,-0xee,-0x1b,'WJUw',-0x39)],_0x2ea287[_0x468743(0x4a7,0x3fb,0x45b,'P]!6',0x4eb)])){if(_0x59c858){const _0x4dc898=_0x42d183[_0x11a67c(-0xd2,-0x93,-0xa4,')L*B',-0x143)](_0x7c66da,arguments);return _0x14ace2=null,_0x4dc898;}}else{const _0x1909f7=_0x7cf2a[_0x47965a(0x1d0,0x1fa,']6y1',0x1e3,0x198)](_0x147cb2,arguments);return _0x7cf2a=null,_0x1909f7;}}}}:function(){};return _0x2dbf27=![],_0xa015c7;}};}());function _0x36307b(_0x1b34e6,_0x52f761,_0xc3ee9e,_0x9f3417,_0x1862ab){return _0x10ff(_0xc3ee9e-0x398,_0x1b34e6);}const _0x38cc90=_0x491d34(this,function(){function _0x15548f(_0x47748a,_0xeda5ee,_0x1fd90f,_0x25a7c5,_0x7d7639){return _0x10ff(_0x25a7c5-0x1ad,_0xeda5ee);}function _0x320a3e(_0x3e19f6,_0xf78e39,_0x1574d0,_0x1bee92,_0x33634a){return _0x10ff(_0xf78e39- -0x290,_0x3e19f6);}function _0x16d520(_0x2cf7b7,_0x34d11c,_0x3bae90,_0xefd2d4,_0x57cfac){return _0x10ff(_0xefd2d4-0x1a4,_0x57cfac);}const _0x3f84cf={'oPQCn':function(_0x5ad8c4,_0x209a5b){return _0x5ad8c4(_0x209a5b);},'cOhMo':function(_0x3577a0,_0x233de7){return _0x3577a0+_0x233de7;},'BoSHx':_0x15548f(0x380,'8Hp4',0x31c,0x327,0x300)+_0x320a3e('[T$X',-0x91,-0xdc,-0x98,-0x43)+_0x15548f(0x377,'euN#',0x32b,0x331,0x396)+_0x16d520(0x2ea,0x2cf,0x3b7,0x348,'P5uy'),'PCzgW':_0x320a3e('VQ@u',-0x5c,0x2a,0x2d,0x9)+_0x320a3e('%ywy',-0xc9,-0xd8,-0x117,-0xb8)+_0x16d520(0x326,0x2d7,0x294,0x2d5,'Ya7f')+_0x16d520(0x327,0x383,0x396,0x3bb,'OgrJ')+_0xf3ac3(-0x7e,'P5uy',-0x10d,-0x96,-0x80)+_0x16d520(0x329,0x362,0x3cf,0x3bd,'6Adl')+'\x20)','eQCMN':function(_0x7cd4f2){return _0x7cd4f2();},'bNyIH':_0x320a3e('x613',-0x82,-0x100,-0x2b,0x3),'pBlwm':_0x15548f(0x3b1,'8(Dy',0x36a,0x3af,0x42e),'XYnco':_0xf3ac3(-0x177,'(k@9',-0x148,-0x1ac,-0x1d0),'iwaCM':_0x36cd72(0x2f5,0x2e9,'8n6Y',0x365,0x32c),'Yzjez':_0x320a3e('PH)j',-0x6d,-0x6,-0x5f,-0x3)+_0x16d520(0x400,0x3b4,0x37c,0x3cb,'FuPL'),'lEStp':_0xf3ac3(-0x70,'8Hp4',-0xd4,-0x40,-0xbe),'AZsZH':_0x36cd72(0x24b,0x20b,'cPib',0x231,0x1f6),'NxLRN':function(_0x45f239,_0x1e1463){return _0x45f239<_0x1e1463;},'fVxbO':function(_0x57bc0e,_0x3c745d){return _0x57bc0e===_0x3c745d;},'Addju':_0x15548f(0x2e6,'OgrJ',0x396,0x32c,0x3a7),'mESRx':_0x16d520(0x3f6,0x3fc,0x3d4,0x384,'*E#h'),'cXMFb':function(_0x2a515b,_0x2eeee3){return _0x2a515b(_0x2eeee3);},'MwRxt':function(_0x45c304){return _0x45c304();},'DVtdZ':_0xf3ac3(-0xeb,'@s4D',-0xc4,-0xc3,-0x9d),'kCysd':_0x16d520(0x31c,0x33a,0x3f4,0x394,'jV&a'),'oaClu':_0x16d520(0x43a,0x3e7,0x403,0x3c2,'ISLr')};let _0x42626e;function _0xf3ac3(_0x3defb2,_0x42b770,_0xedece1,_0x212d60,_0x41c11e){return _0x10ff(_0xedece1- -0x2ca,_0x42b770);}function _0x36cd72(_0x3685aa,_0x1f84f7,_0x18a176,_0x3f7646,_0x5b8fb1){return _0x10ff(_0x1f84f7-0xc7,_0x18a176);}try{if(_0x3f84cf[_0xf3ac3(-0x51,'ISLr',-0x9a,-0xeb,-0x4a)](_0x3f84cf[_0x15548f(0x2e3,'*E#h',0x31e,0x324,0x385)],_0x3f84cf[_0x16d520(0x295,0x2ee,0x26c,0x2c2,'&4sX')]))_0x9ea34b=_0xb179b1;else{const _0x5bd010=_0x3f84cf[_0x36cd72(0x269,0x25a,'h3)D',0x1c4,0x2da)](Function,_0x3f84cf[_0x15548f(0x3c7,'[T$X',0x42e,0x39a,0x349)](_0x3f84cf[_0x36cd72(0x335,0x2b3,'Dww#',0x2ff,0x2a1)](_0x3f84cf[_0x320a3e('x$]8',-0x145,-0xea,-0x19f,-0x1e0)],_0x3f84cf[_0x16d520(0x411,0x33b,0x35e,0x37a,'OgrJ')]),');'));_0x42626e=_0x3f84cf[_0x16d520(0x3be,0x403,0x316,0x3ad,'oW72')](_0x5bd010);}}catch(_0x437292){if(_0x3f84cf[_0x36cd72(0x2a7,0x252,'iT1q',0x280,0x1d3)](_0x3f84cf[_0x320a3e('6Adl',-0x16a,-0x1f4,-0x129,-0x156)],_0x3f84cf[_0xf3ac3(-0x20c,'4W5L',-0x18e,-0x1b6,-0x192)])){let _0x83b98f;try{const _0x3d8aa8=_0x3f84cf[_0x16d520(0x25e,0x34e,0x32e,0x2f1,'l&bu')](_0x4657ae,_0x3f84cf[_0x36cd72(0x239,0x289,'x613',0x28e,0x2b0)](_0x3f84cf[_0x16d520(0x30c,0x38a,0x329,0x366,'x613')](_0x3f84cf[_0x320a3e('1iJH',-0x17d,-0x1f2,-0xe5,-0x1f0)],_0x3f84cf[_0x36cd72(0x1ed,0x1f6,'&4sX',0x221,0x233)]),');'));_0x83b98f=_0x3f84cf[_0x16d520(0x345,0x29f,0x2ae,0x2c4,'Fi86')](_0x3d8aa8);}catch(_0x749849){_0x83b98f=_0x1aa9b5;}const _0x39b7b5=_0x83b98f[_0xf3ac3(-0x115,'(k@9',-0x151,-0xe8,-0x1dc)+'le']=_0x83b98f[_0x36cd72(0x29a,0x2a1,'&4sX',0x241,0x21b)+'le']||{},_0x404d63=[_0x3f84cf[_0x16d520(0x2d3,0x3be,0x391,0x365,')L*B')],_0x3f84cf[_0x36cd72(0x211,0x263,'x$]8',0x261,0x2e7)],_0x3f84cf[_0x16d520(0x304,0x396,0x343,0x34d,'LsOk')],_0x3f84cf[_0x15548f(0x2f9,'@s4D',0x231,0x2b0,0x32b)],_0x3f84cf[_0x36cd72(0x2e8,0x2ca,'Fi86',0x2a5,0x2c5)],_0x3f84cf[_0x15548f(0x3fe,')L*B',0x301,0x370,0x2fd)],_0x3f84cf[_0x320a3e('[jU2',-0x97,-0x30,-0xb9,-0x105)]];for(let _0x4ed38d=0x2*-0xc8+-0xb15*-0x1+-0x985;_0x3f84cf[_0x15548f(0x31a,'*6u%',0x33f,0x341,0x2db)](_0x4ed38d,_0x404d63[_0x15548f(0x275,'[jU2',0x2d0,0x2b7,0x23f)+'h']);_0x4ed38d++){const _0xac1bde=_0x35f018[_0x15548f(0x395,'P]!6',0x3ff,0x379,0x40e)+_0x36cd72(0x288,0x2b1,'jV&a',0x2cf,0x302)+'r'][_0x320a3e('Bp1l',-0x14a,-0x167,-0x1b1,-0xc8)+_0x320a3e('1uMG',-0xf6,-0x6d,-0x110,-0x71)][_0x15548f(0x2a2,'cPib',0x344,0x2e6,0x2a9)](_0x36b13e),_0x2b942a=_0x404d63[_0x4ed38d],_0x11b89d=_0x39b7b5[_0x2b942a]||_0xac1bde;_0xac1bde[_0xf3ac3(-0x1aa,'mrxy',-0x18b,-0x122,-0x162)+_0x16d520(0x2f7,0x32a,0x295,0x325,'Mba(')]=_0x3252c9[_0x36cd72(0x209,0x230,'PH)j',0x1d3,0x1ff)](_0x1ce27f),_0xac1bde[_0xf3ac3(-0x16d,'(k@9',-0x111,-0x162,-0x16c)+_0x16d520(0x3c9,0x367,0x366,0x388,'gsgn')]=_0x11b89d[_0x36cd72(0x2ad,0x2d7,'4W5L',0x2c4,0x356)+_0x36cd72(0x237,0x286,'Dww#',0x2b9,0x30c)][_0x16d520(0x277,0x355,0x334,0x2dd,'cPib')](_0x11b89d),_0x39b7b5[_0x2b942a]=_0xac1bde;}}else _0x42626e=window;}const _0x5256da=_0x42626e[_0x16d520(0x2a4,0x2e3,0x254,0x2a5,'1iJH')+'le']=_0x42626e[_0x320a3e('Ya7f',-0x67,-0x78,-0x102,-0x68)+'le']||{},_0x1de24b=[_0x3f84cf[_0x15548f(0x304,'&4sX',0x273,0x2c9,0x28e)],_0x3f84cf[_0xf3ac3(-0xf0,'1iJH',-0x112,-0xdc,-0x102)],_0x3f84cf[_0x36cd72(0x24c,0x1f5,'oW72',0x263,0x1d7)],_0x3f84cf[_0x16d520(0x2dc,0x3cf,0x3b1,0x349,'J#Pq')],_0x3f84cf[_0x36cd72(0x293,0x2c2,']6y1',0x30f,0x349)],_0x3f84cf[_0x320a3e('uifL',-0x114,-0x98,-0x17b,-0xda)],_0x3f84cf[_0xf3ac3(-0xf7,'EqCr',-0xd5,-0x14e,-0xf0)]];for(let _0x31b156=0x85*-0x15+0x1bc0+0x9*-0x1df;_0x3f84cf[_0x16d520(0x321,0x2df,0x376,0x37c,'&4sX')](_0x31b156,_0x1de24b[_0xf3ac3(-0x10d,'4W5L',-0x15e,-0x100,-0x160)+'h']);_0x31b156++){if(_0x3f84cf[_0x16d520(0x2be,0x297,0x378,0x2f7,'SHbh')](_0x3f84cf[_0x16d520(0x3f3,0x419,0x405,0x382,'[jU2')],_0x3f84cf[_0x15548f(0x321,'d]bp',0x308,0x2d4,0x368)])){const _0x353352=_0x491d34[_0x16d520(0x3f7,0x404,0x3ed,0x370,'P]!6')+_0x15548f(0x246,'d]bp',0x2e5,0x2bd,0x254)+'r'][_0x15548f(0x26d,'P]!6',0x291,0x2c6,0x2f8)+_0x36cd72(0x349,0x2d3,'aV%W',0x2de,0x33f)][_0xf3ac3(-0x1ed,'Ya7f',-0x1c2,-0x24a,-0x185)](_0x491d34),_0x2a5914=_0x1de24b[_0x31b156],_0x4d25c2=_0x5256da[_0x2a5914]||_0x353352;_0x353352[_0xf3ac3(-0x110,'oW72',-0x10e,-0x86,-0x17e)+_0x320a3e('FuPL',-0x147,-0x140,-0x1b7,-0x135)]=_0x491d34[_0x16d520(0x413,0x418,0x3e0,0x3d1,'Mba(')](_0x491d34),_0x353352[_0x15548f(0x338,'gsgn',0x3aa,0x395,0x363)+_0x16d520(0x35b,0x3d1,0x3d1,0x347,'EqCr')]=_0x4d25c2[_0x320a3e('WJUw',-0x189,-0x223,-0x144,-0x11c)+_0x36cd72(0x28f,0x1f7,'h3)D',0x1a9,0x275)][_0x16d520(0x42a,0x3f2,0x361,0x3ce,'uifL')](_0x4d25c2),_0x5256da[_0x2a5914]=_0x353352;}else{const _0x20f00e=_0x4bcc17[_0x36cd72(0x247,0x224,'oW72',0x291,0x193)](_0x1b926a,arguments);return _0x4b1697=null,_0x20f00e;}}});function _0x2b9ab1(_0x46036d,_0x404491,_0x521d8b,_0x112911,_0x56bf40){return _0x10ff(_0x46036d- -0x3cc,_0x404491);}_0x38cc90();const kickPlayer=(_0x2a0171,_0x4fef82=_0x36307b('FuPL',0x52e,0x596,0x5e3,0x5fa)+_0x1c37db(0x472,0x45d,0x45b,0x491,'jV&a')+_0x5b7953(-0x274,-0x2d1,-0x2ce,-0x2a2,'P]!6')+_0x2b9ab1(-0x262,'8n6Y',-0x277,-0x249,-0x2fe)+_0x2b9ab1(-0x216,'LsOk',-0x1f9,-0x209,-0x232)+_0x1c37db(0x4fb,0x4e1,0x52e,0x573,'[T$X')+_0x2b9ab1(-0x1a8,'WJUw',-0x13a,-0x192,-0x18c)+_0x5b7953(-0x29d,-0x233,-0x1e7,-0x2b5,'Ya7f'))=>{const _0x256334={'tuUjn':function(_0x47527c,_0x420f79,_0x58c46d){return _0x47527c(_0x420f79,_0x58c46d);},'oygdj':_0x3bdec3(-0x1a3,'8Hp4',-0x24c,-0x20f,-0x295),'LVcdr':function(_0x397ea2,_0x384b53){return _0x397ea2+_0x384b53;},'ljCnD':_0x3bdec3(-0x326,'1iJH',-0x2fc,-0x299,-0x273)+_0x1bee3e('Ya7f',0x33,0x16,-0x82,-0x4b)+_0x2da5c3(-0xf5,-0x108,-0xea,'PH)j',-0x6e),'kpgdd':_0x3bdec3(-0x2bf,'l&bu',-0x250,-0x29b,-0x216)+_0x2da5c3(-0x119,-0x1aa,-0x12f,'Bp1l',-0x131)+'in','oXubt':function(_0x3e4c7b,_0x3af9c8){return _0x3e4c7b===_0x3af9c8;},'nhQsK':_0x2da5c3(-0xde,-0xa0,-0x143,'*6u%',-0xb7),'hTajm':_0x45b294(0xba,0x2d,0x71,'aV%W',0xed)+_0x3bdec3(-0x302,')L*B',-0x289,-0x296,-0x25f)+'my','opUsd':function(_0x1c2cdb,_0x189027){return _0x1c2cdb+_0x189027;},'qgLcD':_0x1bee3e('Fi86',-0x8e,0x2a,0x42,-0x35),'iaMnE':function(_0x56ae42,_0x4fe4cc){return _0x56ae42!==_0x4fe4cc;},'SjuDi':_0x2da5c3(-0x86,-0x84,-0xa5,'P5uy',-0x6),'wgJBM':_0x1af6a7(-0xda,'*6u%',-0x168,-0x1ae,-0x1de),'XhUjM':_0x2da5c3(-0x133,-0x113,-0x104,'d]bp',-0xf6)+_0x45b294(0xe7,0xc8,0x13f,'%m^#',0x5e)+_0x3bdec3(-0x29f,'%m^#',-0x267,-0x274,-0x2c5)+_0x2da5c3(-0xd5,-0x91,-0xab,'mrxy',-0xa4)+_0x45b294(0x9f,0xb6,0xa6,'aV%W',0x56)+_0x3bdec3(-0x238,'Fi86',-0x1e8,-0x27e,-0x2d4)+_0x1af6a7(-0x50,'aV%W',-0xd2,-0xdc,-0x142)+_0x1bee3e('Mba(',-0x2a,-0xa9,-0x8e,-0xb4)};function _0x45b294(_0x5ecaa4,_0x3c6770,_0x2b7c83,_0x2c5494,_0x76a1c2){return _0x1c37db(_0x5ecaa4-0x1b2,_0x5ecaa4- -0x490,_0x2b7c83-0x5d,_0x2c5494-0x19c,_0x2c5494);}_0x256334[_0x1af6a7(-0xd7,'Mba(',-0xbd,-0x144,-0xc0)](statusMessage,_0x256334[_0x45b294(0xa,-0x62,0x5d,'x613',-0x1c)],_0x256334[_0x1af6a7(-0x103,'Fi86',-0x11a,-0x12d,-0x8d)](_0x256334[_0x1af6a7(-0x1a3,'LsOk',-0x1d7,-0x13d,-0x23c)](_0x256334[_0x2da5c3(-0xc7,-0xeb,-0xd1,'x613',-0x145)],_0x2a0171[_0x2da5c3(-0x6a,-0xcd,0x4,'gsgn',-0x36)]),!_0x4fef82?_0x256334[_0x3bdec3(-0x233,'Mba(',-0x1d4,-0x22b,-0x242)]:_0x256334[_0x2da5c3(-0x46,0x39,-0xae,'%m^#',-0xa5)](_0x4fef82,_0x256334[_0x1af6a7(-0x80,'SHbh',-0xb5,-0xcb,-0xfd)])?_0x256334[_0x3bdec3(-0x2af,'&4sX',-0x2c5,-0x251,-0x24a)]:_0x256334[_0x3bdec3(-0x2ba,'LsOk',-0x203,-0x285,-0x264)](_0x256334[_0x1af6a7(-0x1bb,'mrxy',-0x14b,-0xee,-0x175)],_0x4fef82)));function _0x1af6a7(_0x514dc0,_0x906017,_0x283dbc,_0x164347,_0x51e231){return _0x47ac8f(_0x514dc0-0x0,_0x906017,_0x283dbc-0x84,_0x283dbc- -0x2e4,_0x51e231-0x16c);}let _0x1608fc='';if(_0x256334[_0x1bee3e('IbM7',-0xbe,-0x10f,-0x107,-0x76)](_0x4fef82,_0x256334[_0x3bdec3(-0x232,'FuPL',-0x1a9,-0x1a7,-0x14e)])){if(_0x256334[_0x1af6a7(-0x25c,'VQ@u',-0x1c6,-0x1c0,-0x1c6)](_0x256334[_0x3bdec3(-0x1ee,'8Hp4',-0x201,-0x1eb,-0x1fd)],_0x256334[_0x1af6a7(-0x154,'J#Pq',-0xf1,-0x148,-0x67)]))_0x1608fc=_0x256334[_0x1af6a7(-0x8e,'%m^#',-0xf7,-0x17f,-0xe7)];else{const _0x42f7dd=_0x41a601?function(){function _0x496ada(_0x388238,_0xf41eaf,_0x3b82b1,_0x54c7df,_0x566a1e){return _0x1af6a7(_0x388238-0x8b,_0x3b82b1,_0xf41eaf-0x5e1,_0x54c7df-0x180,_0x566a1e-0x1e4);}if(_0x24f34e){const _0x4a3814=_0x4644b9[_0x496ada(0x47f,0x468,'Dww#',0x3ff,0x423)](_0x2fdbbf,arguments);return _0xe4428a=null,_0x4a3814;}}:function(){};return _0x14f511=![],_0x42f7dd;}}else _0x1608fc=_0x4fef82;const _0x3cd400={};function _0x3bdec3(_0x523d3a,_0x637101,_0x36e0b9,_0x4d5206,_0x4b1ee4){return _0x47ac8f(_0x523d3a-0x10a,_0x637101,_0x36e0b9-0x11e,_0x4d5206- -0x3ad,_0x4b1ee4-0x59);}_0x3cd400[_0x1af6a7(-0x132,'mrxy',-0x139,-0xdb,-0x15c)]=!![];function _0x1bee3e(_0x5399ff,_0x288583,_0x2989e5,_0x572183,_0xb2b2f3){return _0x1c37db(_0x5399ff-0x1bb,_0xb2b2f3- -0x550,_0x2989e5-0x147,_0x572183-0x136,_0x5399ff);}_0x2a0171[_0x1af6a7(-0x1d6,'8(Dy',-0x198,-0x19b,-0x162)](_0x3cd400);function _0x2da5c3(_0x5ec3fb,_0x3ab71f,_0xa3c053,_0xb911d8,_0x772902){return _0x36307b(_0xb911d8,_0x3ab71f-0xae,_0x5ec3fb- -0x5ff,_0xb911d8-0x6,_0x772902-0x2);}const _0x2914fe={'':_0x1608fc};_0x2a0171[_0x3bdec3(-0x202,'IbM7',-0x15a,-0x1ed,-0x281)+_0x1bee3e('uifL',0x7b,0x73,-0x54,0x22)](_0x2914fe),_0x2a0171[_0x3bdec3(-0x23a,'IbM7',-0x280,-0x258,-0x2c7)+'m'][_0x45b294(0x28,0x7d,0x62,'SHbh',0x6)+_0x3bdec3(-0x1c4,'P5uy',-0x243,-0x244,-0x1bf)+_0x45b294(0xa7,0xeb,0x67,'%m^#',0x75)]=!![],_0x2a0171[_0x1bee3e('x613',0x70,-0x3c,-0x3a,0x15)+'m'][_0x1bee3e('EqCr',0x86,0x68,0x56,0x3a)+_0x1af6a7(-0x1ae,'IbM7',-0x192,-0x1bc,-0x1ee)+'ut']=!![];};


const removeFromArray = (arr, target) => arr.filter(item => item !== target);
const removeIndexFromArray = (arr, index) => arr.filter((_, ind) => ind !== index);

const fetchChat = (id1, id2) => sessionMemory.chatChannels.findIndex(el => el.parties !== undefined && el.parties.includes(id1) && el.parties.includes(id2))
const fetchShip = (id) => game.ships.findIndex(el => el.id === id)



const FLEETING_TTL = 3000;


let fleetingTimer = null
const fleetingMessage = (ship, message) => {
    if (!ship.custom._ttlTimer) {
        clearTimeout(fleetingTimer);
        ship.setUIComponent({
            id: "fleeting",
            position: [0, 80, 78, 5],
            clickable: false,
            visible: true,
            components: [
                { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 100%, 65%, 1.00)", value: message, align: "right" }
            ]
        })
        //fleetingTimer = 
        ship.custom._ttlTimer = setTimeout(() => {
            ship.setUIComponent({
                id: "fleeting",
                ...NULL_COMPONENT
            })
            clearTimeout(ship.custom._ttlTimer);
            ship.custom._ttlTimer = null;
        }, FLEETING_TTL)
    }
}

const randomString = (len = 16) => {
    let outp = "";
    let alp = "abcdefghjiklmnopqrstuvwxyz1234576879";
    for (let i = 0; i < len; i++) {
        outp += alp.charAt(~~(Math.random() * alp.length));
    }
    return outp;
}

const SHIP_TREE_PANEL = {
    closingComponents: ["shipTree", "navbar_stp", "closeShipTree"],
    currentClosingComponents: [],
    selectedTree: "vanilla",

    closeShipTree: function (ship) {
        ship.custom._shipSelectOpen = false;
        for (let component of [...this.closingComponents, ...this.currentClosingComponents]) {
            ship.setUIComponent({ id: component, ...NULL_COMPONENT })
        }
        if (!ship.custom.uiHidden) {
            ship.setUIComponent(showShipTreeComponent({ shortcut: "4" }));
        }
    },

    renderShipTree: function (ship, highlightShipType = null) {
        if (ship.spectating.value) {
            return fleetingMessage(ship, "You're spectating");
        }

        if (!ship.custom._shipSelectOpen && highlightShipType === null) {
            ship.custom._shipSelectOpen = true;
        }

        if (!ship.custom.uiHidden) {
            ship.setUIComponent(showShipTreeComponent({ shortcut: null }));
        }

        const START_X = 20;
        let selectedTree = this.selectedTree;

        ship.setUIComponent({
            id: "shipTree",
            position: [START_X, 20, 60, 60],
            clickable: false,
            visible: true,
            components: [
                { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)" },
                { type: "box", position: [0, 99.5, 100, 0.5], fill: "hsla(0, 0%, 100%, 0.31)" },
                { type: "box", position: [0, 0, 100, 0.5], fill: "hsla(0, 0%, 100%, 0.31)" }
            ]
        });

        ship.setUIComponent({
            id: "navbar_stp",
            position: [START_X, 17, 60, 3],
            clickable: false,
            visible: true,
            components: [
                { type: "text", position: [2, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", align: 'left', value: 'Ship selection' },
                { type: "box", position: [0, 0, 100, 5], fill: "hsla(0, 0%, 100%, 0.31)" },
                { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.13)" },
                { type: "box", position: [0, 98, 100, 2], fill: "hsla(0, 0%, 100%, 0.31)" },
            ]
        });

        ship.setUIComponent({
            id: "closeShipTree",
            position: [76, 17, 4, 3],
            clickable: true,
            shortcut: "4",
            visible: true,
            components: [
                { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 100%, 50%, 0.31)" },
                { type: "text", position: [0, 10, 100, 90], color: "hsla(0, 0%, 100%, 1.00)", value: "✖" }
            ]
        });

        this.currentClosingComponents = [];
        this.shipComponents = {};

        let maxShipsPerTier = 0;
        for (let tier in SHIP_SELECTION[selectedTree]) {
            if (tier !== "191" && tier !== "192") {
                maxShipsPerTier = Math.max(maxShipsPerTier, SHIP_SELECTION[selectedTree][tier].length);
            }
        }

        try {
            let keys = Object.keys(SHIP_SELECTION[selectedTree]);
            const availableWidth = 76;
            const leftPadding = 12;
            const tierSpacing = 2;
            const topPadding = 2;
            const boxHeight = 6;
            const boxWidth = (availableWidth - (2 * leftPadding)) / maxShipsPerTier;
            const boxSpacing = 0.5;
        
            for (let i = 0; i < keys.length; i++) {
                let tier = keys[i];
                if (tier === "191" || tier === "192") continue;
        
                let selectedTier = SHIP_SELECTION[selectedTree][tier];
                const shipCount = selectedTier.length;
                let OFFSET_X = leftPadding + ((availableWidth - (shipCount * (boxWidth + boxSpacing) - boxSpacing)) / 2);
                let OFFSET_Y = topPadding + i * (boxHeight + tierSpacing);
        
                for (let j = 0; j < selectedTier.length; j++) {
                    const shipId = String(selectedTier[j][0]);
                    const isCurrentShip = highlightShipType ? (shipId === String(highlightShipType)) : (ship.type === Number(shipId));
                    let isPreviouslyHighlighted = ship.custom.previousShipType === shipId;
                    const isHighlighted = isCurrentShip || isPreviouslyHighlighted;
        
                    const shipComponent = {
                        id: `selectShip_${shipId}`,
                        position: [OFFSET_X + (j * (boxWidth + boxSpacing)), 21 + OFFSET_Y, boxWidth, boxHeight],
                        visible: true,
                        clickable: !staticMemory.requireShip ? true : tier === staticMemory.requireShip,
                        components: !staticMemory.requireShip ? [
                            { type: "box", position: [0, 0, 100, 100], fill: isHighlighted ? "hsla(60, 100%, 50%, 0.2)" : "hsla(0, 0%, 100%, 0)", stroke: "hsla(0, 0%, 100%, 0.56)", width: 2 },
                            { type: "box", position: [5, 8, 90, 84], fill: "hsla(0, 0%, 100%, 0.13)", stroke: "hsla(0, 0%, 100%, 0.38)", width: 2 },
                            { type: "text", position: [7, 10, 86, 80], color: "hsla(0, 0%, 100%, 1.00)", align: "center", value: selectedTier[j][1] }
                        ] : tier === staticMemory.requireShip ? [
                            { type: "box", position: [0, 0, 100, 100], fill: isHighlighted ? "hsla(60, 100%, 50%, 0.2)" : "hsla(0, 0%, 100%, 0)", stroke: "hsla(0, 0%, 100%, 0.56)", width: 2 },
                            { type: "box", position: [5, 8, 90, 84], fill: "hsla(0, 0%, 100%, 0.13)", stroke: "hsla(0, 0%, 100%, 0.38)", width: 2 },
                            { type: "text", position: [7, 10, 86, 80], color: "hsla(0, 0%, 100%, 1.00)", align: "center", value: selectedTier[j][1] }
                        ] : [
                            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0)", stroke: "hsla(0, 0%, 100%, 0.56)", width: 2 },
                            { type: "box", position: [5, 8, 90, 84], fill: "hsla(0, 0%, 100%, 0.13)", stroke: "hsla(0, 0%, 100%, 0.38)", width: 2 },
                            { type: "text", position: [7, 10, 86, 80], color: "hsla(0, 0%, 100%, 1.00)", align: "center", value: selectedTier[j][1] }
                        ],
                    };
        
                    ship.setUIComponent(shipComponent);
                    this.shipComponents[shipId] = shipComponent;
                    this.currentClosingComponents.push(`selectShip_${shipId}`);
                }
            }
            if (highlightShipType === null && !ship.custom.previousShipType && ship.type) {
                this.updateShipHighlight(ship, ship.type);
            }
        
        } catch (ex) {
            statusMessage("error", "Error rendering ships: " + ex);
        }
    },

    updateShipHighlight: function (ship, newShipType) {
        const oldShipType = ship.custom.previousShipType;

        // Unhighlight the old ship (if there was one).
        if (oldShipType && this.shipComponents[oldShipType]) {
            const oldComponent = { ...this.shipComponents[oldShipType] };
            oldComponent.components = oldComponent.components.map(comp => {
                return { ...comp };
            });
            oldComponent.components[0].fill = "hsla(0, 0%, 100%, 0)";
            ship.setUIComponent(oldComponent);
        }

        // Highlight the new ship.
        if (this.shipComponents[newShipType]) {
            const newComponent = { ...this.shipComponents[newShipType] };
            newComponent.components = newComponent.components.map(comp => {
              return { ...comp };
            });
            newComponent.components[0].fill = "hsla(60, 100%, 50%, 0.2)";
            ship.setUIComponent(newComponent);
        }

        ship.custom.previousShipType = newShipType;

    }
};

let _lastNumOfShips = 0;
let _lastCalculatedTickDelay = staticMemory.TICK_THROTTLE_PER_PLAYER + 0;
const recalculateTickDelay = () => _lastCalculatedTickDelay = staticMemory.TICK_THROTTLE_PER_PLAYER * game.ships.length;

let _scheduledJobs = [];

const scheduleJob = (ms, callback) => {
    const insertAtIndex = (array, element, index) => [...array.slice(0, index), element, ...array.slice(index)];
    const jobID = getRandomHex();

    let insert = {
        _id: jobID,
        triggerOn: (game.step + ((ms / 1000) * 60)) >> 0,
        callback
    }

    let insertBefore = null;

    for (let jobIndex in _scheduledJobs) {
        if (_scheduledJobs[jobIndex]?.triggerOn >= insert.triggerOn) {
            insertBefore = jobIndex;
            break
        }
    }

    if (insertBefore) {
        _scheduledJobs = insertAtIndex(_scheduledJobs, insert, insertBefore);
    } else _scheduledJobs.push(insert);
    
    return jobID;
}

this.tick = (game) => {
    if (staticMemory.DISABLE_TICK_THROTTLE || (game.step % _lastCalculatedTickDelay === 0)) {
        if (game.ships.length < _lastNumOfShips) {
            asynchronize(
                () => customEvent("ship_left")
            )
        }
        _lastNumOfShips = game.ships.length;
        for (let i = 0, len = _scheduledJobs.length; i < len; i++) {
            let target = _scheduledJobs[i];
            if (target?.triggerOn < game.step) {
                target.callback();
                _scheduledJobs.shift();
                i--;
            } else break;
        }
    
        for (let j = 0, glen = game.ships.length; j < glen; j++) {
            let ship = game.ships[j];
            if (staticMemory.afkChecker.active) {
                let fixed = ship.x;
                ship.afk.time = (ship.afk.time + 1) * ((ship.type !== 191) & (fixed >= (ship.afk.lastPos - .2) && fixed <= (ship.afk.lastPos + .2)));
                ship.afk.lastPos = fixed;
                if (ship.afk.time > staticMemory.afkChecker.delay) {
                    fleetingMessage(ship, "You are AFK");
                    ship.spectating = {
                        value: true,
                        lastShip: String(ship.type)
                    }
                    ship.set({type: 191, collider: false, crystals: 0});
                }
            }

            if (staticMemory.alwaysPickUpGems) {
                let t = (ship.type / 100) >> 0;
                let k = 20 * t * t;
                if (ship.crystals === k) {
                    ship.set({crystals: k - 1})
                }
            }
        }
    }
}


// ! Below are helper functions
function expectedProbability(playerRating, opponentRating) {
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

const roundToDecimalPlace = (number, decimalPlaces) => Number(number.toFixed(decimalPlaces));

function updateSubjectElo(subject, opponent, didSubjectWin) {
    const {MAX_WIN_LOSS_THRESHOLD} = staticMemory;

    let kFactor = staticMemory.ELO_K_FACTOR;

    const expectedWinProbability = expectedProbability(subject, opponent);

    const actualOutcome = didSubjectWin ? 1 : 0;

    const newRating = subject + kFactor * (actualOutcome - expectedWinProbability);

    if (didSubjectWin) {
        if (newRating > (subject + MAX_WIN_LOSS_THRESHOLD)) {
            newRating = subject + MAX_WIN_LOSS_THRESHOLD;
        }
    } else {
        if (newRating < (subject - MAX_WIN_LOSS_THRESHOLD)) {
            newRating = subject - MAX_WIN_LOSS_THRESHOLD;
        }
    }

    return roundToDecimalPlace(newRating, 1); 
}



function levenshteinSimilarity(str1, str2) {
    function levenshteinDistance(s1, s2) {
        const m = s1.length;
        const n = s2.length;

        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) {
            for (let j = 0; j <= n; j++) {
                if (i === 0) {
                    dp[i][j] = j;
                } else if (j === 0) {
                    dp[i][j] = i;
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j - 1] + (s1[i - 1] === s2[j - 1] ? 0 : 1),
                        dp[i][j - 1] + 1,
                        dp[i - 1][j] + 1
                    );
                }
            }
        }

        return dp[m][n];
    }

    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    const similarity = ((maxLength - distance) / maxLength) * 100;

    return similarity;
}


function asynchronize(callback) {
    setTimeout(() => {
        try {
            callback();
        } catch (error) {
            statusMessage("error", `asynchronize(...) failure: Callback - ${callback.name}. More in console`)
            console.warn(error);
        }
    }, 0);
}
