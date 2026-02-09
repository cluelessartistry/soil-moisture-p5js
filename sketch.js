let port;
let connectBtn;
let latestData = "no data";

// Plant images
let sadPlantImg;
let oneLeafImg;
let happyPlantImg;
let warningImg;     // warning overlay when plant needs water
let waterPlusImg;   // water added overlay

// Blink variables
let blinkStart = 0;

function preload() {
  sadPlantImg = loadImage("nowater.PNG");     // dry/wilted plant
  oneLeafImg = loadImage("1leaf.PNG");        // one leaf grows
  happyPlantImg = loadImage("delight.PNG");     // fully happy plant
  warningImg = loadImage("warning.PNG");      // indicates water needed
  waterPlusImg = loadImage("water.PNG"); // shows water being added
}


function setup() {
  createCanvas(400, 400);

  // Create Serial object
  port = createSerial();

  // Create connect button
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(20, 370);
  connectBtn.mousePressed(connectPort);
}

function connectPort() 
{
  console.log("Button clicked");
  port.open("Arduino", 9600); // change "Arduino" if needed for your port
}

function draw() {
  background(240);

  // Read sensor data from Arduino
  let data = port.readUntil("\n");
  if (data) {
    latestData = int(data.trim());

    // Trigger blink when plant needs water (dry)
    if (latestData > 499) {
      blinkStart = millis();
    }

    // Trigger blink when water is being added (mid-level)
    if (latestData <= 499 && latestData > 330) {
      blinkStart = millis();
    }
  }

  // Display soil moisture value for debugging
  fill(0);
  textSize(18);
  text("Soil Moisture: " + latestData, 20, 30);

  // Decide which image to show
  if (latestData > 499) {
    // Dry soil → sad plant + blinking warning overlay
    image(sadPlantImg, 50, 50, 300, 300);
    let elapsed = millis() - blinkStart;
    if (elapsed < 5000) {
      if (floor(elapsed / 500) % 2 === 0) {
        image(warningImg, 50, 50, 300, 300);
      }
    }
  } else if (latestData <= 499 && latestData > 330) {
    // Mid-level soil → one leaf + water droplet overlay
    image(oneLeafImg, 50, 50, 300, 300);
    let elapsed = millis() - blinkStart;
    if (elapsed < 5000) {
      if (floor(elapsed / 500) % 2 === 0) {
        image(waterPlusImg, 50, 50, 300, 300);
      }
    }
  } else {
    // Soil sufficiently wet → happy plant
    image(happyPlantImg, 50, 50, 300, 300);
  }
}
