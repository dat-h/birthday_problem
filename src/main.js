
import Phaser from 'phaser';
import TitleScene from './TitleScene.js';
import BedroomScene from './BedroomScene.js';

const config = {
  type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#808',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  scene: [BedroomScene]
};

const game = new Phaser.Game(config);
