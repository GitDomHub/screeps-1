function moveRoom(creep){
        var direction = new RoomPosition(21, 23, creep.memory.destination);
        return creep.moveTo(direction);
}

module.exports = moveRoom;