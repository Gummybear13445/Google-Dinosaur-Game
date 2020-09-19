var trex_img,trex,ground_img,ground,invisGround,cloud_img, trex_die;
var obstacle1_img, obstacle2_img,obstacle3_img,obstacle4_img,obstacle5_img,obstacle6_img;
var ObstacleGroup, CloudGroup;
var gameState, PLAY, END;
var score;
var die_mp3, checkPoint_mp3, jump_mp3;
var gameOver_img, restart_img, gameOver, restart;
function preload(){
  
  trex_img=loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_die=loadAnimation("trex_collided.png");
  ground_img=loadImage("ground2.png");
  cloud_img=loadImage("cloud.png");
  obstacle1_img=loadImage("obstacle1.png");
  obstacle2_img=loadImage("obstacle2.png");
  obstacle3_img=loadImage("obstacle3.png");
  obstacle4_img=loadImage("obstacle4.png");
  obstacle5_img=loadImage("obstacle5.png");
  obstacle6_img=loadImage("obstacle6.png");
  gameOver_img=loadImage("gameOver.png");
  restart_img=loadImage("restart.png");
  die_mp3=loadSound("die.mp3");
  checkPoint_mp3=loadSound("checkPoint.mp3");
  jump_mp3=loadSound("jump.mp3");
}

function setup() {
  createCanvas(600,200)
  trex=createSprite(50,150,10,10);
  trex.addAnimation("running",trex_img);
  trex.addAnimation("dying", trex_die);
  trex.scale=0.5;
  ground=createSprite(300,180,600,10);
  ground.addImage("ground",ground_img);
  ground.x=ground.width/2;
  invisGround=createSprite(300,190,600,5);
  invisGround.visible=false;
  
  ObstacleGroup=new Group();
  CloudGroup=new Group();
  
  PLAY=1;
  gameState=PLAY;
  END=0;
  
  score=0;
 
  //trex.debug=true;
  trex.setCollider("circle",0,0,38); 
  
  restart=createSprite(300,130,10,10);
  gameOver=createSprite(300,100,10,10);
  
  restart.addImage("restart", restart_img);
  gameOver.addImage("gameOver", gameOver_img);
  
  gameOver.scale=0.5;
  restart.scale=0.5;
  
}

function draw() {
  background(180);
  
 // console.log(trex.y);
  
  trex.collide(invisGround);
  
  
  if (gameState === PLAY){
    if (keyDown("space")&&trex.y>=150){
    trex.velocityY=- 10;  
      jump_mp3.play();
  }
    
      ground.velocityX=-(2+3*score/100);
    
  trex.velocityY=trex.velocityY+0.8;
    
  spawnClouds();
  spawnObstacles();
    
    if (ObstacleGroup.isTouching(trex)){
     gameState=END; 
      die_mp3.play();
    }
    if(ground.x<0){
   ground.x=ground.width/2
  }
    
    score=score+Math.round(getFrameRate()/60);
    
    if( score % 100 === 0 && score>0 ){
     checkPoint_mp3.play(); 
    }
    
    restart.visible=false;
    gameOver.visible=false;
    
}

  else if (gameState === END){
           
    ground.velocityX=0;
    trex.velocityY=0;
    ObstacleGroup.setVelocityXEach(0);
    CloudGroup.setVelocityXEach(0);
    ObstacleGroup.setLifetimeEach(-1);
    CloudGroup.setLifetimeEach(-1);
    trex.changeAnimation("dying", trex_die);
    restart.visible=true;
    gameOver.visible=true;
    
  }
  
  if(mousePressedOver(restart)){
   
    reset();
    
  }
  
  drawSprites(); 
  
  text("score:"+ score,520,20);
  
}

function reset(){
  
  gameState=PLAY;
  CloudGroup.destroyEach();
  ObstacleGroup.destroyEach();
  score=0;
  trex.changeAnimation("running", trex_img);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = random(80,120);
    cloud.addImage(cloud_img);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
   CloudGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(600,170,10,40);
    obstacle.velocityX = -(2+3*score/100);
    obstacle.velocityX=-6;
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:  obstacle.addImage(obstacle1_img);
        break;
      case 2:  obstacle.addImage(obstacle2_img);
        break;
      case 3:  obstacle.addImage(obstacle3_img);
        break;
      case 4:  obstacle.addImage(obstacle4_img);
        break;
      case 5:  obstacle.addImage(obstacle5_img);
        break;
      case 6:  obstacle.addImage(obstacle6_img);
        break;
        default:break;
    }
    
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    //add each obstacle to the group
    ObstacleGroup.add(obstacle);
  }
}