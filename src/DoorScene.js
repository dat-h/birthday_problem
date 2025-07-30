import Phaser from 'phaser';

class DoorScene extends Phaser.Scene {
  constructor() {
    super('DoorScene');
  }

  preload() {
    // Load any assets needed for the animation (e.g., eyelid images, sound effects)
    // this.load.image('eyelid', 'assets/eyelid.png');
    // this.load.audio('yawn', 'assets/yawn.mp3');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Optional: Play a yawn sound
    // this.sound.play('yawn');

    // Add background (placeholder color)
    this.cameras.main.setBackgroundColor('#000000ff'); // light blue for bathroom

    // Add and rescale background image to fit the scene (800x600), positioned at the top
    const bg = this.add.image(width/2, height/2, 'picnic-bg').setOrigin(0.5, 0.5);
    bg.setDepth(-1000); // Ensure background is behind all objects
    bg.displayWidth = width * 0.75;
    bg.displayHeight = height * 0.75;


    // Integrate web speech api to speak "where am I?"


    // if ('speechSynthesis' in window) {
    //   const utterance = new SpeechSynthesisUtterance('where am I?');
    //   window.speechSynthesis.speak(utterance);
    // }

    // Optional: Add blurry vision effect or overlay here
    // Optional: Add breathing or blinking animation
  }

  update() {
    // Handle any per-frame logic if needed
  }
}
export default DoorScene;
