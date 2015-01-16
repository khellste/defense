ig.module(
	'game.entities.fx.banner'
).requires(
    'game.entities.fx.basic-fx',
	'impact.font',
	'impact.game',
	'impact.timer',
	'game.core.global'
).defines(function () {

// Pre-calculate sine values
var sin = {}, nSteps = 40, sum = 0;
for (var rads = 0, i = 0; i < nSteps; rads += Math.PI/nSteps, i++) {
	sin[i] = Math.sin(rads);
}
for (var r in sin) {
	if (sin.hasOwnProperty(r)) {
		sum += sin[r];
	}
}

BannerFX = BasicFX.extend({
	_noZUpdate: true,

	animSheet: new ig.AnimationSheet('media/img/fx/banner.png', 88, 16),
	font: new ig.Font('media/ui/font-large.png'),
	size: { x: 88, y: 16 },
	offset: { x: 44, y: 8 },
	snapping: false,
	message: '',

	_moveDist: 0,
	_step: 0,
	_moving: false,
	_dismissed: false,
	_timer: null,
	onDone: null,
	duration: 1.5,

	init: function (x, y, settings) {
		settings = settings || { };
		var targetX = ig.game.grid.size.c * ig.game.tilesize / 2;
		var targetY = ig.game.grid.size.r * ig.game.tilesize / 2;
		this.parent(targetX + this.size.x, targetY, settings);
		this.zIndex = Infinity;
		this.addAnim('idle', 1, [0]);
		this.moveTowards(targetX);
	},

	kill: function () {
		this.parent();
		this.onDone && this.onDone();
	},

	moveTowards: function (x) {
		this._moving = true;
		this._step = 0;
		this._moveDist = Math.abs(this.pos.x - x);
	},

	dismiss: function () {
		this._dismissed = true;
	},

	update: function () {
		this.parent();
		if (this._moving) {
			if (++this._step >= nSteps) {
				this._moving = false;
				if (this._dismissed) {
					this.kill();
				}
				else if (this.duration >= 0) {
					this._timer = new ig.Timer(this.duration);
				}
			}
			else {
				this.pos.x -= this._moveDist * sin[this._step]/sum;
			}
		}
		else if (this._dismissed) {
			this.moveTowards(this.pos.x - this.size.x);
		}
		else if (this._timer && this._timer.delta() >= 0) {
			this.dismiss();
		}
	},

	draw: function () {
		this.parent();
		this.font.draw(this.message,
			this.pos.x,
			this.pos.y - 5,
			ig.Font.ALIGN.CENTER
		);
	}
});

Tower.banner = function (opt) {
	opt = opt || {}
	ig.game.spawnEntity(BannerFX, 0, 0, {
		message: opt.message || '',
		duration: (typeof opt.time == 'number') ? opt.time : 1.5,
		onDone: opt.done
	});
};

});