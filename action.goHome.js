function goHome(creep){
    if(!creep.memory.spawnRoom && creep.memory.room) return;
    if(!creep.memory.spawnRoom){
        var direction = new RoomPosition(21, 23, 'W73S51');
        return console.log(creep.moveTo(direction));
    }
    if(creep.memory.spawnRoom.name != creep.room.name){
        var direction = new RoomPosition(21, 23, creep.memory.spawnRoom.name);
        return creep.moveTo(direction);
    }
    var spawns = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN
            }
        });
    creep.moveTo(spawns[0]);
    
}

module.exports = goHome;