ig.module(
	'game.entities.home'
).requires(
	'impact.entity'
).defines(function () {

EntityHome = ig.Entity.extend({
	size: { x: 8, y: 8 },
	animSheet: new ig.AnimationSheet('media/img/base.png', 24, 24),
	offset: { x: 8, y: 8 },
	collides: ig.Entity.COLLIDES.FIXED,

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim('normal', 1, [0]);
		this.currentAnim = this.anims.normal;
	}
});

});