ig.module(
	'game.entities.wizard'
).requires(
	'game.core.upgrades',
	'game.entities.abstract.ranged-unit',
    'game.entities.abstract.enemy-unit'
).defines(function () {

EntityWizard = RangedUnit.extend({
	animSheet: new ig.AnimationSheet('media/img/wizard.png', 8, 8),
	preview: {
		image: new ig.Image('media/img/wizard-preview.png'),
		offset: { x: 0, y: -10 }
	},
	EnemyType: EnemyUnit,
	range: 6,
	speed: 1/2000,
	value: 100,
	power: 8,

	upgrades: [
		new Tower.RangeUpgrade(7, 100),
		new Tower.RangeUpgrade(8, 200),
		new Tower.PowerUpgrade(11, 60),
		new Tower.PowerUpgrade(14, 120),
		new Tower.SpeedUpgrade(1/1750, 70)
	],

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim('down', 1, [0]);
		this.addAnim('downAtk', 0.5, [1, 0], true);
		this.addAnim('up', 1, [2]);
		this.addAnim('upAtk', 0.5, [3, 2], true);
		this.addAnim('right', 1, [4]);
		this.addAnim('rightAtk', 0.5, [5, 4], true);
		this.addAnim('left', 1, [6]);
		this.addAnim('leftAtk', 0.5, [7, 6], true);
	},

	update: function () {
		this.parent();
		var target = this.target;
		if (!target) return;
		var theta = Math.atan2(
			target.pos.y - this.pos.y,
			target.pos.x - this.pos.x
		).toDeg();
		while (theta < 0) theta += 360;
		while (theta > 360) theta -= 360;

		if (theta >= 45 && theta < 135) {
			this.currentAnim = this.anims.downAtk;
		}
		else if (theta >= 135 && theta < 225) {
			this.currentAnim = this.anims.leftAtk;
		}
		else if (theta >= 225 && theta < 315) {
			this.currentAnim = this.anims.upAtk;
		}
		else {
			this.currentAnim = this.anims.rightAtk;
		}
	},

	disengage: function (target) {
		if (this.currentAnim === this.anims.rightAtk) {
			this.currentAnim = this.anims.right;
		}
		else if (this.currentAnim === this.anims.leftAtk) {
			this.currentAnim === this.anims.left;
		}
		else if (this.currentAnim === this.anims.upAtk) {
			this.currentAnim = this.anims.up;
		}
		else {
			this.currentAnim = this.anims.down;
		}
	},

	fireAt: function (target) {
		target.receiveDamage(this.power, this);
		this.currentAnim.gotoFrame(0);
	}
});

});
