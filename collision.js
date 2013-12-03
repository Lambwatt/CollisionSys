window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

setInterval(function() {
		//alert("hit interval");
    redraw();
}, 30);

var box = {x:0, y:0, width:100, height:100, isColliding:false};
var obstacles = [
		{x:100, y:100, width:100, height:100}
	];

function redraw(){
	box.isColliding = findDynamicCollision(box, obstacles);
	console.log("obstacles[0] = "+obstacles[0]);

	context.clearRect(0,0,500,500);
	context.fillStyle = "rgb(0,0,0)";
	for(var i in obstacles){
		context.fillRect(obstacles[i].x,obstacles[i].y,obstacles[i].width,obstacles[i].height);
	}
	if(box.isColliding!=false)
		context.fillStyle = "rgb(255,0,0)";
	else
		context.fillStyle = "rgb(0,0,255)";
	context.fillRect(box.x, box.y, box.width, box.height);
}

canvas.addEventListener("mousemove", function(e){
        box.x = Math.floor((e.pageX - this.offsetLeft));
        box.y = Math.floor((e.pageY - this.offsetTop));
});

function findDynamicCollision(subject, objects){
	
	//var slope = vy / vx; //Used for later version
	console.log("objects[0] is ["+objects[0].x+","+objects[0].y+", "+objects[0].width+""+objects[0].height+"]");
	isAbove = function(obj){
		console.log("obj bottom = "+(obj.y+obj.height)+". Sub top = "+subject.y);
		return (obj.y+obj.height < subject.y);
	}
	isBelow = function(obj){
		return (obj.y > subject.y + subject.height);	
	}
	isLeftOf = function(obj){
		return (obj.x + obj.width < subject.x);
	}
	isRightOf = function(obj){
		return (obj.x > subject.x + subject.width);
	}
	
	//var min = 1;
	for(var o in objects){
		var isAboveResult = isAbove(objects[o]);
		var isBelowResult = isBelow(objects[o]);
		var isLeftOfResult = isLeftOf(objects[o]);
		var isRightOfResult = isRightOf(objects[o]);

		console.log("above = "+isAboveResult+", below = "+isBelowResult+", left = "+isLeftOfResult+", right = "+isRightOfResult);
		
		var collided = !(isAbove(objects[o]) || isBelow(objects[o]) || isLeftOf(objects[o]) || isRightOf(objects[o]));
		if(collided!=false){
			console.log("detected");
			return objects[o];
		}
	}
	console.log("cancelled");
	return false;
} 


