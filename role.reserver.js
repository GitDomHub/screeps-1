var goHome = require('action.goHome');

var roleReserver = {
    run: function(creep){
        
        target = creep.memory.room;
        
        if(creep.room.name != target){
            var something = Memory.savedRooms[target];
            var destination = new RoomPosition(something.x, something.y, something.roomName);
            creep.moveTo(destination);
        } else {
            var room = creep.room;
            var claimTarget = room.controller;
            if(creep.reserveController(claimTarget) == ERR_NOT_IN_RANGE) {
                creep.moveTo(claimTarget);
            }
            
        }
    },
}

module.exports = roleReserver;