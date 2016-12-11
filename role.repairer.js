var roleBuilder = require('role.builder');
var goHome = require('action.goHome');
var withdrawStorage = require ('action.withdrawStorage');

var roleRepairer = {
    
    run: function(creep,hp) {
        
        if(creep.room.name != creep.memory.spawnRoom.name){
            return goHome(creep);
        }
        
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            creep.memory.receiving = false;
        }

        if (creep.memory.working == true) {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax*Memory.hpPercent && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
            });

            if (structure != undefined) {
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else {
                roleBuilder.run(creep);
            }
        }
        else {
            withdrawStorage(creep,0.5);
        }
    }
}

module.exports = roleRepairer;