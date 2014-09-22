ig.module(
	'game.core.treasury'
).requires(
	'game.core.global'
).defines(function () {

var Treasury = ig.Class.extend({
	funds: 50,
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
	}
});

Tower.treasury = new Treasury();

});