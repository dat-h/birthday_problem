import Phaser from 'phaser';
import GameState from '../GameState.js';

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
    }

    saySomething( text ) {
        if ('speechSynthesis' in window && GameState.sfxVolume > 0) {
            const utterance = new SpeechSynthesisUtterance(text );
            // utterance.lang = 'en-GB'
            utterance.rate = 1.5; // faster
            utterance.pitch = 2;  // higher pitch
            utterance.volume = GameState.sfxVolume; // Use voice volume setting
            window.speechSynthesis.speak(utterance);
        }
    }

    create() {
        const { width, height } = this.cameras.main;
        this.scene.bringToTop();
        // Get the paused scene key from data passed to MenuScene
        const pausedScene = this.scene.settings.data?.pausedScene || 'BedroomScene';

        // Update last scene for save/load functionality
        GameState.lastScene = pausedScene;

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


        this.setMusicVolume(GameState.musicVolume);
        this.setSFXVolume(GameState.sfxVolume);

        // Resume button
        const resumeButton = this.add.text(width / 2, height / 2 - 140, 'Resume Game', { font: '32px Berkelium', fill: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        resumeButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume(pausedScene);
        });       

        // Music Volume Slider
        const musicLabel = this.add.text(width / 2, height / 2 - 100, 'Music Volume', { font: '24px Berkelium', fill: '#fff' }).setOrigin(0.5);
        
        // Music slider background
        const musicSliderBg = this.add.graphics();
        musicSliderBg.fillStyle(0x333333);
        musicSliderBg.fillRect(width / 2 - 100, height / 2 - 75, 200, 10);
        musicSliderBg.lineStyle(2, 0xffffff);
        musicSliderBg.strokeRect(width / 2 - 100, height / 2 - 75, 200, 10);
        
        // Make music slider background interactive for clicks
        const musicSliderHitArea = this.add.rectangle(width / 2, height / 2 - 70, 200, 20, 0x000000, 0)
            .setInteractive({ useHandCursor: true });
        
        // Music slider handle
        const musicHandle = this.add.circle(width / 2 - 100 + (GameState.musicVolume * 200), height / 2 - 70, 8, 0xffffff)
            .setInteractive({ useHandCursor: true, draggable: true });
        
        // Music volume text
        const musicVolumeText = this.add.text(width / 2, height / 2 - 55, `${Math.round(GameState.musicVolume * 100)}%`, { font: '16px Berkelium', fill: '#fff' }).setOrigin(0.5);
        
        musicHandle.on('drag', (pointer, dragX) => {
            const sliderX = Math.max(width / 2 - 100, Math.min(width / 2 + 100, dragX));
            musicHandle.x = sliderX;
            const volume = (sliderX - (width / 2 - 100)) / 200;
            this.setMusicVolume(volume);
            musicVolumeText.setText(`${Math.round(GameState.musicVolume * 100)}%`);
        });
        
        // Handle clicks on music slider track
        musicSliderHitArea.on('pointerdown', (pointer) => {
            const sliderX = Math.max(width / 2 - 100, Math.min(width / 2 + 100, pointer.x));
            musicHandle.x = sliderX;
            const volume = (sliderX - (width / 2 - 100)) / 200;
            this.setMusicVolume(volume);
            musicVolumeText.setText(`${Math.round(GameState.musicVolume * 100)}%`);
        });

        // Sound Effects & Voice Volume Slider
        const sfxLabel = this.add.text(width / 2, height / 2 - 30, 'Sound Effects & Voice', { font: '24px Berkelium', fill: '#fff' }).setOrigin(0.5);
        
        // Voice slider background
        const voiceSliderBg = this.add.graphics();
        voiceSliderBg.fillStyle(0x333333);
        voiceSliderBg.fillRect(width / 2 - 100, height / 2 - 5, 200, 10);
        voiceSliderBg.lineStyle(2, 0xffffff);
        voiceSliderBg.strokeRect(width / 2 - 100, height / 2 - 5, 200, 10);
        
        // Make voice slider background interactive for clicks
        const voiceSliderHitArea = this.add.rectangle(width / 2, height / 2, 200, 20, 0x000000, 0)
            .setInteractive({ useHandCursor: true });
        
        // SFX slider handle
        const sfxHandle = this.add.circle(width / 2 - 100 + (GameState.sfxVolume * 200), height / 2, 8, 0xffffff)
            .setInteractive({ useHandCursor: true, draggable: true });
        
        // SFX volume text
        const sfxVolumeText = this.add.text(width / 2, height / 2 + 15, `${Math.round(GameState.sfxVolume * 100)}%`, { font: '16px Berkelium', fill: '#fff' }).setOrigin(0.5);
        
        sfxHandle.on('drag', (pointer, dragX) => {
            const sliderX = Math.max(width / 2 - 100, Math.min(width / 2 + 100, dragX));
            sfxHandle.x = sliderX;
            GameState.sfxVolume = (sliderX - (width / 2 - 100)) / 200;
            sfxVolumeText.setText(`${Math.round(GameState.sfxVolume * 100)}%`);
        });
        
        // Handle clicks on SFX slider track
        voiceSliderHitArea.on('pointerdown', (pointer) => {
            const sliderX = Math.max(width / 2 - 100, Math.min(width / 2 + 100, pointer.x));
            sfxHandle.x = sliderX;
            GameState.sfxVolume = (sliderX - (width / 2 - 100)) / 200;
            sfxVolumeText.setText(`${Math.round(GameState.sfxVolume * 100)}%`);
            
            // Test voice when clicking
            if (GameState.sfxVolume > 0) {
                this.saySomething("Sound effects volume set");
            }
        });

        // Save Game button
        const saveButton = this.add.text(width / 2, height / 2 + 45, 'Save Game', { font: '32px Berkelium', fill: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        saveButton.on('pointerdown', () => {
            const success = GameState.saveGame();
            if (success) {
                // Visual feedback for successful save
                saveButton.setText('Game Saved!');
                saveButton.setTint(0x00ff00); // Green tint
                if (GameState.isVoicesOn) {
                    this.saySomething("Game saved successfully");
                }
                // Reset button appearance after 2 seconds
                this.time.delayedCall(2000, () => {
                    saveButton.setText('Save Game');
                    saveButton.clearTint();
                });
            } else {
                // Visual feedback for failed save
                saveButton.setText('Save Failed!');
                saveButton.setTint(0xff0000); // Red tint
                if (GameState.isVoicesOn) {
                    this.saySomething("Failed to save game");
                }
                // Reset button appearance after 2 seconds
                this.time.delayedCall(2000, () => {
                    saveButton.setText('Save Game');
                    saveButton.clearTint();
                });
            }
        });

        // Load Game button
        const loadButton = this.add.text(width / 2, height / 2 + 90, 'Load Game', { font: '32px Berkelium', fill: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        // Check if save data exists and disable button if not
        if (!GameState.hasSaveData()) {
            loadButton.setTint(0x666666); // Gray out the button
            loadButton.setAlpha(0.5);
        }
        
        loadButton.on('pointerdown', () => {
            if (!GameState.hasSaveData()) {
                if (GameState.isVoicesOn) {
                    this.saySomething("No saved game found");
                }
                return;
            }

            const success = GameState.loadGame();
            if (success) {
                // Visual feedback for successful load
                loadButton.setText('Game Loaded!');
                loadButton.setTint(0x00ff00); // Green tint               
                // Start the loaded scene after a brief delay
                this.time.delayedCall(500, () => {                    
                    this.scene.stop();
                    if (pausedScene) {
                        this.scene.stop(pausedScene);
                    }
                    this.scene.start(GameState.lastScene);
                });
            } else {
                // Visual feedback for failed load
                loadButton.setText('Load Failed!');
                loadButton.setTint(0xff0000); // Red tint
                if (GameState.isVoicesOn) {
                    this.saySomething("Failed to load game");
                }
                // Reset button appearance after 2 seconds
                this.time.delayedCall(2000, () => {
                    loadButton.setText('Load Game');
                    loadButton.clearTint();
                });
            }
        });

        // Restart button
        const restartButton = this.add.text(width / 2, height / 2 + 140, 'Restart Game', { font: '32px Berkelium', fill: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        restartButton.on('pointerdown', () => {
            // Stop the menu scene
            this.scene.stop();
            // Stop the paused scene if it exists
            if (pausedScene) {
                this.scene.stop(pausedScene);
            }
            // Reset game state
            GameState.reset();
            // Start fresh bedroom scene
            this.scene.start('BedroomScene');
        });
       
        // Show version in bottom right
        const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
        this.add.text(width - 10, height - 10, `v${version}`, { font: '16px Berkelium', fill: '#888' }).setOrigin(1, 1);
    }

    // setVolume(value) {
    //     // Clamp between 0 and 1
    //     value = Math.max(0, Math.min(1, value));
    //     GameState.volumeLevel = value; // store slider position (0-1)
    //     // Power curve for perceived loudness with a minimum floor
    //     const minVolume = 0.005;
    //     const maxVolume = 1;
    //     const power = 2.5;
    //     const logVolume = minVolume + (maxVolume - minVolume) * Math.pow(value, power);
    //     GameState.volume = logVolume;
    //     this.sound.volume = logVolume;
    // }

    setMusicVolume(value) {
        // Clamp between 0 and 1
        value = Math.max(0, Math.min(1, value));
        GameState.musicVolume = value;

        const minVolume = 0.005;
        const maxVolume = 1;
        const power = 2.5;
        const logVolume = minVolume + (maxVolume - minVolume) * Math.pow(value, power);
        
        if (window.bgMusic) {
          window.bgMusic.setVolume(logVolume);
        }
    }

    setSFXVolume(value) {
        // Clamp between 0 and 1
        value = Math.max(0, Math.min(1, value));
        GameState.sfxVolume = value;

        const minVolume = 0.005;
        const maxVolume = 1;
        const power = 2.5;
        const logVolume = minVolume + (maxVolume - minVolume) * Math.pow(value, power);
        
        // this.sound.volume = logVolume;
    }
    
    update() {        
    }

} 

export default MenuScene;