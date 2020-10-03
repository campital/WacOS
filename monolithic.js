"use strict";

function addTodoItem() {
    let name = document.getElementById("todo-name");
    let items = document.getElementById("todo-items");
    let itemName = name.value.trim();
    name.value = "";
    if (itemName === "") {
        return;
    }

    let li = document.createElement("li");
    li.appendChild(document.createTextNode(itemName));
    items.appendChild(li);
}

function makeWindow(elem) {
    var titleBar = elem.children[0];

    const btnNames = ["title-btn-close", "title-btn-min", "title-btn-max"];
    var titleButtons = document.createElement("div");
    titleButtons.classList.add("title-btn-container");

    for (let i = 0; i < 3; i++) {
        let btn = document.createElement("div");
        btn.classList.add("title-btn");
        btn.classList.add(btnNames[i]);
        titleButtons.appendChild(btn);
    }

    titleButtons.addEventListener("mouseover", function () {
        for (let x of titleButtons.children) {
            x.classList.add("focus");
        }
    });
    titleButtons.addEventListener("mouseleave", function () {
        for (let x of titleButtons.children) {
            x.classList.remove("focus");
        }
    });


    titleBar.children[0].appendChild(titleButtons);

    titleBar.addEventListener("mousedown", function (e) {
        e = e || window.event;
        e.preventDefault();
        if (e.target.classList.contains("title-btn")) {
            return;
        }

        onDragStart(e.clientX, e.clientY);
    });

    titleBar.addEventListener("touchstart", function (e) {
        e = e || window.event;
        e.preventDefault();
        if (e.target.classList.contains("title-btn")) {
            return;
        }

        onDragStart(e.touches[0].clientX, e.touches[0].clientY);
    });

    elem.addEventListener("mousedown", onWindowClick);
    elem.addEventListener("touchstart", onWindowClick);

    window.addEventListener("resize", windowReset);

    var offX, offY;

    function onWindowClick() {
        if (elem.classList.contains("activeWindow")) {
            return;
        }

        var zMax = 1;
        let classNames = document.getElementsByClassName("activeWindow");
        for (let i = 0; i < classNames.length; i++) {
            zMax = Math.max(classNames[i].style.zIndex, zMax);
            classNames[i].querySelector(".title-bar").style.background = "#f6f6f6";
            classNames[i].querySelector(".window-title").style.color = "#b6b6b6";
            classNames[i].style.boxShadow = "0px 0px 50px rgba(0, 0, 0, .3)";

            for (let x of classNames[i].querySelector(".title-btn-container").children) {
                x.classList.remove("active");
            }
            classNames[i].classList.remove("activeWindow");
        }

        for (let x of elem.querySelector(".title-btn-container").children) {
            x.classList.add("active");
        }
        elem.classList.add("activeWindow");
        elem.style.zIndex = zMax + 1;
        elem.style.boxShadow = "0px 0px 50px rgba(0, 0, 0, .5)";
        titleBar.querySelector(".window-title").style.color = "#515151";
        titleBar.children[0].style.background = "linear-gradient(180deg, rgba(229,228,228,1) 0%, rgba(206,206,206,1) 100%)";
    }

    function onDragStart(x, y) {
        offX = elem.offsetLeft - x;
        offY = elem.offsetTop - y;

        document.addEventListener("mousemove", onDragMouse);
        document.addEventListener("touchmove", onDragTouch);
        document.addEventListener("mouseup", onDragStop);
        document.addEventListener("touchend", onDragStop);
    }

    function onDragMouse(e) {
        e = e || window.event;
        e.preventDefault();

        onDrag(e.clientX, e.clientY);
    }

    function onDragTouch(e) {
        e = e || window.event;
        e.preventDefault();

        onDrag(e.touches[0].clientX, e.touches[0].clientY);
    }

    function onDrag(x, y) {
        elem.style.top = Math.max(0, offY + y) + "px";
        elem.style.left = (offX + x) + "px";
    }

    function onDragStop(e) {
        e = e || window.event;
        e.preventDefault();

        elem.style.top = Math.max(0, Math.min(window.innerHeight - 20, elem.offsetTop)) + "px";
        elem.style.left = Math.max(20 - elem.offsetWidth, Math.min(window.innerWidth - 20, elem.offsetLeft)) + "px";

        document.removeEventListener("mousemove", onDragMouse);
        document.removeEventListener("touchmove", onDragTouch);
        document.removeEventListener("mouseup", onDragStop);
        document.removeEventListener("touchend", onDragStop);
    }

    function windowReset() {
        elem.style.top = Math.max(0, Math.min(window.innerHeight - 20, elem.offsetTop)) + "px";
        elem.style.left = Math.max(20 - elem.offsetWidth, Math.min(window.innerWidth - 20, elem.offsetLeft)) + "px";
    }
}

