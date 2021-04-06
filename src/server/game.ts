import Constants from '../shared/constants';
import { Box, Circle } from '../shared/shape';
import Map from '../shared/map';
import Player from '../shared/player';
import Vector from "../shared/vector";
import ServerPlayer from './serverplayer';

export default class Game {
    players: ServerPlayer[];
    inputs: Input[];
    map: Map;
    io: SocketIO.Server;
    constructor(io: SocketIO.Server) {
        this.players = [];
        this.inputs = [];
        setInterval(this.update.bind(this), 1000 / Constants.UPS);
        this.io = io;
        this.map = new Map([
            new Box(new Vector(300, 300), 0, 200, 400, "blue", 1),
            new Circle(new Vector(200, 300), 0, 100, "blue", 1),
        ], this.players);
    }

    join(socket: SocketIO.Socket) {
        this.players.push(new ServerPlayer(socket, this.map));
    }

    leave(socket: SocketIO.Socket) {
        this.players = this.players.filter(p => p.socket !== socket);
    }

    input(socket: SocketIO.Socket, inputs: Input[]) {
        var player = this.players.find(p => p.socket === socket);
        var earliestClientTime = inputs.reduce((v, i) => v = Math.min(i.clientTime, v), 0);
        for (var input of inputs) {
            input.serverTime = input.clientTime - earliestClientTime;
            input.player = player;
            this.inputs.push(input);
        }
    }

    update() {
        this.processInputs();
    }

    processInputs() {
        this.inputs.sort((a, b) => a.serverTime - b.serverTime);
        for (var input of this.inputs) {
            input.player.apply(input);
        }
        this.inputs = [];
        for (var player of this.players) {
            player.updateClient(this.players); //.filter(p => p !== player)
        }
        for(var player of this.players){
            player.path = [];
        }
    };
}