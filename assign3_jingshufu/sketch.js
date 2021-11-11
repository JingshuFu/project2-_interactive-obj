// this is a very simple sketch that demonstrates how to place a video cam image into a canvas 

let video;
let pose;
let rightY, leftY, mySound1, mySound2;
let num = 20
let mx = new Array(num);
let my = new Array(num);

let osc;
let playing = false;
let serial;
let latestData = "waiting for data"; // you'll use this to write incoming data to the canvas
let splitter;
let put0 = 0,
	put1 = 0,
	put2 = 0;
let bassCircle;

//speech
var myVoice = new p5.Speech('Google UK English Male', speechLoaded);

myVoice.onStart = speechStarted;
myVoice.onEnd = speechEnded;

var lyric = "Raise your hand and the music will sound, use the knob to change the background color, the button can add a frame, and start playing!";

var speakbutton;

function preload() {

	mySound1 = loadSound('assets_sounds_bubbles.mp3');
	mySound2 = loadSound('assets_sounds_wipe.mp3');

}


function setup() {
	createCanvas(640, 480);
	video = createCapture(VIDEO);
	video.hide();
	poseNet = ml5.poseNet(video, modelLoaded);
	poseNet.on('pose', gotPoses)

	bigeye = loadImage('img/eye.png');

	serial = new p5.SerialPort();

	serial.list();
	console.log("serial.list()   ", serial.list());

	serial.open("/dev/tty.usbmodem14501");

	serial.on('connected', serverConnected);


	serial.on('list', gotList);

	serial.on('data', gotData);


	serial.on('error', gotError);

	serial.on('open', gotOpen);

	speakbutton = createButton('Start Using');
	speakbutton.position(250, 750);
	speakbutton.mousePressed(buttonClicked);

}

function modelLoaded() {
	console.log("modelLoaded function has been called so this work!!!!");
};

function gotPoses(poses) {
	console.log(poses);
	if (poses.length > 0) {
		pose = poses[0].pose;
	}

}

function serverConnected() {
	console.log("Connected to Server");
}


function gotList(thelist) {
	console.log("List of Serial Ports:");

	for (var i = 0; i < thelist.length; i++) {

		console.log(i + " " + thelist[i]);
	}
}


function gotOpen() {
	console.log("Serial Port is Open");
}


function gotError(theerror) {
	console.log(theerror);
}



function gotData() {
	var currentString = serial.readLine(); // read the incoming string
	trim(currentString); // remove any trailing whitespace
	if (!currentString) return; // if the string is empty, do no more
	console.log("currentString  ", currentString); // println the string
	latestData = currentString; // save it for the draw method
	console.log("latestData" + latestData); //check to see if data is coming in
	splitter = split(latestData, ','); // 
	put0 = splitter[0];
	put1 = splitter[1];
	put2 = splitter[2];



}


function gotRawData(thedata) {
	println("gotRawData" + thedata);
}



function draw() {



	image(video, 0, 0);

	fill(0, 200, 100, 50);
	stroke(0, 200, 100);
	rect(0, 0, windowWidth, windowHeight);

	if (put1 > 300) {
		fill(0, 170, 100, 50);
		stroke(0, 200, 100);
		rect(0, 0, windowWidth, windowHeight);
	}
	if (put1 > 300) {
		fill(0, 150, 100, 50);
		stroke(0, 200, 100);
		rect(0, 0, windowWidth, windowHeight);
	}
	if (put1 > 500) {
		fill(0, 100, 100, 50);
		stroke(0, 200, 100);
		rect(0, 0, windowWidth, windowHeight);
	}
	if (put1 > 700) {
		fill(0, 50, 100, 50);
		stroke(0, 200, 100);
		rect(0, 0, windowWidth, windowHeight);
	}
	if (put1 > 900) {
		fill(0, 20, 100, 40);
		stroke(0, 200, 100);
		rect(0, 0, windowWidth, windowHeight);
	}
	if (put1 > 900) {
		fill(0, 0, 100, 30);
		stroke(0, 200, 100);
		rect(0, 0, windowWidth, windowHeight);
	}
	if (put0 == 1) {
		image(bigeye, 0, 0, 640, 480);
	}


	for (let i = num - 1; i > 0; i--) {
		mx[i] = mx[i - 1];
		my[i] = my[i - 1];
	}


	if (pose) {
		mx[0] = pose.nose.x
		my[0] = pose.nose.y

		for (let i = 0; i < num; i++) {

			fill(255, 0, 0, 255 - 10 * i);
			// ellipse(pose.nose.x, pose.nose.y, 10);
			ellipse(mx[i], my[i], (1.2 * num - i) / 2);

		}

		fill(223, 120, 30);
		if (pose.rightWrist.y < 480) {
			mySound1.play()
		}
		if (pose.leftWrist.y < 480) {
			mySound2.play()
		}
		ellipse(pose.rightWrist.x, pose.rightWrist.y, 30)
		ellipse(pose.leftWrist.x, pose.leftWrist.y, 30)
	}

}

function buttonClicked() {
	if (speakbutton.elt.innerHTML == 'Start Using') myVoice.speak(lyric);
	else if (speakbutton.elt.innerHTML == 'I got it!') myVoice.stop();
}

function speechLoaded() {

	myVoice.speak("testing one two three!!!");
}

function speechStarted() {

	speakbutton.elt.innerHTML = 'I got it!';
}



function speechEnded() {

	speakbutton.elt.innerHTML = 'Start Using';
}
