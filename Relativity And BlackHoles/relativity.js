//Control drawing
var shipcanvas, shipcanvas2;
var shipctx, shipctx2;
var SHIP_CANVAS_WIDTH = 1000;
var SHIP_CANVAS_HEIGHT = 300;

//Control animation
var play = false;
var animateID;

var start = false;
//Data for Anna and Bob, set to defaults
var michele_x = 300;
var einstein_x = 300;
var michele_len = 300;
var einstein_len = 300;
var michele_speed = 0
var einstein_speed = 0;


var m_x = 300;
var e_x = 300;
var m_len = 300;
var e_len = 300;
var m_speed = 0;
var e_speed = 0;
e_speed = michele_speed = 0.3;
var e_strike_time = 0;
var struck = false;
start = false;
var lorentz = 0;
var tick = 0;
var radius = 20;
var rad = 20;

//Current time in rest frame
var rest_time = 0;

//Set up canvas and context variables
function init(){
	shipcanvas = document.getElementById("shipcanvas");
	shipctx = shipcanvas.getContext('2d');

    shipcanvas2 = document.getElementById("shipcanvas2");
	shipctx2 = shipcanvas2.getContext('2d');
    

	draw();
    draw2();
}
function draw(){
	//Reset canvases
	shipctx.clearRect(0, 0, SHIP_CANVAS_WIDTH, SHIP_CANVAS_HEIGHT);
  
    // Einstein Platform
    shipctx.fillStyle = 'rgba(255,165,0, 0.6)';
	shipctx.strokeStyle = 'rgb(255,165,0)';
    train(shipctx, einstein_x, 100, 40, einstein_len);
    shipctx.fillStyle = 'rgb(0, 0, 0)';
	shipctx.fillText("Train Einstein", einstein_x - (einstein_len * (0.1)), 100);

    // Michele Train
    shipctx.fillStyle = 'rgba(0, 0, 255, 0.4)';
	shipctx.strokeStyle = 'rgb(0, 0, 255)';
    platform(shipctx, michele_x, 250, 40, michele_len);
    shipctx.fillStyle = 'rgb(255, 255, 255)';
    shipctx.fillText("Platform Michele", michele_x - (michele_len * (0.1)), 255);
    if (start == true){
        // Platform Lightning
        shipctx.fillStyle = 'rgba(255,0,0, 0.6)';
        shipctx.strokeStyle = 'rgb(255,0,0)';
        strikeLightning(shipctx,einstein_x + (0.5 * einstein_len),100);
        shipctx.fillStyle = 'rgba(96, 14, 143,0.6)';
        shipctx.strokeStyle = 'rgb(96, 14, 143)';
        
        
        strikeLightning(shipctx,einstein_x - (0.5 * einstein_len),100);
    }
  

}

function draw2(){
	//Reset canvases
	shipctx2.clearRect(0, 0, SHIP_CANVAS_WIDTH, SHIP_CANVAS_HEIGHT);
 
    // Einstein Platform
    shipctx2.fillStyle = 'rgba(255,165,0, 0.6)';
	shipctx2.strokeStyle = 'rgb(255,165,0)';
    train(shipctx2, e_x, 100, 40, e_len);
    shipctx2.fillStyle = 'rgb(0, 0, 0)';
	shipctx2.fillText("Train Einstein", e_x - (e_len * (0.1)), 100);

    // Michele Train
    shipctx2.fillStyle = 'rgba(0, 0, 255, 0.4)';
	shipctx2.strokeStyle = 'rgb(0, 0, 255)';
    platform(shipctx2, m_x, 250, 40, m_len);
    shipctx2.fillStyle = 'rgb(255, 255, 255)';
    shipctx2.fillText("Platform Michele", m_x - (m_len * (0.1)), 255);

    if (start == true){
        // Platform Lightning
      
        shipctx2.fillStyle = 'rgba(96, 14, 143,0.6)';
        shipctx2.strokeStyle = 'rgb(96, 14, 143)';
        strikeLightning2(shipctx2,e_x - (0.5 * e_len),100);
        if (play == true){
            if (rest_time == e_strike_time || struck == true ){
                struck = true;
                shipctx2.fillStyle = 'rgba(255,0,0, 0.6)';
                shipctx2.strokeStyle = 'rgb(255,0,0)';
                strikeLightning3(shipctx2,e_x + (e_len *0.5),100);
                
            }
        }
    }
}


