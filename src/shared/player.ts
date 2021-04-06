import { exception } from "console";
import Constants from "./constants";
import Map from "./map";
import { Circle } from "./shape";
import Vector from "./vector";

class Entity {
    static nextID = 0;
    id: number;
    shape: Shape;
    constructor(shape: Shape) {
        this.shape = shape;
        this.id = Entity.nextID;
        Entity.nextID++;
    }
}

export default class Player extends Entity {
    map: Map;

    constructor(map: Map) {
        super(new Circle(new Vector(100, 100), Constants.PLAYER_MASS, Constants.PLAYER_SIZE, "orange", Constants.PLAYER_RESTITUTION));
        this.map = map;
    }

    apply(input: Input) {
        var deltaTime = input.deltaTime / 1000;
        this.shape.vel.add(new Vector(deltaTime * ((input.left ? -Constants.PLAYER_ACCELERATION : 0) + (input.right ? Constants.PLAYER_ACCELERATION : 0)),
            deltaTime * ((input.up ? -Constants.PLAYER_ACCELERATION : 0) + (input.down ? Constants.PLAYER_ACCELERATION : 0))));
        this.shape.pos.add(this.shape.vel.mult(deltaTime * Constants.PLAYER_SPEED));
        this.shape.vel.set(this.shape.vel.mult(1 - Constants.FRICTION * deltaTime));
        this.map.collide(this);
    }
}