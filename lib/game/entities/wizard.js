ig.module(
	'game.entities.wizard'
).requires(
	'game.core.upgrades',
	'game.entities.abstract.ranged-unit',
    'game.entities.abstract.enemy-unit',
    'impact.timer',
    'game.entities.fx.magic-blast'
).defines(function () {

EntityWizard = RangedUnit.extend({
	animSheet: new ig.AnimationSheet('media/img/wizard.png', 8, 8),
	preview: {
		image: new ig.Image('media/img/wizard-preview.png'),
		offset: { x: 0, y: -10 }
	},
	EnemyType: EnemyUnit,
	range: 6,
	speed: 1/3500,
	value: 100,
	power: 7,
    _firingTimer: null,
    _firingDelay: 1,

	upgrades: [
		new Tower.RangeUpgrade(7, 100),
		new Tower.RangeUpgrade(8, 200),
		new Tower.PowerUpgrade(11, 60),
		new Tower.PowerUpgrade(14, 120),
		new Tower.SpeedUpgrade(1/2500, 70),
		new Tower.SpeedUpgrade(1/1500, 100)
	],

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		this.addAnim('down', 1, [0]);
		this.addAnim('downAtk', 0.5, [1, 0], true);
		this.addAnim('up', 1, [2]);
		this.addAnim('upAtk', 0.5, [3, 2], true);
		this.addAnim('right', 1, [4]);
		this.addAnim('rightAtk', 0.5, [5, 4], true);
		this.addAnim('left', 1, [6]);
		this.addAnim('leftAtk', 0.5, [7, 6], true);
	},

	update: function () {
		this.parent();
		var target = this.target;
		if (!target) return;
		var theta = Math.atan2(
			target.pos.y - this.pos.y,
			target.pos.x - this.pos.x
		).toDeg();
		while (theta < 0) theta += 360;
		while (theta > 360) theta -= 360;

		if (theta >= 45 && theta < 135) {
			this.currentAnim = this.anims.downAtk;
		}
		else if (theta >= 135 && theta < 225) {
			this.currentAnim = this.anims.leftAtk;
		}
		else if (theta >= 225 && theta < 315) {
			this.currentAnim = this.anims.upAtk;
		}
		else {
			this.currentAnim = this.anims.rightAtk;
		}

        if (this._firingTimer != null && this._firingTimer.delta() >= 0) {
            this._firingTimer = null;
            target.receiveDamage(this.power, this);
            ig.game.spawnEntity(MagicBlast, target.pos.x, target.pos.y, {
                mode: MagicBlast.Mode.Hit
            });
        }
	},

	disengage: function (target) {
		if (this.currentAnim === this.anims.rightAtk) {
			this.currentAnim = this.anims.right;
		}
		else if (this.currentAnim === this.anims.leftAtk) {
			this.currentAnim === this.anims.left;
		}
		else if (this.currentAnim === this.anims.upAtk) {
			this.currentAnim = this.anims.up;
		}
		else {
			this.currentAnim = this.anims.down;
		}
	},

	fireAt: function (target) {
        this.currentAnim.gotoFrame(0);
        this._firingTimer = new ig.Timer(this._firingDelay);
        ig.game.spawnEntity(MagicBlast, this.pos.x, this.pos.y, {
            mode: MagicBlast.Mode.Launch
        });
		//target.receiveDamage(this.power, this);
		//this.currentAnim.gotoFrame(0);
	}
});

});
