var goHome = require('action.goHome');
var withdrawStorage = require ('action.withdrawStorage');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.room.name != creep.memory.spawnRoom.name){
            return goHome(creep);
        }

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.memory.receiving = false;
        }

        if(creep.memory.upgrading) {
            var random = Math.random();
            if(random > 0.98) return creep.moveTo(creep.room.controller);
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            withdrawStorage(creep,0);
        }
    }
};

module.exports = roleUpgrader;