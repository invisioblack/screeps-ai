const logistic = require('helper.logistic');
const miner = require("role.miner");
const spawnHelper = require("helper.spawning");
const store = require("construction.stores");

module.exports = class SourcesAspect {
    constructor(roomai) {
        this.roomai = roomai;
        this.room = roomai.room;
        this.sources = this.room.find(FIND_SOURCES);

        // order sources by distance to primary spawn, to ensure that aspects
        // work on that source first
        this.sources = _.sortBy(this.sources, (s) => s.pos.getRangeTo(roomai.spawns.primary));
    }

    run() {
        this.buildStores();
        this.buildMiners();
    }

    buildStores() {
        if(!this.roomai.intervals.buildStores.isActive()) {
            return;
        }

        for(let source of this.sources) {
            store.buildWithAccessTo(source, true);
        }
    }

    buildMiners() {
        if(!this.roomai.canSpawn()) {
            return;
        }

        let parts = spawnHelper.bestAffordableParts(this.room, miner.energyConfigs, true);
        let spawnDuration = spawnHelper.spawnDuration(parts);
        let existingMiners = _.filter(spawnHelper.localCreepsWithRole(this.roomai, miner.name), (c) => !c.ticksToLive || c.ticksToLive > spawnDuration);
        for(let source of this.sources) {
            if(!_.any(existingMiners, (m) => m.memory.target == source.id) &&
                logistic.storeFor(source)) {

                var memory = {
                    role: miner.name,
                    target: source.id,
                    resource: RESOURCE_ENERGY
                };

                this.roomai.spawn(parts, memory);
            }
        }

    }
}

const profiler = require("screeps-profiler");
profiler.registerClass(module.exports, 'SourcesAspect');
