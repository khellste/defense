ig.module(
	'game.core.spoils'
).requires(
	'game.core.global',
	'game.core.treasury',
	'impact.game'
).defines(function () {

Tower.Spoils = {
	Money: function () {
		if (this.value != null) {
			Tower.treasury.funds += this.value;
		}
	}
}

ig.Game.inject({
	removeEntity: function (entity) {
		this.parent(entity);
		if (entity.spoils != null) {
			entity.spoils.call(entity);
		}
	}
});

});