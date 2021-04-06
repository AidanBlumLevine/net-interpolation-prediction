export default class Constants {
    static PLAYER_SIZE = 15;
    static PLAYER_SPEED = 15;
    static PLAYER_ACCELERATION = 100;
    static PLAYER_RESTITUTION = .5;
    static PLAYER_LERP_SPEED = 5;
    static PLAYER_MASS = 1;
    static FRICTION = .9;
    static GRAVITY = -5;
    static UPS = 30;
    static SOCKET = {
        JOIN: "playerJoin",
        INPUTS: "inputsPackage",
        STATE: "gameStateOutput",
        CONNECTED: "connected"
    };
}

// if(typeof module !== 'undefined'){
//     module.exports = Constants;
// }

