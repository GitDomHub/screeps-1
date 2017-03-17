//Testing something
var roleHarvester = require('role.harvestor');
var roleUpgrader = require('role.upgrader');
var roleScavenger = require('role.scavenger');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleFortifier = require('role.fortifier');
var roleTransporter = require('role.transporter');
var roleExtender = require('role.extender');
var roleScout = require('role.scout');
var goHome = require('action.goHome');
Array.prototype.partAdd = require('partAdd');
var roleAttacker = require('role.attacker');
var roleRemotePorter = require('role.remotePorter');
var roleReserver = require('role.reserver');
var roleRemoteHarvester = require('role.remoteHarvester');
var rolePatroller = require('role.patroller');
var roleClaimer = require('role.claimer');
var roleLogi = require('role.logi');
module.exports.loop = function () {
    //var roleAttacker = require('role.attacker');
    //var goHome = require('action.goHome');
    //Memory cleanup
    
    if(!Memory.internalCount) Memory.internalCount = 0;
    if(!Memory.hpPercent) Memory.hpPercent = 0.5;
    Memory.internalCount++;
    if(Memory.internalCount%300 === 0){
        for (let name in Memory.creeps) {
            if (Game.creeps[name] == undefined) {
                delete Memory.creeps[name];
            }
        }
        if(Memory.hpPercent == 0.30) Memory.hpPercent = 0.50;
        if(Memory.hpPercent == 0.50) Memory.hpPercent = 0.30;
    }
    
    if(!Memory.rooms['W73S51']) Memory.rooms['W73S51'] = {};
    //put reserved rooms here
    Memory.rooms['W73S51'].reserved = {
        W74S51:{controllerID: '5836b6c98b8b9619519ef5cd',transport:true, harvester:true, x: 23,y:16},
        W72S51:{controllerID: '5836b6f58b8b9619519efa0b',transport:true, harvester:true, x: 1,y:12},
        W73S52:{controllerID: '5836b6e08b8b9619519ef80e',transport:true, harvester:true, x: 19,y:1, single:true}
    }
    Memory.rooms['W74S52'].reserved = {
        W74S53:{controllerID: '5836b6c98b8b9619519ef5d6',transport:true, harvester:true, x: 19,y:1, single:true, singleHarv:true},
        W73S53:{controllerID: '5836b6e08b8b9619519ef811',transport:true, harvester:true, x: 1,y:10, single:true, singleHarv:true}
    }
    
    var war = false;
    var warTarget = "W73S50"; //W72S51

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var role = creep.memory.role;
        switch(role){
            case 'harvester':{
                roleHarvester.run(creep);
                break;
            }
            case 'upgrader':{
                roleUpgrader.run(creep);
                break;
            }
            case 'scavenger':{
                roleScavenger.run(creep);
                break;
            }
            case 'builder':{
                roleBuilder.run(creep);
                break;
            }
            case 'repairer':{
                roleRepairer.run(creep);
                break;
            }
            case 'fortifier':{
                roleFortifier.run(creep);
                break;
            }
            case 'extender':{
                roleExtender.run(creep);
                break;
            }
            case 'transporter':{
                roleTransporter.run(creep);
                break;
            }
            case 'remotePorter':{
                roleRemotePorter.run(creep);
                break;
            }
            case 'scout':{
                roleScout.run(creep);
                break;
            }
            case 'reserver':{
                roleReserver.run(creep);
                break;
            }
            case 'remoteHarvester':{
                roleRemoteHarvester.run(creep);
                break;
            }
            case 'patroller':{
                rolePatroller.run(creep);
                break;
            }
            case 'claimer':{
                roleClaimer.run(creep);
                break;
            }
            case 'logi':{
                roleLogi.run(creep);
                break;
            }
            case 'recycle':{
                goHome(creep);
                break;
            }
            default:{
                if(!war) goHome(creep);
                break;
            }
        }
        if(war){
            switch(role){
                case 'attacker':{
                    roleAttacker.runAttack(creep,warTarget);
                    break;
                }    
                case 'healer':{
                    roleAttacker.runHeal(creep,warTarget);
                    break;
                }
                case 'leech':{
                    roleAttacker.runLeech(creep,warTarget);
                    break;
                }
                case 'tank':{
                    roleAttacker.runTank(creep,warTarget);
                    break;
                }
            }    
        }
    }
    
    for(var name in Game.spawns){
        var spawn = Game.spawns[name];
        var room = spawn.room;
        
        //spawn.createCreep( [CLAIM,MOVE] , undefined, {role: 'claimer',room: 'W74S52'});
        
        var towers = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER && structure.energy > 10;
                }
        });
        for(i=0;i<towers.length;i++){
            var tower = towers[i];
    
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
        
        var totalScav = _.filter(Game.creeps, (creep) => creep.memory.role == 'scavenger' && creep.memory.spawnRoom.name == room.name);
        var totalUp = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.spawnRoom.name == room.name);
        var totalRep = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.spawnRoom.name == room.name);
        var totalBuild = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.spawnRoom.name == room.name);
        var totalFort = _.filter(Game.creeps, (creep) => creep.memory.role == 'fortifier' && creep.memory.spawnRoom.name == room.name);
        var totalTrans = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter' && creep.memory.spawnRoom.name == room.name);
        var totalExt = _.filter(Game.creeps, (creep) => creep.memory.role == 'extender' && creep.memory.spawnRoom.name == room.name);
        var totalScout = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout' && creep.memory.spawnRoom.name == room.name);
        
        
        
        if(!Memory[name]){
            Memory[name] = {};
        } else if(!Memory[name].sources){
            Memory[name].sources = {};
            var sources = room.find(FIND_SOURCES);
            for(i=0;i<sources.length;i++){
                var squares = 0;
                var position = sources[i].pos;
                var xcoord = position.x -1;
                var ycoord = position.y -1;
                for(x=0;x<3;x++){
                    for(y=0;y<3;y++){
                        if(x==1 && y==1) continue;
                        if(room.getPositionAt(xcoord+x,ycoord+y).lookFor(LOOK_TERRAIN) != "wall") squares++;
                    }
                }
                Memory[name].sources[sources[i].id] = sources[i];
                Memory[name].sources[sources[i].id].squares = squares;
            }
        }
        
        var spawnEnergy = room.energyCapacityAvailable;
        var spawnCount = Math.ceil(1700/spawnEnergy)
        var halfUp = Math.ceil(Math.round((spawnEnergy-100)/2)/100);
        var quarterUp = Math.ceil(((spawnEnergy-100) - Math.ceil(Math.round((spawnEnergy-100)/2)/100)*100)/50/2);
        var quarterDown = Math.floor(((spawnEnergy-100) - Math.ceil(Math.round((spawnEnergy-100)/2)/100)*100)/50/2);
        
        var parts = []
        for(var sourceID in Memory[name].sources){
            var source = Memory[name].sources[sourceID];
            var total = _.filter(Game.creeps, (creep) => creep.memory.source == source.id);
            var limit = Memory[name].sources[sourceID].squares;
            var upperLimit = 5-halfUp;
            if(upperLimit < 1) upperLimit = 1;
            if(limit>upperLimit) limit = upperLimit;
            4-halfUp > 0 ? limit += 4 - halfUp : null
            //if(room.energyAvailable >=200 && total.length < (limit/3 >= 1 ? limit/3 : 1) ){
                //return spawn.createCreep( [WORK, CARRY, MOVE], undefined,{role: 'harvester', source:source.id, spawnRoom:room});
            //}else 
            if(total.length < limit ){
                parts = [];
                halfUp > 7 ? halfUp = 7 : null
                parts.partAdd(WORK,halfUp);
                parts.partAdd(CARRY,Math.ceil(halfUp/2));
                parts.partAdd(MOVE,Math.ceil(halfUp/2));
                return spawn.createCreep( parts, undefined,{role: 'harvester', source:source.id, spawnRoom:room});
            }
        }
        
        if(totalScout.length < 0){
            spawn.createCreep( [MOVE], undefined, {role: 'scout',spawnRoom:room});
        }
        
        parts = []
        parts.partAdd(WORK,halfUp);
        parts.partAdd(CARRY,quarterDown+1);
        parts.partAdd(MOVE,quarterUp+1);
        
        //spawning decisions
        if(totalExt.length < 0){
            parts = [];
            var aThird = Math.floor(spawnEnergy/6/50);
            parts.partAdd(CARRY,aThird*2);
            parts.partAdd(MOVE,aThird);
            spawn.createCreep( parts, undefined, {role: 'extender',spawnRoom:room});
        } else if(totalTrans.length < 2){
            parts = [];
            var aThird = Math.floor(spawnEnergy/3/50);
            if(aThird > 10) aThird = 10;
            parts.partAdd(CARRY,aThird*2);
            parts.partAdd(MOVE,aThird);
            spawn.createCreep( parts, undefined, {role: 'transporter',spawnRoom:room});
        } else if(totalUp.length < 0){
            spawn.createCreep( parts, undefined,{role: 'upgrader',spawnRoom:room});
        } else if(totalScav.length < 1){
            spawn.createCreep( parts, undefined,{role: 'scavenger',spawnRoom:room});
        } else if(totalBuild.length < 1){
            spawn.createCreep( parts, undefined, {role: 'builder',spawnRoom:room});
        } else if(totalRep.length < 1){
            spawn.createCreep( parts, undefined, {role: 'repairer',spawnRoom:room});
        } else if(totalFort.length < 1){
            spawn.createCreep( parts, undefined, {role: 'fortifier',spawnRoom:room});
        } else {
            
            var reservedRooms = Memory.rooms[room.name].reserved;
            var patroller = _.filter(Game.creeps, (creep) => creep.memory.role == 'patroller');
            for(var reservedRoom in Game.rooms){
                var roomObj = Game.rooms[reservedRoom];
                if(roomObj.find(FIND_HOSTILE_CREEPS).length){
                    if(!patroller.length){
                        parts = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE];
                        spawn.createCreep( parts , undefined, {role: 'patroller',spawnRoom:room});
                    }
                }
            }
            var reserveSpawn = false;
            for(var reservedRoom in reservedRooms){
                var roomObj = reservedRooms[reservedRoom];
                var reservers = _.filter(Game.creeps, (creep) => creep.memory.role == 'reserver' && creep.memory.room == reservedRoom);
                var harvester1 = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteHarvester' && creep.memory.room == reservedRoom && creep.memory.spawn1);
                var harvester2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteHarvester' && creep.memory.room == reservedRoom && !creep.memory.spawn1);
                var porter = _.filter(Game.creeps, (creep) => creep.memory.role == 'remotePorter' && creep.memory.room == reservedRoom);
                if(!reservers.length && !roomObj.noctrl){
                    parts = [CLAIM,MOVE];
                    var roomController = Game.getObjectById(reservedRooms[reservedRoom].controllerID);
                    var controllerReserve = 0
                    if(roomController && roomController.reservation) controllerReserve = roomController.reservation.ticksToEnd;
                    if(controllerReserve < 1000) parts.push(CLAIM);
                    spawn.createCreep( parts , undefined, {role: 'reserver',room:reservedRoom});
                    reserveSpawn = true;
                } else if(!harvester1.length && roomObj.harvester){
                    parts = [];
                    parts.partAdd(WORK,7);
                    parts.partAdd(CARRY,5);
                    parts.partAdd(MOVE,6);
                    spawn.createCreep( parts, undefined, {role: 'remoteHarvester',room:reservedRoom,spawn1:true});
                    reserveSpawn = true;
                } else if(porter.length < 1 && roomObj.transport){
                    parts = [];
                    parts.partAdd(CARRY,16);
                    parts.partAdd(MOVE,8);
                    spawn.createCreep( parts, undefined,{role: 'remotePorter',room:reservedRoom,x:roomObj.x,y:roomObj.y,spawnRoom:room});
                    reserveSpawn = true;
                } else if(!harvester2.length && roomObj.harvester && !roomObj.singleHarv){
                    parts = [];
                    parts.partAdd(WORK,7);
                    parts.partAdd(CARRY,5);
                    parts.partAdd(MOVE,6);
                    spawn.createCreep( parts, undefined, {role: 'remoteHarvester',room:reservedRoom,spawn1:false});
                    reserveSpawn = true;
                } else if(porter.length < 2 && roomObj.transport && !roomObj.single){
                    parts = [];
                    parts.partAdd(CARRY,20);
                    parts.partAdd(MOVE,10);
                    spawn.createCreep( parts, undefined,{role: 'remotePorter',room:reservedRoom,x:roomObj.x,y:roomObj.y,spawnRoom:room});
                    reserveSpawn = true;
                }
            }
            if(room.controller.level >= 9){
                var logi =  _.filter(Game.creeps, (creep) => creep.memory.role == 'logi');
                if(!reserveSpawn) {
                        parts = [];
                        var aThird = Math.floor(spawnEnergy/3/50);
                        if(aThird > 10) aThird = 10;
                        parts.partAdd(CARRY,aThird*2);
                        parts.partAdd(MOVE,aThird);
                        spawn.createCreep( parts, undefined, {role: 'logi',room:'W74S52',spawnRoom:room});
                }
            }
        }
        
        //var low = Game.spawns[name].room.find(FIND_MY_CREEPS,{filter: c => {return c.ticksToLive < 1000 c.getRangeTo(Game.spawns[name]) == 1}});
        //spawn.recycleCreep(low[0]);
        //var totalTank = _.filter(Game.creeps, (creep) => creep.memory.role == 'tank');
        //var totalATK = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        //var totalHeal = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');
        //var totalLeech = _.filter(Game.creeps, (creep) => creep.memory.role == 'leech');
        //var v = [];
        //v = v.concat(totalTank,totalATK,totalHeal,totalLeech);
        var totalRecycle = _.filter(Game.creeps, (creep) => creep.memory.role == 'recycle');
        for(i=0;i<totalRecycle.length;i++) spawn.recycleCreep(totalRecycle[i]);
        
        if(war){
            var totalTank = _.filter(Game.creeps, (creep) => creep.memory.role == 'tank');
            var totalATK = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
            var totalHeal = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');
            var totalLeech = _.filter(Game.creeps, (creep) => creep.memory.role == 'leech');

            if(totalATK.length < 0){
                parts = [];
                var aQuart = Math.floor(spawnEnergy/4/100)*100;
                parts.partAdd(RANGED_ATTACK, aQuart*3/150);
                parts.partAdd(MOVE,aQuart/50);
                spawn.createCreep( parts , undefined, {role: 'attacker',spawnRoom:room});
            } else if(totalATK.length < 1){
                //melee attackers
                parts = [];
                var aQuart = Math.floor(spawnEnergy-50/21);
                parts.partAdd(ATTACK, Math.floor(aQuart*16/80));
                parts.partAdd(MOVE,Math.ceil(aQuart*5/50));
                spawn.createCreep( parts , undefined, {role: 'attacker',spawnRoom:room});
            } else if(totalTank.length < 0){
                parts = [];
                var aQuart = Math.floor(spawnEnergy/6/100)*100;
                parts.partAdd(TOUGH, aQuart*5/50);
                parts.partAdd(MOVE,aQuart/10);
                spawn.createCreep( parts, undefined, {role: 'tank',spawnRoom:room});
            } else if(totalHeal.length < 0){
                parts = [];
                var aQuart = Math.floor(spawnEnergy/12/100)*100;
                parts.partAdd(HEAL, aQuart*11/250);
                parts.partAdd(MOVE,aQuart/50);
                spawn.createCreep( parts, undefined, {role: 'healer',spawnRoom:room});
            } else if(totalLeech.length < 0){
                parts = [];
                var aThird = Math.floor(spawnEnergy/11/100)*100;
                parts.partAdd(TOUGH, aThird/10);
                parts.partAdd(CARRY,aThird*5/50);
                parts.partAdd(MOVE,aThird*5/50);
                spawn.createCreep( parts, undefined, {role: 'leech',spawnRoom:room});
            }
        }
    }
    
}