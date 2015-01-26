ig.module(
	'game.entities.fx.countdown'
).requires(
	'impact.font',
	'impact.timer',
	'game.entities.fx.basic-fx'
).defines(function () {

CountdownFX = BasicFX.extend({
	duration: 5,
	font: new ig.Font('media/ui/font.png'),
	timer: null,
	_noZUpdate: true,
	remaining: 5,

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.timer = new ig.Timer(this.duration);
		this.zIndex = Infinity;
	},

	update: function () {
		this.remaining = -Math.floor(this.timer.delta());
		if (this.remaining <= 0) {
			this.kill();
		}
	},

	draw: function () {
		this.font.draw(this.remaining,
			this.pos.x,
			this.pos.y,
			ig.Font.ALIGN.LEFT
		);
	}
});

Tower.countdown = function (time) {
	return ig.game.spawnEntity(CountdownFX,
		0, 0, { duration: time }
	);
};

});