ig.module(
	'game.entities.slideshow'
).requires(
	'impact.entity'
).defines(function () {

EntitySlideshow = ig.Entity.extend({
	size: { x: 72, y: 56 },
	animSheet: new ig.AnimationSheet('media/img/howto.png', 72, 56),
	init: function (x, y, settings) {
		this.parent(x, y, settings);
		for (var i = 0; i < ig.game._instrs.length; i++) {
			this.addAnim(i, 1, [i]);
		}
		this.currentAnim = this.anims[0];
	},

	showImage: function (idx) {
		this.currentAnim = this.anims[idx];
	}
});

if (ig.global.wm) {
	EntitySlideshow.inject({
		init: function (x, y, settings) {
			ig.Entity.prototype.init.call(this, x, y, settings);
			this.addAnim(0, 1, [0]);
		}
	});
}

});