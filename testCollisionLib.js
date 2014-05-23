var subject = {x:250, y:250, width:100, height:100}
var target = {x:0, y:0}
var obstacles = [
 {colliding:false, x:0, y:0, width:50, height:50},
 {colliding:false, x:250, y:125, width:50, height:50},
 {colliding:false, x:125, y:300, width:50, height:50},
 {colliding:false, x:400, y:200, width:50, height:50},
 {colliding:false, x:370, y:200, width:50, height:50},
 {colliding:false, x:360, y:400, width:50, height:50},
 {colliding:false, x:420, y:400, width:50, height:50},
 {colliding:false, x:50, y:450, width:50, height:50}
 /*{coliding:false, x:250, y:250, width:50, height:50}
 {coliding:false, x:250, y:250, width:50, height:50}
 {coliding:false, x:250, y:250, width:50, height:50}
*/]

var is_colliding = false;

//collision cycle
function checkForCollisions(){
	subject.v_x = target.x-subject.x;
	subject.v_y = target.y-subject.y;

	for(var i in obstacles){
		obstacles[i].colliding = false;
	}
	is_colliding = false;
	
	var result = checkForCollisionsDynamic(subject, obstacles, 1, 1);
	if(result){
		//console.log("returned collision with "+result.length+" objects");
		for(i in result){
			//console.log("set_colliding to true");
			result[i].colliding=true;
		}
		is_colliding = true;
	}
}

setInterval(checkForCollisions, 250);

//window stuff
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
	ctx.clearRect(0,0,1000,1000);
	for(var i in obstacles){	
		if(obstacles[i].colliding){
			ctx.fillStyle = "rgb(255,0,0)";
			ctx.fillRect(obstacles[i].x,obstacles[i].y,obstacles[i].width,obstacles[i].height);
		}else{
			ctx.fillStyle = "rgb(0,0,0)";
			ctx.fillRect(obstacles[i].x,obstacles[i].y,obstacles[i].width,obstacles[i].height);
		
		}
	}
	
	ctx.fillStyle = "rgb(0,0,255)";
	ctx.fillRect(subject.x, subject.y, subject.width, subject.height);

	if(is_colliding)
		ctx.fillStyle = "rgb(255,0,0)";
	else
		ctx.fillStyle = "rgb(0,255,0)";
	ctx.fillRect(target.x, target.y, subject.width, subject.height);


}

setInterval(paintTestArea, 30);

canvas.addEventListener("mousemove", function(e){
        target.x = Math.floor((e.pageX - this.offsetLeft));
        target.y = Math.floor((e.pageY - this.offsetTop));
});


