import { Socket } from "socket.io";
import Player from "../shared/player";
import Map from "../shared/map";
import Constants from "../shared/constants";

export default class ServerPlayer extends Player {
    socket: Socket;
    lastProcessedClientTime: number;
    path: State[];
    constructor(socket: Socket, map: Map) {
        super(map);
        this.socket = socket;
        this.path = [];
        this.lastProcessedClientTime = 0;
        var data: InitialPacket = { player: this.serialize(), map: this.map.map }
        socket.emit(Constants.SOCKET.CONNECTED, data);
    }

    apply(input: Input) {
        super.apply(input);
        this.lastProcessedClientTime = Math.max(this.lastProcessedClientTime, input.clientTime);
        this.path.push({ deltaTime: input.deltaTime, pos: this.shape.pos.copy(), vel: this.shape.vel.copy() });
    }

    updateClient(otherPlayers: ServerPlayer[]) {
        var state: UpdatePacket = {
            localPlayer: this.serialize(),
            otherPlayers: otherPlayers.map(p => p.serialize(true))
        }
        this.socket.emit(Constants.SOCKET.STATE, state);
    }

    serialize(detailed?: boolean): SerializedPlayer {
        var data: SerializedPlayer = {
            id: this.id,
            pos: this.shape.pos,
            vel: this.shape.vel,
            lastProcessedTime: this.lastProcessedClientTime,
        }
        if (detailed === true) {
            data.path = this.path;      
        }
        
        return data;
    }
}