ig.module(
	'game.entities.fx.plus'
).requires(
    'game.entities.fx.basic-fx'
).defines(function () {

PlusFX = BasicFX.extend({
	snapping: false,
	animSheet: new ig.AnimationSheet('media/img/fx/plus.png', 3, 3),
	offset: { x: 1, y: 1 },

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.currentAnim = this.addAnim('idle', 1, [0]);
		this.vel.x = Math.random() * 2 - 4;
		this.vel.y = -Math.random() * 5;
	},

	update: function () {
		if (this.currentAnim.alpha <= 0) {
			this.kill();
			return;
		}
		this.currentAnim.alpha = Math.max(this.currentAnim.alpha - 0.02, 0);
		this.parent();
	}
});

});