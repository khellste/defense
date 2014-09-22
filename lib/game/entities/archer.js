ig.module(
	'game.entities.archer'
).requires(
	'game.entities.hunter',
	'game.entities.abstract.ranged-unit'
).defines(function () {

// The archer's projectile is an arrow
var Arrow = Projectile.extend({
	size: { x: 3, y: 3 },
	animSheet: new ig.AnimationSheet('media/img/arrow.png', 3, 3),
	power: 4,
	speed: 50,
	orient: function (theta) {
		var dir = Math.floor((8 * theta - Math.PI / 2) / Math.PI);
		this.currentAnim = this.addAnim(dir, 1, [dir]);
	}
});

// Archer class
EntityArcher = RangedUnit.extend({
	animSheet: new ig.AnimationSheet('media/img/archer.png', 8, 8),
	ProjectileType: Arrow,
	EnemyType: EntityHunter,
	range: 32,
	rechargePeriod: 1500,
	value: 50,

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim('down', 1, [0]);
		this.addAnim('up', 1, [1]);
		this.addAnim('right', 1, [2]);
		this.addAnim('left', 1, [3]);
	},

	engage: function (target) {
		var theta = Math.atan2(
			target.pos.y - this.pos.y,
			target.pos.x - this.pos.x
		).toDeg();
		while (theta < 0) theta += 360;
		while (theta > 360) theta -= 360;

		if (theta >= 45 && theta < 135) {
			this.currentAnim = this.anims.down;
		}
		else if (theta >= 135 && theta < 225) {
			this.currentAnim = this.anims.left;
		}
		else if (theta >= 225 && theta < 315) {
			this.currentAnim = this.anims.up;
		}
		else {
			this.currentAnim = this.anims.right;
		}
	}
});

});