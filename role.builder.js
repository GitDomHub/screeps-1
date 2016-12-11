var roleUpgrader = require('role.upgrader');
var goHome = require('action.goHome');
var withdrawStorage = require ('action.withdrawStorage');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.room.name != creep.memory.spawnRoom.name){
            return goHome(creep);
        }

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.memory.receiving = false;
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                targets = _.sortBy(targets, t=> creep.pos.getRangeTo(t));
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                roleUpgrader.run(creep);
            }
        }
        else {
            withdrawStorage(creep,0.5);
        }
    }
};

module.exports = roleBuilder;