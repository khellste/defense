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

	engage: 	function () { },
	disengage: 	function () { }
});

FriendlyUnit = Unit.extend({
	
});

EnemyUnit = Unit.extend({
	collides: ig.Entity.COLLIDES.PASSIVE,
	type: ig.Entity.TYPE.B,
	value: 2,
	spoils: Tower.Spoils.Money
});

});