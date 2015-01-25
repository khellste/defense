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

/*var SummonerTest = new Seq(
    new Del(25, true),
    new Act(function (done) {
        ig.game.spawnEntity(EntityDarkSummoner, 0, 0, {
            speed: 2,
            recoil: 1,
            health: 20,
            value: 20,
            summons: EntityDarkSummoner,
            summonOpts: {
                speed: 8,
                recoil: 0.5,
                health: 7,
                value: 5,
                actionInterval: 3,
                summonLimit: 3,
                summons: EntityHunter,
                summonOpts: {
                    speed: 8,
                    health: 7,
                    value: 5,
                    power: 1
                }
            }
        });
        done();
    })
);*/

// Some aliases to make level definitions much shorter
var R = function (a, b) { return new Tower.Action.Repeat(a, b); };
var D = function (a) { return new Tower.Action.Delay(a, false); };
var S = function () { return new Tower.Action.Sequence([].slice.call(arguments)); };

// Create a hunter action
var K = function (x, speed, recoil, health, value) {
    return new Tower.Action(function (done) {
        ig.game.spawnEntity(EntityHunter, 8*x, 0, {
            speed: speed, recoil: recoil,
            health: health, value: value
        });
        done();
    });
};

// Create a summoner
var MM = EntityDarkSummoner, MK = EntityHunter, MC = EntityDarkCleric;
var M = function (x, speed, recoil, health, value, interval, limit, type, opts) {
    return new Tower.Action(function (done) {
        ig.game.spawnEntity(EntityDarkSummoner, 8*x, 0, {
            speed: speed, recoil: recoil, health: health,
            value: value, actionInterval: interval,
            summonLimit: limit, summons: type,
            summonOpts: opts || { }
        });
        done();
    });
};

// Create a cleric
var C = function (x, speed, recoil, health, value, magic, interval) {
    return new Tower.Action(function(done) {
        ig.game.spawnEntity(EntityDarkCleric, 8*x, 0, {
            speed: speed, recoil: recoil, health: health,
            value: value, magic: magic, actionInterval: interval
        });
        done();
    });
};

var Lv = function (coords, action) {
    var level = new Tower.Action.Sequence([
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

var h = 0.5, q = 0.25;
Tower.timeline = [
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
/////////////// LEVEL DEFINITIONS //////////////
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

    Lv([4], R(5, S(K(4, 5, h, 5, 4), D(5)))),
    Lv([4, 6], R(5, S(K(4, 4, h, 5, 4), K(6, 4, h, 5, 4), D(7)))),
    Lv([4, 6], R(2, S(K(4, 5, h, 5, 4), D(2), K(4, 5, h, 5, 4), K(6, 5, h, 5, 4), D(5), K(6, 5, h, 5, 4), D(2), K(4, 5, h, 5, 4), K(6, 5, h, 5, 4), D(5)))),
    Lv([3, 4, 6, 7], R(2, S(K(3, 4, h, 6, 7), R(3, S(K(6, 8, h, 5, 5), D(2))), D(6), K(7, 4, h, 6, 7), R(3, S(K(4, 8, h, 5, 5), D(2))), D(4)))),
    Lv([3, 4, 6], S(C(3, 5, h, 25, 20, 10, 1), R(3, S(K(4, 5, h, 10, 8), K(6, 5, h, 10, 8), D(4))))),
    Lv([7], R(10, S(K(7, 15, q, 10, 5), D(3)))),
    Lv([3, 7], R(5, S(K(3, 10, h, 10, 8), D(2), K(7, 10, h, 10, 8), D(1)))),
    Lv([4, 6], R(2, S(M(4, 2, 0, 20, 20, 1, 5, MK, { speed: 5, recoil: h, health: 10, value: 8 }), M(6, 2, 0, 20, 20, 1, 5, MK, { speed: 5, recoil: h, health: 10, value: 8 }), D(10)))),
    //Lv([1, 4, 6], S(M(1, 3, 0, 20, 20, 3, 3, MC, { speed: 12, recoil: h, health: 15, value: 10, magic: 7, interval: 2 }), D(2), R(5, S(K(4, 8, h, 10, 8), K(6, 8, h, 10, 8), D(6)))))

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
/////////// END OF LEVEL DEFINITIONS ///////////
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
];

});