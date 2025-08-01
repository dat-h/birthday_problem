import Phaser from 'phaser';
import GameState from './GameState.js';

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
    }

    saySomething( text ) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text );
            // utterance.lang = 'en-GB'
            utterance.rate = 1.5; // faster
            utterance.pitch = 2;  // higher pitch
            window.speechSynthesis.speak(utterance);
        }
    }

    create() {
        const { width, height } = this.cameras.main;
        this.scene.bringToTop();
        // Get the paused scene key from data passed to MenuScene
        const pausedScene = this.scene.settings.data?.pausedScene || 'BedroomScene';

        this.title = this.add.image(width / 2, height / 2 - 240, 'title').setOrigin(0.5, 0.5).setScale(0.5);

        // Add a bordered rectangle background
        const borderThickness = 4;
        const bgWidth = width * 0.6;
        const bgHeight = height * 0.6;
        const bgX = width / 2 - bgWidth / 2;
        const bgY = height / 2 - bgHeight / 2;
        const graphics = this.add.graphics();
        graphics.fillStyle(0x222222, 0.95);
        graphics.fillRect(bgX, bgY, bgWidth, bgHeight);
        graphics.lineStyle(borderThickness, 0xffffff, 1);
        graphics.strokeRect(bgX, bgY, bgWidth, bgHeight);


        // Set muted to default
        this.sound.volume = GameState.volume;
        this.sound.mute = GameState.isMuted;


        

        const soundButton = this.add.text(width / 2, height / 2 - 100,  `Sound: ${GameState.isMuted ? 'OFF' : 'ON'}`, { font: '32px Arial', fill: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        soundButton.on('pointerdown', () => {
            GameState.isMuted = !GameState.isMuted;
            this.sound.mute = GameState.isMuted;
            soundButton.setText(`Sound: ${GameState.isMuted ? 'OFF' : 'ON'}`);
        });

        // Resume button
        const resumeButton = this.add.text(width / 2, height / 2 + 100, 'Resume Game', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        resumeButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume(pausedScene);
        });

        // Voices On - off button
        const voicesButton = this.add.text(width / 2, height / 2 + 200, `Voices: ${GameState.isVoicesOn ? 'ON' : 'OFF'}`, { font: '32px Arial', fill: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        voicesButton.on('pointerdown', () => {
            GameState.isVoicesOn = !GameState.isVoicesOn;
            if (GameState.isVoicesOn) {
                this.saySomething("Voices are now ON");
            } else {
                this.saySomething("Voices are now OFF");
            }
            voicesButton.setText(`Voices: ${GameState.isVoicesOn ? 'ON' : 'OFF'}`);

        });


        // Start background music
        // if (!this.sound.get('bgm')) {
        //     this.sound.add('bgm', { loop: true, volume: 0.50 }).play();
        // }

        // Show version in bottom right
        const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
        this.add.text(width - 10, height - 10, `v${version}`, { font: '16px Arial', fill: '#888' }).setOrigin(1, 1);
    }

    setVolume(value) {
        // Clamp between 0 and 1
        value = Math.max(0, Math.min(1, value));
        GameState.volumeLevel = value; // store slider position (0-1)
        // Power curve for perceived loudness with a minimum floor
        const minVolume = 0.005;
        const maxVolume = 1;
        const power = 2.5;
        const logVolume = minVolume + (maxVolume - minVolume) * Math.pow(value, power);
        GameState.volume = logVolume;
        this.sound.volume = logVolume;
    }


    update() {        
    }

} 

export default MenuScene;