var goHome = require('action.goHome');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target = creep.memory.room;
        
        if(creep.room.name != target){
            var something = Memory.savedRooms[target];
            var destination = new RoomPosition(something.x, something.y, something.roomName);
            creep.moveTo(destination);
        } else {
            
            if(creep.memory.harvesting == undefined) creep.memory.harvesting = true;
            if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
                creep.memory.harvesting = false;
            }
            if(!creep.memory.harvesting && creep.carry.energy == 0) {
                creep.memory.harvesting = true;
            }
            
            if(creep.memory.harvesting) {
                var color = COLOR_YELLOW;
                if(!creep.memory.spawn1) color = COLOR_GREEN;
                
                var targets = creep.room.find(FIND_DROPPED_ENERGY);
                if(targets.length) {
                    targets = _.sortBy(targets, t=> creep.pos.getRangeTo(t));
                    if(creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                    return;
                }
                
                var priority = creep.pos.findClosestByRange(FIND_FLAGS,{filter:{color:color}});
                var source = priority.pos.lookFor(LOOK_SOURCES)[0];
                
    	        var creepHarvest = creep.harvest(source);
                    if(creepHarvest == ERR_NOT_IN_RANGE || creepHarvest == ERR_NOT_ENOUGH_RESOURCES) {
                        creep.moveTo(source);
                    }
            }
            else {

                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax*Memory.hpPercent && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
                });
                if(structure){
                        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure);
                    }
                    return;
                }
                
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    targets = _.sortBy(targets, t=> creep.pos.getRangeTo(t));
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                    return;
                }
                
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                                return structure.structureType == STRUCTURE_CONTAINER  && 
                                structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                });
                
                if(!targets.length){
                    structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
                    });
                    if(structure){
                            if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(structure);
                        }
                        return;
                    }
                }
                
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                
            }
        }
	}
};

module.exports = roleHarvester;