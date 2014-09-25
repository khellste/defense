ig.module(
	'game.core.ui.buttons'
).requires(
	'impact.entity',
	'game.core.global',
	'impact.animation'
).defines(function () {

Tower.Button = ig.Entity.extend({
	ignoreGrid: true,
	size: { x: 8, y: 8 },
	path: '',
	selected: false,
	persistentSelection: false,
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
			// Ignore ig.game._rscreen. These are UI elements!
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
	},

	mouseUp: function () {
		this.persistentSelection || this.deselect();
	},

	select: function () {
		Tower.UI.deselectAllButtons();
		this.selected = true;
		this.currentAnim =
			this._hover ? this.anims.onHover : this.anims.onIdle;
	},

	deselect: function () {
		this.selected = false;
		this.currentAnim =
			this._hover ? this.anims.offHover : this.anims.offIdle;
	}
});

Tower.LabeledButton = Tower.Button.extend({
	label: '',
	position: 'above',
	font: new ig.Font('media/ui/font-tiny-gray.png'),

	draw: function () {
		this.parent();
		if (!this.canDraw()) return;
		if (this.position === 'above') {
			this.font.draw(this.label, this.pos.x + 1, this.pos.y - 5);
		}
		else if (this.position === 'below') {
			throw 'unsupported';
		}
		else if (this.position === 'left') {
			throw 'unsupported';
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

	mouseLeave: function () {
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
		else {
			this.affordable && this.select();
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

Tower.UpgradeButton = Tower.PurchaseButton.extend({
	type: null,
	barPath: '',
	barAnims: [],

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		var barSheet = new ig.AnimationSheet(this.barPath, 3, 13);
		for (var i = 0; i < 7; i++) {
			this.barAnims.push(new ig.Animation(barSheet, 1, [i], true));
		}
	},

	update: function () {
		if (Tower.UI.selectedUnit) {
			var upgrade = Tower.UI.selectedUnit.nextUpgrade(this.type);
			if (upgrade) {
				this.label = this.price = upgrade.price;
			}
			else {
				this.label = '--';
				this.price = Infinity;
			}
			this.barAnims.forEach(function (anim) { anim.update(); });
			this.parent();
		}
	},

	drawBar: function (which) {
		(this.barAnims[which] || this.barAnims[0]).draw(
			this.pos.x - 4,
			this.pos.y - 5
		);
	},

	draw: function () {
		this.parent();
		var unit = Tower.UI.selectedUnit;
		if (this.canDraw() && unit) {
			this.drawBar(Tower.Upgrade.rank(this.type, unit, 0, 6));
		}
	},

	click: function () {
		var entity = Tower.UI.selectedUnit;
		if (!entity) return;
		var upgrade = entity.nextUpgrade(this.type);
		if (upgrade) {
			entity.applyUpgrade(upgrade);
			Tower.treasury.funds -= upgrade.price;
		}
	}
});

});