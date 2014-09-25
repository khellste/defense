ig.module(
	'game.core.upgrades'
).requires(
	'game.core.global',
	'game.core.stats',
	'game.entities.abstract.unit',
	'game.core.stats'
).defines(function () {

// Upgrade base class
Tower.Upgrade = ig.Class.extend({
	value: 0,
	price: 0,
	bestValue: 0,
	stat: null,

	init: function (value, price) {
		this.value = value;
		this.price = price;
		this.constructor.stat = this.stat;
	},

	apply: function (entity) {
		this.processEntity(entity, this.value);
		entity._appliedUpgrades[this.hash()] = this;
	},

	hash: function () {
		return this.constructor.classId + '-' + this.value;
	},

	processEntity: function (entity, value) {
		entity.stats[this.stat.name].value = value;
	}
});
Tower.Upgrade.compare = function (a, b) { return a.value - b.value; };
Tower.Upgrade.rank = function (Type, obj, min, max) {
	var rank = 0;
	if (typeof obj === 'number') {
		rank = Math.ceil(Type.prototype.stat.rank(obj, min, max));
	}
	else if (obj instanceof Tower.Upgrade) {
		rank = Math.ceil(Type.prototype.stat.rank(obj.value, min, max));
	}
	else if (obj instanceof FriendlyUnit) {
		rank = Math.ceil(obj.stats[Type.prototype.stat.name].rank(min, max));
	}
	return (rank < min) ? min : (rank > max) ? max: rank;
};

Tower.PowerUpgrade = Tower.Upgrade.extend({ stat: Tower.Stat.Power });
Tower.SpeedUpgrade = Tower.Upgrade.extend({ stat: Tower.Stat.Speed });
Tower.RangeUpgrade = Tower.Upgrade.extend({ stat: Tower.Stat.Range });

FriendlyUnit.inject({
	upgrades: [],
	_appliedUpgrades: {},

	nextUpgrade: function (type) {
		var applicable = this.upgrades.filter(function (u) {
			return (
				u instanceof type &&
				!this._appliedUpgrades.hasOwnProperty(u.hash())
			);
		}.bind(this)).sort(Tower.Upgrade.compare);
		return applicable[0] || null;
	},

	applyNextUpgrade: function (type) {
		var next = this.nextUpgrade(type);
		next && this.applyUpgrade(next);
		return !!next;
	},

	applyUpgrade: function (upgrade) {
		upgrade && upgrade.apply(this);
	}
})

});