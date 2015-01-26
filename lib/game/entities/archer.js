ig.module(
	'game.entities.archer'
).requires(
	'game.entities.abstract.enemy-unit',
	'game.entities.abstract.ranged-unit',
	'game.core.upgrades'
).defines(function () {

// The archer's projectile is an arrow
var Arrow = Projectile.extend({
	size: { x: 3, y: 3 },
	animSheet: new ig.AnimationSheet('media/img/arrow.png', 3, 3),
	power: 3,
	speed: 50,
	orient: function (theta) {
		var dir = Math.floor((8 * theta - Math.PI / 2) / Math.PI);
		this.currentAnim = this.addAnim(dir, 1, [dir]);
	}
});

// Archer class
EntityArcher = RangedUnit.extend({
	animSheet: new ig.AnimationSheet('media/img/archer.png', 8, 8),
	preview: {
		image: new ig.Image('media/img/archer-preview.png'),
		offset: { x: 0, y: -10 }
	},
	ProjectileType: Arrow,
	EnemyType: EnemyUnit,
	range: 2,
	speed: 1/1000,
	power: 4,
	value: 50,
	upgrades: [
		new Tower.PowerUpgrade(6, 40),
		new Tower.PowerUpgrade(10, 65),
		new Tower.RangeUpgrade(3, 50),
		new Tower.RangeUpgrade(4, 75),
		new Tower.SpeedUpgrade(1/875, 45),
		new Tower.SpeedUpgrade(1/750, 80)
	],

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim('down', 1, [0]);
		this.addAnim('up', 1, [1]);
		this.addAnim('right', 1, [2]);
		this.addAnim('left', 1, [3]);
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