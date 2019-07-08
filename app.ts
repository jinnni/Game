import * as PIXI from 'pixi.js';

class Game {
  app: PIXI.Application;
  loader = new  PIXI.Loader;
  sprite =[];
  spritePosition = [];
  reverseSpritePosition = [];
  width = window.innerWidth - 15;
  height = window.innerHeight - 15;
  option = {
    width: this.width,
    height: this.height,
    backgroundColor: 0x1099bb
  }
  text;
  totalCards = 53;
  cardIndex:number = this.totalCards - 1;
  ticker;
  speed = 2;
  newXPosition = this.width/2;
  scale = 0.5;
  cardMenu;
  randomMoney
  constructor() {
    new PIXI.Rectangle(0, 0, this.width, this.height);
    this.app = new PIXI.Application(this.option);
    document.body.appendChild(this.app.view);
    this.loader.add('menu1','./assets/card-icon.png');
    this.loader.add('menu2','./assets/card-icon.png');
    this.loader.add('cards','./assets/spritesheetcollection.json');
    this.loader.add('coin','./assets/coin.json');
    this.loader.load(this.setup.bind(this));
  }

  setup() {
    this.cardMenu = new PIXI.Sprite(this.loader.resources["menu1"].texture);
    this.cardMenu.scale = new PIXI.Point(this.scale, this.scale);
    this.cardMenu.position.set(this.width/2, this.height/2);
    this.cardMenu.buttonMode = true;
    this.cardMenu.interactive = true;
    this.cardMenu.buttonMode = true;
    this.cardMenu.on('pointerdown', ()=>{
        this.onButtonDown(0);
    });
    this.app.stage.addChild(this.cardMenu);

    this.randomMoney = new PIXI.Sprite(this.loader.resources["coin"].textures['coin'+0+'.png']);
    this.randomMoney.scale = new PIXI.Point(this.scale, this.scale);
    this.randomMoney.position.set(this.width/2, this.height/3);
    this.randomMoney.buttonMode = true;
    this.randomMoney.interactive = true;
    this.randomMoney.buttonMode = true;
    this.randomMoney.on('pointerdown', ()=>{
        this.onButtonDown(1);
    });
    this.app.stage.addChild(this.randomMoney);
  }
  onButtonDown(key){
    switch (key) {
        case 0:
            this.createCard();
            this.moveCardRight(this.sprite[this.cardIndex],this.cardIndex)
            break;
        case 1:
            this.createRandomMoney();
            // this.moveCardRight(this.sprite[this.cardIndex],this.cardIndex)
            break;
        default:
            break;
    }
  }
  showAnimationDuration(){
    this.text = new PIXI.Text('This is a PixiJS text' + this.app.ticker.speed,{fontFamily : 'Arial', fontSize: 23, fill : 0xff1010, align : 'center'});
    this.app.stage.addChild(this.text);
  }
  createRandomMoney(){
    let position = [this.width/2.5, this.width/2, this.width/1.7];
    let yPosition = this.height/2;
    let order = [
                    [0,0,0],
                    [1,0,0],
                    [1,1,0],
                    [1,1,1],
                    [0,0,1],
                    [0,1,1],
                    [1,0,1]
                ]
    // this.ticker = new PIXI.Ticker();
    // this.ticker.add(() => {
        setInterval(()=>{
                let random = order[Math.floor(Math.random() * order.length)];
                for (let index = 0; index < random.length; index++) {
                    if(random[index] == 0){
                        this.generateText(position[index],yPosition);
                    }else{
                        this.generateCoin(position[index],yPosition);
                    }
                }
           
        },2000)
        
    // });
  }
  generateText(xPosition,yPosition){
    let text = new PIXI.Text('PIXI',{fontFamily : 'Arial', fontSize: 23, fill : 0xff1010, align : 'center'});
    text.position.x = xPosition;
    text.position.y = yPosition;
    this.app.stage.addChild(text);
    setTimeout(() => {
        text.destroy();
     }, 1900);
  }
  generateCoin(xPosition,yPosition){
    let textureArray = [];
    for (let index = 0; index < 6; index++) {
        const texture = PIXI.Texture.from('coin'+index+'.png');
        textureArray.push(texture);
    }
    let animate = new PIXI.AnimatedSprite(textureArray);
    animate.position.x = xPosition;
    animate.position.y = yPosition;
    animate.animationSpeed = 0.3;
    animate.play();
    this.app.stage.addChild(animate);
    setTimeout(() => {
       animate.destroy();
    },1900);
  }
  createCard(){
    let index, x, y;
    for (index = 0; index < this.totalCards; index++) {
        let sprite = new PIXI.Sprite(this.loader.resources["cards"].textures['card' + index + '.png']);
        sprite.scale = new PIXI.Point(this.scale, this.scale);
        x = index*4;
        y = index*8;
        sprite.position.set(x, y);
        this.app.stage.addChild(sprite);
        this.sprite.push(sprite);
        this.spritePosition.push({x: (x + this.newXPosition), y: y, z: index})
    }
    for (let index = this.spritePosition.length - 1; index >= 0; index--) {
       this.reverseSpritePosition.push(this.spritePosition[index]);
    }
  }
  moveCardRight(sprite, index){
    this.ticker = new PIXI.Ticker();
    this.ticker.start();
    this.ticker.speed = this.speed;
    this.ticker.add(() => {
        this.updateOrder(index,this.reverseSpritePosition[index].z,sprite);
        if(sprite.x >= this.reverseSpritePosition[index].x){
            sprite.x = this.reverseSpritePosition[index].x;
            this.ticker.destroy();
            this.moveCardTop(sprite,index);
        }
        sprite.x++;
    });
  }
  moveCardTop(sprite,index){
    this.ticker = new PIXI.Ticker();
    this.ticker.start();
    this.ticker.speed = this.setup;   
    this.ticker.add(() => {
        if(sprite.y ==  this.reverseSpritePosition[index].y){
            sprite.y = this.reverseSpritePosition[index].y;
            this.ticker.destroy();
            this.cardIndex--;
            if(this.cardIndex >= 0){
                this.moveCardRight(this.sprite[this.cardIndex],this.cardIndex);
            }
        }
        if(sprite.y < this.reverseSpritePosition[index].y){
            sprite.y++;
        }else{
            sprite.y--;
        }
    });
  }
  updateOrder(index,y,sprite){
    this.app.stage.children[index].zIndex = y;
    this.app.stage.addChild(sprite);
  }
}

new Game();