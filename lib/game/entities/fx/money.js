ig.module(
	'game.entities.fx.money'
).requires(
	'game.entities.fx.plus'
).defines(function () {

MoneyFX = PlusFX.extend({
	animSheet: new ig.AnimationSheet('media/img/fx/money.png', 3, 3),
});

});