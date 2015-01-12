ig.module(
    'game.entities.fx.magic-blast'
).requires(
    'impact.entity'
).defines(function () {

var Modes = { Launch: 0, Hit: 1 };

MagicBlast = ig.Entity.extend({
    snapping: false,
    mode: Modes.Launch,
    animSheet: new ig.AnimationSheet('media/img/fx/magic-blast.png', 8, 24),

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        //this.pos.y += 0.05;
        this.addAnim('launch', 0.05, [0, 0, 0, 0, 0, 1, 2, 3], true);
        this.addAnim('hit', 0.05, [4, 5, 6, 7, 8, 9, 10, 11, 12], true);
        if (this.mode == MagicBlast.Mode.Launch) {
            this.currentAnim = this.anims.launch;
            this.offset.y = 32;
        }
        else {
            this.currentAnim = this.anims.hit;
            this.offset.y = 16;
        }
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

MagicBlast.Mode = Modes;

});