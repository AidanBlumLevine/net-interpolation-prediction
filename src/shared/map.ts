import Collisions from "./collisions";
import Player from "./player";

export default class Map {
    map: Shape[];
    players: Player[]
    constructor(shapes: Shape[], players: Player[]) {
        this.map = shapes;
        this.players = players;
    }

    collide(player: Player): void {
        for (var shape of this.map) {
            if (Collisions.couldCollide(player.shape, shape)) {
                Collisions.collide(shape, player.shape);
            }
        }
        for (var p of this.players) {
            if (player !== p) {
                if (Collisions.couldCollide(player.shape, p.shape)) {
                    Collisions.collide(p.shape, player.shape);
                }
            }
        }

    }
}