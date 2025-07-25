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

    // Backgrounds
    this.load.image('bedroom-bg-dark', 'assets/img/background-dark-closed.png');
    this.load.image('bedroom-bg-light', 'assets/img/background-light-closed.png');
    this.load.image('bathroom-bg', 'assets/img/background-bathroom.png');

    // Scene items
    this.load.image('bed-sprite', 'assets/img/bed-sprite.png');


    // Inventory items
    this.load.image('flashlight-off', 'assets/img/flashlight-off.png');
    this.load.image('flashlight-on', 'assets/img/flashlight-on.png');
    this.load.image('dirty-sock', 'assets/img/dirty-sock.png');
    this.load.image('batteries', 'assets/img/d_battery.png');
    this.load.image('punch-card', 'assets/img/punch-card.png');

    // Character
    this.load.image('bernard-face', 'assets/img/bernard-face.png');
    this.load.spritesheet('bernard-walk', 'assets/img/bernard-sprite.png', {
      frameWidth: 156,
      frameHeight: 218
    });

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
