ig.module(
	'game.main'
).requires(
	// Impact
	'impact.game',
	'impact.timer',
	'impact.sound',
	//'impact.debug.debug',

	// Plugins
	'plugins.cheese',
	'plugins.lattice',
	'plugins.lattice.multi-bfs',
	'plugins.lattice.cheese-extensions',

	// Game
	'game.levels.level1',
	'game.levels.title',
	'game.entities.wall',
	'game.entities.hunter',
	'game.entities.home',
	'game.entities.archer',
	'game.entities.wizard',
	'game.core.ui.hud',
	'game.core.treasury',
	'game.core.cursor',
	'game.schedule',
	'game.entities.fx.banner',
	'game.core.shims'
).defines(function () {

ig.Entity.inject({
	update: function () {
		this.parent();
		if (!this._noZUpdate) {
			this.zIndex = this.pos.y;
		}
	}
});

var Phase = {
	Preparation: 0,
	Attack: 1,
	Lose: 2	
};

var MyGame = ig.Game.extend({
	cursor: new Tower.SnappingCursor(),
	autoSort: true,
	sortBy: ig.Game.SORT.Z_INDEX,
	clickType: null,
	idx: 0,
	_begun: false,
	_waiting: false,

	events: [
		new ch.ClickEventQueue({ key: ig.KEY.MOUSE1 }),
		new ch.ClickEventQueue({ key: ig.KEY.MOUSE2 }),
		new ch.MouseEnterEventQueue(),
		new ch.MouseLeaveEventQueue(),
		new ch.MouseDownEventQueue({ key: ig.KEY.MOUSE1 }),
		new ch.MouseUpEventQueue({ key: ig.KEY.MOUSE1 })
	],

	init: function () {
		this.loadLevel(LevelTitle);
		this.showHUD = false;
		ig.music.loop = true;
		ig.music.add('media/snd/music/march.*', 'march');
		ig.music.add('media/snd/music/victory.*', 'victory');
	},

	allEnemiesDead: function () {
		return !this.getEntitiesByType(EnemyUnit).length;
	},

	update: function () {
		if (!this._begun) {
			return this.parent();
		}

		var curr = Tower.timeline[this.idx];

		// Game over!
		if (curr == null) {
			if (!this._waiting) {
				ig.music.play('victory');
				this._waiting = true;
				Tower.banner({ message: 'You won!' }, -1);
			}
		}

		// Game not over!
		else {
			curr.update();
			if (!this._waiting && curr.finished && this.allEnemiesDead()) {
				if (Tower.timeline[this.idx + 1]) {
					this._waiting = true;
					Tower.banner({
						message: 'Wave ' + (this.idx + 2),
						done: function () {
							this.idx++;
							this._waiting = false;
						}.bind(this)
					});
				}
				else {
					this.idx++;
				}
			}
		}
		Tower.health && this.parent();
	},

	begin: function () {
		this.loadLevel(LevelLevel1);
		this.grid.addPlugin('bfs', lat.MultiBfsGridPlugin,
			{ targets: this.getEntitiesByType(EntityHome) });

		ig.music.play('march');
		this.showHUD = true;
		Tower.banner({
			message: 'Wave ' + (this.idx + 1),
			done: function () { this._begun = true; }.bind(this)
		});
	},
});

ig.main('#canvas', MyGame, 30, 11*8, 14*8, 4);

});