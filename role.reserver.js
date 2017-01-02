var spawnHelper = require('helper.spawning');

module.exports = {
    name: "reserver",
    partConfigs: [
        [CLAIM, MOVE]
    ],
    shouldBuild: function(spawn) {
        return false;
    },
    chooseParts: function(room) {
        return spawnHelper.bestAvailableParts(room, this.partConfigs);
    },
    run: function(creep) {
        var targetPos = new RoomPosition(creep.memory.target.x, creep.memory.target.y, creep.memory.target.roomName);
        if(creep.room.name != targetPos.roomName) {
            creep.moveTo(targetPos);
            return;
        }

        if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
};