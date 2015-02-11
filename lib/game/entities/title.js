ig.module(
	'game.entities.title'
).requires(
	'impact.entity'
).defines(function () {

EntityTitle = ig.Entity.extend({
	animSheet: new ig.AnimationSheet('media/img/title.png', 72, 40),
	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim('idle', 1, [0]);
	}
});

});