var goHome = require('action.goHome');
var withdrawStorage = require ('action.withdrawStorage');
var findShippers = require ('action.findShippers');

var roleTransporter = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.room.name != creep.memory.spawnRoom.name){
            return goHome(creep);
        }
        
        if(creep.memory.transporting && creep.carry.energy < 50) {
            creep.memory.transporting = false;
        }
        if(!creep.memory.transporting && creep.carry.energy > 200) {
            creep.memory.transporting = true;
        }
        if(creep.memory.transporting === undefined){
            creep.memory.transporting = true;
        }

        if(!creep.memory.transporting) {
            creep.say("RECEIVING");
            var targets = creep.room.find(FIND_DROPPED_ENERGY,{
                filter: (s) => s.amount >200 
            });
            if(targets.length) {
                targets = _.sortBy(targets, t=> creep.pos.getRangeTo(t));
                if(creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                    return
                }
            }
            var sourceContainerID = creep.room.memory.sourceContainers;
            if(sourceContainerID){
                var sourceContainers = [];
                var refs = creep.room.memory.accountedContainer;
                for(i=0;i<sourceContainerID.length;i++){
                    if(!refs) refs = {};
                    for(var creepID in refs){
                        if(creepID == creep.id) continue;
                        if(sourceContainerID[i] == refs[creepID] ){
                            continue
                        }
                    }
                    var container = Game.getObjectById(sourceContainerID[i]);
                    if(container.store[RESOURCE_ENERGY] < 750) continue;
                    sourceContainers.push(container)
                }
                sourceContainers = _.sortBy(sourceContainers, c=> c.store[RESOURCE_ENERGY]);
                if(sourceContainers.length){
                    var sourceID = sourceContainers.length >= 1 ? sourceContainers.length-1 : 0;
                    var largestSource = sourceContainers[sourceID];
                    creep.room.memory.accountedContainer[creep.id] = largestSource.id;
                    if(creep.withdraw(largestSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(largestSource);
                    }   
                } else {
                    if(creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > creep.carryCapacity - creep.carry[RESOURCE_ENERGY]){
                        if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                            creep.moveTo(creep.room.storage);
                        }   
                        return;
                    }
                    findShippers(creep);
                }
            } else {
                findShippers(creep);
            }
            
        } else {
            creep.say("SHIPPING");
            var refs = creep.room.memory.accountedContainer;
            for(var creepID in refs){
                if(creepID == creep.id) {
                    creep.room.memory.accountedContainer[creepID] = undefined;
                    break;
                }
            }  
            var spawn = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_EXTENSION) && 
                            structure.energy < structure.energyCapacity
                }
            });
            spawn = _.sortBy(spawn, s=> creep.pos.getRangeTo(s));
            if(spawn.length){
                if(creep.transfer(spawn[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(spawn[0]);
                }
                return;
            }
            var receivers = creep.room.find(FIND_MY_CREEPS,{
                filter: c => {return c.memory.receiving}
            });
            receivers = _.sortBy(receivers, s=> creep.pos.getRangeTo(s));
            if(receivers.length && creep.transfer(receivers[0],RESOURCE_ENERGY) != ERR_NOT_IN_RANGE){
                return
            }
            var exitContainerID = creep.room.memory.exitContainers;
            if(exitContainerID){
                var exitContainers = [];
                for(i=0;i<exitContainerID.length;i++){
                    var container = Game.getObjectById(exitContainerID[i]);
                    if(container.store[RESOURCE_ENERGY] > 1500) continue;
                    exitContainers.push(container)
                }
                exitContainers = _.sortBy(exitContainers, c=> c.store[RESOURCE_ENERGY]);
                if(exitContainers.length){
                    if(creep.transfer(exitContainers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(exitContainers[0]);
                    }
                } else {
                    if(receivers.length && creep.transfer(receivers[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        return creep.moveTo(receivers[0]);
                    }
                    storage = creep.room.storage
                    if(storage && creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(storage);
                    }
                }
            }
        }
    }
};

module.exports = roleTransporter;