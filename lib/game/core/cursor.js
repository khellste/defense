ig.module(
	'game.core.cursor'
).requires(
	'game.core.global',
	'plugins.lattice',
	'plugins.lattice.cheese-extensions',
	'plugins.cheese',
	'impact.sound'
).defines(function () {

Tower.SnappingCursor = lat.SnapCursor.extend({
	animSheet: new ig.AnimationSheet('media/img/cursor.png', 8, 8),
	snapping: false,
	replace: true,
	enemiesAtCursor: 0,
	deleteSound: new ig.Sound('media/snd/sfx/destroy.*'),
	putSound: new ig.Sound('media/snd/sfx/put.*'),

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

	draw: function (x, y) {
		this.parent(x, y);
		if (typeof ig.game.clickType === 'function') {
			var preview = ig.game.clickType.prototype.preview;
			if (preview && preview.image) {
				var off = preview.offset || { x: 0, y: 0 };
				var snap = ig.game.snap({ x: x, y: y }, true);
				ig.system.context.globalAlpha = 0.4;
				preview.image.draw(snap.x + off.x, snap.y + off.y);
				ig.system.context.globalAlpha = 1;
			}
		}
	},

	click: function (e) {
		if (e.snap.y < 96 && (!e.items[0] || !e.items.some(function (i) {
			return i === Tower.UI.selectedUnit;
		}))) {
			Tower.UI.hideMenu();
		}
		if (e.key === ig.KEY.MOUSE1) {
			if (e.snap.y >= 96) {
				return;
			}
			if (ig.game.clickType === 'delete') {
				if (!e.items.some(function (i) {
					return i instanceof EntityWall ||
							i instanceof FriendlyUnit; })) {
					Tower.UI.deselectAllButtons();
				}
				else {
					this.deleteSound.play();
				}
			}
			else if (ig.game.clickType) {
				if (ig.game.clickType === EntityWall &&
					ig.game.grid.plugins.bfs.test(e.grid.r, e.grid.c)) return;
				var value = ig.game.clickType.prototype.value;
				if (Tower.treasury.funds < value) return;
				var Type = ig.game.clickType;
				if (Type.prototype instanceof RangedUnit) {
					if (e.items[0] instanceof EntityWall) {
						if (e.items[0].units.length > 0) return;
						var archer = ig.game.spawnEntity(Type, e.snap.x, e.snap.y);
						e.items[0].addUnit(archer);
						Tower.treasury.funds -= value;
						this.putSound.play();
					}
					else {
						Tower.UI.deselectAllButtons();
						ig.game.clickType = null;
					}
				}
				else {
					if (!e.items.some(function (i) {
						return i.pos.x === e.snap.x && i.pos.y === e.snap.y;
					})) {
						ig.game.spawnEntity(Type, e.snap.x, e.snap.y);
						Tower.treasury.funds -= value;
						this.putSound.play();
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


});