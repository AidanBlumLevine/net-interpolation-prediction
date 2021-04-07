import { Socket } from "socket.io";
import Player from "../shared/player";
import Map from "../shared/map";
import Constants from "../shared/constants";

export default class ServerPlayer extends Player {
    socket: Socket;
    lastProcessedClientTime: number;
    constructor(socket: Socket, map: Map) {
        super(map);
        this.socket = socket;
        this.lastProcessedClientTime = 0;
        var data: InitialPacket = { player: this.serialize(), map: this.map.map }
        socket.emit(Constants.SOCKET.CONNECTED, data);
    }

    apply(input: Input) {
        super.apply(input);
        this.lastProcessedClientTime = Math.max(this.lastProcessedClientTime, input.clientTime);
    }

    updateClient(otherPlayers: ServerPlayer[]) {
        var state: UpdatePacket = {
            localPlayer: this.serialize(),
            otherPlayers: otherPlayers.map(p => p.serialize())
        }
        this.socket.emit(Constants.SOCKET.STATE, state);
    }

    serialize(): SerializedPlayer {
        var data: SerializedPlayer = {
            id: this.id,
            pos: this.shape.pos,
            vel: this.shape.vel,
            lastProcessedTime: this.lastProcessedClientTime,
        }
        return data;
    }
}