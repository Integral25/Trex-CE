var PLAY = 1;
var END = 0;
var gameState = PLAY;

var playerSquareImage, playerSquare;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, spike, tallSpike;

var score=0;

var gameOver, restart;

function preload(){
  
  playerSquareImage = loadImage("playerSquare.jpg");
  groundImage = loadImage("ground.jpg");
  
  cloudImage = loadImage("cloud.png");
  
  spike = loadImage("tallSpike.jpg");
  tallSpike = loadImage("spike.jpg");
  
  restartImg = loadImage("restart.jpg");
}

function setup() {
  createCanvas(600, 200);
  
  playerSquare = createSprite(100,165,20,50);
  playerSquare.addImage(playerSquareImage);
  playerSquare.scale = 0.05;
  
  ground = createSprite(100,700,400,20);
  ground.scale = 1.5;
  ground.addImage("ground",groundImage);
  ground.width = 1000;
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  textSize(40);
  fill("blue");
  gameOver = text("Game Over", 250, 100);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.1;
  
  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,165,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //playerSquare.debug = true;
  background("white");
  textSize(10);
  fill("black");
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && playerSquare.y >= 140) {
      playerSquare.velocityY = -14;
    }
  
    playerSquare.velocityY = playerSquare.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    playerSquare.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(playerSquare)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    playerSquare.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the player animation
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.destroyEach();
    cloudsGroup.setLifetimeEach(-1);
    
    playerSquare.depth = restart.depth - 1;
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = playerSquare.depth;
    playerSquare.depth = playerSquare.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,135,10,40);
    obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(spike);
              break;
      case 2: obstacle.addImage(tallSpike);
      default: break;
    }
    
    obstacle.setCollider("circle", 0, 0, 380);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.07;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  score = 0;
}