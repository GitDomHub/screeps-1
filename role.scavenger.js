var roleUpgrader = require('role.upgrader');
var findStorage = require ('action.findStorage');
var goHome = require('action.goHome');


var roleScavenger = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.room.name != creep.memory.spawnRoom.name){
            return goHome(creep);
        }

        if(creep.memory.scavenging && creep.carry.energy == creep.carryCapacity) {
            creep.memory.scavenging = false;
        }
        if(!creep.memory.scavenging && creep.carry.energy === 0) {
            creep.memory.scavenging = true;
        }

        if(creep.memory.scavenging) {
            var targets = creep.room.find(FIND_DROPPED_ENERGY,{
                filter: (s) => s.amount >25 
            });
            if(targets.length) {
                targets = _.sortBy(targets, t=> creep.pos.getRangeTo(t));
                if(creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                roleUpgrader.run(creep);
            }
        } else {
            roleUpgrader.run(creep);
        }
    }
};

module.exports = roleScavenger;