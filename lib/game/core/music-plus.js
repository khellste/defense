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

		// Stop the currently playing song, if any
		if (this.playing) {
			this.stop();
		}

		// If play is called while the requested song's XHR is still in flight,
		// remember the name of the song so that we can play it as soon as it
		// has loaded.
		if (this._xhrCt > 0 && this.buffers[name] == null) {
			this._toPlay = name;
			return;
		}

		// Play the requested song
		var source = this.ctx.createBufferSource();
		source.buffer = this.buffers[name];
		source.connect(this.ctx.destination);
		source.loop = true;
		source.start(0);
		this.playing = source;
		this._nextSong();
	},

	stop: function () {
		this.playing.stop();
		this.playing = null;
	},

	sequence: function () {
		[].forEach.call(arguments, function (name) {
			this.seq.push(name);
		}.bind(this));
		this._nextSong();
	},

	_nextSong: function () {
		if (this.playing && this.seq.length) {
			this.playing.loop = false;
			this.playing.onended = function () {
				this.stop();
				this.play(this.seq.shift());
			}.bind(this);
		}
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