function findStorage(creep){
            creep.memory.shipping = true;
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_EXTENSION && 
                                structure.energy < structure.energyCapacity &&
                                creep.pos.getRangeTo(structure) < 6;
                    }
            });
            
            if(!targets.length){
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                                return structure.structureType == STRUCTURE_CONTAINER  && 
                                structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                });
            }
            
            if(!targets.length){
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_SPAWN && 
                                structure.energy < structure.energyCapacity;
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

module.exports = findStorage;