import Phaser from 'phaser';

class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  preload() {
    this.load.image('title-img', 'assets/img/title.png');
  }

  create() {

    this.cameras.main.setBackgroundColor('#222');
    const cam = this.cameras.main;
    const centerX = cam.width / 2;
    const centerY = cam.height / 2;

    // Add and center the title image
    this.add.image(centerX, centerY - 150, 'title-img').setOrigin(0.5);

    const startText = this.add.text(centerX, centerY, 'Start', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const optionsText = this.add.text(centerX, centerY + 70, 'Options', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startText.on('pointerdown', () => {
      this.scene.start('BedroomScene');
    });
    optionsText.on('pointerdown', () => {
      // Placeholder for options menu
      optionsText.setText('Options (not implemented)');
    });
  }
}

export default TitleScene;
