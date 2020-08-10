var imageNumber = 0; // 100.jpg is the first image
var unitNumber = 1;
var arrayName;
var result = "";
var original = "";
var timer;
var recognition = new webkitSpeechRecognition ();
recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = "en-US";

function startLearning() {
  if (!navigator.onLine) {
    window.alert("You are offline.");
    return;
  }
  if (!window.hasOwnProperty("webkitSpeechRecognition")) {
    window.alert("Speech recognition is not supported by your browser.");
    return;
  }
  document.getElementById("welcome").style.display = "none";
  document.getElementById("learn").style.display = "block";
  nextImage();
  startDictation();
}

function nextImage() {
  document.getElementById("correct").style.display = "none";
  document.getElementById("logo").innerHTML = document.getElementById(unitNumber).innerHTML;
  arrayName = eval("unit" + unitNumber);
  original = arrayName[imageNumber];
  if (original === undefined) {
    nextUnit();
  } else {
    document.getElementById("image").src = "images/" + (unitNumber * 100 + imageNumber) + ".jpg";
    document.getElementById("original").innerHTML = original;
    document.getElementById("result").innerHTML = "...";
  }
}

function skip() {
  stopDictation();
  clearTimeout(timer);
  document.getElementById("correct").style.display = "none";
  document.getElementById("incorrect").style.display = "none";
  imageNumber++;
  nextImage();
}

function nextUnit(link) {
  if (link === undefined) {
    if (unitNumber < 30) {
      unitNumber++;
      imageNumber = 0;
      nextImage();
    }
  } else {
    var string = link.toString();
    var index = string.search("#");
    unitNumber = string.slice(index + 1);
    imageNumber = 0;
    if (document.getElementById("pictureFrame")) {
      stopDictation();
      nextImage();
    } else {
      startLearning();
    }
  }
}

function startDictation() {
  recognition.start();
  document.getElementById("incorrect").style.display = "none";
  document.getElementById("micOn").style.display = "block";
  document.getElementById("micOff").style.display = "none";
}

function stopDictation() {
  recognition.stop();
  document.getElementById("micOff").style.display = "block";
  document.getElementById("micOn").style.display = "none";
}

recognition.onresult = function(e) {
  result = e.results[0][0].transcript;
  document.getElementById("result").innerHTML = result;
}

recognition.onend = function() {
  stopDictation();
  if (result === "") {return;}

  if (result.toLowerCase() === original.toLowerCase()) {
    document.getElementById("correct").style.display = "block";
    imageNumber++;
    timer = setTimeout(nextImage, 3000);
  } else {
    document.getElementById("incorrect").style.display = "block";
    timer = setTimeout(startDictation, 3000);
  }
  result = "";
}
