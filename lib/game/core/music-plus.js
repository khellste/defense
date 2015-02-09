ig.module(
	'game.core.music-plus'
).requires(
	'impact.sound'
).defines(function () {

// TODO Check for support

ig.MusicPlus = ig.Class.extend({
	buffers: {},	// maps path to buffer
	names: {},	// maps name to path
	path: 'music/plus',

	ctx: null,
	playing: null,
	title: '',
	seq: [],

	_toPlay: null,
	_xhrCt: 0,
	_loadCallback: null,

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
		var buffer = this.buffers[this.names[name]];
		if (buffer == null) {
			console.error('There is no song called \'' + name + '\'!');
			return;
		}
		var source = this.ctx.createBufferSource();
		source.buffer = buffer;
		source.connect(this.ctx.destination);
		source.loop = true;
		source.start(0);
		this.playing = source;
		this.title = name;
		this._nextSong();
	},

	isPlaying: function (name) {
		return this.title === name;
	},

	stop: function () {
		if (this.playing) {
			this.playing.stop();
			this.playing = null;
			this.title = '';
		}
	},

	reset: function () {
		this.seq = [];
		this.stop();
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
				var next = this.seq.shift();
				next && this.play(next);
			}.bind(this);
		}
	},

	add: function (music, name) {
		this.names[name] = music;
		this._loadSong(music, function () {
			if (this._toPlay === name) {
				this.play(name);
			}
		}.bind(this));
	},

	_loadSong: function (path, callback) {

		// Support for { name: path } objects
		var name = null;
		if (typeof path == 'object') {
			for (var i in path) {
				if (path.hasOwnProperty(i)) {
					path = path[name = i];
					break;
				}
			}
		}

		var req = new XMLHttpRequest;
		req.open('GET', path, true);
		req.responseType = 'arraybuffer';
		req.onload = function () {
			this._xhrCt--;
			this.ctx.decodeAudioData(
				req.response,
				function (buffer) {
					this.buffers[path] = buffer;
					if (name != null) {
						this.names[name] = path;
					}
					if (typeof callback == 'function') {
						callback();
					}
					if (this._xhrCt === 0 && this._loadCallback) {
						this._loadCallback(this.path, true);
						this._loadCallback = null;
					}
				}.bind(this)
			);
		}.bind(this);
		req.send();
		this._xhrCt++;
	},

	load: function (cb) {
		ig.MusicPlus.songs.forEach(this._loadSong.bind(this));
		this._loadCallback = cb;
	}
});

ig.MusicPlus.songs = [];
ig.MusicPlus.preloadSongs = function (songs) {
	songs.forEach(function (path) {
		ig.MusicPlus.songs.push(path);
	});
};

ig.music2 = new ig.MusicPlus();
ig.addResource(ig.music2);

});