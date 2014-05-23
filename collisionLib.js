function checkForCollisionSingular(subject, object){
	/*if(!(subject.x>object.x+object.width
		||subject.x+subject.width<object.x
		||subject.y>object.y+object.height
		||subject.y+subject.height<object.y)){
	*/
	var rightOf = subject.x>=object.x+object.width
	var leftOf = subject.x+subject.width<=object.x
	var below = subject.y>=object.y+object.height
	var above = subject.y+subject.height<=object.y
	//console.log(rightOf+":"+leftOf+":"+below+":"+above);
	if(!(rightOf||leftOf||below||above))
	{
		//console.log(true);
		return true;
	}
	//console.log(false);
	return false;
}

function checkForCollisionsDiscrete(subject, objects){
	var result = [];
	for(var i in objects){
		if(checkForCollisionSingular(subject, objects[i])){
			result.push(objects[i]);
		}
	}
	if(result.length>0)
		return result;
	else
		return false;
}

function checkForCollisionsContin(subject, objects, prime_step, num_steps, sec_step, sec_per_step){
	var collisions;
	var off_step_guage = 0;
	var subject_clone = {x:subject.x, y:subject.y, width:subject.width, height:subject.height};
	for(var i = 0; i<=num_steps; i++){
		
		//console.log("checking for objects in "+JSON.stringify(subject_clone));
		collisions = checkForCollisionsDiscrete(subject_clone, objects);
		if(collisions) return {candidates:collisions, steps:i};
		else{
			addCollisionStep(subject_clone, prime_step);
			off_step_guage += sec_per_step;
			var num_up = 0;
			//console.log("guage contains "+off_step_guage+" having added "+sec_per_step);	
			while(off_step_guage>1){
				addCollisionStep(subject_clone, sec_step);	
				off_step_guage -= 1;
				num_up++;
			}
			console.log("updated "+num_up+" times.");
		}
	}
	//console.log("i = "+i);
	return false;
}

function addCollisionStep(subject, step){
	subject.x += step.x;
	subject.y += step.y;
}

function checkForCollisionsDynamic(subject, objects, min_width, min_height){
	
	//define the large coordinate box
	var box = {};
	box.width = Math.abs(subject.width)+Math.abs(subject.v_x);
	box.height = Math.abs(subject.height)+Math.abs(subject.v_y);
	var use_box_x = false;
	var use_box_y = false;
	if(subject.v_x >= 0){ 
		box.x = subject.x;
	}else{ 
		use_box_x = true;
		box.x = subject.x+subject.v_x;
	}

	if(subject.v_y >= 0){ 
		box.y = subject.y;
	}else{ 
		box.y = subject.y+subject.v_y;
		use_box_y = true;
	}

	//Detect things in large collision box
	//console.log("box: "+JSON.stringify(box))
	var candidates = checkForCollisionsDiscrete(box, objects);
	if(!candidates){/*console.log("cleared at large box");*/ return false;}

	//Determine ruling co-ordinate
	var prime_step = {};
	var sec_step = {};
	var steps = 0;
	var sec_per_step = 0;
	var clone = {};
	clone.x = subject.x-subject.width*use_box_x;
	clone.y = subject.y-sec_per_step*use_box_y;
	if(Math.abs(subject.v_x)>Math.abs(subject.v_y)){
		prime_step.x = subject.width * (subject.v_x<0 ? -1: 1);//subject.width;
		prime_step.y = 0;	
		sec_step.x = 0;
		sec_step.y = subject.v_y<0 ? -1: 1;
		steps = Math.abs(Math.ceil(subject.v_x/subject.width))+1;
		sec_per_step = Math.abs((subject.v_y/subject.v_x)*subject.width);
		clone.width = subject.width*2, 
		clone.height = subject.height+sec_per_step;
	}else{
		prime_step.y = subject.height * (subject.v_y<0 ? -1: 1);//subject.height;
		prime_step.x = 0;
		sec_step.y = 0;
		sec_step.x = subject.v_x<0 ? -1: 1;
		steps = Math.abs(Math.ceil(subject.v_y/subject.height))+1;
		if(steps <= 1){
			console.log(subject.v_y, subject.height, subject.v_y/subject.height);
		}
		sec_per_step = Math.abs((subject.v_x/subject.v_y)*subject.height);//Not sure about this math. Check on paper.
		clone.width = subject.width+sec_per_step;
		clone.height = subject.height*2;
	}

	console.log("by size step = {"+JSON.stringify(prime_step)+", "+JSON.stringify(sec_step)+", "+steps+","+sec_per_step+"}");
	//check collisions in steps
	console.log("Clone = "+JSON.stringify(clone));
	var results = checkForCollisionsContin(clone, candidates, prime_step, steps, sec_step, sec_per_step);
	console.log("cleared at large step contin where result = "+JSON.stringify(results));
	return results.candidates;
	//If one or zero, result is as precise as necessary.
	//if(!results /*|| results.candidates.length==1*/){
	//	/*console.log("cleared at large step contin where result = "+JSON.stringify(results));*/ return results.candidates;
	
		//console.log("Large phantom or multiple");
	//	return results.candidates;
	//}//create a clone at a matched position
	var subject_clone = {x:subject.x, y:subject.y, width:subject.width, height:subject.height};
	var off_step_guage;
	for(var s = 0; s<results.steps; s++){
		addCollisionStep(subject_clone, prime_step);
		off_step_guage += sec_per_step;
			
		while(off_step_guage>1){
			addCollisionStep(subject_clone, sec_step);	
			off_step_guage -= 1;
			}
	}

	//Resize steps
	if(Math.abs(subject.v_x)>Math.abs(subject.v_y)){
		prime_step.x = subject.v_x<0 ? -1: 1;
		prime_step.y = 0;	
		sec_step.x = 0;
		sec_step.y = subject.v_x<0 ? -1: 1;
		steps = subject.width;
		sec_per_step = subject.v_y/subject.v_x;
	}else{
		prime_step.y = subject.v_y<0 ? -1: 1;
		prime_step.x = 0;
		sec_step.y = 0;
		sec_step.x = subject.v_x<0 ? -1: 1;
		steps = subject.height;
		sec_per_step = subject.v_x/subject.v_y//Not sure about this math. Check on paper.
	}

	//incrementally move 1 pixel at a time until collision is found. update secondary dimension accordingly. 
  //console.log("by pixel step = {"+JSON.stringify(prime_step)+", "+JSON.stringify(sec_step)+", "+steps+","+sec_per_step+"}");
	var finalResults = checkForCollisionsContin(subject_clone, results.candidates, prime_step, steps, sec_step, sec_per_step);
	if(finalResults){
		//console.log("cleared at small step contin"); 
		return results.candidates;}
	else{
		//console.log("Warning, Phantom detected");
		return false;
	}
}

