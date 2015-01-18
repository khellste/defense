ig.module(
	'game.core.ui.buttons'
).requires(
	'impact.entity',
	'game.core.global',
	'impact.animation',
	'impact.sound'
).defines(function () {

Tower.Button = ig.Entity.extend({
	ignoreGrid: true,
	size: { x: 8, y: 8 },
	path: '',
	selected: false,
	persistentSelection: false,
	soundA: new ig.Sound('media/snd/sfx/button-down.*'),
	soundB: new ig.Sound('media/snd/sfx/button-up.*'),
	_hover: false,

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.animSheet =
			new ig.AnimationSheet(this.path, this.size.x, this.size.y);
		this.addAnim('offIdle', 1, [0]);
		this.addAnim('offHover', 1, [1]);
		this.addAnim('onIdle', 1, [2]);
		this.addAnim('onHover', 1, [3]);
	},

	canDraw: function () {
		return !!Tower.UI._drawingPhase;
	},

	draw: function () {
		if (this.canDraw()) {
			this.currentAnim.draw(
				this.pos.x - this.offset.x,
				this.pos.y - this.offset.y
			);
		}
	},

	mouseEnter: function () {
		this._hover = true;
		this.currentAnim =
			this.selected ? this.anims.onHover : this.anims.offHover;
	},

	mouseLeave: function () {
		this._hover = false;
		this.currentAnim =
			this.selected ? this.anims.onIdle : this.anims.offIdle;
	},

	mouseDown: function () {
		this.currentAnim = this.anims.onHover;
		if (this.persistentSelection) {
			this.selected || this.soundA.play();
		}
		else {
			this.soundA.play();
		}
	},

	mouseUp: function () {
		if (!this.persistentSelection) {
			this.deselect();
			this.soundB.play();
		}
	},

	select: function () {
		Tower.UI.deselectAllButtons();
		this.selected = true;
		this.currentAnim =
			this._hover ? this.anims.onHover : this.anims.onIdle;
	},

	deselect: function () {
		if (this.selected && this.persistentSelection) {
			this.soundB.play();
		}
		this.selected = false;
		this.currentAnim =
			this._hover ? this.anims.offHover : this.anims.offIdle;
	}
});

Tower.NonHUDButton = Tower.Button.extend({
	draw: ig.Entity.prototype.draw
});

Tower.LabeledButton = Tower.Button.extend({
	label: '',
	position: 'above',
	font: new ig.Font('media/ui/font-tiny-gray.png'),
	labelOffset: { x: 1, y: -5 },

	draw: function () {
		this.parent();
		if (!this.canDraw()) return;
		if (this.position === 'above') {
			this.font.draw(this.label,
				this.pos.x + this.labelOffset.x,
				this.pos.y + this.labelOffset.y
			);
		}
		else {
			throw 'unsupported';
		}
	}
});

Tower.NonHUDLabeledButton = Tower.NonHUDButton.extend({
	label: '',
	position: 'above',
	font: new ig.Font('media/ui/font-tiny-gray.png'),
	labelOffset: { x: 0, y: 0 },

	draw: function () {
		this.parent();
		if (this.position === 'above') {
			this.font.draw(this.label,
				this.pos.x + this.labelOffset.x - ig.game._rscreen.x,
				this.pos.y + this.labelOffset.y - ig.game._rscreen.y,
				ig.Font.ALIGN.CENTER
			);
		}
		else {
			throw 'unsupported';
		}
	}
});

Tower.PurchaseButton = Tower.LabeledButton.extend({
	price: 0,
	affordable: false,
	affordableFont: new ig.Font('media/ui/font-tiny-yellow.png'),
	expensiveFont: new ig.Font('media/ui/font-tiny-gray.png'),

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.label = this.price;
	},

	update: function () {
		this.parent();
		var prev = this.affordable;
		this.affordable = (this.price <= Tower.treasury.funds);
		if (prev !== this.affordable && this.selected) {
			this.deselect();
		}
		this.font =
			this.affordable ? this.affordableFont : this.expensiveFont;
	},

	mouseEnter: function () {
		this.affordable && this.parent();
	},

	mouseDown: function () {
		this.affordable && this.parent();
	}
});

