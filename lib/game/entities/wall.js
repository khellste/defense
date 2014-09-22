ig.module(
	'game.entities.wall'
).requires(
	'impact.entity',
	'impact.game',
	'plugins.lattice.wall'
).defines(function () {

EntityWall = lat.Wall.extend({
	health: 5000,
	size: { x: 8, y: 8 },
	animSheet: new ig.AnimationSheet('media/img/wall.png', 8, 24),
	offset: { x: 0, y: 16 },
	value: 75,
	maxUnits: 1,
	units: [],

	mouseEnter: function () {
		this.hbar.visible = true;
	},

	mouseLeave: function () {
		this.hbar.visible = false;
	},

	addUnit: function (unit) {
		if (this.units.length >= this.maxUnits) {
			return false;
		}
		unit.offset.y += this.size.y + 2;
		unit.perch = this;
		unit._noZUpdate = true, // TODO
		unit.zIndex = 500; // TODO
		unit.pos.x = this.pos.x;
		unit.pos.y = this.pos.y;
		unit.ignoreGrid = this.ignoreGrid;
		unit.snapping = this.snapping;
		this.units.push(unit);
		return true;
	},

	removeUnit: function (unit) {
		unit.offset.y -= this.size;
		unit.perch = null;
		this.units.erase(unit);
	}
});

ig.Game.inject({
	removeEntity: function (entity) {
		this.parent(entity);
		if (entity instanceof EntityWall) {
			entity.units.forEach(function (unit) {
				unit.kill();
			});
		}
	}
})

});