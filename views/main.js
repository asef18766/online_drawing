const width = 30;
var mapH, mapW;
var c;
var map = []
var picks = ["#000000", "#00ffff", "#ff00ff", "#ffff00", "#0000ff", "#ff0000", "#00ff00", "#ffffff"];
var picking = 0;

function fill(y, x, color) {
    c.fillStyle = color
    map[y][x] = color
    c.fillRect(width * x, width * y, width, width);
}

function drawing(y, x, color) {
    if (y < 0 || y >= mapH || x < 0 || x >= mapW) return;
    if (map[y][x] == color) return;
    socket.emit("draw", [y, x, color]);
}

$(document).ready(() => {
    mapH = $(".map").height();
    mapW = $(".map").width();

    var click = 0;
    c = $('.map').get(0).getContext("2d");

    for (let i = 0; i < picks.length; i++) {
        $("body").append('<div class="pick" id=pick' + i + '></div>')
        $("#pick" + i).css("top", 50 + i * 78.57 + "px");
        $("#pick" + i).css("background-color", picks[i]);
    }
    $("#pick0").css("border-left", "10px solid BurlyWood");

    var f = e => drawing(e.offsetY / width | 0, e.offsetX / width | 0, color = picks[picking]);

    $(".map").mousemove(e => {
        if (click) f(e);
    });

    $(".map").mousedown(f);

    $(".map").get(0).addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.touches.forEach(f);
    }, false);

    $(".map").get(0).addEventListener('touchmove', function(e) {
        e.preventDefault();
        e.touches.forEach(f);
    }, false);

    $("body").mousedown(() => {
        click = 1;
    })

    $("body").mouseup(() => {
        click = 0;
    })

    $("body").mouseleave(() => {
        click = 0;
    })

    $(".pick").click(function() {
        $("#pick" + picking).css("border-left", "");
        picking = this.id.replace("pick", "");
        $(this).css("border-left", "10px solid BurlyWood");
    })

    socket.on("disconnect", function() {
        $("#online").text("未連線");
        $("#online").css("color", "red");
    });

    socket.on("map", function(array) {
        $("#online").text("已連線");
        $("#online").css("color", "LawnGreen");
        for (let i = 0; i < array.length; i++) {
            map[i] = [];
            for (let j = 0; j < array[i].length; j++) {
                fill(i, j, array[i][j]);
            }
        }
    });

    socket.on("draw", a => {
        fill(...a);
    })
});