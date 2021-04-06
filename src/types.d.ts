interface Shape {
    pos: import("./shared/vector").default,
    bounds?(): BoundingBox,
    color: string,
    vel: import("./shared/vector").default,
    restitution: number,
    mass: number,
    width?: number,
    height?: number,
    radius?: number,
    draw?(CanvasRenderingContext2D): void
}

interface BoundingBox {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

interface Input {
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean,
    clientTime: number,
    deltaTime: number,
    serverTime?: number,
    player?: import("./shared/player").default,
}

interface SerializedPlayer {
    id: number,
    lastProcessedTime?: number,
    pos: import("./shared/vector").default,
    vel: import("./shared/vector").default,
    path?: State[]
}

type InitialPacket = {
    map: Shape[],
    player: SerializedPlayer
}

type UpdatePacket = {
    localPlayer: SerializedPlayer,
    otherPlayers: SerializedPlayer[]
}

type State = {
    pos: import("./shared/vector").default,
    vel: import("./shared/vector").default,
    deltaTime: number,
}

interface Contact {
    a: Shape,
    b: Shape,
    normal: import("./shared/vector").default,
    penetration: number
}