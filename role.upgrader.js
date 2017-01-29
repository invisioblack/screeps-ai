var spawnHelper = require('helper.spawning');
var logistic = require('helper.logistic');

module.exports = {
    name: "upgrader",
    partConfigs: [
        [WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, CARRY, MOVE, CARRY, CARRY, MOVE],
        [WORK, WORK, WORK, WORK, CARRY, WORK, MOVE, CARRY, MOVE, CARRY, MOVE],
        [WORK, CARRY, WORK, MOVE, CARRY, MOVE, CARRY, MOVE],
        [WORK, WORK, CARRY, MOVE, CARRY, MOVE],
        [WORK, WORK, CARRY, MOVE]
    ],
    run: function(creep) {
        var controller = creep.room.controller;
        var container = logistic.storeFor(controller);
        if(container && container.store.energy > 0) {
            var withdrawResult = OK;
            
            // only really withdraw when the carry is empty, because only one
            // creep can withdraw from a container in the same tick. So we ensure
            // that multiple ugraders can do their job simultaneously
            if(creep.carry.energy == 0) {
                withdrawResult = creep.withdraw(container, RESOURCE_ENERGY);
            }
            
            if(withdrawResult == OK) {
                if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                }
            } else if(withdrawResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
          
          return;
        }
        
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        }
        else {
            var source = controller.pos.findClosestByRange(FIND_SOURCES);
            logistic.obtainEnergy(creep, source);
        }
    }
};