var goHome = require('action.goHome');
var withdrawStorage = require ('action.withdrawStorage');
var findShippers = require ('action.findShippers');

var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.transporting && creep.carry.energy == 0) {
            creep.memory.transporting = false;
        }
        if(!creep.memory.transporting && creep.carry.energy > 50) {
            creep.memory.transporting = true;
        }
        if(creep.memory.transporting === undefined){
            creep.memory.transporting = true;
        }

        if(!creep.memory.transporting) {
            creep.say("BEEP");
            var creepMem = creep.memory;
            if(creepMem.room != creep.room.name){
                return creep.moveTo(new RoomPosition(creepMem.x, creepMem.y, creepMem.room))
            }
            var room = creep.room;
            var priority = creep.pos.findClosestByRange(FIND_FLAGS,{filter:{color:COLOR_BLUE}});
            if(!priority){
                return creep.memory.role = 'recycle';
            }
            var buildings = priority.pos.lookFor(LOOK_STRUCTURES);
            var attackTarget = buildings[0];
            if(buildings[0].structureType != STRUCTURE_CONTAINER && buildings.length == 2) attackTarget = buildings[1];
            if(!attackTarget) priority.remove();
            if(creep.withdraw(attackTarget,RESOURCE_ENERGY)== ERR_NOT_IN_RANGE){
                return creep.moveTo(attackTarget);
            }
        } else {
            creep.say("BOOP");
            if(creep.room.name != creep.memory.spawnRoom.name) return goHome(creep);
            var target = creep.room.storage;
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }   
        }
    }
};

module.exports = roleTransporter;