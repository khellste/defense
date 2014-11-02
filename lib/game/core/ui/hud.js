ig.module(
	'game.core.ui.hud'
).requires(
	'impact.font',
	'impact.image',
	'impact.game',
	'impact.entity',
	'game.core.global',
	'game.core.treasury',
	'game.entities.wall',
	'game.entities.archer',
	'game.entities.wizard',
	'game.core.ui.buttons',
	'game.core.upgrades'
).defines(function () {

var UI = ig.Class.extend({
	moneyFont: new ig.Font('media/ui/font-tiny-yellow.png'),
	moneyFontGray: new ig.Font('media/ui/font-tiny-gray.png'),
	scoreFont: new ig.Font('media/ui/font.png'),
	hudImage: new ig.Image('media/ui/hud.png'),
	heartSheet: new ig.AnimationSheet('media/ui/heart.png', 8, 8),
	heartAnim: { full: null, empty: null },
	buttons: [],
	selectedUnit: null, // Unit most recently selected by left click
	_buttonsInitialized: false,
	_drawingPhase: false,

	init: function () {
		this.heartAnim.empty = new ig.Animation(this.heartSheet, 1, [0], true);
		this.heartAnim.full = new ig.Animation(this.heartSheet, 1, [1], true);
	},

	_initButtons: function () {
		this.buttons.push(ig.game.spawnEntity(Tower.EntityPurchaseButton, 40, 103, {
			path: 'media/ui/buttons/wall.png',
			type: EntityWall
		}));
		this.buttons.push(ig.game.spawnEntity(Tower.EntityPurchaseButton, 55, 103, {
			path: 'media/ui/buttons/archer.png',
			type: EntityArcher
		}));
		this.buttons.push(ig.game.spawnEntity(Tower.EntityPurchaseButton, 70, 103, {
			path: 'media/ui/buttons/wizard.png',
			type: EntityWizard
		}));
		this.buttons.push(ig.game.spawnEntity(Tower.UpgradeButton, 38, 103, {
			path: 'media/ui/buttons/range.png',
			barPath: 'media/ui/buttons/range-bar.png',
			type: Tower.RangeUpgrade
		}));
		this.buttons.push(ig.game.spawnEntity(Tower.UpgradeButton, 57, 103, {
			path: 'media/ui/buttons/power.png',
			barPath: 'media/ui/buttons/power-bar.png',
			type: Tower.PowerUpgrade
		}));
		this.buttons.push(ig.game.spawnEntity(Tower.UpgradeButton, 76, 103, {
			path: 'media/ui/buttons/speed.png',
			barPath: 'media/ui/buttons/speed-bar.png',
			type: Tower.SpeedUpgrade
		}));
		this.buttons.push(ig.game.spawnEntity(Tower.DeleteButton, 1, 97));
		this._buttonsInitialized = true;
	},

	deselectAllButtons: function () {
		this.buttons.forEach(function (btn) { btn.deselect(); });
	},

	showMenuFor: function (unit) {
		this.deselectAllButtons();
		this.selectedUnit = unit;
	},

	hideMenu: function () {
		this.selectedUnit = null;
	},

	draw: function () {
		this._buttonsInitialized || this._initButtons();
		this._drawingPhase = true;

		// Unit range
		if (this.selectedUnit) {
			if (this.selectedUnit instanceof RangedUnit) {
				this.selectedUnit.drawRange();
			}
		}

		// HUD backdrop
		this.hudImage.draw(0, 96);

		// Health
		var health = Tower.health;
		for (var i = 1; i <= 3; i++) {
			this.heartAnim[health < i ? 'empty' : 'full'].draw(2 + 7 * i, 97);
		}

		// Money
		var funds = Tower.treasury.funds;
		this.moneyFont.draw((funds > 9999) ? 9999 : funds, 12, 106);

		// Buttons
		this.buttons.forEach(function (btn) {
			if (btn instanceof Tower.EntityPurchaseButton &&
				this.selectedUnit == null) {
				btn.draw();
			}
			else if (btn instanceof Tower.UpgradeButton &&
				this.selectedUnit != null) {
				btn.draw();
			}
			if (btn instanceof Tower.DeleteButton) {
				btn.draw();
			}
		}.bind(this));
		this._drawingPhase = false;
	}
});

// Initialize and install
Tower.UI = new UI();
ig.Game.inject({
	draw: function () {
		this.parent();
		Tower.UI.draw();
	},

	removeEntity: function (entity) {
		this.parent(entity);
		if (entity === Tower.UI.selectedUnit) {
			Tower.UI.selectedUnit = null;
		}
	}
});

});