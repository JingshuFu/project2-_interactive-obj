// this is a very simple sketch that demonstrates how to place a video cam image into a canvas 

let video;
let pose;
let rightY, leftY, mySound1, mySound2;
let num = 20
let mx = new Array(num);
let my = new Array(num);

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

function draw() {

	image(video, 0, 0);
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
