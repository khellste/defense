ig.module(
	'game.entities.wizard'
).requires(
	'game.entities.hunter',
	'game.entities.abstract.ranged-unit'
).defines(function () {

EntityWizard = RangedUnit.extend({
	animSheet: new ig.AnimationSheet('media/img/wizard.png', 8, 8),
	EnemyType: EntityHunter,
	range: 128,
	rechargePeriod: 1000,
	value: 60,
	power: 1,

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim('down', 1, [0]);
		this.addAnim('downAtk', 1, [1]);
		this.addAnim('up', 1, [2]);
		this.addAnim('upAtk', 1, [3]);
		this.addAnim('right', 1, [4]);
		this.addAnim('rightAtk', 1, [5]);
		this.addAnim('left', 1, [6]);
		this.addAnim('leftAtk', 1, [7]);
	},

	engage: function (target) {
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
	}
});

});