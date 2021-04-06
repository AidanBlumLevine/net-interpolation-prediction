import Vector from "../shared/vector";

export default new class Collisions {
    couldCollide(shape1: Shape, shape2: Shape): boolean {
        return shape1.bounds().minX < shape2.bounds().maxX &&
            shape1.bounds().maxX > shape2.bounds().minX &&
            shape1.bounds().minY < shape2.bounds().maxY &&
            shape1.bounds().maxY > shape2.bounds().minY;
    }

    private ResolveCollision(contact: Contact) {
        var relativeVelocity = contact.b.vel.difference(contact.a.vel);
        var velAlongNormal = relativeVelocity.dot(contact.normal);
        if (velAlongNormal > 0) { return; } //seperating velocities

        var e = Math.min(contact.a.restitution, contact.b.restitution);
        var aInvMass = 1 / contact.a.mass;
        if (aInvMass == Infinity) { aInvMass = 0; }
        var bInvMass = 1 / contact.b.mass;
        if (bInvMass == Infinity) { bInvMass = 0; }

        var j = -(1 + e) * velAlongNormal
        j /= aInvMass + bInvMass;

        var impulse = contact.normal.mult(j);
        contact.a.vel.add(impulse.mult(-aInvMass));
        contact.b.vel.add(impulse.mult(bInvMass));

        //teleport out to avoid sinking
        var aPenetrationMultiplier = -contact.a.mass / (contact.a.mass + contact.b.mass)
        contact.a.pos.add(contact.normal.mult(contact.penetration * aPenetrationMultiplier));
        var bPenetrationMultiplier = contact.b.mass / (contact.a.mass + contact.b.mass)
        contact.b.pos.add(contact.normal.mult(contact.penetration * bPenetrationMultiplier));

    }

    collide(shape1: Shape, shape2: Shape): void {
        var contact = this.collide_unknown_circle(shape1, shape2);
        if (contact != null) {
            this.ResolveCollision(contact);
        }
    }

    private collide_unknown_circle(shape1: Shape, shape2: Shape): Contact {
        if (shape1.radius !== undefined) {
            return this.circle_circle(shape1, shape2);
        } else {
            return this.rect_circle(shape1, shape2);
        }
    }

    private circle_circle(circle1: Shape, circle2: Shape): Contact {
        var difference = circle2.pos.difference(circle1.pos);
        var dist = difference.length();
        if (dist < circle1.radius + circle2.radius) {
            var overlap = circle1.radius + circle2.radius - dist;
            return {
                a: circle1,
                b: circle2,
                normal: difference.normalized(),
                penetration: overlap
            }
        }
        return null;
    }

    private rect_circle(rect: Shape, circle: Shape): Contact {
        var rectPos: Vector = new Vector(rect.pos.x + rect.width / 2, rect.pos.y + rect.height / 2);
        var n: Vector = circle.pos.difference(rectPos);

        var closest: Vector = new Vector(n);
        closest.set(new Vector(Math.min(Math.max(- rect.width / 2, closest.x), rect.width / 2), //clamp
            Math.min(Math.max(- rect.height / 2, closest.y), rect.height / 2)));

        var inside: boolean = false;
        if (n.equals(closest)) {
            inside = true;
            if (Math.abs(n.x) > Math.abs(n.y)) {
                if (closest.x > 0) { closest.x = rect.width / 2; }
                else { closest.x = -rect.width / 2 }
            }
            else {
                if (closest.y > 0) { closest.y = rect.height / 2 }
                else { closest.y = -rect.height / 2 }
            }
        }

        var normal: Vector = n.difference(closest);
        var length = normal.length();

        if (length > circle.radius && !inside) {
            return null;
        }
        normal.scale(1 / length);
        if (inside) {
            normal.scale(-1);
            return {
                a: rect,
                b: circle,
                normal: normal,
                penetration: circle.radius - length
            }
        }
        else {
            return {
                a: rect,
                b: circle,
                normal: normal,
                penetration: circle.radius - length
            }
        }
    }
}