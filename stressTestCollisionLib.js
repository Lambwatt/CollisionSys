var walls = [
	{x:0, y:0, width:400, height:1},
	{x:0, y:0, width:1, height:400},
	{x:400, y:0, width:1, height:400},
	{x:0, y:400, width:400, height:1}
];
var balls = [
	//{x:10, y:50, width:50, height:50, v_x:-2, v_y:-1},
	//{x:70, y:50, width:50, height:50, v_x:2, v_y:1}
];

for(var i = 1; i<8; i++){
	for(var j = 1; j<8; j++){
		balls.push({x:i*50, y:j*50, width:10, height:10, v_x:Math.ceil(Math.random()*4), v_y:Math.ceil(Math.random()*4)})
	}
}

var canPlay = false;

function updateBalls(){

	if(!canPlay) return;

	for(var i = 0; i<balls.length; i++){
		//var candidates = walls;
		//candidates.push
		

		var wall_results = checkForCollisionsDynamic(balls[i], walls);

		var candidates = [];
		for(var j in balls){
			if(balls[j]!=balls[i])
				candidates.push(balls[j]);
		}
		
		var ball_results = checkForCollisionsDynamic(balls[i], candidates);

		var results = [];
		if(wall_results){
			for(var r in wall_results)
				results.push(wall_results[r]);
		}

		if(ball_results){
			for(r in ball_results)
				results.push(ball_results[r]);
		}
		//console.log(JSON.stringify(results));
		if(results.length>0){
			
			resolveCollision(balls[i], results);
			balls[i].x+=balls[i].v_x/Math.abs(balls[i].v_x);
			balls[i].y+=balls[i].v_y/Math.abs(balls[i].v_y);
			//Need to manage bounce out in a way that doesn't bypass secondary collisions
			//i--;
		}else{
			balls[i].x+=balls[i].v_x;
			balls[i].y+=balls[i].v_y;
		}

	}

}
//Assume collision will be with the closest object
// function getClosest(subject, objects){
// 	var closest_dist = Math.abs(objects[0].x-subject.x) + Math.abs(objects[0].y - subject.y);
// 	var cand = 0;
// 	for(var i = 1; i<objects.length; i++){
// 		var next_dist = Math.abs(objects[0].x-subject.x) + Math.abs(objects[0].y - subject.y);
// 		if(next_dist<closest_dist){
// 			closest_dist = next_dist;
// 			cand = i;
// 		}
// 	}
// 	return objects[cand];
// }

function resolveCollision(subject, objects){
	var hit_hor = false;
	var hit_ver = false;
	
	for(var i in objects){
		//console.log(subject.y, objects[i].y + objects[i].height, subject.y+subject.v_y, objects[i].y+objects[i].height);
		if(hit_hor) console.log("did nothing horizontally");//do nothing	

		else if(subject.x + subject.width <= objects[i].x && subject.x+subject.width+subject.v_x > objects[i].x){
			subject.v_x*=-1;
			//objects[i].v_x = subject.v_x * -1;
			//subject.x = objects[i].x - subject.width - 1;
			hit_hor = true;
			//console.log("changed horizontal direction");
		}
		else if(subject.x>=objects[i].x+objects[i].width && subject.x+subject.v_x < objects[i].x+objects[i].width){
			subject.v_x*=-1;
			//objects[i].v_x = subject.v_x * -1;
			//subject.x = objects[i].x+objects[i].width +1;
			hit_hor = true;
			//console.log("changed horizontal direction");
		}

		//console.log(subject.y+subject.height <= objects[i].y, subject.y+subject.height+subject.v_y > objects[i].y, subject.y >= objects[i].y + objects[i].height, subject.y+subject.v_y < objects[i].y+objects[i].height);
		if(hit_ver) console.log("did nothing vertically");
		else if(subject.y+subject.height <= objects[i].y && subject.y+subject.height+subject.v_y > objects[i].y){
			subject.v_y*=-1;
			//objects[i].v_y = subject.v_y * -1;
			//subject.y = objects[i].y - subject.height - 1;
			hit_ver = true;
			//console.log("changed vertical direction on down collision");
			//console.log("placed object at "+objects[i].y+" - "+subject.height+"-"+1+" which = "+subject.y);
			//console.log("object's v_y = "+subject.v_y);
		}
		else if(subject.y >= objects[i].y + objects[i].height && subject.y+subject.v_y < objects[i].y+objects[i].height){
			subject.v_y*=-1;
			//objects[i].v_y = subject.v_y * -1;
			//subject.y = objects[i].y+objects[i].height +1;
			hit_ver = true;
			//i--;
			//console.log("changed vartical direction on up collision");
		}

		if(hit_ver && hit_hor) return;
		//console.log(JSON.stringify(subject));
	}
}

//setInterval(updateBalls, 250);


setInterval(paintTestArea, 30);
setInterval(updateBalls, 10);

window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//paint cycle
function paintTestArea(){
	ctx.clearRect(0,0,500,500);

	ctx.fillStyle = "rgb(0,0,0)";
	for(var i in balls){
			ctx.fillRect(balls[i].x,balls[i].y,balls[i].width,balls[i].height);
	}

	for(var i in walls){
			ctx.fillRect(walls[i].x,walls[i].y,walls[i].width,walls[i].height);
	}
}



canvas.addEventListener("mousedown", function(e){
 	canPlay = true;
});

 canvas.addEventListener("mouseup", function(e){
 	canPlay = false;
});