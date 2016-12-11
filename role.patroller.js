var goHome = require('action.goHome');
var moveRoom = require('action.moveRoom');

var rolePatroller = {
    run: function(creep){
        
        var priority = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(priority) {
            if(creep.attack(priority) == ERR_NOT_IN_RANGE){
                creep.moveTo(priority);
            }
            return;
        }
        
        for(var reservedRoom in Game.rooms){
            var roomObj = Game.rooms[reservedRoom];
            var hostiles = roomObj.find(FIND_HOSTILE_CREEPS);
            if(hostiles.length){
                console.log(hostiles[0]);
                creep.memory.destination = roomObj.name;
                if(creep.rangedAttack(hostiles[0])==ERR_NOT_IN_RANGE){
                    creep.moveTo(hostiles[0]);
                }
            } else if(creep.memory.destination){
                return moveRoom(creep);
            }else{
                goHome(creep);
            }
        }
        
        
    }
}

module.exports = rolePatroller;