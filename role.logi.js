var goHome = require('action.goHome');
var findStorage = require ('action.findStorage');

var roleLogi = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.say("LOGI");
        if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity && creep.room.name == creep.memory.spawnRoom.name) {
            var room = creep.room;
            var storage = room.storage;
            if(creep.withdraw(storage,RESOURCE_ENERGY)== ERR_NOT_IN_RANGE){
                return creep.moveTo(storage);
            }
        } else if(creep.room.name != creep.memory.room && creep.carry[RESOURCE_ENERGY] == creep.carryCapacity){
            var destination = new RoomPosition(25, 25, creep.memory.room);
            creep.moveTo(destination);
        } 
        else {
            if(creep.carry[RESOURCE_ENERGY] < 50){
                /* recycle
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_SPAWN
                    }
                });
                if(creep.pos.getRangeTo(targets[0]) != 1){
                    return creep.moveTo(targets[0])
                } else {
                    return creep.memory.role = 'recycle';
                }
                end recycle */
                return goHome(creep);
            }
            
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_SPAWN && 
                                structure.energy < structure.energyCapacity;
                    }
            });
            
            if(!targets.length){
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                                return structure.structureType == STRUCTURE_STORAGE  && 
                                structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                });
            }
            
            if(!targets.length){
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER && 
                                structure.store[RESOURCE_ENERGY] < 1500;
                    }
                });
            }
            
            if(targets.length > 0) {
                var transporters = creep.room.find(FIND_MY_CREEPS,{
                    filter: c => {return c.memory.role == "transporter" && c.carry[RESOURCE_ENERGY] < c.carryCapacity;}
                });
                //Transfers to transporter if in range
                transporters = _.sortBy(transporters, t=> creep.pos.getRangeTo(t));
                if(transporters.length && creep.transfer(transporters[0],RESOURCE_ENERGY) != ERR_NOT_IN_RANGE) return;
                
                targets = _.sortBy(targets, t=> creep.pos.getRangeTo(t));
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    }
};

module.exports = roleLogi;