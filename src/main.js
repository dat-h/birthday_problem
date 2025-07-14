
import Phaser from 'phaser';
import TitleScene from './TitleScene.js';
import BedroomScene from './BedroomScene.js';

const config = {
  type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222',
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
  scene: [TitleScene, BedroomScene]
};

const game = new Phaser.Game(config);
