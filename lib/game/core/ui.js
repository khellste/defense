ig.module(
	'game.core.ui'
).requires(
	'impact.font',
	'impact.image',
	'impact.game',
	'impact.entity',
	'game.core.global',
	'game.core.treasury',
	'game.entities.wall',
	'game.entities.archer',
	'game.entities.wizard'
).defines(function () {

// NOTE: Buttons won't work unless Entity is extended to support
// `mouseEnter` and `mouseLeave` event handlers! This is done with the
// "cheese" plugin in main.js, but it could also be done with any other
// compatible plugin.

var UI = ig.Class.extend({
	moneyFont: new ig.Font('media/ui/font-tiny-yellow.png'),
	moneyFontGray: new ig.Font('media/ui/font-tiny-gray.png'),
	scoreFont: new ig.Font('media/ui/font.png'),
	hudImage: new ig.Image('media/ui/hud.png'),
	buttons: [],
	_buttonsInitialized: false,

	_initButtons: function () {
		this.buttons.push(ig.game.spawnEntity(PurchaseButton, 32, 103, {
			path: 'media/ui/buttons/wall.png',
			type: EntityWall
		}));
		this.buttons.push(ig.game.spawnEntity(PurchaseButton, 42, 103, {
			path: 'media/ui/buttons/archer.png',
			type: EntityArcher
		}));
		this.buttons.push(ig.game.spawnEntity(PurchaseButton, 52, 103, {
			path: 'media/ui/buttons/wizard.png',
			type: EntityWizard
		}));
		this._buttonsInitialized = true;
	},

	draw: function () {
		this._buttonsInitialized || this._initButtons();

		// HUD backdrop
		this.hudImage.draw(0, 96);

		// Money
		var funds = Tower.treasury.funds;
		this.moneyFont.draw((funds > 9999) ? 9999 : funds, 12, 106);

		// Score
		//this.scoreFont.draw(12345, 2, 98);

		// Buttons
		this.buttons.forEach(function (btn) { btn.draw('foobar'); });
	}
});

var Button = ig.Entity.extend({
	ignoreGrid: true,
	size: { x: 8, y: 8 },
	callback: function () { },

	click: function (e) { this.callback(); },

	draw: function (secret) {
		if (secret === 'foobar') {
			ig.Entity.prototype.draw.call(this);
		}
	}
});

var PurchaseButton = Button.extend({
	type: null, path: '',
	selected: false,
	affordable: false,
	moneyFont: new ig.Font('media/ui/font-tiny-yellow.png'),
	moneyFontGray: new ig.Font('media/ui/font-tiny-gray.png'),
	price: 0,

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.animSheet = new ig.AnimationSheet(this.path, 8, 8);
		this.price = this.type.prototype.value;
		this.addAnim('offIdle', 1, [0]);
		this.addAnim('offHover', 1, [1]);
		this.addAnim('onIdle', 1, [2]);
		this.addAnim('onHover', 1, [3]);
		this.callback = function () {
			if (this.selected) {
				this.deselect();
			}
			else {
				this.affordable && this.select();
			}
		}.bind(this);
	},

	update: function () {
		this.parent();
		var prev = this.affordable;
		this.affordable = this.price <= Tower.treasury.funds;
		if (prev !== this.affordable && this.selected) {
			this.deselect();
		}
	},

	mouseEnter: function (e) {
		if (!this.affordable) return;
		if (this.selected) {
			this.currentAnim = this.anims.onHover;
		}
		else {
			this.currentAnim = this.anims.offHover;
		}
	},

	mouseLeave: function (e) {
		if (this.selected) {
			this.currentAnim = this.anims.onIdle;
		}
		else {
			this.currentAnim = this.anims.offIdle;
		}
	},

	mouseDown: function (e) {
		if (!this.affordable) return;
		this.currentAnim = this.anims.onHover;
	},

	select: function () {
		Tower.UI.buttons.forEach(function (btn) {
			if (btn instanceof PurchaseButton) {
				btn.deselect();
			}
		});
		this.selected = true;
		ig.game.clickType = this.type;
		this.currentAnim = this.anims.onHover;
	},

	deselect: function () {
		this.selected = false;
		ig.game.clickType = null;
		this.currentAnim = this.anims.offIdle;
	},

	draw: function (secret) {
		if (secret === 'foobar') {
			this.parent(secret);
			var font = this.affordable ? this.moneyFont : this.moneyFontGray;
			font.draw(this.price, this.pos.x + 1, this.pos.y - 5);
		}
	}
});

//var MiscButton = 

// Initialize and install
Tower.UI = new UI();
ig.Game.inject({
	draw: function () {
		this.parent();
		Tower.UI.draw();
	}
});

});