var roleScout = {
    run: function(creep){
        if(!creep.memory.destination) creep.memory.destination = {};
    
        if(creep.memory.destination.roomName != creep.room.name){
            //resetting unstucker
            creep.memory.unstucker = 0;
            
            //saving to memory
            if(!Memory.savedRooms) Memory.savedRooms = {};
            if(!Memory.savedRooms[creep.room.name]) Memory.savedRooms[creep.room.name] = creep.room.getPositionAt(25,25);
            
            var exits = Game.map.describeExits(creep.room.name);
            var roomsInMemory = Memory.savedRooms;
            var exitArray = [];
            for(var exitDirection in exits){
                if(!roomsInMemory[exits[exitDirection]]){
                    exitArray.push(exits[exitDirection]);
                }
            }
            
            //already explored
            if(!exitArray.length){
                for(var exitDirection in exits){
                    exitArray.push(exits[exitDirection]);
                }
            }
            
            var randomIndex = Math.floor(Math.random()*exitArray.length);
            var destination = creep.pos.findClosestByPath(creep.room.findExitTo(exitArray[randomIndex]));
            
            //new destination
            creep.memory.destination = destination;
            creep.moveTo(destination.x,destination.y);
            
            //saving to memory
            creep.memory.distance++;
        } else {
            var destination = creep.memory.destination;
            creep.moveTo(destination.x,destination.y);
            if(creep.pos.y == destination.y && creep.pos.x == destination.x){
                creep.memory.unstucker++;
            }
            if(creep.memory.unstucker == 3){
                creep.memory.destination.roomName = "";
            }
        }
    }
}

module.exports = roleScout;