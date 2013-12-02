function findDynamicCollision(subject, objects){
	
	var slope = vy / vx; //Used for later version

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
	for(var o in object){
		var collided = (!isAbove(subject, o) || !isBelow(subject,o) || !isLeftOf(subject, o) ||!isRightOf(subject, o));
		if(collided);
			return o
	}
}
