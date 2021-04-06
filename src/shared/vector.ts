import { verify } from "crypto";

export default class Vector {
    x: number;
    y: number;

    constructor(...obj) {
        if (obj.length == 2) {
            this.x = obj[0];
            this.y = obj[1];
        } else {
            this.x = obj[0].x;
            this.y = obj[0].y;
        }
    }
    set(v: Vector): void {
        this.x = v.x;
        this.y = v.y;
    }

    add(vector: Vector): void {
        this.x += vector.x;
        this.y += vector.y;
    }
    mult(scalar: number): Vector {
        return new Vector(
            this.x * scalar,
            this.y * scalar
        );
    }
    normalized(): Vector {
        var length = this.length();
        return new Vector(
            this.x / length,
            this.y / length
        );
    }
    equals(vector: Vector): boolean{
        return Math.round((this.x - vector.x) * 1000000) == 0 && Math.round((this.y - vector.y) * 1000000) == 0;
    }
    difference(vector: Vector): Vector {
        return new Vector(
            this.x - vector.x,
            this.y - vector.y
        );
    }

    length(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    dot(other: Vector){
        return this.x * other.x + this.y * other.y;
    }

    scale(scalar: number): void{
        this.x *= scalar,
        this.y *= scalar
    }
    copy(): Vector{
        return new Vector(this);
    }
}