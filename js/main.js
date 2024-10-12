class Player {
  constructor() {
    this.width = 40; //40
    this.height = 20; //20
    this.positionX = 50 - this.width / 2;
    this.positionY = 0;
    this.domElement = null;
    this.currentRotation = 0;
    this.cavities = ["C", "S", "T", "C", "S", "T"]; // circle, square, triangle, circle, square, triangle.
    this.position = [0, 1, 2, 3, 4, 5]; // corresponding positions initially 1 is South, 4 is North, 5 NE, 3 NW, 0 SE, 2 SW

    this.createDomElement();
  }
  createDomElement() {
    // step1: create the element
    this.domElement = document.createElement("img");
    this.domElement.src = "./images/gear.svg";

    // step2: add content or modify (ex. innerHTML...)
    this.domElement.id = "player";
    this.domElement.style.width = this.width + "vw";
    this.domElement.style.height = this.height + "vh";
    this.domElement.style.left = this.positionX + "vw";
    this.domElement.style.bottom = this.positionY + "vh";

    //step3: append to the dom: `parentElm.appendChild()`
    const board = document.getElementById("board");
    board.appendChild(this.domElement);
  }
  moveRight() {
    if (this.positionX < 100 - this.width) {
      this.positionX = this.positionX + 2;
      this.domElement.style.left = this.positionX + "vw";
    }
  }
  moveLeft() {
    if (this.positionX > 0) {
      this.positionX = this.positionX - 2;
      this.domElement.style.left = this.positionX + "vw";
    }
  }
  rotateRight() {
    this.domElement.style.transition = "transform 1s";
    this.currentRotation += 60;
    this.domElement.style.transform = `rotate(${this.currentRotation}deg)`;
    const lastElement = this.cavities.pop(); // remove last element
    this.cavities.unshift(lastElement); // add to beginning
  }
  rotateLeft() {
    this.domElement.style.transition = "transform 1s";
    this.currentRotation -= 60;
    this.domElement.style.transform = `rotate(${this.currentRotation}deg)`;
    const firstElement = this.cavities.pop(); // remove first element
    this.cavities.push(firstElement); // add in the end
  }
}

const shapes = ["C", "S", "T"];

class Obstacle {
  constructor() {
    this.width = 10;
    this.height = 5;
    this.positionX = Math.floor(Math.random() * (100 - this.width + 1)); // random number between 0 and (100 - this.width)
    this.positionY = 100;
    this.domElement = null;
    this.shape = shapes[Math.floor(Math.random() * 3)];

    this.createDomElement();
  }
  createDomElement() {
    // step1: create the element
    switch (this.shape) {
      case "C":
        this.domElement = document.createElement("img");
        this.domElement.src = "./images/circle.svg";
        break;
      case "S":
        this.domElement = document.createElement("img");
        this.domElement.src = "./images/square.svg";
        break;
      case "T":
        this.domElement = document.createElement("img");
        this.domElement.src = "./images/triangle.svg";
        break;
    }

    // step2: add content or modify (ex. innerHTML...)
    this.domElement.className = "obstacle";
    this.domElement.style.width = this.width + "vw";
    this.domElement.style.height = this.height + "vh";
    this.domElement.style.left = this.positionX + "vw";
    this.domElement.style.bottom = this.positionY + "vh";

    //step3: append to the dom: `parentElm.appendChild()`
    const board = document.getElementById("board");
    board.appendChild(this.domElement);
  }
  moveDown() {
    this.positionY--;
    this.domElement.style.bottom = this.positionY + "vh";
  }
}

const player = new Player();

const obstacleArr = []; // will store instances of the class Obstacle

// create obstacles
setInterval(() => {
  const newObstacle = new Obstacle();
  obstacleArr.push(newObstacle);
}, 4000); //4000

// update all obstacles
setInterval(() => {
  obstacleArr.forEach((obstacleInstance) => {
    // move current obstacle
    obstacleInstance.moveDown();

    // detect collision
    if (
      player.positionX < obstacleInstance.positionX + obstacleInstance.width &&
      player.positionX + player.width > obstacleInstance.positionX &&
      player.positionY < obstacleInstance.positionY + obstacleInstance.height &&
      player.positionY + player.height > obstacleInstance.positionY &&
      player.cavities[4] != obstacleInstance.shape // 5th condition if shapes do not correspond.
    ) {
      console.log("game over");
      location.href = "gameover.html";
    }
  });
}, 50); //50

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") {
    player.moveLeft();
  } else if (e.code === "ArrowRight") {
    player.moveRight();
  }
});

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  player.rotateRight();
  return false;
});

document.addEventListener("click", (e) => {
  e.preventDefault();
  player.rotateLeft();
  return false;
});
