ig.module(
	'game.core.treasury'
).requires(
	'game.core.global',
	'game.entities.wall'
).defines(function () {

var Treasury = ig.Class.extend({
	funds: 500,
	max: Number.MAX_SAFE_INTEGER || 9007199254740991,

	init: function (baseMoney) {
		var funds = baseMoney || this.funds;
		Object.defineProperty(this, 'funds', {
			enumerable: true,
			get: function () { return funds; },
			set: function (value) {
				if (value < 0) {
					funds = 0;
				} else if (value > this.max) {
					funds = this.max;
				} else {
					funds = value;
				}
			}.bind(this)
		});
	},

	sellUnit: function (unit) {
		if (unit instanceof EntityWall && unit.units.length) {
			unit = unit.units[0];
		}
		var gainz = unit.value * 0.9 * unit.health/unit.hbar.max;
		this.funds += gainz;
		unit.kill();
		return gainz;
	}
});

Tower.treasury = new Treasury();

});