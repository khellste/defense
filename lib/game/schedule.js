ig.module(
	'game.schedule'
).requires(
	'impact.game',
	'game.core.timeline',
	'game.entities.hunter',
    'game.entities.dark-summoner'
).defines(function () {

var Seq = Tower.Action.Sequence;
var Act = Tower.Action;
var Rep = Tower.Action.Repeat;
var Del = Tower.Action.Delay;

var SummonerTest = new Seq(
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
);

Tower.timeline = [
	SummonerTest
];

});