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
	preview: {
		image: new ig.Image('media/img/wall-preview.png'),
		offset: { x: 0, y: -16 }
	},
	offset: { x: 0, y: 16 },
	value: 75,
	maxUnits: 1,
	hitbox: {
		offset: { x: 0, y: -8 },
		size: { x: 8, y: 16 }
	},
	units: [],

	addUnit: function (unit) {
		if (this.units.length >= this.maxUnits) {
			return false;
		}
		unit.perch = this;
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
	},

	click: function (e) {
		if (ig.game.clickType === 'delete') {
			this.sell();
			return true;
		}
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
		else if (entity.perch instanceof EntityWall) {
			entity.perch.removeUnit(entity);
		}
	}
})

});