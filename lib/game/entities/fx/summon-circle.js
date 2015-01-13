ig.module(
    'game.entities.fx.summon-circle'
).requires(
    'impact.entity'
).defines(function () {

SummonCircle = ig.Entity.extend({
    snapping: false,
    animSheet: new ig.AnimationSheet('media/img/fx/summon-circle.png', 8, 8),
    offset: { x: 0, y: -1 },
    _noZUpdate: true,

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.zIndex = this.pos.y + 0.5;
        this.currentAnim = this.addAnim('decay', 0.25, [0, 1, 2], true);
    },

    // Ignore static collisions
    handleMovementTrace: function (res) {
        this.pos.x += this.vel.x * ig.system.tick;
        this.pos.y += this.vel.y * ig.system.tick;
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