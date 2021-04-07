import Constants from '../shared/constants';
import { CreateShape } from '../shared/shape'
import Map from "../shared/map";
import Player from '../shared/player';
import { LocalPlayer, PredictivePlayer } from './clientplayer';

class Client {
    input: Input;
    inputs: Input[];
    socket: SocketIOClient.Socket;
    ctx: CanvasRenderingContext2D;
    map: Map;
    players: Player[];
    localPlayer: LocalPlayer;
    lastUpdate: number;
    lastServerUpdate: number;
    constructor() {
        this.input = { up: false, down: false, left: false, right: false, clientTime: 0, deltaTime: 0 }
        this.socket = io();
        this.socket.io.reconnection(false);
        this.socket.emit(Constants.SOCKET.JOIN);

        this.inputs = [];
        this.lastUpdate = window.performance.now();
        this.lastServerUpdate = this.lastUpdate;
        this.players = [];
        this.map = new Map([], this.players);

        this.socket.on(Constants.SOCKET.CONNECTED, (data: InitialPacket) => {
            for (var shape of data.map) {
                this.map.map.push(CreateShape(shape));
            };
            this.localPlayer = new LocalPlayer(data.player, this.map);
            this.players.push(this.localPlayer);
        });

        this.socket.on(Constants.SOCKET.STATE, (state: UpdatePacket) => {
            this.loadState(state);
        });

        var canvas = document.getElementById('canvas') as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = canvas.getContext('2d');



        document.addEventListener('keydown', (event) => { this.updateKeyStates(event.which, true); });
        document.addEventListener('keyup', (event) => { this.updateKeyStates(event.which, false); });

        this.update();
    }

    update() {
        const now = window.performance.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;

        if (this.localPlayer !== undefined) {
            this.input.deltaTime = deltaTime;
            this.input.clientTime = now;

            var uniqueInput = { ...this.input };
            this.inputs.push(uniqueInput);
            this.localPlayer.applyAndSave(uniqueInput);

            if (now - this.lastServerUpdate > 1000 / Constants.UPS) {
                this.lastServerUpdate = now;
                this.socket.emit(Constants.SOCKET.INPUTS, this.inputs);
                this.inputs = [];
            }
        }

        for (var player of this.players.filter(p => p !== this.localPlayer)) {
            (player as PredictivePlayer).update(deltaTime);
        }

        this.draw();
        window.requestAnimationFrame(this.update.bind(this));
    }

    loadState(data: UpdatePacket) {
        var activePlayerIDs = data.otherPlayers.map(s => s.id);
        activePlayerIDs.push(this.localPlayer.id);
        this.players = this.players.filter(p => activePlayerIDs.indexOf(p.id) !== -1);
        for (var obj of data.otherPlayers) {
            var existingPlayer = this.players.find(e => e.id === obj.id) as PredictivePlayer;
            if (existingPlayer === undefined) { //new player
                this.players.push(new PredictivePlayer(obj, this.map));
            } else {
                existingPlayer.setState(obj);
            }
        };
        this.localPlayer.setState(data.localPlayer);
    }

    draw() {
        //this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.ctx.fillStyle = "white";
        this.ctx.globalAlpha = 1;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        this.ctx.globalAlpha = 1;
        this.map.map.forEach(shape => shape.draw(this.ctx));
        this.players.forEach(player => player.draw(this.ctx));
    }

    updateKeyStates(code, value) {
        if (code == 68 || code == 39) this.input.right = value;
        else if (code == 83 || code == 40) this.input.down = value;
        else if (code == 65 || code == 37) this.input.left = value;
        else if (code == 87 || code == 38) this.input.up = value;
    }
}

const client = new Client();