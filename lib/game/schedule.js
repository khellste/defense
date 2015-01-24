ig.module(
	'game.schedule'
).requires(
	'impact.game',
	'game.core.timeline',
	'game.entities.hunter',
    'game.entities.dark-summoner'
).defines(function () {

var Seq = Tower.Action.Sequence;
var Act = Tower.Action;
var Rep = Tower.Action.Repeat;
var Del = Tower.Action.Delay;
var wait = 15;

var SummonerTest = new Seq(
    new Del(25, true),
    new Act(function (done) {
        ig.game.spawnEntity(EntityDarkSummoner, 0, 0, {
            speed: 2,
            recoil: 1,
            health: 20,
            value: 20,
            summons: EntityDarkSummoner,
            summonOpts: {
                speed: 8,
                recoil: 0.5,
                health: 7,
                value: 5,
                actionInterval: 3,
                summonLimit: 3,
                summons: EntityHunter,
                summonOpts: {
                    speed: 8,
                    health: 7,
                    value: 5,
                    power: 1
                }
            }
        });
        done();
    })
);

Tower.timeline = [

    ///// WAVE 0 /////
	new Seq(
        new Del(wait, true),
        new Act(function (done) {
            ig.music2.sequence('battle-sf');
            ig.music2.sequence('battle-fast');
            done();
        }),
        new Rep(5,
            new Seq(
                new Act(function (done) {
                    ig.game.spawnEntity(EntityHunter, 8*4, 0, {
                        speed: 5,
                        recoil: 0.5,
                        health: 5,
                        value: 4
                    });
                    done();
                }),
                new Del(5)
            )
        )
    ),

    ///// WAVE 1 /////
    new Seq(
        new Del(wait, true),
        new Act(function (done) {
            ig.music2.sequence('battle-sf');
            ig.music2.sequence('battle-fast');
            done();
        }),
        new Rep(5,
            new Seq(
                new Act(function (done) {
                    ig.game.spawnEntity(EntityHunter, 8*4, 0, {
                        speed: 4,
                        recoil: 0.5,
                        health: 5,
                        value: 4
                    });
                    ig.game.spawnEntity(EntityHunter, 8*6, 0, {
                        speed: 4,
                        recoil: 0.5,
                        health: 5,
                        value: 4
                    });
                    done();
                }),
                new Del(7)
            )
        )
    ),

    ///// WAVE 2 /////
    new Seq(
        new Del(wait, true),
        new Act(function (done) {
            ig.music2.sequence('battle-sf');
            ig.music2.sequence('battle-fast');
            done();
        }),
        new Rep(2,
            new Seq(
                new Act(function (done) {
                    ig.game.spawnEntity(EntityHunter, 8*4, 0, {
                        speed: 5,
                        recoil: 0.5,
                        health: 5,
                        value: 4,
                    })
                    done();
                }),
                new Del(2),
                new Act(function (done) {
                    ig.game.spawnEntity(EntityHunter, 8*4, 0, {
                        speed: 5,
                        recoil: 0.5,
                        health: 5,
                        value: 4
                    });
                    ig.game.spawnEntity(EntityHunter, 8*6, 0, {
                        speed: 5,
                        recoil: 0.5,
                        health: 5,
                        value: 4
                    });
                    done();
                }),
                new Del(5),
                new Act(function (done) {
                    ig.game.spawnEntity(EntityHunter, 8*6, 0, {
                        speed: 5,
                        recoil: 0.5,
                        health: 5,
                        value: 4
                    });
                    done();
                }),
                new Del(2),
                new Act(function (done) {
                    ig.game.spawnEntity(EntityHunter, 8*4, 0, {
                        speed: 5,
                        recoil: 0.5,
                        health: 5,
                        value: 4
                    });
                    ig.game.spawnEntity(EntityHunter, 8*6, 0, {
                        speed: 5,
                        recoil: 0.5,
                        health: 5,
                        value: 4
                    });
                    done();
                }),
                new Del(5)
            )
        )
    ),

    ///// WAVE 3 /////
    new Seq(
        new Del(wait, true),
        new Act(function (done) {
            ig.music2.sequence('battle-sf');
            ig.music2.sequence('battle-fast');
            done();
        }),
        new Rep(2,
            new Seq(
                new Act(function (done) {
                    ig.game.spawnEntity(EntityHunter, 8*3, 0, {
                        speed: 4,
                        recoil: 0.5,
                        health: 6,
                        value: 7
                    });
                    done();
                }),
                new Rep(3,
                    new Seq(
                        new Act(function (done) {
                            ig.game.spawnEntity(EntityHunter, 8*6, 0, {
                                speed: 8,
                                recoil: 0.5,
                                health: 5,
                                value: 5
                            });
                            done();
                        }),
                        new Del(2)
                    )
                ),
                new Del(6),
                new Act(function (done) {
                    ig.game.spawnEntity(EntityHunter, 8*7, 0, {
                        speed: 4,
                        recoil: 0.5,
                        health: 6,
                        value: 7
                    });
                    done();
                }),
                new Rep(3,
                    new Seq(
                        new Act(function (done) {
                            ig.game.spawnEntity(EntityHunter, 8*4, 0, {
                                speed: 8,
                                recoil: 0.5,
                                health: 5,
                                value: 5
                            });
                            done();
                        }),
                        new Del(2)
                    )
                ),
                new Del(6)
            )
        )
    ),

    ///// WAVE 4 /////
    new Seq(
        new Del(wait, true),
        new Act(function (done) {
            ig.music2.sequence('battle-sf');
            ig.music2.sequence('battle-fast');
            done();
        }),
        new Rep(10,
            new Seq(
                new Act(function (done) {
                    ig.game.spawnEntity(EntityHunter, 8*3, 0, {
                        speed: 10,
                        recoil: 0.25,
                        health: 10,
                        value: 5
                    })
                    done();
                }),
                new Del(3)
            )
        )
    )
];

});