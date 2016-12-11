function withdrawStorage(creep,limit){
            creep.memory.receiving = true;
            var targets = creep.room.find(FIND_STRUCTURES,{
                filter: (s)=>{
                    return s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE
                }
            })
            if(!targets.length){
                targets = creep.room.find(FIND_STRUCTURES,{
                    filter:(s)=>{return s.structureType == STRUCTURE_SPAWN;}
                })
            }
            if(targets.length > 0) {
                if(targets[0].structureType == STRUCTURE_CONTAINER) targets = _.filter(targets, t=> {return t.store[RESOURCE_ENERGY] > 200});
                targets = _.sortBy(targets, t=> creep.pos.getRangeTo(t));
                var withdraw = creep.withdraw(targets[0], RESOURCE_ENERGY);
                if(withdraw == ERR_NOT_IN_RANGE || ERR_NOT_ENOUGH_RESOURCES){
                    creep.moveTo(targets[0]);
                }
            }
        }

module.exports = withdrawStorage;