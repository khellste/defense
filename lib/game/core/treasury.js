ig.module(
	'game.core.treasury'
).requires(
	'game.core.global',
	'game.entities.wall',
	'game.entities.fx.money'
).defines(function () {

var Treasury = ig.Class.extend({
	funds: 0,
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

ig.Entity.inject({
	init: function (x, y, settings) {
		this.parent(x, y, settings);
		Object.defineProperty(this, 'sellPrice', {
			enumerable: true,
			set: function () { },
			get: function () {
				if (!this.value) return 0;
				var base = this.value;
				if (this._appliedUpgrades != null) {
					for (var name in this._appliedUpgrades) {
						base += this._appliedUpgrades[name].price;
					}
				}
				return Math.ceil(base * 0.7);
			}.bind(this)
		});
	},

	sell: function () {
		if (this.units) {
			this.units.forEach(function (unit) {
				unit.sell();
			});
		}
		Tower.treasury.funds += this.sellPrice;
		this.kill();
		for (var i = 0; i < 3; i++) {
			ig.game.spawnEntity(MoneyFX,
				this.pos.x + this.size.x/2,
				this.pos.y + this.size.y/2,
			{});
		}
	}
});

Tower.treasury = new Treasury(70);

});