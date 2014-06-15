var subject = {x:250, y:250, width:100, height:100}
var target = {x:0, y:0}
var obstacles = [
 {colliding:false, x:0, y:0, width:50, height:50},
 {colliding:false, x:250, y:175, width:50, height:1},
 {colliding:false, x:175, y:300, width:1, height:50},
 //{colliding:false, x:400, y:200, width:50, height:50},
 //{colliding:false, x:370, y:200, width:1, height:50},
 {colliding:false, x:360, y:400, width:50, height:1},
 {colliding:false, x:450, y:400, width:50, height:1},
 {colliding:false, x:100, y:450, width:50, height:1},
 {colliding:false, x:330, y:205, width:50, height:1}
 /*{coliding:false, x:250, y:250, width:50, height:50}
 {coliding:false, x:250, y:250, width:50, height:50}
*/]

var is_colliding = false;
var detailedSearchRegions = [];
var candidates = [];

//collision cycle
function checkForCollisions(){
	subject.v_x = target.x-subject.x;
	subject.v_y = target.y-subject.y;

	for(var i in obstacles){
		obstacles[i].colliding = false;
	}
	is_colliding = false;

	console.log("target is "+JSON.stringify(target));
	console.log("subject is "+JSON.stringify(subject));

	candidates = [];
	detailedSearchRegions = [];
	var result = checkForCollisionsDynamic(subject, obstacles, 1, 1);
	if(result){
		detailedSearchRegions = result.checked_areas;
		candidates = result.considered;
		console.log(detailedSearchRegions.length);
		//console.log("returned collision with "+result.length+" objects");
		for(i in result.candidates){
			//console.log("set_colliding to true");
			result.candidates[i].colliding=true;
		}
		is_colliding = result.result;
	}
}

//setInterval(checkForCollisions, 250);

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


	ctx.beginPath();
	ctx.moveTo(subject.x, subject.y);
	ctx.lineTo(target.x, target.y);
	
	ctx.moveTo(subject.x+subject.width, subject.y);
	ctx.lineTo(target.x+subject.width, target.y);
	
	ctx.moveTo(subject.x, subject.y+subject.height);
	ctx.lineTo(target.x, target.y+subject.height);
	
	ctx.moveTo(subject.x+subject.width, subject.y+subject.height);
	ctx.lineTo(target.x+subject.width, target.y+subject.height);
	ctx.stroke();	

	ctx.fillStyle = "rgb(255,0,255)";
	//console.log(JSON.stringify(detailedSearchRegions));
	for(var j in detailedSearchRegions){
		//console.log("drawing a rectangle on "+JSON.stringify(detailedSearchRegions[j]));
		ctx.fillRect(detailedSearchRegions[j].x, detailedSearchRegions[j].y, detailedSearchRegions[j].width, detailedSearchRegions[j].height);
	}
	
	ctx.fillStyle = "rgb(123,0,255)";
	//console.log(JSON.stringify(detailedSearchRegions));
	/*for(var k in considered){
		console.log("drawing a rectangle on "+JSON.stringify(detailedSearchRegions[j]));
		ctx.fillRect(detailedSearchRegions[j].x, detailedSearchRegions[j].y, detailedSearchRegions[j].width, detailedSearchRegions[j].height);
	}*/
//	console.log("did I draw "+j+" rectangles?");
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

canvas.addEventListener("mouseup", function(e){
	  checkForCollisions();
    //    target.x = Math.floor((e.pageX - this.offsetLeft));
      //  target.y = Math.floor((e.pageY - this.offsetTop));
});
