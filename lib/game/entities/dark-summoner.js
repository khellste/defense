ig.module(
    'game.entities.dark-summoner'
).requires(
    'game.entities.abstract.active-enemy-unit',
    'game.entities.hunter',
    'game.entities.fx.summon-circle',
    'game.entities.wall'
).defines(function () {

EntityDarkSummoner = ActiveEnemyUnit.extend({
    animSheet: new ig.AnimationSheet('media/img/dark-summoner.png', 8, 8),
    requireAlign: true,

    power: 0,
    actionDelay: 1.5,
    actionInterval: 3,
    summons: EntityHunter,
    summonOpts: {},
    summonLimit: Infinity,
    _summonCount: 0,

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
        
        this.addAnim('summon', 0.5, [17, 18]);

        this.currentAnim = this.anims.down;
    },

    // Return value: how many seconds to wait before resuming
    action: function () {
        if (this._summonCount >= this.summonLimit) {
            return 0;
        }
        var pos = this.findSummonPosition();
        if (pos == null) {
            return 0;
        }

        this.currentAnim = this.anims.summon;

        // "Summon" the unit
        ig.game.spawnEntity(this.summons, pos.x, pos.y, this.summonOpts);

        // Do the summon effect
        ig.game.spawnEntity(SummonCircle, pos.x, pos.y, {});

        this._summonCount++;
        return 2;
    },

    delay: function () {
        if (this._summonCount >= this.summonLimit) {
            return;
        }
        this.currentAnim = this.anims.summon;
        this.currentAnim.gotoFrame(0);
    },

    findSummonPosition: function () {
        var next = this._bfs_curr.target;

        // If that spot is free of walls, use it
        var isWall = function (e) { return e instanceof EntityWall; };
        if (!ig.game.grid.cellAt(next.r, next.c).tenants.some(isWall)) {
            return {
                x: next.c * ig.game.tilesize,
                y: next.r * ig.game.tilesize
            };
        }

        // Otherwise, look for an available spot around this entity
        var nbrs = this.neighbors(), ret = ig.copy(this.pos);
        if (!nbrs.south.some(isWall)) {
            ret.y += this.size.y;
        }
        else if (!nbrs.north.some(isWall)) {
            ret.y -= this.size.y;
        }
        else if (!nbrs.east.some(isWall)) {
            ret.x -= this.size.x;
        }
        else if (!nbrs.west.some(isWall)) {
            ret.x += this.size.x;
        }
        return ig.game.snap(ret);
    }
});

});