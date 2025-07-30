import Phaser from 'phaser';

class WakeUpScene extends Phaser.Scene {
  constructor() {
    super('WakeUpScene');
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

    const vignette = this.add.image(width/2, height/2, 'vignette').setOrigin(0.5, 0.5);
    vignette.displayWidth = width * .75;
    vignette.displayHeight = height * .75;


    // Create a fullscreen black rectangle to simulate closed eyes
    this.eyelid = this.add.rectangle(width /2 , height /2 , 800, 600, 0x000000).setDepth(10);

    // Animate the eyelid opening (fade out to reveal the scene)
    // this.tweens.add({
    //   targets: this.eyelid,
    //   alpha: 0,
    //   duration: 2000,
    //   ease: 'Sine.easeInOut',
    //   onComplete: () => {
    //     // Transition to the next scene (e.g., BedroomScene)
    //     this.scene.start('WakeUpScene');
    //   }
    // });

    this.messageText = this.add.text(
    width / 2,
    height / 2 + 200,
    'mmm...',
    {
        font: '36px Arial',
        align: 'center'
    }
    ).setOrigin( 0.5, 0.5);    

    this.tweens.add({
      targets: this.eyelid,
      alpha: 0,
      duration: 800,
      ease: 'Sine.easeInOut',
      onComplete: () => {
            this.tweens.add({
            targets: this.eyelid,
            alpha: 1,
            duration: 400,
            ease: 'Sine.easeInOut',
            onComplete: () => {

                this.tweens.add({
                targets: this.eyelid,
                alpha: 0,
                duration: 1600,
                ease: 'Sine.easeInOut',
                onComplete: () => {
                    this.messageText.setText( 'huh?')
                    this.tweens.add({
                    targets: this.eyelid,
                    alpha: 1,
                    duration: 5000,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        this.messageText.setText( 'where am I?')
                        this.tweens.add({
                        targets: this.eyelid,
                        alpha: 0,
                        duration: 3000,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            this.tweens.add({
                            targets: this.eyelid,
                            alpha: 0,
                            duration: 1000,
                            ease: 'Sine.easeInOut',
                            onComplete: () => {
                                // Transition to the next scene (e.g., BedroomScene)
                                this.scene.start('BedroomScene');
                            }
                            });
                        }
                        });
                    }
                    });
                    bg.setTexture('ceiling-bg');
                }
                });
            }
            });        
      }
    });


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

export default WakeUpScene;