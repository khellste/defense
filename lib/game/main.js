ig.module(
	'game.main'
).requires(
	// Impact
	'impact.game',
	'impact.timer',
	'impact.sound',
	'impact.input',

	// Plugins
	'plugins.cheese.cheese',
	'plugins.lattice.lattice',
	'plugins.lattice.multi-bfs',
	'plugins.lattice.cheese-extensions',

	// Game
	'game.levels.level1',
	'game.levels.title',
	'game.levels.howto',
	'game.levels.credits',
	'game.entities.wall',
	'game.entities.hunter',
	'game.entities.home',
	'game.entities.archer',
	'game.entities.wizard',
	'game.entities.textbox',
	'game.entities.slideshow',
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
	instrIdx: -1,
	showHUD: false,
	_begun: false,
	_waiting: false,
	stopped: false,
	kill: false,

	sfx: {
		fanfare: new ig.Sound('media/snd/sfx/victory.*'),
		failure: new ig.Sound('media/snd/sfx/you-lose.*')
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
		if (typeof window != 'undefined') {
			Object.defineProperty(window, 'x', {
				get: function () {
					this.kill = !this.kill;
				}.bind(this)
			});
		}
		ig.input.bind(ig.KEY.ESC, 'clear-cursor');
	},

	allEnemiesDead: function () {
		return !this.getEntitiesByType(EnemyUnit).length;
	},

	update: function () {
		if (this.kill) return;
		if (!this._begun) {
			return this.parent();
		}

		if (ig.input.pressed('clear-cursor')) {
			this.clickType = null;
			Tower.UI.deselectAllButtons();
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
			ig.music2.stop();
			this.sfx.failure.play();
			Tower.banner({
				message: 'You lose',
				time: 4,
				done: this.reset.bind(this)
			});
		}
		this.parent();
	},

	reset: function (noMusic) {
		if (!(noMusic || ig.music2.isPlaying('march'))) {
			ig.music2.reset();
			ig.music2.play('march');
		}
		Tower.health = Tower.maxHealth;
		Tower.treasury.funds = this.idx = this.instrIdx = 0;
		this.stopped = this.showHUD = this._begun = this._waiting = false;
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
		Tower.treasury.funds = 0;
		this.warnCoords(this.idx);
	},

	_instrs: [
		'Protect the village\nfrom invaders!',
		'Place walls to re-\nroute the enemy.',
		'Fight back with\nrangers and\nmages.',
		'Earn gold by\ndefeating enemies\nand clearing levels.',
		'Upgrade your\nwarriors\' range,\npower, and speed.',
		'Sell your units to\nrecoup some gold.',
		'If your health\nfalls to zero,\nyou lose!'
	],

	dispInstr: function (idx) {
		var tb = this.getEntitiesByType(EntityTextbox)[0];
		var ss = this.getEntitiesByType(EntitySlideshow)[0];
		tb.message(this._instrs[idx]);
		ss.showImage(idx);
	},

	instr: function (cmd) {
		if (cmd === 'next') {
			if (this.instrIdx === this._instrs.length-1) return this.reset();
			this.dispInstr(++this.instrIdx);
		}
		else if (cmd === 'prev') {
			if (this.instrIdx === 0) return this.reset();
			this.dispInstr(--this.instrIdx);
		}
		else {
			this.loadLevel(LevelHowto);
			this.dispInstr(this.instrIdx = 0);
		}
	},

	credits: function () {
		this.loadLevel(LevelCredits);
		this.getEntitiesByType(EntityTextbox)[0].message(
			'Programming:\nKarl Hellstern\n\n' +
			'Graphics:\nKarl Hellstern\n\n' +
			'Music:\nKarl Hellstern\n\n' +
			'Sound Effects:\nKarl Hellstern\n\n'
		);
	}
});

ig.main('#canvas', MyGame, 30, 11*8, 14*8, 4);
Tower.jumpTo = function (lvNo) {
	if (lvNo > Tower.timeline.length) {
		ig.game.reset();
		console.info('Jumping to title');
		return;
	}
	console.info('Jumping to Wave ' + lvNo);
	ig.game.reset(true);
	ig.game.idx = lvNo - 1;
	ig.game.begin();
};

});