ig.module(
	'game.entities.dark-cleric'
).requires(
	'game.entities.abstract.active-enemy-unit'
).defines(function () {

EntityDarkCleric = ActiveEnemyUnit.extend({

	animSheet: new ig.AnimationSheet('media/img/cleric.png', 8, 8),
	_frame: 0,
	magic: 2,
	power: 1,
	actionDelay: 1.5,

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		var animSpeed = 2/this.speed;

		this.addAnim('down', animSpeed, [1, 2, 1, 3]);
		this.addAnim('up', animSpeed, [5, 6, 5, 7]);
		this.addAnim('right', animSpeed, [9, 10, 9, 11]);
		this.addAnim('left', animSpeed, [13, 14, 13, 15]);

		this.addAnim('downDmg', 0.05, [4, 0]);
		this.addAnim('upDmg', 0.05, [8, 0]);
		this.addAnim('rightDmg', 0.05, [12, 0]);
		this.addAnim('leftDmg', 0.05, [16, 0]);
		
		this.addAnim('heal', 0.5, [17, 18]);

		this.currentAnim = this.anims.down;
	},

	// Return value: how many seconds to wait before resuming
	action: function () {
		this.currentAnim = this.anims.heal;
		this.currentAnim.gotoFrame(0);
		ig.game.getEntitiesByType(EnemyUnit).forEach(function (unit) {
			(unit !== this) && unit.heal(this.magic, true);
		}.bind(this));
		return 4;
	},

	update: function () {
		this.parent();
		this._frame++;
		if (this._acting && this._frame % 15 == 0) {
			ig.game.getEntitiesByType(EnemyUnit).forEach(function (unit) {
				if (unit !== this) {
					ig.game.spawnEntity(PlusFX,
						unit.pos.x + unit.size.x/2,
						unit.pos.y + unit.size.y/2,
					{});
				}
			}.bind(this));
		}
	}
});

});