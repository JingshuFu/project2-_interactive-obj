/* 
August 2019 - Doug Whitton 
play 3 analog sensors that output sound and circle graphic
The Arduino file that's running is "threeSensorExample"
*/

let osc;
let playing = false;
let serial;
let latestData = "waiting for data"; // you'll use this to write incoming data to the canvas
let splitter;
let put0 = 0,
	put1 = 0,
	put2 = 0;
let bassCircle;
let song1;
let song2;


function setup() {

	angleMode(DEGREES);
	rectMode(CENTER);

	song1 = createAudio('assets/assets_sounds_bubbles.mp3');
	song2 = createAudio('assets/assets_audio_Basquiat.mp3');


	createCanvas(windowWidth, windowHeight);


	///////////////////////////////////////////////////////////////////
	//Begin serialport library methods, this is using callbacks
	///////////////////////////////////////////////////////////////////    

	// Instantiate our SerialPort object
	serial = new p5.SerialPort();

	// Get a list the ports available
	// You should have a callback defined to see the results
	serial.list();
	console.log("serial.list()   ", serial.list());

	//////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////
	// Assuming our Arduino is connected, let's open the connection to it
	// Change this to the name of your arduino's serial port
	serial.open("/dev/tty.usbmodem14601");
	/////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	// Here are the callbacks that you can register

	// When we connect to the underlying server
	serial.on('connected', serverConnected);

	// When we get a list of serial ports that are available
	serial.on('list', gotList);
	// OR
	//serial.onList(gotList);

	// When we some data from the serial port
	serial.on('data', gotData);
	// OR
	//serial.onData(gotData);

	// When or if we get an error
	serial.on('error', gotError);
	// OR
	//serial.onError(gotError);

	// When our serial port is opened and ready for read/write
	serial.on('open', gotOpen);
	// OR
	//serial.onOpen(gotOpen);

	// Callback to get the raw data, as it comes in for handling yourself
	//serial.on('rawdata', gotRawData);
	// OR
	//serial.onRawData(gotRawData);


}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////



// We are connected and ready to go
function serverConnected() {
	console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
	console.log("List of Serial Ports:");
	// theList is an array of their names
	for (var i = 0; i < thelist.length; i++) {
		// Display in the console
		console.log(i + " " + thelist[i]);
	}
}

// Connected to our serial device
function gotOpen() {
	console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
	console.log(theerror);
}


// There is data available to work with from the serial port
function gotData() {
	var currentString = serial.readLine(); // read the incoming string
	trim(currentString); // remove any trailing whitespace
	if (!currentString) return; // if the string is empty, do no more
	console.log("currentString  ", currentString); // println the string
	latestData = currentString; // save it for the draw method
	console.log("latestData" + latestData); //check to see if data is coming in
	splitter = split(latestData, ','); // split each number using the comma as a delimiter
	//console.log("splitter[0]" + splitter[0]); 
	put0 = splitter[0]; //put the first sensor's data into a variable
	put1 = splitter[1];
	put2 = splitter[2];



}

// We got raw data from the serial port
function gotRawData(thedata) {
	println("gotRawData" + thedata);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device


function draw() {



	if (put1 > 1) {
		ellipse(width / 2, height / 2, put1);
	}

	bass();
	melody();
}

function bass() {

	if (put0 == 1) {
		song1.loop();
		emo1();
	}
	if (put0 == 0) {
		song1.stop();
	}
}

function melody() {
	if (put2 < 5) {
		song2.play();
		emo();
	} else if (put2 > 10) {
		song2.stop();
	}
}


function emo() {

	background(150, 50, 20, 80)
	translate(width / 2, height / 2)

	noFill()

	strokeWeight(8)
	for (var n = 0; n < 8; n++) {
		stroke(150 + n * 20, 100 + n * 5, 50)
	}
	beginShape()
	for (var i = 0; i < 360; i += 30) {
		var rad = map(sin(i * 3 + frameCount), -1, 1, 100, 300)
		var x = rad * cos(i)
		var y = rad * sin(i)
		vertex(x, y)
	}
	endShape(CLOSE)
	rotate(frameCount / 10)

}

function emo1() {

	translate(width / 2, height / 2);

	for (var i = 0; i < 100; i++) {
		push()
		rotate(sin(frameCount + i) * 300)
		rect(0, 0, 1000 - i * 2, 200 - i, 200 - i)
		pop()
	}
	translate(width / 3, height / 3);




}
