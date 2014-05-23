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

var box = {x:200, y:200, width:100, height:100, isColliding:false};
var target = {x:0, y:0, width:100, height:100};
var dest = {x:0, y:0, width:100, height:100};
var obstacles = [
		{x:100, y:100, width:100, height:100}
	];

function redraw(){
	box.isColliding = findDynamicCollision(target, obstacles);
	console.log("obstacles[0] = "+obstacles[0]);

	context.clearRect(0,0,500,500);
	context.fillStyle = "rgb(0,0,0)";
	for(var i in obstacles){
		context.fillRect(obstacles[i].x,obstacles[i].y,obstacles[i].width,obstacles[i].height);
	}
	
	context.fillStyle = "rgb(0,0,255)";
	context.fillRect(box.x, box.y, box.width, box.height);

	if(box.isColliding!=false)
		context.fillStyle = "rgb(255,0,0)";
	else
		context.fillStyle = "rgb(0,255,0)";
	context.fillRect(target.x, target.y, target.width, box.height);

}

canvas.addEventListener("mousemove", function(e){
        target.x = Math.floor((e.pageX - this.offsetLeft));
        target.y = Math.floor((e.pageY - this.offsetTop));
});

function findDynamicCollisions(subject, objects){
	var rotation = getRotationForCollision(subject);
	var rotation_matrix = 0;
}

function findDynamicCollision(subject, objects){
	
	var vx = target.x - box.x;
	var vy = target.y - box.y;

	var slope = vy/vx;

/*  if(vy>0){
		if(vx>0){
			isAbove = function(obj){
				if(obj.x < subject.x+subject.width)
					return (obj.y+obj.height < subject.y);
				else
					return (obj.y+obj.height < subject.y + (slope * obj.y));
			}
			isBelow = function(obj){
				if(obj.x + obj.width > subject.x + vx)
					return (obj.y > subject.y + subject.height);	
				else
					return (obj.y > subject.y + subject.height + (slope * (obj.x + obj.width));
			}
		}else if(vx<0){
			isAbove = function(obj){
				if(obj.x + obj.width < subject.x)
					return (obj.y+obj.height < subject.y);
				else
					return (obj.y+obj.height < subject.y + (slope * (obj.x + obj.width)));
			}
			isBelow = function(obj){
				if(obj.x > subject.x + vx + subject.width)
					return (obj.y > subject.y + subject.height);	
				else
					return (obj.y > subject.y + subject.height + (slope * (obj.x));
			}
		}else{
			isAbove = function(obj){
				return (obj.y+obj.height < subject.y);
			}
			isBelow = function(obj){
				return (obj.y > subject.y + subject.height);	
			}
		}
	}else if(vy<0){
		if(vx>0){
			isAbove = function(obj){
				if(obj.x + obj.width > subject.x + vx)
					return (obj.y+obj.height < subject.y);
				else
					return (obj.y+obj.height < subject.y + (slope * (obj.x + obj.width)));
			}
			isBelow = function(obj){
				if(obj.x < subject.x+subject.width)
					return (obj.y > subject.y + subject.height);	
				else
					return (obj.y > subject.y + subject.height+ (slope * obj.x));
			}
		}else if(vx<0){
			isAbove = function(obj){
				if(obj.x< subject.x + vx)
					return (obj.y+obj.height < subject.y);
				else
					return (obj.y+obj.height < subject.y + (slope * (obj.x + obj.width)));
			}
			isBelow = function(obj){
				if(obj.x + obj.width > subject.x+subject.width)
					return (obj.y > subject.y + subject.height);	
				else
					return (obj.y > subject.y + subject.height+ (slope * obj.x));
			}
			else{
				isAbove = function(obj){
					return (obj.y+obj.height < subject.y);
				}
				isBelow = function(obj){
					return (obj.y > subject.y + subject.height);	
				}
			}
		}
	}else{
		isAbove = function(obj){
			return (obj.y+obj.height < subject.y);
		}
		isBelow = function(obj){
			return (obj.y > subject.y + subject.height);	
		}
	}

	if(vx > 0){
		
	}else if(vx < 0){

	}else{

	}*/
	var slope = vy / vx; //Used for later version
	//console.log("objects[0] is ["+objects[0].x+","+objects[0].y+", "+objects[0].width+", "+objects[0].height+"]");
	isAbove = function(obj){
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


