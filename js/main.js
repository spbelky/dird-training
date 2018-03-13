// global vars, exposed in window
// if converted to a widget, these would need to be confined
var leftCollar, midCollar, rightCollar, leftJowl, chin, rightJowl;
leftCollar = {name: "leftCollar",x: null, y: null};
midCollar = {name: "midCollar",x: null, y: null};
rightCollar = {name: "rightCollar",x: null, y: null};
leftJowl = {name: "leftJowl",x: null, y: null};
chin = {name: "chin",x: null, y: null};
rightJowl = {name: "rightJowl",x: null, y: null};
var dataPoints = [leftCollar, midCollar, rightCollar, leftJowl, chin, rightJowl];

function getRandomImage() {
  var dogImg = document.getElementById("dog-image");
  // should get grabbing a random image from a hosted file folder...
  // but locally i have to grab from my own file folder
  var min = 4885;
  var max = 4962;
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  var path = "img/071.German_shepherd_dog/German_shepherd_dog_0"+num+".jpg"
  // var directory = "file:///Users/spbelky/Hax/dird-training/"
  // dogImg.src = directoty + path;
  // // for local, ^
  dogImg.src = path;
  console.log("getting image", path);
  console.log(dogImg);
  setTimeout(function(){ drawCanvas(); }, 1000); //i hate that i have to do set a timeout
}

function drawCanvas() {
  var canvas = document.getElementById("canvas");
  var container = document.getElementById("container");
  var dogImg = document.getElementById("dog-image");
  window.dogImg = dogImg;
  var cw = container.offsetWidth;
  var ratio = dogImg.width / dogImg.height;
  canvas.width = cw;
  canvas.height = cw/ratio;
  ctx = canvas.getContext("2d");
  //  drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
  ctx.drawImage(dogImg, 0, 0, dogImg.naturalWidth, dogImg.naturalHeight, 0, 0, canvas.width, canvas.height);
  canvas.addEventListener("mousedown", recordClick, false);
}

function getCursorPosition(event) {
  var canvas = document.getElementById("canvas");
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  var dataPoint = {x: x, y: y};
  return dataPoint;
}

function recordClick(event) {
  var xy = getCursorPosition(event);
  for (var i = 0; i < dataPoints.length; i++) {
    d = dataPoints[i];
    if (d.x === null) {
      d.x = xy.x;
      d.y = xy.y;
      // these x and y values might need to be normalized. for ex: if we stretched the image by 2x,
      // the values would need to be halved. or if we halved the image, the values need to double.
      createPoint(d);
      fg = document.getElementById(d.name);
      fg.classList.add("done");
      return
    }
  }
}

function createPoint (dataPoint) {
  var container = document.getElementById("container");
  var point = document.createElement("div");
  var label = document.createElement("div");
  point.classList.add("point");
  point.id = dataPoint.name+"_point";
  point.style.top = dataPoint.y + "px";
  point.style.left = dataPoint.x + "px";
  container.appendChild(point);
  point.addEventListener("mousedown", deletePoint, false);
  refreshForm();
}

function deletePoint(event) {
  var point = event.currentTarget;
  for (var i = 0; i < dataPoints.length; i++) {
    d = dataPoints[i];
    if (d.name+"_point" === point.id) {
      d.x = null;
      d.y = null;
      fg = document.getElementById(d.name);
      fg.classList.remove("done");
      break
    }
  }
  point.parentElement.removeChild(point);
  refreshForm();
}

function refreshForm() {
  var submitButton = document.getElementById("sub-button");
  for (var j = 0; j < dataPoints.length; j++) {
    p = dataPoints[j];
    if (p.x === null || p.y === null) {
      submitButton.classList.add("hide");
      submitButton.disabled = true;
      return
    }
  }
  submitButton.classList.remove("hide");
  submitButton.disabled = false;
}

function submitForm() {
  var t = "Submitted!\n\n" + formatSummary();
  alert(t);
  // http post, hit dird endpoint with dataPoints object
  // also include which image the data is for
}

function formatSummary() {
  var string = "";
  for (var i = 0; i < dataPoints.length; i++) {
    d = dataPoints[i];
    string += "name: " + d.name + "\n x:" + d.x + ", y:" + d.y + "\n\n";
  }
  return string;
}

$(getRandomImage(););
