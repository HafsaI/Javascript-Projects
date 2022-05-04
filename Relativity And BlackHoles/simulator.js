
/**
   Adaption to functions by Kiran Bahadury.
*/

//Control drawing
var shipcanvas, clkcanvas;
var shipctx, clkctx;
var digitalClk = true;
var SHIP_CANVAS_WIDTH = 1000;
var SHIP_CANVAS_HEIGHT = 500;

//Control animation
var play = false;
var animateID;

//Data for Anna and Bob, set to defaults
var michele_x = 300;
var einstein_x = 300;
var michele_len = 100;
var einstein_len = 100;
var michele_speed = 0
var einstein_speed = 0;

var lorentz = 0;
var cur_frame = "einstein";


//Times in nanoseconds
var einstein_times = [0, 0, 0];
var michele_times = [0, 0, 0];

//Current time in rest frame
var rest_time = 0;

//Set up canvas and context variables
function init(){
	shipcanvas = document.getElementById("shipcanvas");
	shipctx = shipcanvas.getContext('2d');
	draw();
}

//Fired when frame radio buttons are updated
function changeFrame(radio){
	//Get corresponding IDs and names
	var selected_id = radio.id.slice(0, -2); //either "anna" or "bob"
	var other_id = (selected_id == "einstein") ? "michele":"einstein";
	cur_frame = selected_id;

	var selected_speed_id = selected_id + "_speed";
	var other_speed_id = other_id + "_speed";

	var selected_name = String.fromCharCode(selected_id.charCodeAt(0) - 32) + selected_id.substring(1); //Make uppercase

	//Enable and set the other speed input box
	document.getElementById(other_speed_id).removeAttribute("disabled");
	document.getElementById(other_speed_id).value = -1*parseFloat(document.getElementById(selected_speed_id).value);

	//Force speed to equal 0 in selected frame
	document.getElementById(selected_speed_id).value = "0";
	document.getElementById(selected_speed_id).setAttribute("disabled", "disabled");

	document.getElementById("speed_text").innerHTML = "Set velocities relative to " + selected_name + " (in terms of c)";

	//Update values
	if(isInputValid()) reset();
}


//Check if data entered is within the appropriate bounds
function isInputValid(){
	var as = Math.abs(parseFloat(document.getElementById("michele_speed").value));
	var bs = Math.abs(parseFloat(document.getElementById("einstein_speed").value));
	var al = parseFloat(document.getElementById("michele_len").value);
	var bl = parseFloat(document.getElementById("einstein_len").value);

	if(as > 0.99 || bs > 0.99 || al < 1 || bl < 1){
		alert("Speeds must be between -0.99 and 0.99, lengths must be greater than 1");
		return false;
	}

	return true;
}

//Fired when play/pause button is pressed
function togglePlay(button){
	if(play){ //Currently paused, user wants to play animation
		button.innerHTML = "Start";
		window.clearInterval(animateID);
		play = !play;
	} else { //Currently playing, user wants to pause animation
		if(!isInputValid()) return;
		disableInput();
		document.getElementById("reset").removeAttribute("disabled");
		button.innerHTML = "Pause";
		calculateLengths();
		calculateTimes();
		animateID = window.setInterval(animate, 50);
		play = !play;
	}
}

//Enable input boxes (except for current frame's speed)
function enableInput(){
	//Temporarily enable all
	document.getElementById("michele_speed").removeAttribute("disabled");
	document.getElementById("einstein_speed").removeAttribute("disabled");
	document.getElementById("michele_len").removeAttribute("disabled");
	document.getElementById("einstein_len").removeAttribute("disabled");
	//Disable cur frame speed
	document.getElementById(cur_frame + "_speed").setAttribute("disabled", "disabled");
}

//Disable all input boxes
function disableInput(){
	document.getElementById("michele_speed").setAttribute("disabled", "disabled");
	document.getElementById("einstein_speed").setAttribute("disabled", "disabled");
	document.getElementById("michele_len").setAttribute("disabled", "disabled");
	document.getElementById("einstein_len").setAttribute("disabled", "disabled");
}


//Force values to be recalculated and displayed
function update(){
	if(!isInputValid()) return;
	calculateLengths();
	calculateTimes();
	draw();
}

//Reset animation and enable inputs
function reset(){
	window.clearInterval(animateID);
	document.getElementById("playpause").innerHTML = "Start";
	play = false;
	michele_x = 300;
	einstein_x = 300;
    michele_len = 100;
	einstein_len = 100;

	rest_time = 0;
    einstein_times = [0, 0, 0];
    michele_times = [0, 0, 0];
    set_times();
	//update();
    draw();

	enableInput();

	document.getElementById("reset").setAttribute("disabled", "disabled");
}

