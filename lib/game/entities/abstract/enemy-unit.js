ig.module(
	'game.entities.abstract.enemy-unit'
).requires(
	'game.entities.abstract.unit',
	'game.core.spoils',
	'plugins.lattice.BFS',
	'game.entities.fx.plus'
).defines(function () {

EnemyUnit = Unit.extend({
	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	value: 2,
	spoils: Tower.Spoils.Money,
	snapping: false,
	recoiling: false,
	dir: 'down',
	size: { x: 8, y: 8 },
	_recoilTimeout: null,

	// Things that alter difficulty:
	speed: 2,
	recoil: 4,
	health: 10,
	value: 2,

	// Health bar
	hbar: {
		max: 0,
		visible: false,
		orientation: 'left',
		fgColor: '#4169e1',
		bgColor: '#ff4500'
	},

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.hbar.max = this.hbar.max || this.health;
		this.hbar.orientation = 'top';
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

	heal: function (number, absolute) {
		var amt = absolute ? number : (this.hbar.max * number);
		this.health = Math.min(this.health + amt, this.hbar.max);
	},

	_drawHealth: function () {
		if (!this.hbar.visible) return;

		var r = this.health/this.hbar.max, o = this.hbar.orientation,
			sys = ig.system, ctx = sys.context, sc = sys.scale,
			x1, x2, y1, y2, w1, w2, h1, h2;

		var x = sys.getDrawPos(this.pos.x - ig.game._rscreen.x),
			y = sys.getDrawPos(this.pos.y - ig.game._rscreen.y),
			sx = this.size.x * sc, sy = this.size.y * sc;

		if (o === 'left' || o === 'right') {
			y1 = y2 = y; w1 = w2 = sc; h2 = (h1 = sy) * r;
			x1 = x2 = (o === 'left') ? x : (x + sx - w1);
		}
		else {
			x1 = x2 = x; h1 = h2 = sc; w2 = (w1 = sx) * r;
			y1 = y2 = (o === 'top') ? y : (y + sy - h1);
		}

		ctx.save();
		ctx.globalCompositionOperation = 'source-over';
		ctx.fillStyle = this.hbar.bgColor;
		ctx.fillRect(x1, y1, w1, h1);
		ctx.fillStyle = this.hbar.fgColor;
		ctx.fillRect(x2, y2, w2, h2);
		ctx.restore();
	},

	draw: function () {
		this.parent();
		this._drawHealth();
	},

	mouseEnter: function () {
		this.hbar.visible = true;
	},

	mouseLeave: function () {
		this.hbar.visible = false;
	},

	collideWith: function (a) {
		if (a instanceof EntityHome) {
			this.spoils = null;
			this.kill();
			Tower.health--;
		}
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
	}
});

});