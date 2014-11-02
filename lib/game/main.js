ig.module(
	'game.main'
).requires(
	// Impact
	'impact.game',
	'impact.timer',
	//'impact.debug.debug',

	// Plugins
	'plugins.cheese',
	'plugins.lattice',
	'plugins.lattice.BFS',
	'plugins.lattice.cheese-extensions',

	// Game
	'game.levels.level1',
	'game.entities.wall',
	'game.entities.hunter',
	'game.entities.home',
	'game.entities.archer',
	'game.entities.wizard',
	'game.core.ui.hud',
	'game.core.treasury',
	'game.core.cursor',
	'game.core.timeline'
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

	events: [
		new ch.ClickEventQueue({ key: ig.KEY.MOUSE1 }),
		new ch.ClickEventQueue({ key: ig.KEY.MOUSE2 }),
		new ch.MouseEnterEventQueue(),
		new ch.MouseLeaveEventQueue(),
		new ch.MouseDownEventQueue({ key: ig.KEY.MOUSE1 }),
		new ch.MouseUpEventQueue({ key: ig.KEY.MOUSE1 })
	],

	init: function () {
		this.loadLevel(LevelLevel1);
		var home = this.getEntitiesByType(EntityHome)[0];
		this.grid.addPlugin('bfs', lat.BfsGridPlugin, { target: home });
		this.timer = new ig.Timer(1);
	},

	allEnemiesDead: function () {
		return this.getEntitiesByType(EnemyUnit).length === 0;
	},

	update: function () {
		var curr = Tower.timeline[this.idx];
		curr && curr.update();
		if (curr && curr.done && this.allEnemiesDead()) {
			this.idx++;
		}
		Tower.health && this.parent();
	}
});

ig.main('#canvas', MyGame, 30, 11*8, 14*8, 4);

});