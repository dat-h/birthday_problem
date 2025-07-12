import Phaser from 'phaser';

class BedroomScene extends Phaser.Scene {
  constructor() {
    super('BedroomScene');
  }

  preload() {
    // Load the background and character sprite
    this.load.image('bedroom-bg', 'assets/img/background.png');
    this.load.spritesheet('bernard-walk', 'assets/img/bernard-sprite.png', {
      frameWidth: 112, // Adjust to your sprite's frame width
      frameHeight: 156 // Adjust to your sprite's frame height
    });
  }

  create() {

    // Add and rescale background image to fit the scene (800x600)
    const bg = this.add.image(400, 300, 'bedroom-bg');
    bg.setDisplaySize(800, 600);

    // Optionally, add a label for debugging or remove the text below
    // this.add.text(100, 100, 'Point and Click Adventure', { font: '24px Arial', fill: '#fff' });

    // Create the character sprite in the center using Arcade Physics
    this.player = this.physics.add.sprite(400, 300, 'bernard-walk', 0);
    this.player.setScale(1.4);
    this.player.setCollideWorldBounds(true);

    // Create walk animation (assumes right-facing walk frames 0-5)
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('bernard-walk', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
    });

    this.target = new Phaser.Math.Vector2(this.player.x, this.player.y);

    // Move player to pointer on click
    this.input.on('pointerdown', (pointer) => {
      this.target.x = pointer.x;
      this.target.y = pointer.y;
      // Flip sprite based on direction
      if (pointer.x < this.player.x) {
        this.player.setFlipX(true); // Face left
      } else {
        this.player.setFlipX(false); // Face right
      }
      this.physics.moveToObject(this.player, this.target, 200);
      this.player.anims.play('walk', true);
    });
  }

  update() {
    // Stop moving when close to target
    if (this.player && this.target) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        this.target.x, this.target.y
      );
      if (distance < 4) {
        this.player.body.setVelocity(0, 0);
        this.player.anims.stop();
        this.player.setFrame(0); // Idle frame
      }
    }
  }
}

export default BedroomScene;
