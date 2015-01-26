ig.module(
	'game.entities.abstract.projectile'
).requires(
	'impact.entity',
	'impact.sound',
	'plugins.lattice.wall'
).defines(function () {

Projectile = ig.Entity.extend({
	ignoreGrid: true,
	collides: ig.Entity.COLLIDES.NONE,
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.B,
	owner: null,
	_target: { x: 0, y: 0 },
	_initHeight: 0,
	_initDist: 0,
	soundB: new ig.Sound('media/snd/sfx/arrow-hit.*'),
	soundA: new ig.Sound('media/snd/sfx/arrow-launch.*'),

	speed: 0,
	power: 0,

	EnemyType: null,
	_noZUpdate: true,

	aimAt: function (target) {
		var sq = function (x) { return Math.pow(x, 2); };
		var sx = this.pos.x + this.size.x/2,
			sy = this.pos.y + this.size.y/2,
			tx = target.pos.x + target.size.x/2, 
			ty = target.pos.y + target.size.y/2,
			vx = target.vel.x, 	vy = target.vel.y;

		// Quadratic equation parameters
		var a = sq(vx) + sq(vy) - sq(this.speed);
		var b = 2 * (vx * (tx - sx) + vy * (ty - sy));
		var c = sq(tx - sx) + sq(ty - sy);

		// Unreachable
		if (a === 0) return null;
		var D = sq(b) - 4 * a * c;
		if (D < 0) return null;

		// Calculate the aim angle
		var t = ((a < 0 ? -1 : 1) * Math.sqrt(D) - b) / (2 * a);
		var x = tx + t * vx, y = ty + t * vy;
		this._target = { x: x, y: y };
		this._initDist = Math.sqrt(
			Math.pow(x - sx, 2) + Math.pow(y - sy, 2)
		);
		var angle = Math.atan2(y - sy, x - sx);
		var PI2 = Math.PI * 2;
		while (angle < 0) angle += PI2;
		while (angle >= PI2) angle -= PI2;
		return angle;
	},

	update: function () {
		var currDist = Math.sqrt(
			Math.pow(this.pos.x + this.size.x/2 - this._target.x, 2) +
			Math.pow(this.pos.y + this.size.y/2 - this._target.y, 2)
		);
		var progress = currDist / this._initDist;
		this.offset.y = this._initHeight * progress;
		this.parent();

		// Destroy the projectile when it goes off screen
		var canvas = ig.system.canvas, scale = ig.system.scale;
		if (this.pos.y + this.size.y < 0 || this.pos.y > canvas.height/scale ||
			this.pos.x + this.size.x < 0 || this.pos.x > canvas.width/scale) {
			this.kill();
		}

		// Add velocity to z-index to fix the projectile's depth to always
		// be alead of things on the same tile that the projectile is going
		// to be moving past
		else {
			this.zIndex = this.pos.y + this.vel.y;
		}
	},

	// Ignore static collisions
	handleMovementTrace: function (res) {
		this.pos.x += this.vel.x * ig.system.tick;
		this.pos.y += this.vel.y * ig.system.tick;
	},

	launchAt: function (target) {
		var theta = this.aimAt(target);
		if (theta == null) {
			console.error("What? Can't reach target!");
			theta = 0;
		}
		this.vel.x = this.speed * Math.cos(theta);
		this.vel.y = this.speed * Math.sin(theta);
		return theta;
	},

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.EnemyType = this.target.constructor;
		this._initHeight = this.offset.y = this.owner.offset.y || 0;
		this.orient(this.launchAt(this.target));
		setTimeout(this.kill.bind(this), 10000);
		this.soundA.play();
	},

	check: function (other) {
		if (other instanceof this.EnemyType) {
			this.impact(other);
		}
		else {
			this.kill();
		}
	},

	impact: function (other) {
		this.kill();
		this.soundB.play();
		other.receiveDamage(this.power);
	},

	orient: function (theta) { },
});

});