function initBgSelect(elem) {
    var startX, startY;
    var selectBox = document.getElementById("bg-select");

    elem.addEventListener("mousedown", function (e) {
        e = e || window.event;
        if (e.target === elem) {
            e.preventDefault();
            startSelect(e.clientX, e.clientY);
        }
    });

    elem.addEventListener("touchstart", function (e) {
        e = e || window.event;
        if (e.target === elem) {
            e.preventDefault();
            startSelect(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    function startSelect(x, y) {
        startX = x;
        startY = y;

        selectBox.style.top = startY + "px";
        selectBox.style.left = startX + "px";
        selectBox.style.width = "0";
        selectBox.style.height = "0";
        selectBox.style.visibility = "visible";

        elem.addEventListener("mousemove", moveSelectMouse);
        elem.addEventListener("touchmove", moveSelectTouch);
        elem.addEventListener("mouseup", stopSelect);
        elem.addEventListener("touchend", stopSelect);
    }

    function moveSelectTouch(e) {
        e = e || window.event;
        e.preventDefault();
        moveSelect(e.touches[0].clientX, e.touches[0].clientY);
    }

    function moveSelectMouse(e) {
        e = e || window.event;
        e.preventDefault();
        moveSelect(e.clientX, e.clientY);
    }

    function moveSelect(x, y) {
        let tempX = x - startX;
        if (tempX < 0) {
            selectBox.style.left = (x) + "px";
            selectBox.style.width = (startX - x) + "px";
        } else {
            selectBox.style.left = (startX) + "px";
            selectBox.style.width = (tempX) + "px";
        }

        let tempY = y - startY;
        if (tempY < 0) {
            selectBox.style.top = (y) + "px";
            selectBox.style.height = (startY - y) + "px";
        } else {
            selectBox.style.top = (startY) + "px";
            selectBox.style.height = (tempY) + "px";
        }
    }

    function stopSelect(e) {
        e = e || window.event;
        e.preventDefault();

        selectBox.style.visibility = "hidden";
        elem.removeEventListener("mousemove", moveSelectMouse);
        elem.removeEventListener("touchmove", moveSelectTouch);
        elem.removeEventListener("mouseup", stopSelect);
        elem.removeEventListener("touchend", stopSelect);
    }
}

makeWindow(document.getElementById("todos"));
makeWindow(document.getElementById("ball-game"));
makeWindow(document.getElementById("about"));

initBgSelect(document.children[0]);

class BallGame {
    balls = new Array();
    ctx;

    constructor(canvas) {
        window.requestAnimationFrame((d) => this.loop(d));
        this.ctx = canvas.getContext("2d");
    }

    loop(delta) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for(let ind = 0; ind < this.balls.length; ind++) {
            let ball = this.balls[ind];
            this.calculatePosition(this.balls, , ind);
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, 100, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        window.requestAnimationFrame((d) => this.loop(d));
    }

    addBall(x, y) {
        this.balls.push({
            x: x,
            y: y,
            radius: 100,
            color: [0, 0, 0],
            velocity: [0, 0]
        });
    }

    calculatePosition(balls, bounds, index, delta) {
        let ball = balls[index];
        ball.velocity[0] *= Math.pow(.99, delta);
        ball.velocity[1] -= .00000245 * delta;
        for(let bound of bounds) {
            
        }
    }
}

let bh = new BallGame(document.querySelector("canvas"));
bh.addBall(200, 200);