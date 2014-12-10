ig.module(
	'game.core.timeline'
).requires(
	'game.core.global',
	'impact.game',
	'impact.timer',
	'game.entities.hunter',
	'game.entities.dark-cleric'
).defines(function () {

Tower.Action = ig.Class.extend({
	next: null,
	timer: null,
	delay: 0,

	init: function (action, delay) {
		this.action = action;
		this.delay = delay || 0;
	},

	update: function () {
		if (!this.timer) {
			this.timer = new ig.Timer(this.delay);
			this.action();
		}
		else if (this.timer.delta() >= 0) {
			this.timer = null;
			this.next();
		}
	}
});

Tower.Action.Repeat = Tower.Action.extend({
	count: 0,

	init: function (action, delay, count) {
		this.parent(action, delay);
		this.count = count;
	},
	
	update: function () {
		if (this.count <= 0) {
			this.timer = null;
			this.next();
		}
		else if (!this.timer) {
			this.timer = new ig.Timer(this.delay);
			this.action();
		}
		else if (this.timer.delta() >= 0) {
			this.timer = null;
			this.count--;
		}
	}
});

Tower.Action.Delay = Tower.Action.extend({
	init: function (delay) {
		this.parent(function () { }, delay);
	}
});

Tower.Scenario = ig.Class.extend({
	timeline: [],
	idx: 0,
	done: false,

	init: function (timeline) {
		this.timeline = timeline;
		this.timeline.forEach(function (action) {
			action.next = this.next.bind(this);
		}.bind(this));
	},

	next: function () {
		this.idx++;
	},

	update: function () {
		if (!this.done && this.timeline[this.idx]) {
			this.timeline[this.idx].update();
		}
		else {
			this.done = true;
		}
	}
});


Tower.timeline = [
	new Tower.Scenario([
		new Tower.Action(function () {
			ig.game.spawnEntity(DarkCleric, 20, 0, {
				speed: 5,
				recoil: 0.5,
				health: 20,
				value: 5
			});
		}),
		new Tower.Action.Delay(2),
		new Tower.Action(function () {
			ig.game.spawnEntity(DarkCleric, 20, 0, {
				speed: 5,
				recoil: 0.5,
				health: 20,
				value: 5
			});
		}),
		new Tower.Action.Delay(10),
		new Tower.Action.Repeat(function () {
			ig.game.spawnEntity(EntityHunter, 40, 0, {
				speed: 10,
				recoil: 2,
				health: 10,
				value: 3
			});
		}, 5, 5),
		new Tower.Action.Delay(3),
		new Tower.Action.Repeat(function () {
			ig.game.spawnEntity(EntityHunter, 40, 0, {
				speed: 2,
				recoil: 0.1,
				health: 20,
				value: 5
			});
		}, 6, 3)
	])
];

});