var canva = document.getElementById("canvas");
var msg = document.getElementById("msg");
var ctx = canva.getContext("2d");
var w = 35, h = 35;
var curMap;//current map
var curLevel;
var curMan;
var iCurlevel = parseInt(document.getElementById("cur_level").innerText);//Number of checkpoints
var moveTimes = 0;

var oImgs = {
    "block" : "/static/images/block.jpg",
    "wall" : "/static/images/wall.jpg",
    "box" : "/static/images/box.jpg",
    "ball" : "/static/images/ball.jpg",
    "up" : "/static/images/up.jpg",
};
 
function imgPreload (srcs,callback) {
    var count = 0,imgNum = 0,images = {};
    for (src in srcs) {
        imgNum++;
    };
    for (src in srcs) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++count >= imgNum) {
                callback(images)
            };
        };
        images[src].src = srcs[src];
    };
};
 
var block,wall,box,ball,up,down,left,right;
imgPreload (oImgs,function (images) {
    block = images.block;
    wall = images.wall;
    box = images.box;
    up = images.up;
    ball = images.ball;
    down = up;
    left = up;
    right = up;
    init();
});
 
//Init game
function init () {
    initLevel();//Init level
    showMoveInfo();//Init data
};
 
//Init map
function InitMap () {
    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 16; j++) {
            ctx.drawImage(block,w*j,h*i,w,h);
        };
    };
};
 
//man position
function Point (x,y) {
    this.x = x;
    this.y = y;
};
 
var perPosition = new Point(5,5);//
 

function DrawMap (level) {
    for (var i = 0; i < level.length; i++) {
        for (var j = 0; j < level[i].length; j++) {
            var pic = block;
            switch (level[i][j]){
                case 1:
                    pic = wall;
                    break;
                case 2:
                    pic = ball;
                    break;
                case 3:
                    pic = box;
                    break;
                case 4:
                    pic = curMan;
                    perPosition.x = i;
                    perPosition.y = j;
                    break;
                case 5:
                    pic = box;
                    break;
            };
            
            ctx.drawImage(pic,w * j - (pic.width-w) / 2,h * i - (pic.height-h),pic.width,pic.height)
        };
    };
};
 
//Init level
function initLevel () {
    curMap = copyArray(levels[iCurlevel]);
    curLevel = levels[iCurlevel];
    curMan = down;
    InitMap();
    DrawMap(curMap);
};
 
//Select level
function NextLevel (i) {
    iCurlevel = iCurlevel + i;
    if (iCurlevel < 0) {
        iCurlevel = 0;
        return;
    };
    let len= levels.length;
    if (iCurlevel > len-1) {
        iCurlevel = len-1;
    };
    initLevel();
    moveTimes = 0;
    showMoveInfo();
};
 

function go(dir) {
    let p1, p2;
    switch(dir) {
        case "up":
            p1 = new Point(perPosition.x - 1, perPosition.y);
            p2 = new Point(perPosition.x - 2, perPosition.y);
            break;
        case "down":
            p1 = new Point(perPosition.x + 1, perPosition.y);
            p2 = new Point(perPosition.x + 2, perPosition.y);
            break;
        case "left":
            p1 = new Point(perPosition.x, perPosition.y - 1);
            p2 = new Point(perPosition.x, perPosition.y - 2);
            break;
        case "right":
            p1 = new Point(perPosition.x, perPosition.y + 1);
            p2 = new Point(perPosition.x, perPosition.y + 2);
            break;
    }

    if(Trygo(p1, p2)) {
        moveTimes++;
        showMoveInfo();
    }
    
    InitMap();
    
    DrawMap(curMap);

    if(checkFinish()) {
        var id_val = document.getElementById("id_val").innerText;;
        var cur_level = iCurlevel;
        var send_data = {
            'id':id_val,
            'curLevel':cur_level
        }

        $.ajax({
            url:'/add_score',
            type:'post',
            data:send_data,
            success:function (data){
                if(data.code==400){
                    alert("Congratulations！！");
                    NextLevel(1);
                }else{
                    NextLevel(0);
                }
            }
        })
    }
}
 

function checkFinish() {
    for(var i = 0; i < curMap.length; i++) {
        for(var j = 0; j < curMap[i].length; j++) {
            if(curLevel[i][j] == 2 && curMap[i][j] != 3 || curLevel[i][j] == 5 && curMap[i][j] != 3) {
                return false;
            }
        }
    }
    return true;
};
 
function Trygo(p1, p2) {
    if(p1.x < 0) return false; 
    if(p1.y < 0) return false; 
    if(p1.x > curMap.length) return false; 
    if(p1.y > curMap[0].length) return false; 
    if(curMap[p1.x][p1.y] == 1) return false; 
    if(curMap[p1.x][p1.y] == 3 || curMap[p1.x][p1.y] == 5) {
        if(curMap[p2.x][p2.y] == 1 || curMap[p2.x][p2.y] == 3) {
            return false;
        }
        
        curMap[p2.x][p2.y] = 3; 
    
    }
    
    curMap[p1.x][p1.y] = 4; 
    
    var v = curLevel[perPosition.x][perPosition.y];
    if(v != 2){
        if(v == 5){
            v = 2;
        } else {
            v = 0;
        }
    }

    curMap[perPosition.x][perPosition.y] = v;
    perPosition = p1;
    return true;
};

function doKeyDown (event) {
    switch (event.keyCode){
        case 37://Left
            go("left");
            break;
        case 38://Up
            go("up");
            break;
        case 39://Right
            go("right");
            break;
        case 40://Down
            go("down");
            break;
    };
};
 
function showMoveInfo () {
    msg.innerHTML = "Level " + (iCurlevel+1) + ", Level moves " + moveTimes + " times";
};
 
 
function copyArray(arr) {
    var b = []; 
    for(var i = 0; i < arr.length; i++) {
        b[i] = arr[i].concat();
    }
    return b;
};

document.getElementById('games_dd').focus()