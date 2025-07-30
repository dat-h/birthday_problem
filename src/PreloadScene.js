import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Display loading text or bar
    const { width, height } = this.cameras.main;
    this.loadingText = this.add.text(width / 2, height / 2, 'Loading...', {
      font: '20px Arial',
      fill: '#fff'
    }).setOrigin(0.5);

    // Optional: loading bar
    const barWidth = 200;
    const barHeight = 20;
    const barBg = this.add.rectangle(width / 2, height / 2 + 40, barWidth, barHeight, 0x444444).setOrigin(0.5);
    const bar = this.add.rectangle(width / 2 - barWidth / 2, height / 2 + 40, 0, barHeight, 0xffffff).setOrigin(0, 0.5);

    this.load.on('progress', (value) => {
      bar.width = barWidth * value;
    });

    // Invisible
    this.load.image('invisible', 'assets/img/1x1.png');
    this.load.image('vignette', 'assets/img/vignette.png');
    this.load.image('menu-btn', 'assets/img/menu-btn.png');



    // Backgrounds
    this.load.image('bedroom-bg-light', 'assets/img/backgrounds/background-light-closed.png');
    this.load.image('bathroom-bg', 'assets/img/backgrounds/background-bathroom.png');
    this.load.image('toilet-bg', 'assets/img/backgrounds/background-toilet.png');
    this.load.image('picnic-bg', 'assets/img/backgrounds/picnic_bg.png');
    this.load.image('ceiling-bg', 'assets/img/backgrounds/ceiling.png');



    // Scene items
    this.load.image('bed-sprite', 'assets/img/scene/bed-sprite.png');
    this.load.image('box-locked-sprite', 'assets/img/scene/box-locked-sprite.png');
    this.load.image('box-open-sprite', 'assets/img/scene/box-open-sprite.png');
    this.load.image('drawer-closed-sprite', 'assets/img/scene/drawer-closed-sprite.png');
    this.load.image('laundry-hamper', 'assets/img/scene/laundry-hamper.png');

    // Inventory items
    this.load.image('flashlight-off', 'assets/img/items/flashlight-off.png');
    this.load.image('flashlight-on', 'assets/img/items/flashlight-on.png');
    this.load.image('dirty-sock', 'assets/img/items/dirty-sock.png');
    this.load.image('batteries', 'assets/img/items/d_battery.png');
    this.load.image('batterypair', 'assets/img/items/batterypair.png');
    this.load.image('punch-card', 'assets/img/items/punch-card.png');
    this.load.image('key', 'assets/img/items/key.png');
    this.load.image('notepad', 'assets/img/items/notepad.png');
    this.load.image('pencil', 'assets/img/items/pencil.png');
    this.load.image('clock-hands', 'assets/img/items/clock-hands.png');
    this.load.image('pliers', 'assets/img/items/pliers.png');
    this.load.image('glass', 'assets/img/items/glass.png');
    this.load.image('glass-full', 'assets/img/items/glass-full.png');
    
    // Character
    this.load.image('bernard-face', 'assets/img/bernard-face.png');
    this.load.spritesheet('bernard-walk', 'assets/img/bernard-sprite.png', {
      frameWidth: 156,
      frameHeight: 218
    });


    // Music
    // Load music from music.mp3
    this.load.audio('bg-music', 'assets/music/music.mp3');

    // Load sound effects

    // Any additional assets
    // this.load.image('...', 'assets/img/....png');
  }

  create() {
    // Create walk animation (assumes right-facing walk frames 0-5) for all scenes
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('bernard-walk', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
    });    

    this.scene.start('BedroomScene'); // Start the main game scene after preloading
  }
}

export default PreloadScene;
