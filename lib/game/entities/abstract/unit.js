ig.module(
	'game.entities.abstract.unit'
).requires(
	'impact.entity',
	'game.core.spoils'
).defines(function () {
window.treasury = window.treasury || 0;

Unit = ig.Entity.extend({

	// Entity overrides
	size: { x: 8, y: 8 },
	offset: { x: 0, y: 0 },
	value: 0,

	engage: 	function () { },
	disengage: 	function () { }
});

FriendlyUnit = Unit.extend({

});

EnemyUnit = Unit.extend({
	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	value: 2,
	spoils: Tower.Spoils.Money,

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
	}
});

});