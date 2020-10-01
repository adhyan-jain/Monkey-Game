 var monkey,monkey_running,monkey_collided;
 var cloud,cloud_image;
 var banana,bananaImage;
 var obstacle,obstacleImage;
 var FoodGroup,obstaclesGroup,cloudsGroup;
 var survivaltime;
 var lives = 1;
 var sprite;
 var blank;
 var sprite1
 
 var gameover, restart
 var gameOverImg,restartImg;

 var jumpSound , checkPointSound, dieSound;

 var MENU = 2;
 var PLAY = 1;
 var END = 0;
 var gamestate = MENU;
 
 var highscore = 0;
 localStorage["HighestScore"] = 0;

 function preload(){
  
 monkey_running = loadAnimation ("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
   
 monkey_collided = loadAnimation("sprite_5.png");
  
 ground_image = loadImage("GROUND.png");
 cloudImage = loadImage("cloud.png"); 
 bananaImage = loadImage("banana.png");
 obstacleImage = loadImage("obstacle.png");
 
 restartImg = loadImage("restart.png");
 gameOverImg = loadImage("gameOver.png");
 
 jumpSound = loadSound("jump.mp3");
 dieSound = loadSound("die.mp3");
 checkPointSound = loadSound("checkPoint.mp3"); 
 }

 function setup() {
  
 createCanvas(600,250);
  
 survivaltime = 0;
   
 FoodGroup = new Group();
 obstaclesGroup = new Group()
 cloudsGroup = new Group();
   
 monkey = createSprite(50,190,50,50);
 monkey.addAnimation("running",monkey_running);
 monkey.addAnimation("collided", monkey_collided);
 monkey.scale = 0.1;
 
 sprite1 = createSprite(50,30,10,10);
 sprite1.addImage(bananaImage);
 sprite1.scale = 0.09;
   
 ground = createSprite(330,390);
 ground.addImage(ground_image);
 ground.scale = 4;
 ground.x = ground.width /2;
  
 invisibleground = createSprite(200,230,400,10);
 invisibleground.visible = false;
   
 gameOver = createSprite(300,100);
 gameOver.addImage(gameOverImg);
  
 restart = createSprite(300,140);
 restart.addImage(restartImg);
  
 gameOver.scale = 0.5;
 restart.scale = 0.5;
 
 blank = createSprite(300,125,590,240);
 blank.shapeColor = "white"
 blank.visible = true;
   
 sprite = createSprite(440,232,250,40);
 sprite.visible = false;
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 40 === 0) {
  cloud = createSprite(600,100,40,10);
  cloud.y = Math.round(random(20,60));
  cloud.addImage(cloudImage);
  cloud.scale = 0.7;
  cloud.velocityX = -(6 + 3*survivaltime/200);
    
  //assign lifetime to the variable
  cloud.lifetime = 110;
    
    //adjust the depth
    cloud.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    cloud.depth = cloud.depth - 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

 function draw() {

 background("lightblue");
  
 drawSprites();
  
 monkey.depth = ground.depth
 monkey.depth = ground.depth + 1;
  
 if (ground.x < 0){
 ground.x = ground.width/2;
 }
  
  //add gravity
  monkey.velocityY = monkey.velocityY + 0.8;
  
  monkey.collide(invisibleground);
  
 if(highscore <= survivaltime){
  
 highscore = survivaltime
 }
  
  if(gamestate === MENU){
  
    blank.visible = true;
    
  fill("black");
    textSize(20);
    text("STORY:",20,30);
    text("A monkey has escaped from the zoo. Help him run and go as far",20,55);
    text("as possible from the zoo without getting hit by any stone kept",20,80);
    text("in the way.",20,105);
    text("INSTRUCTIONS:",20,130);
    text("1. Press space or up arrow to jump.",20,160);
    text("2. One banana increases one life and one banana = one life",20,185);
    text("3. Getting hit by a stone will decrease monkey's life by 1.",20,210);
    text("CLICK HERE TO START.",330,240);
    
  if(mouseIsOver(sprite)) {
  fill("red");
  text("CLICK HERE TO START.",330,240); 
  }
 
 if(mousePressedOver(sprite)){
 
 gamestate = PLAY;
 }   
    
  }
  
 if(gamestate === PLAY){
 
 blank.visible = false;
 fill("black");
 textSize(20);
 text("Survival Time : " + survivaltime,400,30);
 survivaltime = survivaltime +  Math.round((Math.round(World.frameRate/60))*0.5);
 
 text("High Score : " + highscore,400,60);
   
 text("= " + lives,85,40);
   
 monkey.changeAnimation("running",monkey_running);
   
 monkey.visible = true;
   
 if(FoodGroup.isTouching(monkey)) {
 lives = lives + 1;
 checkPointSound.play();
 FoodGroup.destroyEach();
 }
   
 gameOver.visible = false;
 restart.visible = false;
   
 ground.velocityX = -(4 + 3*survivaltime/200);
 
 //jump when the space key is pressed
 if(keyDown("space")  && monkey.y > 194){
 
 monkey.velocityY = -14;
 jumpSound.play();
 }
    
if (keyDown("UP_ARROW") &&  monkey.y > 194) {
 
  monkey.velocityY = -14;
  jumpSound.play();
 }
  
 spawnClouds();
 spawnBanana();
 spawnObstacles();
  
 if(monkey.isTouching(obstaclesGroup) && lives == 1){
 
 lives = 0;
 gamestate = END;
 }
   
 if(monkey.isTouching(obstaclesGroup) && lives > 1){
 
 lives = lives - 1;
 dieSound.play();
 obstaclesGroup.destroyEach();
 FoodGroup.destroyEach();
 monkey.x = 50;
 }
  
 if(lives == 0){
 
 gamestate = END;
 dieSound.play();
 }
  
  }
 
 if(gamestate === END){
 
 fill("black");
 textSize(20);
 text("Survival Time : " + survivaltime,400,30);
 text("High Score : " + highscore,400,60);
 text("= " + lives,85,40);
   
 gameOver.visible = true;
 restart.visible = true;
 
 ground.velocityX = 0;
 monkey.velocityY = 0;
 
 //change the monkey animation
 monkey.changeAnimation("collided", monkey_collided);
 
 //set lifetime of the game objects so that they are never destroyed
 obstaclesGroup.setLifetimeEach(-1);
 cloudsGroup.setLifetimeEach(-1);
 FoodGroup.setLifetimeEach(-1);
 
 obstaclesGroup.setVelocityXEach(0);
 cloudsGroup.setVelocityXEach(0);
 FoodGroup.setVelocityXEach(0);
   
 if(mousePressedOver(restart)){
 
 reset();
 }
 }
 }

 function spawnBanana() {
 //write code here to spawn the clouds
 if (frameCount % 1000  === 0) {
 banana = createSprite(600,100,40,10);
 banana.y = Math.round(random(100,150));
 banana.addImage(bananaImage);
 banana.scale = 0.1;
 banana.velocityX = -(6 + 3*survivaltime/200);
 
 banana.setCollider("rectangle",0,0,300,500,90);
 
 //assign lifetime to the variable
 banana.lifetime = 110;
 
 //adding cloud to the group
 FoodGroup.add(banana);
 }
 }

 function spawnObstacles(){
 if (frameCount % 70 == 0){
 var obstacle = createSprite(600,200,10,40);
 obstacle.velocityX = -(6 + 3*survivaltime/200);
 obstacle.addImage(obstacleImage);
 obstacle.y = 200;
 obstacle.scale = 0.15;
 
 //assign lifetime to the obstacle           
 obstacle.lifetime = 110;
 
 //adjust the depth
 obstacle.depth = ground.depth;
 ground.depth = ground.depth - 1;
   
 //add each obstacle to the group
 obstaclesGroup.add(obstacle);
 
 obstaclesGroup.setColliderEach("circle",0,0,200);
 } 
 else if(World.frameCount % 120 === 0 && survivaltime > 1000) {
    
 var obstacle2 = createSprite(600,200,10,40);
 obstacle2.velocityX = -(6 + 3*survivaltime/200);
 obstacle2.addImage(obstacleImage);
 obstacle2.y = 200;
 obstacle2.scale = 0.15;
 
 //assign lifetime to the obstacle           
 obstacle2.lifetime = 110;
 
 //adjust the depth
 obstacle2.depth = ground.depth;
 ground.depth = ground.depth - 1;
    
 obstaclesGroup.add(obstacle2);
  }
   
   
 }

 function reset(){
 
 gamestate = MENU;
 monkey.x = 50;
 monkey.visible = false;
 monkey.addAnimation("running",monkey_running);
 restart.visible = false;
 gameOver.visible = false;
 cloudsGroup.destroyEach();
 obstaclesGroup.destroyEach();
 FoodGroup.destroyEach();
 survivaltime = 0;
 lives = 1;
 }