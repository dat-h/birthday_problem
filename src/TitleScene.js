import Phaser from 'phaser';

class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#222');
    this.add.text(400, 150, 'The Birthday Problem', { font: '48px Arial', fill: '#fff' }).setOrigin(0.5);

    const startText = this.add.text(400, 300, 'Start', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const optionsText = this.add.text(400, 370, 'Options', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });

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
