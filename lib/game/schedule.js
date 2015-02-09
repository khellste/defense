ig.module(
	'game.schedule'
).requires(
	'impact.game',
	'game.core.timeline',
	'game.entities.hunter',
    'game.entities.dark-summoner',
    'game.entities.dark-cleric',
    'game.entities.fx.grid-glow'
).defines(function () {

// Some aliases to make level definitions much shorter
var R = function (a, b) { return new Tower.Action.Repeat(a, b); };
var D = function (a) { return new Tower.Action.Delay(a, false); };
var S = function () { return new Tower.Action.Sequence([].slice.call(arguments)); };

// Create a knight
var K = function (x, speed, health, value) {
    return new Tower.Action(function (done) {
        ig.game.spawnEntity(EntityHunter, 8*x, 0, {
            speed: speed, health: health, value: value
        });
        done();
    });
};

// Create a summoner
var MM = EntityDarkSummoner, MK = EntityHunter, MC = EntityDarkCleric;
var M = function (x, speed, health, value, interval, limit, type, opts) {
    return new Tower.Action(function (done) {
        ig.game.spawnEntity(EntityDarkSummoner, 8*x, 0, {
            speed: speed, health: health,
            value: value, actionInterval: interval,
            summonLimit: limit, summons: type,
            summonOpts: opts || { }
        });
        done();
    });
};

// Create a cleric
var C = function (x, speed, health, value, magic, interval) {
    return new Tower.Action(function(done) {
        ig.game.spawnEntity(EntityDarkCleric, 8*x, 0, {
            speed: speed, health: health,
            value: value, magic: magic, actionInterval: interval
        });
        done();
    });
};

var Lv = function (coords, action, cash) {
    var level = new Tower.Action.Sequence([
        new Tower.Action(function (done) {
            if (typeof cash == 'number') {
                Tower.treasury.funds += cash;
            }
            done();
        }),
        new Tower.Action.Delay(15, true),
        new Tower.Action(function (done) {
            var kill = function (e) { e.kill(); };
            ig.game.getEntitiesByType(GridGlowFX).forEach(kill);
            ig.music2.sequence('battle-sf', 'battle-fast');
            done();
        }),
        action
    ]);
    level.coords = coords;
    return level;
};

Tower.timeline = [
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
//\\//\\//\\//\ LEVEL DEFINITIONS \\//\\//\\//\\
/* 1*/Lv([4],R(5,S(K(4,5,5,4),D(5))),100),
/* 2*/Lv([4,6],R(5,S(K(4,4,5,4),K(6,4,5,4),D(7))),50),
/* 3*/Lv([4,6],R(2,S(K(4,5,5,4),D(2),K(4,5,5,4),K(6,5,5,4),D(5),K(6,5,5,4),D(2),K(4,5,5,4),K(6,5,5,4),D(5))),50),
/* 4*/Lv([3,4,6,7],R(2,S(K(3,4,6,7),R(3,S(K(6,8,5,5),D(2))),D(6),K(7,4,6,7),R(3,S(K(4,8,5,5),D(2))),D(4))),75),
/* 5*/Lv([3,4,6],S(C(3,5,25,20,10,1),R(3,S(K(4,5,10,8),K(6,5,10,8),D(4)))),75),
/* 6*/Lv([7],R(10,S(K(7,15,10,6),D(2))),75),
/* 7*/Lv([3,7],R(6,S(K(3,15,10,7),D(1),K(7,15,10,6),D(1))),100),
/* 8*/Lv([3,4,6,7],S(M(4,2,15,20,20,1,5,MK,{speed:5,health:10,value:8}),M(6,2,15,20,20,1,5,MK,{speed:5,health:10,value:8}),D(10),M(3,2,15,20,20,1,5,MK,{speed:5,health:10,value:8}),M(7,2,15,20,20,1,5,MK,{speed:5,health:10,value:8})),100),
/* 9*/Lv([1,4,6,9],R(3,S(K(1,10,10,7),K(4,15,10,7),K(6,15,10,7),K(9,10,10,7),D(5))),100),
/*10*/Lv([0,2,3,7,8,10],R(2,S(K(0,8,10,7),K(2,10,10,7),K(3,8,10,7),K(7,8,10,7),K(8,10,10,7),K(10,8,10,7),D(8))),125),
/*11*/Lv([3,4,6,7],R(2,S(K(3,3,35,8),K(7,3,35,8),D(3),K(4,3,35,8),K(6,3,35,8),D(5))),150),
/*12*/Lv([0,4,6],S(C(0,6,35,25,20,1),D(2),R(5,S(K(4,3,30,8),K(6,3,30,8),D(4)))),175),
/*13*/Lv([1,9],S(M(1,2,20,12,1,99,MM,{speed:4,health:13,value:10,actionInterval:1,summonLimit:10,summons:MK,summonOpts:{speed:8,health:15,value:7}}),M(9,2,20,12,1,99,MM,{speed:4,health:13,value:10,actionInterval:1,summonLimit:10,summons:MK,summonOpts:{speed:8,health:15,value:7}})),200),
/*14*/Lv([0,1,2,3,4,5,6,7,8,9,10],S(K(0,3,30,9),K(1,3,30,9),K(2,3,30,9),K(3,3,30,9),K(4,3,30,9),K(5,3,30,9),K(6,3,30,9),K(7,3,30,9),K(8,3,30,9),K(9,3,30,9),K(10,3,30,9),D(5),C(1,6,35,25,20,2),C(9,6,35,25,20,2)),200),
/*15*/Lv([1,2,4,5,6,8,9],S(R(3,S(M(1,2,50,40,4,99,MM,{speed:4,health:40,value:35,actionInterval:1,summonLimit:99,summons:MK,summonOpts:{speed:10,health:35,value:25}}),M(5,2,50,40,4,99,MM,{speed:4,health:40,value:35,actionInterval:1,summonLimit:99,summons:MK,summonOpts:{speed:10,health:35,value:25}}),M(9,2,50,40,4,99,MM,{speed:4,health:40,value:35,actionInterval:1,summonLimit:99,summons:MK,summonOpts:{speed:10,health:35,value:25}}),D(3),R(2,S(K(2,12,35,20),D(0.5),K(4,12,35,20),D(0.5),K(6,12,35,20),D(0.5),K(8,12,35,20))),D(10)))),400)
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
];

});