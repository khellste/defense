ig.module(
	'game.entities.abstract.unit'
).requires(
	'impact.entity'
).defines(function () {

Unit = ig.Entity.extend({

	// Entity overrides
	size: { x: 8, y: 8 },
	offset: { x: 0, y: 0 },
	value: 0,

	engage: 	function () { },
	disengage: 	function () { }
});

});