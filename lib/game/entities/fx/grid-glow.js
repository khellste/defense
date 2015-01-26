ig.module(
	'game.entities.fx.grid-glow'
).requires(
	'game.entities.fx.basic-fx'
).defines(function () {

GridGlowFX = BasicFX.extend({
	animSheet: new ig.AnimationSheet('media/img/fx/grid-glow.png', 8, 8),
	_noZUpdate: true,
	size: { x: 8, y: 8 },
	offset: { x: 0, y: 0 },
	_dAlpha: -0.005,
	_maxAlpha: 0.75,
	_minAlpha: 0.25,

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim('glow', 1, [5]);
		this.currentAnim.alpha = 0.75;
		this.zIndex = -50;
	},

	update: function () {
		this.parent();
		var anim = this.currentAnim;
		anim.alpha += this._dAlpha;
		if (anim.alpha > this._maxAlpha) {
			anim.alpha = this._maxAlpha;
			this._dAlpha *= -1;
		}
		else if (anim.alpha < this._minAlpha) {
			anim.alpha = this._minAlpha;
			this._dAlpha *= -1;
		}
	}
});

});