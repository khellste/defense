ig.module(
	'game.core.timeline'
).requires(
	'game.core.global',
	'impact.timer'
).defines(function () {

// A single action
Tower.Action = ig.Class.extend({
	_action_cb: null,

	init: function (action) {
		this._action_cb = action;
	},

	update: function () {
		this._action_cb(this.done.bind(this));
	},

	reset: function () { },

	done: function () { }
});

// Delay for an amount of seconds
Tower.Action.Delay = Tower.Action.extend({
	timer: null,
	delay: 0,

	init: function (delay) {
		this.delay = delay;
	},

	update: function () {
		if (this.timer == null) {
			this.timer = new ig.Timer(this.delay);
		}
		else if (this.timer.delta() >= 0) {
			this.timer = null;
			this.done();
		}
	},

	reset: function () {
		this.timer = null;
	}
});

// Run a sequence of actions
Tower.Action.Sequence = Tower.Action.extend({
	actions: [],
	index: 0,
	finished: false,

	init: function (actions) {
		if (!(actions instanceof Array)) {
			actions = [].slice.call(arguments, 0);
		}
		this.actions = actions.map(function (action) {
			if (typeof action === 'function') {
				action = new Tower.Action(action);
			}
			action.done = function () {
				this.index++;
			}.bind(this);
			return action;
		}.bind(this));
	},

	update: function () {
		var action = this.actions[this.index];
		if (action != null) {
			action.update();
		}
		else {
			this.finished = true;
			this.done();
		}
	},

	reset: function () {
		this.index = 0;
		this.finished = false;
		this.actions.forEach(function (action) {
			action.reset();
		});
	}
});

// Repeat
Tower.Action.Repeat = Tower.Action.extend({
	count: 0,
	_initCount: 0,

	init: function (count, action) {
		this.count = this._initCount = count;
		if (typeof action === 'function') {
			action = new Tower.Action(action);
		}
		this.action = action;
		this.action.done = function () {
			this.count--;
			this.action.reset();
		}.bind(this);
	},
	
	update: function () {
		if (this.count <= 0) {
			this.done();
		}
		else {
			this.action.update();
		}
	},

	reset: function () {
		this.count = this._initCount;
	}
});

});