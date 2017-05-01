var player;
var canvas;
var ctx;

window.onclick = function(){

	document.getElementById('videoplayer').contentDocument.body.focus();
};
window.onkeydown = keydownCatch;


function keydownCatch(e){
	console.log(e);
	if(e.keyCode == 37){	// 37 = left
		simulateKeyEvent(",");
		e.preventDefault();
	}
	if(e.keyCode == 39){	// 39 = right
		simulateKeyEvent(".");
		e.preventDefault();
	}

}

function simulateKeyEvent(character) {
  var evt = document.createEvent("KeyboardEvent");
   evt.initKeyboardEvent("keypress", true, true, window,
                    0, 0, 0, 0,
                    0, character.charCodeAt(0))

					var bla = player.getIframe();

  var canceled = !bla.dispatchEvent(evt);
  if(canceled) {
    // A handler called preventDefault
    console.log(" A handler called preventDefault");
  } else {
    // None of the handlers called preventDefault
    console.log(" None of the handlers called preventDefault");

  }
}

function load(){
	var urlString = document.getElementById('yt-url-input').value;
	var ytid = getYtId(urlString);
	var ww = ((window && window.innerWidth) ? window.innerWidth : 1280);
	var wh = ((window && window.innerHeight) ? window.innerHeight : 720);
	var aspect = 16/9;
	var controlH = 100;

	var videoH = wh-controlH;
	var videoW = Math.ceil(videoH*aspect);

	document.getElementById('drawing').style.width = (videoW+20)+"px";
	document.getElementById('drawing').style.height = (videoH+20)+"px";
	document.getElementById('checkpointlist').style.width = (ww-videoW-30)+"px";

	document.getElementById('video_url').style.display = "none";
	document.getElementById('videoplayer').style.display = "block";
	document.getElementById('control').style.display = "block";

	player = new YT.Player('videoplayer', {
		width: videoW,
		height: videoH,
		videoId: ytid,
		playerVars: {
			'autoplay': 0,
			'controls': 1,
			'showinfo': 0,
			'rel' : 0
		},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});

	canvas = document.getElementById("drawing");

	canvas.width = videoW+20;
	canvas.height = videoH+20;

	ctx = canvas.getContext("2d");
	ctx.fillStyle = "#FF0000";
	ctx.strokeStyle="#FF0000";
	ctx.lineWidth=4;

	canvas.onmousemove = canvasMouseMove;
	canvas.onmousedown = function(){
		canvasDraw = true;
		pause();
	};
	canvas.onmouseup = function(){
		canvasDraw = false;
	};

}
var canvasDraw = false;
var lastLoc = [0,0];
function canvasMouseMove(evt){
	if(canvasDraw){
		var x = evt.clientX;
		var y = evt.clientY;

		//ctx.fillRect(x-2,y-2,4,4);

		if(lastLoc[0] != null && lastLoc[1] != null){
			ctx.beginPath();
			ctx.moveTo(lastLoc[0],lastLoc[1]);
			ctx.lineTo(x,y);
			ctx.stroke();
			console.log("stroke");
		}


		lastLoc[0] = x;
		lastLoc[1] = y;
	}else{
		lastLoc = [null,null];
	}
}

function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function onPlayerStateChange(evt){
	if(evt.data == 1) {
		clearCanvas();
	}
}

function onPlayerReady(){

}

function getYtId(url){
    var hash;
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
		if(hash[0] == "v")
			return hash[1];
    }
    return "";
}

function onYouTubeIframeAPIReady() {
	document.getElementById('yt-url-btn').disabled = false;
}
function play(){
	player.playVideo();
}
function pause(){
	player.pauseVideo();
}
function setVolume(val){
	player.setVolume(val);
}

function toggleVolume(){
	if(player.isMuted()) {
		player.unMute();
		document.getElementById('toggle').innerHTML = 'mic';
	} else {
		player.mute();
		document.getElementById('toggle').innerHTML = 'mic_off';
	}
}

function prev(sec){
	var current = player.getCurrentTime();
	current -= parseInt(sec);
	if(current < 0)
		current = 0;
	seek(current);
}

function seek(value){
	player.seekTo(value);
}

function speed(value){
	player.setPlaybackRate(value);
}

function addCheckpoint(){
	var current = player.getCurrentTime();
	var itemString = convertSecToString(current);
	var newItem = '<div class="item" onclick="seek('+parseInt(current)+')">'+itemString+'</div>';
	document.getElementById('checkpointlist').innerHTML += newItem;
}

function convertSecToString(sec){
	sec = parseInt(sec);

    var minutes = Math.floor(sec/60);
    var seconds = sec % 60;

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;

}
