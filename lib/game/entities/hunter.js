ig.module(
	'game.entities.hunter'
).requires(
	'game.entities.abstract.unit',
	'plugins.lattice.BFS'
).defines(function () {

EntityHunter = EnemyUnit.extend({
	snapping: false,
	size: { x: 8, y: 8 },
	animSheet: new ig.AnimationSheet('media/img/dev/knight.png', 8, 8),
	recoiling: false,
	dir: 'down',
	_recoilTimeout: null,

	// Things that alter difficulty:
	speed: 2,
	recoil: 4,
	health: 10,
	value: 2,

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.hbar.orientation = 'top';

		var animSpeed = 2/this.speed;
		this.addAnim('down', animSpeed, [1, 2, 1, 3]);
		this.addAnim('up', animSpeed, [5, 6, 5, 7]);
		this.addAnim('right', animSpeed, [9, 10, 9, 11]);
		this.addAnim('left', animSpeed, [13, 14, 13, 15]);

		this.addAnim('downDmg', 0.05, [4, 0]);
		this.addAnim('upDmg', 0.05, [8, 0]);
		this.addAnim('rightDmg', 0.05, [12, 0]);
		this.addAnim('leftDmg', 0.05, [16, 0]);
		
		this.currentAnim = this.anims.down;
	},

	receiveDamage: function (amount, from) {
		this.parent(amount, from);
		this.recoiling = true;
		if (this._recoilTimeout != null) {
			clearTimeout(this._recoilTimeout);
		}
		this._recoilTimeout = setTimeout(function () {
			this.recoiling = false;
			this._recoilTimeout = null;
			this.resumeMovement();
		}.bind(this), this.recoil * 250);
		this.vel.x = this.vel.y = 0;
		this.pauseMovement();
	},

	update: function () {
		if (this.recoiling) {
			this.currentAnim = this.anims[this.dir + 'Dmg'];
			this.vel.x = this.vel.y = 0;
			this.parent();
		}
		else {
			this.stepTowardsTarget(this.speed, 'bfs');
			this.parent();
			if (this.vel.x < 0) {
				this.dir = 'left';
			}
			else if (this.vel.x > 0) {
				this.dir = 'right';
			}
			else if (this.vel.y < 0) {
				this.dir = 'up';
			}
			else {
				this.dir = 'down';
			}
			this.currentAnim = this.anims[this.dir];
		}
	},

	collideWith: function (a) {
		if (a instanceof EntityHome) {
			this.spoils = null;
			this.kill();
			Tower.health--;
		}
	}
});

});