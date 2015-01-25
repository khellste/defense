ig.module(
	'game.entities.abstract.unit'
).requires(
	'impact.entity'
).defines(function () {

Unit = ig.Entity.extend({
	size: { x: 8, y: 8 },
	offset: { x: 0, y: 0 },
	update: function () { ig.game.stopped || this.parent(); },
	engage: function () { },
	disengage: function () { }
});

});