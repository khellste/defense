ig.module(
    'game.entities.fx.summon-circle'
).requires(
    'impact.entity'
).defines(function () {

SummonCircle = ig.Entity.extend({
    snapping: false,
    animSheet: new ig.AnimationSheet('media/img/fx/summon-a.png', 8, 8),
    offset: { x: 0, y: -1.05 },

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.pos.y -= 0.05;
        this.currentAnim = this.addAnim('idle', 1, [0]);
    },

    // Ignore static collisions
    handleMovementTrace: function (res) {
        this.pos.x += this.vel.x * ig.system.tick;
        this.pos.y += this.vel.y * ig.system.tick;
    },

    update: function () {
        if (this.currentAnim.alpha <= 0) {
            this.kill();
            return;
        }
        this.currentAnim.alpha = Math.max(this.currentAnim.alpha - 0.02, 0);
        this.parent();
    }
})

});