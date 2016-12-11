var goHome = require('action.goHome');

var roleAttacker = {
    runAttack: function(creep,target){
        if(target==""){
            return goHome(creep);
        }
        
        if(creep.room.name != target){
            var priority = creep.pos.findClosestByRange(FIND_FLAGS,{filter:{color:COLOR_WHITE}});
            if(priority) return creep.moveTo(priority);
            var something = Memory.savedRooms[target];
            var destination = new RoomPosition(something.x, something.y, something.roomName);
            creep.moveTo(destination);
        } else {
            var room = creep.room;
            //var hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            //if(hostile && creep.rangedAttack(hostile) == 0) return;
            var priority = creep.pos.findClosestByRange(FIND_FLAGS,{filter:{color:COLOR_RED}});
            //if(!priority) priority = creep.pos.findClosestByRange(FIND_FLAGS,{filter:{color:COLOR_BLUE}});
            if(!priority) priority = creep.pos.findClosestByRange(FIND_FLAGS,{filter:{color:COLOR_PURPLE}});
            if(!priority) return goHome(creep);
            var attackTarget = priority.pos.lookFor(LOOK_STRUCTURES)[0];
            if(!attackTarget) priority.remove();
            Math.random() > 0.60 ? creep.moveTo(attackTarget) : null
            var melee = creep.attack(attackTarget);
            if(melee==-12){
                if(creep.rangedAttack(attackTarget)== ERR_NOT_IN_RANGE){
                    return creep.moveTo(attackTarget);
                }
            } else if(melee == ERR_NOT_IN_RANGE) {
                creep.moveTo(attackTarget);
            }
            
        }
    },
    runHeal: function(creep,target){
        if(target==""){
            return goHome(creep);
        }
        
        if(creep.room.name != target){
            var priority = creep.pos.findClosestByRange(FIND_FLAGS,{filter:{color:COLOR_WHITE}});
            if(priority) return creep.moveTo(priority);
            var something = Memory.savedRooms[target];
            var destination = new RoomPosition(something.x, something.y, something.roomName);
            creep.moveTo(destination);
        } else {
            var units = creep.room.find(FIND_MY_CREEPS);
            units = _.sortBy(units, u=> u.hits/u.hitsMax);
            if(!units.length) return;
            creep.heal(units[0]);
            creep.moveTo(units[0]);   
        }
    },
    runLeech: function(creep,target){
        if(target==""){
            return goHome(creep);
        }
        if(creep.room.name != target){
            var priority = creep.pos.findClosestByRange(FIND_FLAGS,{filter:{color:COLOR_WHITE}});
            if(priority) return creep.moveTo(priority);
            var something = Memory.savedRooms[target];
            var destination = new RoomPosition(something.x, something.y, something.roomName);
            creep.moveTo(destination);
        } else {
            if(creep.carry[RESOURCE_ENERGY] > 0) return creep.drop(RESOURCE_ENERGY);
            var room = creep.room;
            var priority = creep.pos.findClosestByRange(FIND_FLAGS,{filter:{color:COLOR_BLUE}});
            if(!priority) return goHome(creep);
            var attackTarget = priority.pos.lookFor(LOOK_STRUCTURES)[0];
            if(!attackTarget) priority.remove();
            if(creep.withdraw(attackTarget,RESOURCE_ENERGY)== ERR_NOT_IN_RANGE){
                return creep.moveTo(attackTarget);
            }
        }
    },
    runTank: function(creep,target){
        if(target==""){
            return goHome(creep);
        }
        if(creep.room.name != target){
            var priority = creep.pos.findClosestByRange(FIND_FLAGS,{filter:{color:COLOR_WHITE}});
            if(priority) return creep.moveTo(priority);
            var something = Memory.savedRooms[target];
            var destination = new RoomPosition(something.x, something.y, something.roomName);
            creep.moveTo(destination);
        } else {
            if(creep.carry[RESOURCE_ENERGY] > 0) return creep.drop(RESOURCE_ENERGY);
            var room = creep.room;
            var priority = creep.pos.findClosestByRange(FIND_FLAGS,{filter:{color:COLOR_BLUE}});
            if(!priority) return goHome(creep);
            var attackTarget = priority.pos.lookFor(LOOK_STRUCTURES)[0];
            if(!attackTarget) priority.remove();
            creep.moveTo(attackTarget);
        }
    },
    runPowerH: function(creep,target){
        if(target==""){
            return goHome(creep);
        }
    }
}

module.exports = roleAttacker;