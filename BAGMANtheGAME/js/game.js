
//import GameoverState from 'game_over';
// create a new scene
var gameScene = new Phaser.Scene('Game');

var highscore;
var score = 0;
// load assets

gameScene.preload = function () {
    // game.load.spritesheet('uniqueKey', 'assets/sprites/runningBagman.png', 37, 45, 5);
    // load images
    this.load.image('background', 'assets/16-bit-city111.png');
    this.load.image('rooftop', 'assets/platform1122.png');
    this.load.image('trash', 'assets/Trash.png');
    this.load.image('lad', 'assets/oneBagman.png');
    this.load.image('bag25', 'assets/bag25.png');
    //this.load.image('titlescreen', 'assets/backgroundMenu.png');
    //this.load.image('startButton', 'assets/start_btn.png');
    this.load.image('finished', 'assets/help.png');
    this.load.image('sound', 'assets/soundIcon.png');
    
    
    this.load.audio('music','audio/gameMusic11.mp3');
    var scoreText;
    
   // this.state.add('Gameover', GameoverState, false);
    

};

// called once after the preload ends
gameScene.create = function (){
    
    let music = this.sound.add('music');
    music.play();
    
    
    //music = game.add.audio('music');
    //spawns pickup
    bagSpawnTimer = this.time.addEvent({
        delay: 5000,
        loop: true,
        callback: spawnBag25,
        callbackScope: this
    });

//Score Count
this.timer = this.time.addEvent({
    delay: 1000,
    loop: true,
    callback: scoreCounter,
    callbackScope: this
});
    
//incrementing score
function scoreCounter(){
        score++
    }
    
    

   
    //Create city background
    var bg = this.add.sprite(0, 0, 'background');
    bg.setOrigin(0,0);
    
    //trash configuration 
    this.trashMinX = 0;
    this.trashXorig = 1200;
    
    this.gameSpeed = 3.5;

    //adding the trash cans
    this.trashs = this.add.group({
        key: 'trash',
        repeat: 6,
        setXY: {
            x: 800,
            y: 235,
            stepX: 300,
            stepY: 0
        }
    });
    
    //The scrolling roof background  
    gameScene.roof = gameScene.add.tileSprite(315, 335, 636, 110, 'rooftop');
    this.physics.add.existing(gameScene.roof);
    gameScene.roof.visible = true;
    
    //console.log(gameScene.roof);
    gameScene.roof.body.setCollideWorldBounds(true);

    console.log(gameScene.roof);
    
    
    
    
    //Adding physics to the trash
    this.physics.add.collider(this.trashs, gameScene.roof);

    //Adding physics to bagman
    this.lad = this.physics.add.sprite(55, 205, 'lad');
    this.lad.setScale(2);

    this.lad.setCollideWorldBounds(true);

    this.physics.add.collider(this.lad, gameScene.roof);
    
    //pickup
    this.bag25 = this.add.sprite(640, 155, 'bag25');
    
    //this.finished = this.add.sprite(300,250,'finished');
    
    //Score box 
    this.scoreText = this.add.text(555, 8, 'FUCK: 0' , {
        fontSize: '13px',
        fill: '#ffffff'
    });
    
    this.highscoreText = this.add.text(430, 8, 'FUCKUY: 0' , {
        fontSize: '13px',
        fill: '#ffffff'
    });


    //game dimensions set to system configuration
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    this.pointer = this.input.activePointer;


};

function spawnBag25 () {
    this.bag25.visible = true;
}

gameScene.update = function () {
    
//console.log(score);
console.log(highscore);
    
    gameScene.roof.tilePositionX += this.gameSpeed;
    // console.log(cursors);
  
    
    if (this.bag25.visible){
    //pickups speed    
    this.bag25.x -= 6;
  }
    //loading pickup incrementing score by 25 when picked up
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.lad.getBounds(),this.bag25.getBounds())) {
        this.bag25.visible = false;
        this.bag25.x = 640;
        score += 25;
        
       
   }
    
    
    //incrementing score 
    this.scoreText.setText("SCORE: " + score);
    //this.scoreText.setText("HIGHSCORE: " + highccore);
    
    
  /* highscoreText.text = 'HIGHSCORE: ' + localStorage.getItem("flappyighscore");{
        if(score > localStorage.getItem("flappyighscore")){
            localStorage.setItem("flappyighscore", score);
        }
    }*/
   
    //Making bagman jump with mouse click
    if (this.pointer.isDown == true && this.lad.body.touching.down) {
        console.log("Mouse Clicked");
        this.lad.setVelocityY(-250);
    }
    
    
    let trashs = this.trashs.getChildren();
    let numTrashs = trashs.length;


for (let i = 0; i < numTrashs; i++) {

    // move trash
    trashs[i].x -= this.gameSpeed;


      
       // reloads trash after leaving screen
     if (trashs[i].x <= this.trashMinX) {
      trashs[i].x = this.trashXorig;
    }

    // trash collision
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.lad.getBounds(), trashs[i].getBounds())) {
        //this.music.stop();
        //activates game over function
        this.gameOver();
        
    break;
    }

  }



};

gameScene.gameOver = function() {
    
    this.add.sprite(320,180,'finished');
    //game.input.onDown.add(this.Game, this);

    //music.stop();
    
    //game.input.onTap.addOnce(restart,this);
    
    
        //.setInteractive();
    
    
  /*  endGame(){
        this.game.state.start('Gameover')
    }*/
    

    // restart the scene
  
    //07: replace this.scene.restart with a camera Shake effect
    //this.add.sprite(0,0,'gameEnd');
    // this.cameras.main.shake(500);
    this.time.destroy();
    score = 0;


    //game.input.onDown.add(this.restartGame, this);
    // restart game
    //this.time.delayedCall(500, function() {
      //  this.scene.restart();
    //}, [], this);
}






// set the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
    width: 640,
    height: 360,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 400
            },
            debug: false
        }
    },
    scene: gameScene,

};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