function animate(){
	rest_time += 50; //1 ms in sim = 1 ns in real world
	michele_x += 15*michele_speed;
	einstein_x += 15*einstein_speed;
	calculateTimes(); //play() already calculates lengths
	draw();
}



// clock
function set_times(){
    document.getElementById("einstein_rear").value = einstein_times[0];
    document.getElementById("einstein_middle").value = einstein_times[1];
    document.getElementById("einstein_front").value = einstein_times[2];
    document.getElementById("michele_rear").value = michele_times[0];
    document.getElementById("michele_middle").value = michele_times[1];
    document.getElementById("michele_front").value = michele_times[2];
}


function draw(){
	//Reset canvases
	shipctx.clearRect(0, 0, SHIP_CANVAS_WIDTH, SHIP_CANVAS_HEIGHT);

    // ships
	//Eisntein
    shipctx.fillStyle = 'rgba(255,165,0, 0.6)';
	shipctx.strokeStyle = 'rgb(255,165,0)';
    spaceship(shipctx, einstein_x, 150, 40, einstein_len);

    // Michele
    shipctx.fillStyle = 'rgba(0, 0, 200, 0.4)';
	shipctx.strokeStyle = 'rgb(0, 0, 200)';
    spaceship(shipctx, michele_x, 350, 40, michele_len);
    set_times();

}
//Draw a spaceship centered at x, y
function spaceship(ctx, x, y, height, length){
	ctx.beginPath();
	ctx.moveTo(x - (length*0.5), y - (height*0.5));
	ctx.lineTo(x + (length*0.25), y - (height*0.5));
	ctx.lineTo(x + (length*0.5), y);
	ctx.lineTo(x + (length*0.25), y + (height*0.5));
	ctx.lineTo(x - (length*0.5), y + (height*0.5));
	ctx.closePath();

	ctx.fill();
	ctx.lineWidth = 4;
	ctx.stroke();
	ctx.lineWidth = 1;
}



//Set speeds, calculate lorentz, and determine the apparent lengths of Anna's and Bob's ships
function calculateLengths(){
	//Anna's frame
	if(document.getElementById("micheleRB").checked){
		michele_speed = 0;
		einstein_speed = parseFloat(document.getElementById("einstein_speed").value);
		lorentz = 1/Math.sqrt(1-(einstein_speed*einstein_speed));

		michele_len = parseFloat(document.getElementById("michele_len").value);
		einstein_len = parseFloat(document.getElementById("einstein_len").value) / lorentz;

	//Bob's frame
	} else {
		michele_speed = parseFloat(document.getElementById("michele_speed").value);
		einstein_speed = 0;

		lorentz = 1/Math.sqrt(1-(michele_speed*michele_speed));

		michele_len = parseFloat(document.getElementById("michele_len").value) / lorentz;
		einstein_len = parseFloat(document.getElementById("einstein_len").value);
	}
}

//Calculate clock with calculated lorentz
function calculateTimes(){
	scale_factor = 10/3;  //Speed already in terms of c, so we divide by 3e8 and multiply by 1e9 for nanoseconds
	//Anna's frame
	if(document.getElementById("micheleRB").checked){
		michele_times[0] = michele_times[1] = michele_times[2] = rest_time;

		einstein_times[0] = parseInt(lorentz*(rest_time - (einstein_speed*scale_factor) * (einstein_x - 300 - einstein_len*0.5)));
		einstein_times[1] = parseInt(lorentz*(rest_time - (einstein_speed*scale_factor) * (einstein_x - 300)));
		einstein_times[2] = parseInt(lorentz*(rest_time - (einstein_speed*scale_factor) * (einstein_x - 300 + einstein_len*0.5)));

	//Bob's frame
	} else {
		einstein_times[0] = einstein_times[1] = einstein_times[2] = rest_time;

		michele_times[0] = parseInt(lorentz*(rest_time - (michele_speed*scale_factor) * (michele_x - 300 - michele_len*0.5)));
		michele_times[1] = parseInt(lorentz*(rest_time - (michele_speed*scale_factor) * (michele_x - 300)));
		michele_times[2] = parseInt(lorentz*(rest_time - (michele_speed*scale_factor) * (michele_x - 300 + michele_len*0.5)));
	}
}