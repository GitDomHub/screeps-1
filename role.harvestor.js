var goHome = require('action.goHome');
var findStorage = require ('action.findStorage');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.room.name != creep.memory.spawnRoom.name){
            return goHome(creep);
        }
        
	    if(creep.carry.energy < creep.carryCapacity) {
	        creep.memory.shipping = false;
	        var source;
	        if(creep.memory.source){
	            source = Game.getObjectById(creep.memory.source)
	        } else {
	            var sources = creep.room.find(FIND_SOURCES);
                source = sources[0];
	        }
	        var creepHarvest = creep.harvest(source);
                if(creepHarvest == ERR_NOT_IN_RANGE || creepHarvest == ERR_NOT_ENOUGH_RESOURCES) {
                    if(creep.carry.energy >= 50 && creep.room.energyAvailable < creep.room.energyCapacityAvailable){
                        return findStorage(creep);
                    }
                    creep.moveTo(source);
                }
        }
        else {
            findStorage(creep);
        }
	}
};

module.exports = roleHarvester;