Tower.EntityPurchaseButton = Tower.PurchaseButton.extend({
	type: null,
	affordable: false,
	moneyFont: new ig.Font('media/ui/font-tiny-yellow.png'),
	moneyFontGray: new ig.Font('media/ui/font-tiny-gray.png'),
	price: 0,
	persistentSelection: true,

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.label = this.price = this.type.prototype.value;
	},

	click: function () {
		if (this.selected) {
			this.deselect();
		}
		else if (this.affordable) {
			this.select();
		}
	},

	update: function () {
		Tower.UI.selectedUnit || this.parent();
	},

	select: function () {
		this.parent();
		Tower.UI.hideMenu();
		ig.game.clickType = this.type;
	},

	deselect: function () {
		this.parent();
		ig.game.clickType = null;
	}
});

var coverBarPath = 'media/ui/buttons/bar-limits.png';
var coverSheet = new ig.AnimationSheet(coverBarPath, 3, 13);
var coverAnims = [];
for (var i = 0; i < 7; i++) {
	coverAnims.push(new ig.Animation(coverSheet, 1, [i], true));
}
Tower.UpgradeButton = Tower.PurchaseButton.extend({
	type: null,
	barPath: '',
	barAnims: [],
	unit: null,
	upgrade: null,

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		var barSheet = new ig.AnimationSheet(this.barPath, 3, 13);
		for (var i = 0; i < 7*2; i++) {
			this.barAnims.push(new ig.Animation(barSheet, 1, [i], true));
		}
	},

	update: function () {
		this.unit = Tower.UI.selectedUnit;
		this.upgrade = null;
		if (this.unit) {
			this.max = this.unit.maxUpgrade(this.type);
			this.upgrade = this.unit.nextUpgrade(this.type);
			if (this.upgrade) {
				this.label = this.price = this.upgrade.price;
			}
			else {
				this.label = '--';
				this.price = Infinity;
			}
			this.barAnims.forEach(function (anim) { anim.update(); });
			this.parent();
			if (!(this.upgrade && this.affordable)) {
				this.currentAnim = this.anims.offIdle;
			}
		}
	},

	drawBar: function (which, preview) {
		if (preview) which += 7;
		(this.barAnims[which] || this.barAnims[0]).draw(
			this.pos.x - 4,
			this.pos.y - 5
		);
		var maxIdx = Tower.Upgrade.rank(this.type, this.max.value, 0, 6);
		coverAnims[maxIdx].draw(this.pos.x - 4, this.pos.y - 5);
	},

	draw: function () {
		if (!this.affordable || !this.upgrade) {
			this.currentAnim = this.anims.offIdle;
		}
		this.parent();
		if (this.canDraw() && this.unit) {
			var idx = 0, preview = (this._hover && this.upgrade);
			if (preview) {
				idx = Tower.Upgrade.rank(this.type, this.upgrade.value, 0, 6);
			}
			else {
				idx = Tower.Upgrade.rank(this.type, this.unit, 0, 6);
			}
			this.drawBar(idx, preview);
		}
	},

	click: function () {
		if (!this.unit || !this.affordable) return;
		if (!this.upgrade) {
			this.currentAnim = this.anims.offIdle;
			return;
		}
		this.unit.applyUpgrade(this.upgrade);
		Tower.treasury.funds -= this.upgrade.price;
	},

	mouseUp: function () {
		if (this.affordable) {
			this.soundB.play();
		}
	}
});

Tower.DeleteButton = Tower.Button.extend({
	path: 'media/ui/buttons/delete.png',
	persistentSelection: true,

	select: function () {
		this.parent();
		ig.game.clickType = 'delete';
	},

	deselect: function () {
		this.parent();
		ig.game.clickType = null;
	},

	click: function () {
		if (this.selected) {
			this.deselect();
		}
		else {
			this.select();
		}
	}
});

if (ig.global.wm) {
	Tower.Button.inject({
		canDraw: function () { return true; },
		draw: ig.Entity.prototype.draw
	});
}

});