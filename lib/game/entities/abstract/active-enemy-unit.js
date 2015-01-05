ig.module(
	'game.entities.abstract.active-enemy-unit'
).requires(
	'game.entities.abstract.enemy-unit',
	'impact.timer'
).defines(function () {

ActiveEnemyUnit = EnemyUnit.extend({
	_actionTimer: null,
	_acting: false,
    actionInterval: 2,
	
    _delayTimer: null,
    _delaying: false,
    _doneDelaying: false,
    actionDelay: 0,
    
    _snapped: true,
    requireAlign: false,

	init: function () {
		this.parent.apply(this, arguments);
		this._actionTimer = new ig.Timer(this.actionInterval);
        this._delayTimer = new ig.Timer(this.actionDelay);
	},

    onNewGridPos: function () {
        this._snapped = true;
    },

	update: function () {
        var snap = this._snapped;
        this._snapped = false;

        // Has the unit's delay interval expired
        if (this._delaying && this._delayTimer.delta() >= 0) {
            this._delaying = false;
            this._doneDelaying = true;
        }

        // Has the unit's action interval expired?
		else if (this._acting && this._actionTimer.delta() >= 0) {
			this._acting = false;
			this._actionTimer.set(this.actionInterval);
			this.resumeMovement();
		}

        // Is the unit busy acting or delaying?
        else if (this._acting || this._delaying) {
            this.pauseMovement();
            ig.Entity.prototype.update.call(this);
            return;
        }

        // Do parent update
		this.parent();
		if (this.recoiling) {
			this._actionTimer.pause();
		}
		else {
			this._actionTimer.unpause();
		}

        // Was this unit just delaying?
        if (!this._delaying && this._doneDelaying) {
            this._doneDelaying = false;
            this._acting = true;
            this._actionTimer.set(this.action() || 0);
        }

        // Is this unit ready to act or delay?
        if (this._actionTimer.delta() >= 0 && (!this.requireAlign || snap)) {
            if (this.actionDelay > 0) {
                this._delaying = true;
                this._delayTimer.set(this.actionDelay);
                this.delay();
            }
            else {
                this._acting = true;
                this._actionTimer.set(this.action() || 0);
            }
        }
	},

	receiveDamage: function (amount, from) {
		this.parent(amount, from);
		if (this._acting) {
			this._acting = false;
			this._actionTimer.set(this.actionInterval);
			this.resumeMovement();
		}
	},

    delay:  function () { },
	action: function () { }
});

});