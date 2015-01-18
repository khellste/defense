ig.module(
	'game.core.stats'
).requires(
	'game.core.global',
	'game.entities.abstract.friendly-unit'
).defines(function () {

Tower.Stat = ig.Class.extend({
	name: '',
	prop: '',
	worstValue: 0,
	bestValue: Infinity,

	init: function (settings) {
		ig.merge(this, settings);
	},

	rank: function (value, min, max) {
		var scaled = value.map(this.worstValue, this.bestValue, min, max);
		if (scaled < min) return min;
		if (scaled > max) return max;
		return scaled;
	}
});

Tower.Stat.Power = new Tower.Stat({
	name: 'power',
	worstValue: 1,
	bestValue: 20
});

Tower.Stat.Speed = new Tower.Stat({
	name: 'speed',
	worstValue: 1/3500,
	bestValue: 1/500
});

Tower.Stat.Range = new Tower.Stat({
	name: 'range',
	worstValue: 2,
	bestValue: 8
});

Tower.Stat.types = [Tower.Stat.Power, Tower.Stat.Speed, Tower.Stat.Range];

FriendlyUnit.inject({
	stats: { },

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		Tower.Stat.types.forEach(function (stat) {

			// Replace, e.g., this.speed with a property that has getters and
			// setters to ensure that the value is within the permissible
			// range of values for this stat.
			var best = stat.bestValue, worst = stat.worstValue;
			var value = worst, name = stat.name, old = this[name];
			Object.defineProperty(this, name, {
				enumerable: true,
				get: function () { return value; },
				set: function (newVal) {
					if (typeof newVal !== 'number') return;
					if (newVal !== value) {
						value = newVal;
						if (value < worst) value = worst;
						if (value > best) value = best;
					}
				}.bind(this)
			});
			this[name] = old;

			// Add a metadata object to this.stats, e.g., "this.stats.speed",
			// which can be used to rank this stat on a scale (as well as to
			// get and set the value).
			var statsProp = { };
			Object.defineProperty(this.stats, name, {
				enumerable: true,
				get: function () { return statsProp; },
				set: function () { }
			});
			Object.defineProperties(statsProp, {
				value: {
					enumerable: true,
					get: function () { return this[name]; }.bind(this),
					set: function (newVal) { this[name] = newVal; }.bind(this)
				},
				rank: {
					enumerable: true,
					set: function () { },
					get: function () {
						return function (min, max) {
							return stat.rank(this.value, min, max);
						};
					}.bind(this)
				}
			});

		}.bind(this));
	}
});

});