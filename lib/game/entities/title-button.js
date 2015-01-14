ig.module(
	'game.entities.title-button'
).requires(
	'game.core.ui.buttons'
).defines(function () {

EntityTitleButton = Tower.NonHUDLabeledButton.extend({
	size: { x: 16, y: 8 },
	labelOffset: { x: 8.5, y: -5 },
	path: 'media/ui/buttons/play.png',
	font: new ig.Font('media/ui/font.png'),
	label: '???',
	action: null,

	init: function (x, y, settings) {
		if (typeof this.font === 'string') {
			this.font = new ig.Font(this.font);
		}
		this.font.lineSpacing = -3;
		if ((settings || {}).image != null) {
			this.path = 'media/ui/buttons/' +
				settings.image.toLowerCase() + '.png';
		}
		this.parent(x, y, settings);
		this.label = this.label.replace(/\\n/g, '\n');

		var height = this.font.heightForString(this.label);
		var nLines = height/this.font.height;
		if (nLines > 1) {
			this.labelOffset.y -= height/2;
		}
	},

	click: function () {
		if (this.action == null) {
			console.warn('No action to take!');
			return;
		}
		var parsed = this.action.split(' ');
		var name = parsed.shift();
		var fun = ig.game[name];
		if (typeof fun !== 'function') {
			console.error('The action \'' + name + '\' is invalid!');
			return;
		}
		fun.apply(ig.game, parsed);
	}
});

});