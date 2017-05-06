module.exports = {
    directions: {
        1: { x: -1, y: -1 },
        2: { x: 1, y: -1 },
        3: { x: 1, y: 1 },
        4: { x: -1, y: 1 },
    },
    outlineCorners: [
        { x: -1.5, y: -0.5 },
        { x: -1.5, y: -1.5 },
        { x: -0.5, y: -1.5 },
        { x: 0.5, y: -1.5 },
        { x: 1.5, y: -1.5 },
        { x: 1.5, y: -0.5 },
        { x: 1.5, y: 0.5 },
        { x: 1.5, y: 1.5 },
        { x: 0.5, y: 1.5 },
        { x: -0.5, y: 1.5 },
        { x: -1.5, y: 1.5 },
        { x: -1.5, y: 0.5 },
        { x: -1.5, y: -0.5 }
    ],
    outline: function(room, reactor) {
        let x = reactor.x,
            y = reactor.y;
        let corners = [];
        for(let i = 0; i < this.outlineCorners.length; i++) {
            if(i % 3 !== 1 || Math.floor(i/3) !== reactor.dir - 1) corners.push(this.outlineCorners[i]);
        }

        room.visual.poly(_.map(corners, (p) => [x + p.x, y + p.y]), { stroke: "#77f" });
    },
    build: function(room, reactor) {
        let dir = this.directions[reactor.dir];
        room.createConstructionSite(reactor.x + dir.x, reactor.y, STRUCTURE_LAB);
        room.createConstructionSite(reactor.x, reactor.y + dir.y, STRUCTURE_LAB);

        for(let x = -1; x <= 1; x += 1) {
            for(let y = -1; y <= 1; y += 1) {
                if(x == 0 && (y == 0 || y == dir.y)) continue;
                if(y == 0 && (x == 0 || x == dir.x)) continue;
                if(x == dir.x && y == dir.y) {
                    room.createConstructionSite(reactor.x + x, reactor.y + y, STRUCTURE_ROAD);
                } else {
                    room.createConstructionSite(reactor.x + x, reactor.y + y, STRUCTURE_LAB);
                }
            }
        }

        room.createConstructionSite(reactor.x, reactor.y, STRUCTURE_ROAD);
        room.ai().labs.updateReactor(reactor, dir);
    },
    addBuilding: function(memory, flag) {
        let size = memory.push({ x: flag.pos.x, y: flag.pos.y, dir: flag.color });
        if(size > 1) memory.shift();
    },
    removeBuilding: function(memory, flag) {
        memory.pop();
    }
};

const profiler = require("screeps-profiler");
profiler.registerObject(module.exports, 'construction.reactor');