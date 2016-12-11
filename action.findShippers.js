function findShippers(creep){
    var shippers = creep.room.find(FIND_MY_CREEPS,{
        filter: c => {return c.memory.shipping}
    });
    shippers = _.sortBy(shippers, s=> creep.pos.getRangeTo(s));
    if(shippers.length) return creep.moveTo(shippers[0]);
    var spawn = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_SPAWN;
        }
    });
    creep.moveTo(spawn[0]);
}
module.exports = findShippers;