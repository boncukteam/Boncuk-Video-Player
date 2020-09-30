var videoDiv;
var video;
var videoSource;
var videoId;
var videoController;
var videoControllerParts = [];
var videoControllerStatus;

var videoPlayButton;
var videoTimer;
var controllerTimeline;
var liveTimeline;

var controlTimer;
var controllerTime = 0;
var currentTime = [0, 0, 0];
var timer = 1000;

var extension;
var fileTypes = [
    {extension: 'mp4', mime: 'video/mp4'},
    {extension: 'webm', mime: 'video/mp4'},
    {extension: 'mkv', mime: 'video/mp4'},
    {extension: 'mov', mime: 'video/mp4'}
];

function AddElement(tag, attribute, text = "") {
    var element;
    element = document.createElement(tag);
    for(var i = 0; i < attribute.length; i++) {
        element.setAttribute(attribute[i].key, attribute[i].value);
    }
    element.innerHTML = text;
    return element;
}

function BoncukVideoPlayer(source) {
    extension = source.split('.');
    extension = extension[extension.length-1];
    videoId = "kdjhg2kg23";
    videoControllerStatus = true;
    var element;

    document.head.innerHTML += '<link rel="stylesheet" href="css/style.css"/>';

    videoDiv = AddElement("div", [
        {"key": "class", "value": "boncuk-video-player"},
        {"key": "id", "value": videoId}
    ]);
    document.body.appendChild(videoDiv);

    video = AddElement("video", [
        {"key": "class", "value": "boncuk-video-player"},
        {"key": "onclick", "value": "BoncukPlayVideo();"},
        {"key": "autoplay", "value": ""}
    ]);
    video.muted = false;
    video.controls = false;
    videoDiv.append(video);
    var mime = '';

    for(var i = 0; i < fileTypes.length; i++) {
        if(extension == fileTypes[i]['extension']) {
            mime = fileTypes[i]['mime'];
        }
    }

    mime = mime == '' ? 'video/mp4' : mime;

    element = AddElement("source", [
        {"key": "src", "value": source},
        {"key": "type", "value": mime}
    ]);

    video.append(element);
    video.append(document.createTextNode("Tarayıcınız video özelliğini desteklemiyor..."));

    videoController = AddElement("div", [{"key": "class", "value": "boncuk-video-controller"}]);
    videoDiv.append(videoController);

    var parts = ["left", "center", "right"];

    for(var i = 0; i < parts.length; i++) {
        videoControllerParts[i] = AddElement("div", [{"key": "class", "value": "boncuk-video-controller-" + parts[i]}]);
        videoController.append(videoControllerParts[i]);
    }

    videoPlayButton = AddElement("a", [
        {"key": "class", "value": "boncuk-video-play"},
        {"key": "href", "value": "#"},
        {"key": "onclick", "value": "BoncukPlayVideo(); return false;"}
    ]);
    videoControllerParts[0].append(videoPlayButton);

    element = AddElement("i", [
        {"key": "class", "value": "fa fa-pause"}
    ]);
    videoPlayButton.append(element);

    element = AddElement("a", [
        {"key": "href", "value": "#"},
        {"key": "onclick", "value": "BoncukRestartVideo(); return false;"}
    ], '<i class="fa fa-stop"></i>');
    videoControllerParts[0].append(element);

    playerTime = AddElement("span", [
        {"key": "class", "value": "boncuk-video-player-time"}
    ], "00:00:00");
    videoControllerParts[0].append(playerTime);

    controllerTimeline = AddElement("input", [
        {"key": "type", "value": "range"},
        {"key": "class", "value": "boncuk-video-controller-timeline"},
        {"key": "min", "value": 0},
        {"key": "max", "value": 100},
        {"key": "value", "value": 0}
    ]);
    videoControllerParts[1].append(controllerTimeline);

    /*element = AddElement("span", [
        {"key": "class", "value": "boncuk-logo-for-video"}
    ]);
    videoControllerParts[2].append(element);*/

    element = AddElement("a", [
        {"key": "href", "value": "#"}
    ], '<i class="fa fa-cog"></i>');
    videoControllerParts[2].append(element);

    element = AddElement("a", [
        {"key": "href", "value": "#"}
    ], '<i class="fa fa-expand"></i>');
    videoControllerParts[2].append(element);

    liveTimeline = AddElement("div", [
        {"key": "class", "value": "boncuk-video-live-timeline"}
    ]);
    liveTimeline.style.width = "0%";
    videoDiv.append(liveTimeline);

    controlTimer = setInterval(BoncukVideoListener, timer);
    videoDiv.addEventListener("mouseenter", function() {BoncukToggleController(true);});
    videoDiv.addEventListener("mouseleave", function() {BoncukToggleController(false);});
    videoControllerStatus = false;
}

function BoncukSetPad(value) {
    return parseInt(value).toString().padStart(2, 0);
}

function BoncukTextTime(currentTime) {
    playerTime.innerHTML = BoncukSetPad(currentTime[0]) + ":" + BoncukSetPad(currentTime[1]) + ":" + BoncukSetPad(currentTime[2]);
}

function BoncukVideoListener() {
    currentTime[2] = parseInt(video.currentTime % 60);
    if(video.currentTime / 60 != currentTime[1]) {
        currentTime[1] = video.currentTime / 60;
        if(video.currentTime / 3600 != currentTime[0])
            currentTime[0] = video.currentTime / 3600;
    }

    BoncukTextTime(currentTime);

    controllerTimeline.setAttribute("value", parseInt(video.currentTime * 100 / video.duration));
    liveTimeline.style.width = parseInt(video.currentTime) * 100 / parseInt(video.duration) + "%";
}

function BoncukPlayVideo() {
    if(!video.paused) {
        video.pause();
        videoPlayButton.childNodes[0].className = "fa fa-play";
        clearInterval(controlTimer);
    }else {
        video.play();
        videoPlayButton.childNodes[0].className = "fa fa-pause";
        controlTimer = setInterval(BoncukVideoListener, timer);
    }
}

function BoncukToggleController(status) {
    if(status) {
        videoController.style.display = "grid";
    }else {
        videoController.style.display = "none";
    }
}

function BoncukRestartVideo() {
    video.currentTime = 0;
    BoncukTextTime(currentTime);
}