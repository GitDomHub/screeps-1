var roleRepairer = require('role.repairer');
var goHome = require('action.goHome');
var withdrawStorage = require ('action.withdrawStorage');

var roleFortifier = {
    
    run: function(creep) {
        
        if(creep.room.name != creep.memory.spawnRoom.name){
            return goHome(creep);
        }
        
        if (creep.memory.working && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        else if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.receiving = false;
        }

        if (creep.memory.working == true) {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.hits < s.hitsMax*0.0001) || (s.hits < s.hitsMax*0.01 && s.structureType != STRUCTURE_WALL)
            });

            if (structure != undefined) {
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else {
                roleRepairer.run(creep);
            }
        }
        else {
            withdrawStorage(creep,0.5);
        }
    }
}

module.exports = roleFortifier;