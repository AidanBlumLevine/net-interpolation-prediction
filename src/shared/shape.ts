import Vector from "./vector";

export function CreateShape(shape: Shape): Shape {
    if (shape.width === undefined) {
        return new Circle(shape.pos, shape.mass, shape.radius, shape.color, shape.restitution);
    }
    return new Box(shape.pos, shape.mass, shape.width, shape.height, shape.color, shape.restitution);
}

class Box implements Shape {
    pos: Vector;
    width: number;
    height: number
    color: string;
    vel: Vector;
    restitution: number;
    mass: number;
    constructor(pos: Vector, mass: number, width: number, height: number, color: string, restitution: number) {
        this.pos = new Vector(pos.x, pos.y);
        this.vel = new Vector(0, 0);
        this.mass = mass;
        this.width = width;
        this.height = height;
        this.restitution = restitution;
        if (color === undefined) { this.color = 'black'; }
        else { this.color = color; }
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    bounds() {
        return {
            minX: this.pos.x,
            minY: this.pos.y,
            maxX: this.width + this.pos.x,
            maxY: this.height + this.pos.y
        };
    }
}

class Circle implements Shape {
    pos: Vector;
    radius: number;
    color: string;
    vel: Vector;
    restitution: number;
    mass: number;
    constructor(pos: Vector, mass: number, radius: number, color: string, restitution: number) {
        this.pos = new Vector(pos.x, pos.y);
        this.radius = radius;
        this.vel = new Vector(0, 0);
        this.mass = mass;
        this.restitution = restitution;
        if (color === undefined) { this.color = 'black'; }
        else { this.color = color; }
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }
    bounds() {
        return {
            minX: this.pos.x - this.radius,
            minY: this.pos.y - this.radius,
            maxX: this.pos.x + this.radius,
            maxY: this.pos.y + this.radius,
        };
    }
}

export { Box, Circle };
