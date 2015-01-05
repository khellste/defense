ig.module(
    'game.entities.dark-summoner'
).requires(
    'game.entities.abstract.active-enemy-unit',
    'game.entities.hunter'
).defines(function () {

EntityDarkSummoner = ActiveEnemyUnit.extend({
    animSheet: new ig.AnimationSheet('media/img/dark-summoner.png', 8, 8),

    power: 0,
    summons: EntityHunter,
    summonOpts: {},
    summonLimit: Infinity,
    summonDelay: 5,
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
            this.speed *= 1.2;
            return 0;
        }
        this.currentAnim = this.anims.summon;
        this.currentAnim.gotoFrame(0);
        ig.game.spawnEntity(this.summons, this.pos.x, this.pos.y,
            this.summonOpts);
        this._summonCount++;
        if (this.value == 20)
            console.log('Entity ' + this.id + ' summoned for the ' + this._summonCount + 'th time');
        return this.summonDelay;
    }
});

});