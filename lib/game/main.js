ig.module(
	'game.main'
).requires(
	// Impact
	'impact.game',
	//'impact.debug.debug',

	// Plugins
	'plugins.cheese',
	'plugins.lattice',
	'plugins.lattice.BFS',
	'plugins.lattice.cheese-extensions',
	'plugins.health-bar',

	// Game
	'game.levels.level1',
	'game.entities.wall',
	'game.entities.hunter',
	'game.entities.home',
	'game.entities.archer',
	'game.entities.wizard',
	'game.core.ui.hud',
	'game.core.treasury'
).defines(function () {

ig.Entity.inject({
	update: function () {
		this.parent();
		if (!this._noZUpdate) {
			this.zIndex = this.pos.y;
		}
	}
});

var SnappingCursor = lat.SnapCursor.extend({
	animSheet: new ig.AnimationSheet('media/img/cursor.png', 8, 8),
	snapping: false,
	replace: true,
	enemiesAtCursor: 0,

	init: function (settings) {
		this.parent(settings);
		this.addAnim('square', 1, [0]);
		this.addAnim('remove', 1, [1]);
		this.addAnim('sword', 1, [2]);
		this.addAnim('pointer', 1, [3]);
		this.addAnim('hammer', 1, [4]);
		this.currentAnim = this.anims.pointer;
	},

	drag: function (e) {
		if (e.key === ig.KEY.MOUSE2) {
			ig.game.screen.x -= e.delta.x;
			ig.game.screen.y -= e.delta.y;
		}
	},

	update: function () {
		this.parent();
		if (ig.input.mouse.y >= 12 * 8) {
			this.currentAnim = this.anims.pointer;
			this.snapping = false;
		}
		else if (ig.game.clickType === 'delete') {
			this.currentAnim = this.anims.remove;
			this.snapping = false;
		}
		else if (ig.game.clickType === 'repair') {
			this.currentAnim = this.anims.hammer;
			this.snapping = false;
		}
		else if (ig.game.clickType && !Tower.UI.selectedUnit) {
			this.currentAnim = this.anims.square;
			this.snapping = true;
		}
		else {
			this.currentAnim = this.anims.pointer;
			this.snapping = false;
		}
	},

	click: function (e) {
		if (!(e.items[0] instanceof FriendlyUnit) && e.snap.y < 12*8) {
			Tower.UI.hideMenu();
		}
		if (e.key === ig.KEY.MOUSE1) {
			if (ig.game.clickType === 'delete') {
				if (e.snap.y >= 12*8) return;
				var found = false;
				for (var i = 0; i < e.items.length; i++) {
					if (e.items[i] instanceof EntityWall) {
						var victim = e.items[i];
						if (e.items[i].units[0]) {
							victim = e.items[i].units[0];
						}
						Tower.treasury.funds += victim.sellPrice;
						victim.kill();
						found = true;
						break;
					}
				}
				found || Tower.UI.deselectAllButtons();
			}
			else if (ig.game.clickType) {
				if (e.snap.y >= 12*8) return;
				var value = ig.game.clickType.prototype.value;
				if (Tower.treasury.funds < value) return;
				var Type = ig.game.clickType;
				if (Type.prototype instanceof RangedUnit) {
					if (e.items[0] instanceof EntityWall) {
						if (e.items[0].units.length > 0) return;
						var archer = ig.game.spawnEntity(Type, e.snap.x, e.snap.y);
						e.items[0].addUnit(archer);
						Tower.treasury.funds -= value;
					}
				}
				else {
					if (!e.items[0]) {
						ig.game.spawnEntity(Type, e.snap.x, e.snap.y);
						Tower.treasury.funds -= value;
					}
				}
			}
		}
		else if (e.key === ig.KEY.MOUSE2) {
			if (ig.game.rightClick) {
				ig.game.rightClick(e);
			}
		}
	}
});

var MyGame = ig.Game.extend({
	cursor: new SnappingCursor(),
	autoSort: true,
	sortBy: ig.Game.SORT.Z_INDEX,
	clickType: null,

	events: [
		new ch.ClickEventQueue({ key: ig.KEY.MOUSE1 }),
		new ch.ClickEventQueue({ key: ig.KEY.MOUSE2 }),
		new ch.MouseEnterEventQueue(),
		new ch.MouseLeaveEventQueue(),
		new ch.MouseDownEventQueue({ key: ig.KEY.MOUSE1 }),
		new ch.MouseUpEventQueue({ key: ig.KEY.MOUSE1 }),
		//new ch.DragEventQueue({ key: ig.KEY.MOUSE2 })
	],

	init: function () {
		this.loadLevel(LevelLevel1);
		var home = this.getEntitiesByType(EntityHome)[0];
		this.grid.addPlugin('bfs',
			lat.BfsGridPlugin, { target: home });
		this.grid.addPlugin('bfs_nowall',
			lat.BfsGridPlugin, { target: home, ignoreImpassable: true });
		this._int = setInterval(function () {
			//if (this.getEntitiesByType(EntityHunter).length > 10) return;
			this.spawnEntity(EntityHunter, 5*8, 0);
		}.bind(this), 4000);
	}
});

ig.main('#canvas', MyGame, 30, 11*8, 14*8, 4);

});