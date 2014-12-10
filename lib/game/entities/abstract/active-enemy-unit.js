ig.module(
	'game.entities.abstract.active-enemy-unit'
).requires(
	'game.entities.abstract.enemy-unit',
	'impact.timer'
).defines(function () {

ActiveEnemyUnit = EnemyUnit.extend({
	_actionTimer: null,
	_acting: false,
	actionDelay: 2,

	init: function () {
		this.parent.apply(this, arguments);
		this._actionTimer = new ig.Timer(this.actionDelay);
	},

	update: function () {
		if (this._acting) {
			if (this._actionTimer.delta() >= 0) {
				this._acting = false;
				this._actionTimer.set(this.actionDelay);
				this.resumeMovement();
			}
			else {
				this.pauseMovement();
				ig.Entity.prototype.update.call(this);
				return;
			}
		}
		this.parent();
		if (this.recoiling) {
			this._actionTimer.pause();
		}
		else {
			this._actionTimer.unpause();
		}

		if (this._actionTimer.delta() >= 0) {
			this._acting = true;
			this._actionTimer.set(this.action() || 0);
		}
	},

	receiveDamage: function (amount, from) {
		this.parent(amount, from);
		if (this._acting) {
			this._acting = false;
			this._actionTimer.set(this.actionDelay);
			this.resumeMovement();
		}
	},

	action: function () { }
});

});