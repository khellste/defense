ig.module(
	'game.core.shims'
).requires(
	'impact.sound'
).defines(function () {

// Chrome audio bugs
if (window.chrome && typeof Audio == 'function') {

	// Audio objects must be reloaded before they'll play again
	Audio.prototype._play = Audio.prototype.play;
	Audio.prototype.play = function () {
		this.autoplay = true;
		this.load();
	};

	// Don't even try OGG
	ig.Sound.use = [ig.Sound.FORMAT.MP3];

	// Native looping doesn't work...
	ig.Music.inject({
		add: function (music, name) {
			var tmp = this._loop;
			this._loop = false;
			this.parent(music, name);
			this._loop = tmp;

			// This is to get rid of the gap between plays
			var path = music instanceof ig.Sound ? music.path : music;
			var track = ig.soundManager.load(path, false);
			var self = this;
			track.addEventListener('timeupdate', function () {
				if (self._loop && this === self.currentTrack &&
					this.currentTime > this.duration - 0.3) {
					this.play();
				}
			});
		},

		setLooping: function (l) {
			this._loop = l;
		}
	});
}

});