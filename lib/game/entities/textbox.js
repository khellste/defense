ig.module(
	'game.entities.textbox'
).requires(
	'impact.font',
	'impact.entity'
).defines(function () {

EntityTextbox = ig.Entity.extend({
	snapping: false,
	size: { x: 16, y: 8 },
	msgOffset: { x: 0, y: 0 },
	font: new ig.Font('media/ui/font.png'),
	_message: '[textbox]',
	action: null,

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		if (typeof this.font === 'string') {
			this.font = new ig.Font(this.font);
		}
		this.font.lineSpacing = -2;
		this.message(this._message);
	},

	message: function (newMsg) {
		this._message = newMsg.replace(/\\n/g, '\n');
	},

	draw: function () {
		this.parent();
		this.font.draw(this._message,
			this.pos.x + this.msgOffset.x - ig.game._rscreen.x,
			this.pos.y + this.msgOffset.y - ig.game._rscreen.y,
			ig.Font.ALIGN.LEFT
		);
	}
});

});