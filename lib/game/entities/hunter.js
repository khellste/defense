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
	_recoilTimeout: null,
	dir: 'down',

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.hbar.orientation = 'top';

		this.addAnim('down', 0.5, [1, 2, 1, 3]);
		this.addAnim('up', 0.5, [5, 6, 5, 7]);
		this.addAnim('right', 0.5, [9, 10, 9, 11]);
		this.addAnim('left', 0.5, [13, 14, 13, 15]);

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
		}.bind(this), 500);
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
			if (!this.stepTowardsTarget(20, 'bfs')) {
				this.stepTowardsTarget(10, 'bfs_nowall');
			}
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
		}
	},

	mouseEnter: function () {
		this.hbar.visible = true;
	},

	mouseLeave: function () {
		this.hbar.visible = false;
	}
});

});