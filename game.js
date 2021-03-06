
var camPos = [0,0,0];
var camRot = [0,0];


var game = {
	blockSize: 1,
	running: false,
	gravity : 0.3,
	
	cooldowns : {
		'build' : {'cd' : 500},
		'break' : {'cd' : 300}
	}
}

var lastTime = 0;
var keys = {};
var mousebuttons = {};



function initGame() {
	level.initLevel();
}

function animate(tpf) {
		
}

function logic(tpf) {
	player.update(tpf);
	level.update(tpf);
	sun.update(tpf);
	
	if(keys[87] === true) {
		player.move(1, 0);
	} else if(keys[83] === true) {
		player.move(-1, 0);
	}
	
	if(keys[65] === true) {
		player.move(0, 1);
	} else if(keys[68] === true) {
		player.move(0, -1);
	}
	
	if(keys[27] === true) {
		console.log("Quit.");
		game.running = false;
	}
	
	if(keys[32] === true) {
		player.jump();
	}
	
	if(mousebuttons[1] === true) {
		player.continuePunch();
		if(player.selection != null && level.isInLevelBounds(player.selection) && cooldownCheck('build')) {
			var newPos = [
				player.selection[0] + (player.selectionFace == 3 ? 1 : (player.selectionFace == 4 ? -1 : 0)),
				player.selection[1] + (player.selectionFace == 1 ? 1 : (player.selectionFace == 2 ? -1 : 0)),
				player.selection[2] + (player.selectionFace == 5 ? 1 : (player.selectionFace == 6 ? -1 : 0))
			];
			level.setLevelBlock(newPos, 1);
			cooldownStart('build');
		}
	}
	
	if(mousebuttons[3] === true) {
		player.continuePunch();
		if(player.selection != null && level.isInLevelBounds(player.selection) && cooldownCheck('break')) {
			player.smash();
			cooldownStart('break');
		}
	}
	
	camPos = player.pos;
	camRot = player.rot;
	
}

function cooldownCheck(name) {
	var timeNow = new Date().getTime();
	return (typeof game.cooldowns[name].stamp == 'undefined') || (timeNow - game.cooldowns[name].stamp > game.cooldowns[name].cd); 
}

function cooldownStart(name) {
	game.cooldowns[name].stamp = new Date().getTime();
}

var fps_c = 0, fps_t = 0;
function tick() {
	if(game.running) {
        requestAnimFrame(tick);
        drawScene();
        
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;
	        animate(elapsed);
	        logic(elapsed);
        }
        
        level.findSelection(player.pos, player.rot[0], player.rot[1]);
        
        fps_c ++;
        if(timeNow - fps_t > 1000) {
        	$("#fps").html(fps_c.toString());
        	fps_c = 0;
        	fps_t = timeNow;
        }
        
        lastTime = timeNow;
	}
}

	
function handleKeyDown() {
	var keyCode = 'which' in event ? event.which : event.keyCode;
	keys[keyCode] = true;
}

function handleKeyUp() {
	var keyCode = 'which' in event ? event.which : event.keyCode;
	keys[keyCode] = false;
}

var lastMX, lastMY;
function handleMouseMove() {
	var dx, dy;
	if(document.pointerLockEnabled) {
		dx = event.movementX;
		dy = event.movementY;
	} else {
		dx = event.screenX - lastMX;
		dy = event.screenY - lastMY;
	}
	
	if(! isNaN(dx))
		player.rotate(dx, 0);
		
	if(! isNaN(dy)) 
		player.rotate(0, dy)

	lastMX = event.screenX;
	lastMY = event.screenY;
}

function handleMouseUp() {
	mousebuttons[event.which] = false;
}

function handleMouseDown() {
	mousebuttons[event.which] = true;
}

window.onblur = function() {
    for (key in keys)
        keys[key] = false;
    for (key in mousebuttons)
    	mousebuttons[key] = false;
};
