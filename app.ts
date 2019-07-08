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
    backgroundColor: 0x5055ff
  }
  text;
  totalCards = 23;
  cardIndex:number = this.totalCards - 1;
  ticker;
  speed = 1;
  newXPosition = this.width/2;
  scale = 0.5;
  cardMenu;
  layer1 = new PIXI.Container();
  randomMoney;
  layer2 = new PIXI.Container();
  fire;
  layer3 = new PIXI.Container();
  container = new PIXI.Container();
  constructor() {
    new PIXI.Rectangle(0, 0, this.width, this.height);
    this.app = new PIXI.Application(this.option);
    document.body.appendChild(this.app.view);
    this.loader.add('menu1','./assets/card-icon.png');
    this.loader.add('menu2','./assets/card-icon.png');
    this.loader.add('cards','./assets/spritesheetcollection.json');
    this.loader.add('coin','./assets/coin.json');
    this.loader.add('firework','./assets/firework.json');
    this.loader.add('fire','./assets/fire.png');
    this.loader.load(this.setup.bind(this));
    this.container.height = this.height;
    this.container.width = this.width;
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
    this.app.stage.addChild(this.container);
  }

  setup() {
    this.cardMenu = new PIXI.Sprite(this.loader.resources["menu1"].texture);
    this.cardMenu.scale = new PIXI.Point(this.scale, this.scale);
    this.cardMenu.position.set(this.container.width/2,0);
    this.cardMenu.buttonMode = true;
    this.cardMenu.interactive = true;
    this.cardMenu.buttonMode = true;
    this.cardMenu.on('pointerdown', ()=>{
        this.onButtonDown(0);
    });
    this.container.addChild(this.cardMenu);

    this.randomMoney = new PIXI.Sprite(this.loader.resources["coin"].textures['coin'+0+'.png']);
    this.randomMoney.scale = new PIXI.Point(this.scale, this.scale);
    this.randomMoney.position.set(this.container.width/1, 0);
    this.randomMoney.buttonMode = true;
    this.randomMoney.interactive = true;
    this.randomMoney.buttonMode = true;
    this.randomMoney.on('pointerdown', ()=>{
        this.onButtonDown(1);
    });
    this.container.addChild(this.randomMoney);

    this.fire = new PIXI.Sprite(this.loader.resources["fire"].texture);
    this.fire.scale = new PIXI.Point(0.1, 0.1);
    this.fire.position.set(this.container.width,0);
    this.fire.buttonMode = true;
    this.fire.interactive = true;
    this.fire.buttonMode = true;
    this.fire.on('pointerdown', ()=>{
        this.onButtonDown(2);
    });
    this.container.addChild(this.fire);
  }
  onButtonDown(key){
    switch (key) {
        case 0:
            this.layer1.position.set(0,0);
            this.layer1.height = this.height;
            this.layer1.width = this.width;
            this.container.addChild(this.layer1);
            this.createCard();
            this.moveCard(this.sprite[this.cardIndex],this.cardIndex)
            break;
        case 1:
            this.layer2.position.set(0,0);
            this.layer2.height = this.height;
            this.layer2.width = this.width;
            this.container.addChild(this.layer2);
            this.createRandomMoney();
            break;
        case 2:
            this.layer3.position.set(0,0);
            this.layer3.height = this.height;
            this.layer3.width = this.width;
            this.container.addChild(this.layer3);
            this.fireworkAnimation();
            break;
        default:
            break;
    }
  }
  showAnimationDuration(){
    this.text = new PIXI.Text('This is a PixiJS text' + this.app.ticker.speed,{fontFamily : 'Arial', fontSize: 23, fill : 0xff1010, align : 'center'});
    this.layer1.addChild(this.text);
  }
  createRandomMoney(){
    let position = [this.app.screen.width/2.5, this.app.screen.width/2, this.app.screen.width/1.7];
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
    this.layer2.addChild(animate);
    setTimeout(() => {
       animate.destroy();
    },1900);
  }
  createCard(){
    let index, x, y;
    for (index = 0; index < this.totalCards; index++) {
        let sprite = new PIXI.Sprite(this.loader.resources["cards"].textures['card' + index + '.png']);
        sprite.scale = new PIXI.Point(this.scale, this.scale);
        x = index*8;
        y = index*8;
        sprite.position.set(x, y);
        this.layer1.addChild(sprite);
        this.sprite.push(sprite);
        this.spritePosition.push({x: (x + this.newXPosition), y: y, z: index})
    }
    for (let index = this.spritePosition.length - 1; index >= 0; index--) {
       this.reverseSpritePosition.push(this.spritePosition[index]);
    }
  }
  moveCard(sprite, index){
    this.app.ticker = new PIXI.Ticker();
    this.app.ticker.start();
    this.app.ticker.speed = this.speed;
    let newY = 0;
    let newX = 0;
    this.app.ticker.add((delta) => {
        newY = this.reverseSpritePosition[index].y;
        newX = this.reverseSpritePosition[index].x;
        this.updateOrder(index,this.reverseSpritePosition[index].z,sprite);
        if(sprite.x > newX){
            sprite.x++;
        }
        // if(sprite.x < newX){
        //     sprite.x;
        // }
        if(sprite.y > newY){
            sprite.y-=2;
        }
        if(sprite.y < newY){
            sprite.y++;
        }
        if(sprite.y === newY){
            newX = sprite.x;
            sprite.y = newY;
            sprite.x = newX;
            this.app.ticker.stop();
            if (this.cardIndex > 0) {
                this.cardIndex--;
                this.moveCard(this.sprite[this.cardIndex],this.cardIndex);
            }
        }
    });
  }
  updateOrder(index,y,sprite){
    this.layer1.children[index].zIndex = y;
    this.layer1.addChild(sprite);
  }
  fireworkAnimation(){
    let textureArray = [];
    for (let index = 0; index < 27; index++) {
        const texture = PIXI.Texture.from('f'+index+'.png');
        textureArray.push(texture);
    }
    let animate = new PIXI.AnimatedSprite(textureArray);
    animate.position.x = 0;
    animate.position.y = 0;
    animate.animationSpeed = 0.3;
    animate.play();
    this.layer3.addChild(animate);
  }
}

new Game();