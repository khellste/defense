ig.module(
	'game.entities.hunter'
).requires(
	'game.entities.abstract.passive-enemy-unit'
).defines(function () {

EntityHunter = PassiveEnemyUnit.extend({
	animSheet: new ig.AnimationSheet('media/img/dev/knight.png', 8, 8),

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
		
		this.currentAnim = this.anims.down;
	}
});

});