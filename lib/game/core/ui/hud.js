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
	'game.core.upgrades',
	'impact.sound'
).defines(function () {

Tower._UI = ig.Class.extend({
	moneyFont: new ig.Font('media/ui/font-tiny-yellow.png'),
	moneyFontGray: new ig.Font('media/ui/font-tiny-gray.png'),
	scoreFont: new ig.Font('media/ui/font.png'),
	hudImage: new ig.Image('media/ui/hud.png'),
	heartSheet: new ig.AnimationSheet('media/ui/heart.png', 8, 8),
	heartAnims: [],
	buttons: [],
	selectedUnit: null, // Unit most recently selected by left click
	_buttonsInitialized: false,
	_drawingPhase: false,
	_menuOnSound: new ig.Sound('media/snd/sfx/button-down.*'),
	_menuOffSound: new ig.Sound('media/snd/sfx/button-up.*'),

	init: function () {
		for (var i = 0; i <= 4; i++) {
			this.heartAnims.push(new ig.Animation(this.heartSheet, 1, [i], true));
		}
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
		if (this.selectedUnit != unit) {
			this._menuOnSound.play();
		}
		this.deselectAllButtons();
		this.selectedUnit = unit;
	},

	hideMenu: function () {
		if (this.selectedUnit != null) {
			this._menuOffSound.play();
		}
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
		var health = Tower.health.map(0, Tower.maxHealth, 0, 12);
		for (var i = 0; i < 3; i++) {
			var j = 0;
			for (; j < 4 && health > 0; j++, health--);
			this.heartAnims[j].draw(9 + 7 * i, 97);
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
Tower.UI = new Tower._UI();
ig.Game.inject({
	showHUD: true,

	draw: function () {
		this.parent();
		if (this.showHUD) {
			Tower.UI.draw();
		}
	},

	removeEntity: function (entity) {
		this.parent(entity);
		if (entity === Tower.UI.selectedUnit) {
			Tower.UI.selectedUnit = null;
		}
	}
});

});