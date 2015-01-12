ig.module(
	'game.schedule'
).requires(
	'impact.game',
	'game.core.timeline',
	'game.entities.hunter',
	'game.entities.dark-cleric',
    'game.entities.dark-summoner'
).defines(function () {

var Seq = Tower.Action.Sequence;
var Act = Tower.Action;
var Rep = Tower.Action.Repeat;
var Del = Tower.Action.Delay;

var Level1 = new Seq(
	new Rep(5, 
		new Seq(
			new Act(function (done) {
				ig.game.spawnEntity(DarkCleric, 0, 0, {
					speed: 5,
					recoil: 0.5,
					health: 20,
					value: 10,
					magic: 10
				});
				done();
			}),
			new Rep(5,
				new Seq(
					new Act(function (done) {
						ig.game.spawnEntity(EntityHunter, 40, 0, {
							speed: 10,
							recoil: 2,
							health: 10,
							value: 3
						});
						done();
					}),
					new Del(3)
				)
			),
			new Del(6)
		)
	),
	new Rep(5,
		new Seq(
			new Act(function (done) {
				done();
			}),
			new Del(4)
		)
	)
);

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
                health: 1,
                value: 5,
                actionInterval: 3,
                summonLimit: 3,
                summons: EntityHunter,
                summonOpts: {
                    speed: 8,
                    health: 5,
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