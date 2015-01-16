ig.module(
    'game.entities.fx.summon-circle'
).requires(
    'game.entities.fx.basic-fx'
).defines(function () {

SummonCircle = BasicFX.extend({
    snapping: false,
    animSheet: new ig.AnimationSheet('media/img/fx/summon-circle.png', 8, 8),
    offset: { x: 0, y: -1 },
    _noZUpdate: true,

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.zIndex = this.pos.y + 0.5;
        this.currentAnim = this.addAnim('decay', 0.25, [0, 1, 2], true);
    },

    update: function () {
        if (this.currentAnim.loopCount > 0) {
            this.kill();
            return;
        }
        this.parent();
    }
});

});