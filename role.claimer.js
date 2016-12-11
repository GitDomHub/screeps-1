var roleReserver = {
    run: function(creep){
        
        var target = creep.memory.room;
        
        if(creep.room.name != target){
            var priority = creep.pos.findClosestByRange(FIND_FLAGS,{filter:{color:COLOR_WHITE}});
            if(priority) return creep.moveTo(priority);
            var something = Memory.savedRooms[target];
            var destination = new RoomPosition(something.x, something.y, something.roomName);
            creep.moveTo(destination);
        } else {
            var room = creep.room;
            var claimTarget = creep.room.controller;
            if(creep.claimController(claimTarget) == ERR_NOT_IN_RANGE) {
                creep.moveTo(claimTarget);
            }
            
        }
    },
}

module.exports = roleReserver;