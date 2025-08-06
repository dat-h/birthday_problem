
import Phaser from 'phaser';
import TitleScene from './scenes/TitleScene.js';
import BedroomScene from './scenes/BedroomScene.js';
import BathroomScene, { ToiletScene } from './scenes/BathroomScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import WakeUpScene from './scenes/AnimatedScene.js';
import MenuScene from './scenes/MenuScene.js';
import DoorScene from './scenes/DoorScene.js';

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
    dom: {
        createContainer: true
    },
    parent: 'gamecanvas', // Never set parent here - it messes up the viewport in iOS
  scene: [PreloadScene, TitleScene, MenuScene, WakeUpScene, BedroomScene, BathroomScene, ToiletScene, DoorScene]
};

const game = new Phaser.Game(config);
