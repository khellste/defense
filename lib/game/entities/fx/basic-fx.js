ig.module(
	'game.entities.fx.basic-fx'
).requires(
	'impact.entity'
).defines(function () {

BasicFX = ig.Entity.extend({
	collides: ig.Entity.COLLIDES.NEVER,

    handleMovementTrace: function (res) {
        this.pos.x += this.vel.x * ig.system.tick;
        this.pos.y += this.vel.y * ig.system.tick;
    },

});

});