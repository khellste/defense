ig.module(
	'game.schedule'
).requires(
	'impact.game',
	'game.core.timeline',
	'game.entities.hunter',
	'game.entities.dark-cleric'
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

Tower.timeline = [
	Level1
];

/*		new Tower.Action(function (done) {
			ig.game.spawnEntity(DarkCleric, 20, 0, {
				speed: 5,
				recoil: 0.5,
				health: 20,
				value: 5
			});
			done();
		}),
		new Tower.Action.Delay(10),
		new Tower.Action.Repeat(function (done) {
			ig.game.spawnEntity(EntityHunter, 40, 0, {
				speed: 10,
				recoil: 2,
				health: 10,
				value: 3
			});
			done();
		}, 5, 5),
*/

});