function test(test_func, expected_result, message){
	console.log("expecting "+expected_result);
	if(test_func != expected_result){
		console.log("FAILED: "+message);
		return 1;
	}
	return 0;
}

function testSingular(){
	var i = 0;
	i += test(checkForCollisionSingular({x:2,y:2,width:4,height:4}, {x:1,y:1,width:2,height:2}), true, "Collided with non-colliding object");
	i += test(checkForCollisionSingular({x:2,y:2,width:4,height:4}, {x:3,y:0,width:2,height:2}), false, "Detect top");
	i += test(checkForCollisionSingular({x:2,y:2,width:4,height:4}, {x:6,y:3,width:2,height:2}), false, "Detect right");
	i += test(checkForCollisionSingular({x:2,y:2,width:4,height:4}, {x:3,y:6,width:2,height:2}), false, "Detect bottom");
	i += test(checkForCollisionSingular({x:2,y:2,width:4,height:4}, {x:0,y:3,width:2,height:2}), false, "Detect left");
	return i;
}

function testDiscrete(){
	var objs = [
		{name:"NOT",x:0,y:0,width:2,height:2}, 
		{name:"top", x:3,y:1,width:2,height:2}, 
		{name:"right", x:5,y:3,width:2,height:2}, 
		{name:"bottom", x:3,y:5,width:2,height:2}, 
		{name:"left", x:1,y:3,width:2,height:2}
	];

	var result = checkForCollisionsDiscrete({x:2, y:2, width:4, height:4}, objs);	
	if(result.length!=4){
		console.log("Failed. Detected:");
		for(var i in result){
			console.log(result[i].name);
		}
		return 1
	}
	return 0;
}

function testContin(){

	var subject = {x:6, y:3, width:4, height:4};
	var i = 0;

	var testSet =  [
		{x:1, y:1, width:1, height:1}, 
		{x:2, y:5, width:1, height:1},
		{x:9, y:2, width:1, height:1},
		{x:11, y:5, width:1, height:1},
		{x:13, y:6, width:1, height:1}];

	i += test(checkForCollisionsContin(subject, [{x:1, y:1, width:1, height:1}], {x:1, y:0}, 3, {x:0, y:1}, 3) == 0, true, "no collision" );	
	i += test(checkForCollisionsContin(subject, testSet, {x:4, y:0}, 5, {x:0, y:1}, 1/3).candidates.length == 2, true, "plus plus" );
	
	var result = checkForCollisionsContin(subject, testSet, {x:-4, y:0}, 5, {x:0, y:1}, 1/3);
	i += test(result.candidates.length==1, true, result.candidates.length);
	i += test(checkForCollisionsContin(subject, testSet, {x:4, y:0}, 5, {x:0, y:-1}, 1/3).candidates.length == 2, true, "plus minus");
	i += test(checkForCollisionsContin(subject, testSet, {x:-4, y:0}, 5, {x:0, y:-1}, 1/3).candidates.length == 1, true, "minus minus");

	return i;
}

function testLib(){
	var i = 0;
	console.log("singles");
	i += testSingular();
	console.log("discrete");
	i += testDiscrete();
	console.log("contin");
	i += testContin();	

	if(i==0) console.log("ALL TESTS PASSED.");
	else console.log("Failed "+i+" tests.");
}

//testLib();