//Draw a platform centered at x, y
function platform(ctx, x, y, height, length){
	ctx.beginPath();
	ctx.moveTo(x - (length*0.5), y - (height*0.5));
	ctx.lineTo(x + (length*0.5), y - (height*0.5));
	//ctx.lineTo(x + (length*0.5), y);
	ctx.lineTo(x + (length*0.5), y + (height*0.5));
	ctx.lineTo(x - (length*0.5), y + (height*0.5));
	ctx.closePath();

	ctx.fill();
	ctx.lineWidth = 4;
	ctx.stroke();
	ctx.lineWidth = 1;
}


//Draw a spaceship centered at x, y
function train(ctx, x, y, height, length){
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


//Reset animation and enable inputs
function reset(){
	window.clearInterval(animateID);
	document.getElementById("playpause").innerHTML = "Start";
	play = false;
	michele_x = 300;
	einstein_x = 300;
    michele_len = 300;
	einstein_len = 300;

    m_x = 300;
	e_x = 300;
    m_len = 300;
	e_len = 300;
    e_speed = michele_speed = 0.3;
    tick = 0;
    radius = 20;
    rad = 0;
	rest_time = 0;
    start = false;
    struck = false;

    draw();
    draw2();
	document.getElementById("reset").setAttribute("disabled", "disabled");
}

//Fired when play/pause button is pressed
function togglePlay(button){
	if(play){ //Currently paused, user wants to play animation
		button.innerHTML = "Start";
		window.clearInterval(animateID);
		play = !play;
	} else { //Currently playing, user wants to pause animation
		document.getElementById("reset").removeAttribute("disabled");
		button.innerHTML = "Pause";
		calculateTimes();
        findStrikeTime();
        draw();
        draw2();
        start = true;
		animateID = window.setInterval(animate, 50);
       

		play = !play;
	}
}


function animate(){
	rest_time += 50; //1 ms in sim = 1 ns in real world
	michele_x += 10*michele_speed;
    e_x += 10*e_speed;
    console.log(e_speed);
    radius += 5;
    if (struck == true){
        rad +=5;
    }
    else{
        tick+=1;
    }
  
	calculateTimes(); //play() already calculates lengths
	draw();
    draw2();
    document.getElementById("time").innerHTML = tick;

}

function set_times(){
    document.getElementById("einstein_rear").value = einstein_times[0];
    document.getElementById("einstein_middle").value = einstein_times[1];
    document.getElementById("einstein_front").value = einstein_times[2];
    document.getElementById("michele_rear").value = michele_times[0];
    document.getElementById("michele_middle").value = michele_times[1];
    document.getElementById("michele_front").value = michele_times[2];
}

function strikeLightning(ctx,x,y){
    ctx.beginPath();
    ctx.arc(x,y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function strikeLightning3(ctx,x,y){
    
    ctx.beginPath();
    ctx.arc(x,y, rad, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function strikeLightning2(ctx,x,y){
    ctx.beginPath();
    ctx.arc(x,y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function findStrikeTime(){
    scale_factor = 10/3;
    lorentz = 1/Math.sqrt(1-(e_speed*e_speed));
    e_strike_time = e_speed*e_len * scale_factor;
    console.log(e_strike_time);

}
//Calculate clock with calculated lorentz
function calculateTimes(){  
    document.getElementById("time").innerHTML = tick;
}

