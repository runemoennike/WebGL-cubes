var player = {
	selection : null,
	selectionFace : 0,

	rotSpeed : 0.003,
	tiltSpeed : 0.001,
	
	moveMaxSpeed : 0.2,
	walkPower : 0.2,
	strafePower : 0.2,

	jumpPower : 1,

	pos : vec3.create([5, 10, 5]),
	rot : [0, -0.5],
	vel : vec3.create([0, 0, 0]),
	
	armAngle : 0,
	armDir : 0,
	isPunching : false,

	move : function(forward, sideways) {
		if(this.vel[1] == 0) {
			this.vel[0] -= Math.sin(this.rot[0]) * -forward * this.walkPower - Math.cos(this.rot[0]) * -sideways * this.strafePower;
			this.vel[2] += Math.cos(this.rot[0]) * -forward * this.walkPower + Math.sin(this.rot[0]) * -sideways * this.strafePower;
		}
		var length = Math.sqrt(this.vel[0] * this.vel[0] + this.vel[2] * this.vel[2]);
		if(length > this.moveMaxSpeed) {
			this.vel[0] = this.vel[0] / length * this.moveMaxSpeed;
			this.vel[2] = this.vel[2] / length * this.moveMaxSpeed;
		}
	},
	
	rotate : function(dx, dy) {
		camRot[0] += dx * this.rotSpeed;
		camRot[1] += dy * this.tiltSpeed;
	},
	
	
	jump : function() {
		if(this.vel[1] == 0) {
			this.vel[1] += this.jumpPower;
		}
	},
	
	smash : function() {
		if(this.selection == null) return;
		if(typeof level.breakage[this.selection] != 'undefined' ) {
			if(level.breakage[this.selection].damage > 1.0) {
				level.setLevelBlock(this.selection, 0);
				delete level.breakage[this.selection];
			} else {
				level.breakage[this.selection].damage += 0.3;
				level.breakage[this.selection].lasthit = new Date().getTime();
			}
		} else {
			level.breakage[this.selection] = {'lasthit' : new Date().getTime(), 'damage' : 0};
		}
	},
	
	continuePunch : function() {
		this.isPunching = true;
	},
	
	update : function(tpf) {
		tpf /= 30;
		
		if(this.vel[1] == 0) {
			vec3.scale(this.vel, 0.5 * tpf);
		}
		
		var vel = vec3.create(this.vel);
		vec3.scale(tpf);
		vec3.add(this.pos, vel);
		
		var colTestPos = vec3.create(this.pos);
		var colTestVel = vec3.create(this.vel);
		vec3.scale(colTestVel, 2);
		vec3.add(colTestPos, colTestVel);
		if((this.vel[0] != 0 || this.vel[2] != 0) && (level.collideWC(colTestPos) || level.collideWC([colTestPos[0], colTestPos[1]-1, colTestPos[2]]))) {
			vec3.subtract(this.pos, vel);
		}
		
		this.vel[1] -= game.gravity * tpf;
		if(this.vel[1] < 0 && level.collideWC([this.pos[0], this.pos[1]-2*game.blockSize, this.pos[2]])) {
			this.vel[1] = 0;
			
			var levelHeight = level.findHeightWC(this.pos);
			this.pos[1] = (levelHeight) / game.blockSize + 2;
		}
		
		if(this.isPunching) {
			if(this.armDir == 0) {
				this.armAngle += 0.06 * tpf;
				if(this.armAngle > 0.3) {
					this.armDir = 1; 
				}
			} else if(this.armDir == 1) {
				this.armAngle -= 0.10 * tpf;
				if(this.armAngle < 0.0) {
					this.armDir = 0;
				}
			}
		} else if(this.armAngle != 0.0) {
			this.armAngle -= 0.06 * tpf;
			if(this.armAngle < 0.0) {
				this.armAngle = 0.0;
				this.armDir = 0;
			}
		}
		
		this.isPunching = false;
	}
}
