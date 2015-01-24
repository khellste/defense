ig.module(
	'game.core.music-plus'
).requires(
	'impact.sound'
).defines(function () {

// TODO Check for support

var MusicPlus = ig.Class.extend({
	buffers: {},
	ctx: null,
	playing: null,
	seq: [],
	_toPlay: null,
	_xhrCt: 0,

	init: function () {
		this.ctx = new AudioContext();
	},

	play: function (name) {
		if (this.playing) {
			this.stop();
		}

		if (this._xhrCt > 0 && this.buffers[name] == undefined) {
			this._toPlay = name;
			return;
		}

		var source = this.ctx.createBufferSource();
		source.buffer = this.buffers[name];
		source.connect(this.ctx.destination);
		source.start(0);
		this.playing = source;

		if (this.seq.length) {
			source.onended = function () {
				this.stop();
				this.play(this.seq.shift());
			}.bind(this);
		}
		else {
			source.loop = true;
		}
	},

	stop: function () {
		this.playing.stop();
		this.playing = null;
	},

	sequence: function () {
		[].forEach.call(arguments, function (name) {
			this.seq.push(name);
		}.bind(this));
		this.playing.loop = false;
		this.playing.onended = function () {
			this.stop();
			this.play(this.seq.shift());
		}.bind(this);
	},

	add: function (music, name) {
		var req = new XMLHttpRequest();
		req.open('GET', music, true);
		req.responseType = 'arraybuffer';
		req.onload = function () {
			this.ctx.decodeAudioData(
				req.response,
				function (buffer) {
					this.buffers[name] = buffer;
					this._xhrCt--;
					if (this._toPlay === name) {
						this.play(name);
					}
				}.bind(this)
			);
		}.bind(this);
		req.send();
		this._xhrCt++;
	}
});

ig.music2 = new MusicPlus();

});