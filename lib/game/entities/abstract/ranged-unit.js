ig.module(
	'game.entities.abstract.ranged-unit'
).requires(
	'game.entities.abstract.unit',
	'game.entities.abstract.projectile',
	'game.util.drawing'
).defines(function () {

RangedUnit = FriendlyUnit.extend({
	target: null,
	EnemyType: null,
	ProjectileType: null,
	range: 0,
	speed: 1/1000,
	fired: false,
	power: 0,

	getTarget: function () {
		var actualRange = this.range * 8;

		// If I already have a target, verify that it is valid
		if (this.target != null) {
			if (this.target.distanceTo(this) > actualRange ||
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
			if (dist <= actualRange && dist < minDist) {
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
			}.bind(this), 1/this.speed);
		}
	},

	fireAt: function (target) {
		var P = this.ProjectileType;
		ig.game.spawnEntity(P,
			this.pos.x + this.size.x/2 - P.prototype.size.x/2,
			this.pos.y + this.size.y/2 - P.prototype.size.y/2,
			{ target: target, power: this.power }
		);
	},

	click: function (e) {
		if (Tower.UI.selectedUnit === this) {
			Tower.UI.hideMenu();
		}
		else {
			Tower.UI.showMenuFor(this);
		}
	},

	drawRange: function () {
		var actualRange = this.range * 8;
		var drawing = RangedUnit._rangeCache[this.range];
		if (drawing == null) {
			drawing = new Tower.Drawing({
				width: actualRange * 2,
				height: actualRange * 2
			});
			drawing.ctx.fillStyle = 'rgba(255,255,255,0.05)';
			drawing.ctx.strokeStyle = 'rgba(255,255,255,0.1)';
			drawing.ctx.arc(actualRange, actualRange, actualRange, 0, 2*Math.PI);
			drawing.ctx.fill();
			drawing.ctx.stroke();
			drawing.resize(ig.system.scale);
			RangedUnit._rangeCache[this.range] = drawing;
		}
		drawing.draw(
			this.pos.x - actualRange + this.size.x/2,
			this.pos.y - actualRange + this.size.y/2
		);
	}
});

RangedUnit._rangeCache = {};

});