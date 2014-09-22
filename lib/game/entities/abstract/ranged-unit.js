ig.module(
	'game.entities.abstract.ranged-unit'
).requires(
	'game.entities.abstract.unit',
	'game.entities.abstract.projectile'
).defines(function () {

RangedUnit = FriendlyUnit.extend({
	target: null,
	EnemyType: null,
	ProjectileType: null,
	range: 0,
	rechargePeriod: 1000,
	fired: false,

	getTarget: function () {
		// If I already have a target, verify that it is valid
		if (this.target != null) {
			if (this.target.distanceTo(this) > this.range ||
				this.target._killed) {
				this.disengage(this.target);
				this.target = null;
			}
			else {
				return this.target;
			}
		}

		// Look for a new target
		var enemies = ig.game.getEntitiesByType(this.EnemyType);
		var closest = null, minDist = Number.MAX_VALUE;
		for (var i = 0; i < enemies.length; i++) {
			var dist = enemies[i].distanceTo(this);
			if (dist <= this.range && dist < minDist) {
				closest = enemies[i];
				minDist = dist;
			}
		}
		if ((this.target = closest) != null) {
			this.engage(this.target);
		}
		return this.target;
	},

	update: function () {
		this.parent();
		this.getTarget();
		if (this.target != null && !this.fired) {
			this.fireAt(this.target);
			this.fired = true;
			setTimeout(function () {
				this.fired = false;
			}.bind(this), this.rechargePeriod);
		}
	},

	fireAt: function (target) {
		var P = this.ProjectileType;
		ig.game.spawnEntity(P,
			this.pos.x + this.size.x/2 - P.prototype.size.x/2,
			this.pos.y + this.size.y/2 - P.prototype.size.y/2,
			{ target: target }
		);
	}
});

});