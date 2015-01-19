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
	'plugins.browser-quirks',

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
	'game.entities.fx.banner'
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
	music: new ig.Sound('/media/snd/music/intro.*'),

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
		this.music.play();
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

		}

		// Game not over!
		else {
			curr.update();
			if (curr.finished && this.allEnemiesDead()) {
				this.idx++;
			}
		}
		Tower.health && this.parent();
	},

	begin: function () {
		this.loadLevel(LevelLevel1);
		this.grid.addPlugin('bfs', lat.MultiBfsGridPlugin,
			{ targets: this.getEntitiesByType(EntityHome) });

		this.showHUD = true;
		this.music.stop();
		Tower.banner({
			message: 'Begin!',
			done: function () { this._begun = true; }.bind(this)
		});
	},
});

ig.main('#canvas', MyGame, 30, 11*8, 14*8, 4);

});