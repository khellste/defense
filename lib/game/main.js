ig.module(
	'game.main'
).requires(
	// Impact
	'impact.game',
	'impact.timer',
	'impact.sound',
	//'impact.debug.debug',

	// Plugins
	'plugins.cheese.cheese',
	'plugins.lattice.lattice',
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
	'game.core.audio-shim',
	'game.core.music-plus',
	'game.entities.fx.grid-glow'
).defines(function () {

ig.Entity.inject({
	update: function () {
		this.parent();
		if (!this._noZUpdate) {
			this.zIndex = this.pos.y;
		}
	}
});

// Pre-load music
ig.MusicPlus.preloadSongs([
	{ 'march': 'media/snd/music/march.wav' },
	{ 'battle-slow': 'media/snd/music/battle-slow.wav' },
	{ 'battle-fast': 'media/snd/music/battle-fast.wav' },
	{ 'battle-sf': 'media/snd/music/battle-trans-s2f.wav' },
	{ 'battle-fs': 'media/snd/music/battle-trans-f2s.wav' }
]);

var MyGame = ig.Game.extend({
	cursor: new Tower.SnappingCursor(),
	autoSort: true,
	sortBy: ig.Game.SORT.Z_INDEX,
	clickType: null,
	idx: 0,
	showHUD: false,
	_begun: false,
	_waiting: false,
	stopped: false,

	sfx: {
		fanfare: new ig.Sound('media/snd/sfx/victory.*')
	},

	events: [
		new ch.ClickEventQueue({ key: ig.KEY.MOUSE1 }),
		new ch.ClickEventQueue({ key: ig.KEY.MOUSE2 }),
		new ch.DoubleClickEventQueue({ key: ig.KEY.MOUSE2 }),
		new ch.MouseEnterEventQueue(),
		new ch.MouseLeaveEventQueue(),
		new ch.MouseDownEventQueue({ key: ig.KEY.MOUSE1 }),
		new ch.MouseUpEventQueue({ key: ig.KEY.MOUSE1 })
	],

	init: function () {
		this.loadLevel(LevelTitle);
		this.showHUD = false;
		ig.music2.play('march');
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
				ig.music2.stop();
				this.sfx.fanfare.play();
				this._waiting = true;
				Tower.banner({
					message: 'You won!',
					time: 10,
					done: this.reset.bind(this)
				});
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
					ig.music2.sequence('battle-fs');
					ig.music2.sequence('battle-slow');
					this.warnCoords(this.idx + 1);
				}
				else {
					this.idx++;
				}
			}
		}

		if (Tower.health <= 0 && !this.stopped) {
			this.stopped = true;
			Tower.banner({
				message: 'You lose',
				time: 4,
				done: this.reset.bind(this)
			});
		}
		this.parent();
	},

	reset: function (noMusic) {
		ig.music2.reset();
		noMusic || ig.music2.play('march');
		Tower.health = Tower.maxHealth;
		Tower.treasury.funds = 100;
		this.stopped = this.showHUD = this._begun = this._waiting = false;
		this.idx = 0;
		this.getEntitiesByType(Unit).forEach(function (e) { e.kill(); });
		this.getEntitiesByType(lat.Wall).forEach(function (e) { e.kill(); });
		lat.BfsGridPlugin.instances = [];
		lat.MultiBfsGridPlugin.instances = {};
		this.clickType = null;
		Tower.timeline.forEach(function (tl) { tl.reset(); });
		this.loadLevel(LevelTitle);
		Tower.UI = new Tower._UI();
	},

	warnCoords: function (which) {
		var tl = Tower.timeline[which];
		tl && tl.coords.forEach(function (x) {
			this.spawnEntity(GridGlowFX, 8*x, 0, { });
		}.bind(this));
	},

	begin: function () {
		this.loadLevel(LevelLevel1);
		this.grid.addPlugin('bfs', lat.MultiBfsGridPlugin,
			{ targets: this.getEntitiesByType(EntityHome) });
		ig.music2.play('battle-slow');
		this.showHUD = true;
		Tower.banner({
			message: 'Wave ' + (this.idx + 1),
			done: function () { this._begun = true; }.bind(this)
		});
		Tower.treasury.funds = 100;
		this.warnCoords(this.idx);
	}
});

ig.main('#canvas', MyGame, 30, 11*8, 14*8, 4);
Tower.jumpTo = function (lvNo, noCheat) {
	if (lvNo > Tower.timeline.length) {
		ig.game.reset();
		console.info('Jumping to title');
		return;
	}
	console.info('Jumping to Wave ' + lvNo);
	ig.game.reset(true);
	ig.game.idx = lvNo - 1;
	ig.game.begin();
	if (noCheat !== true) {
		Tower.treasury.funds = Infinity;
	}
};

});