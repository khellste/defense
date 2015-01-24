ig.module(
	'game.core.audio-shim'
).requires(
	'impact.sound',
	'game.core.global'
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
}

});