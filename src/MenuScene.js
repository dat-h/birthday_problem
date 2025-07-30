import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
    }

    create() {
        const { width, height } = this.cameras.main;

        // Set muted to default
        this.sound.volume = gameState.volume;
        this.sound.mute = gameState.isMuted;

        // Add sound toggle
        const soundButton = this.add.bitmapText(width / 2, height / 2 + 200, 'nokia16', `Sound: ${gameState.isMuted ? 'OFF' : 'ON'}`, 24)
            .setOrigin(0.5)
            .setInteractive();

        soundButton.on('pointerdown', () => {
            gameState.isMuted = !gameState.isMuted;
            this.sound.mute = gameState.isMuted;
            soundButton.setText(`Sound: ${gameState.isMuted ? 'OFF' : 'ON'}`);
            saveGameState();
        });

        // Add volume slider (20 blocks)
        this.volumeBlocks = [];
        const blockCount = 20;
        const blockSpacing = 9;
        const blockY = height / 2 + 250;
        const blockStartX = width / 2 - ((blockCount - 1) * blockSpacing) / 2;
        // Initialize gameState.volume if not set
        if (typeof gameState.volume !== 'number') gameState.volume = 1;
        for (let i = 0; i < blockCount; i++) {
            const filled = i < Math.round(gameState.volume * (blockCount - 1));
            const block = this.add.bitmapText(blockStartX + i * blockSpacing, blockY, 'nokia16', '|', 32)
                .setOrigin(0.5)
                .setTint(filled ? 0xffffff : 0x444444)
                .setInteractive();
            block.blockIndex = i;
            block.on('pointerdown', () => {
                gameState.isMuted = false;
                this.sound.mute = gameState.isMuted;
                soundButton.setText(`Sound: ${gameState.isMuted ? 'OFF' : 'ON'}`);

                this.setVolume(i / (blockCount - 1));
            });
            this.volumeBlocks.push(block);
        }
        this.updateVolumeBlocks();

        // Start background music

        if (!this.sound.get('bgm')) {
            this.sound.add('bgm', { loop: true, volume: 0.50 }).play();
        }

        // Show version in bottom right
        const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
        const versionText = this.add.bitmapText(width / 2, height - 20, 'nokia16', `v${version}`, 16).setOrigin(0.5, 0);
        
        // Debug popup functionality - click version 5 times
        this.versionClickCount = 0;
        this.lastVersionClickTime = 0;
        versionText.setInteractive();
        versionText.on('pointerdown', () => {
            const currentTime = this.time.now;
            // Reset counter if more than 2 seconds between clicks
            if (currentTime - this.lastVersionClickTime > 2000) {
                this.versionClickCount = 0;
            }
            this.versionClickCount++;
            this.lastVersionClickTime = currentTime;
            
            if (this.versionClickCount >= 5) {
                this.showDebugPopup();
                this.versionClickCount = 0;
            }
        });
    }

    setVolume(value) {
        // Clamp between 0 and 1
        value = Math.max(0, Math.min(1, value));
        gameState.volumeLevel = value; // store slider position (0-1)
        // Power curve for perceived loudness with a minimum floor
        const minVolume = 0.005;
        const maxVolume = 1;
        const power = 2.5;
        const logVolume = minVolume + (maxVolume - minVolume) * Math.pow(value, power);
        gameState.volume = logVolume;
        this.sound.volume = logVolume;
        this.updateVolumeBlocks();
        saveGameState();
    }

    updateVolumeBlocks() {
        const blockCount = this.volumeBlocks.length;
        // Use the slider value for UI, not the log-mapped value
        const sliderValue = typeof gameState.volumeLevel === 'number' ? gameState.volumeLevel : 1;
        const filledBlocks = Math.round(sliderValue * (blockCount - 1));
        for (let i = 0; i < blockCount; i++) {
            this.volumeBlocks[i].setTint(i <= filledBlocks ? 0xffffff : 0x444444);
        }
    }

    update() {        
        if (this.starfield) this.starfield.update();
        const amplitude = 10; // subtle
        const frequency = 5; // radians per second
        const time = this.time.now / 1000;
        if( this.gameTitleLetters ) {
            this.gameTitleLetters.forEach(l => {
                l.y = l.baseY + amplitude * Math.sin(frequency * time + l.waveIndex * 0.5);
            });
        }        
    }

    createTwistingPixels() {
        const { width, height } = this.cameras.main;
        const pixelSize = 8;
        const cols = Math.ceil(width / pixelSize);
        const rows = Math.ceil(height / pixelSize);
        this.twistingPixels = [];
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * pixelSize + pixelSize / 2;
                const y = row * pixelSize + pixelSize / 2;
                const pixel = this.add.rectangle(x, y, pixelSize - 1, pixelSize - 1, 0xffffff);
                pixel.setOrigin(0.5);
                pixel.setDepth(1000); // Above everything
                
                // Random rotation and scale animation
                const delay = Math.random() * 500;
                const duration = 700 + Math.random() * 300;
                const rotationSpeed = (Math.random() - 0.5) * 4; // -2 to 2 radians
                const scaleSpeed = 0.5 + Math.random() * 1.5; // 0.5 to 2
                
                this.tweens.add({
                    targets: pixel,
                    rotation: rotationSpeed * Math.PI,
                    scaleX: scaleSpeed,
                    scaleY: scaleSpeed,
                    alpha: 0,
                    x: x + (Math.random() - 0.5) * 50,
                    y: y + (Math.random() - 0.5) * 50,
                    delay: delay,
                    duration: duration,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        pixel.destroy();
                    }
                });
                
                this.twistingPixels.push(pixel);
            }
        }
    }

    showDebugPopup() {
        const { width, height } = this.cameras.main;
        
        // Create overlay
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
            .setOrigin(0, 0)
            .setDepth(2000)
            .setInteractive();
        
        // Create popup background
        const popupWidth = 280;
        const popupHeight = 200;
        const popupX = width / 2 - popupWidth / 2;
        const popupY = height / 2 - popupHeight / 2;
        
        const popup = this.add.graphics();
        popup.fillStyle(0x222222, 0.95);
        popup.fillRoundedRect(popupX, popupY, popupWidth, popupHeight, 8);
        popup.lineStyle(2, 0x39ff14, 1);
        popup.strokeRoundedRect(popupX, popupY, popupWidth, popupHeight, 8);
        popup.setDepth(2001);
        
        // Title
        this.add.bitmapText(width / 2, popupY + 20, 'nokia16', 'DEBUG MENU', 20)
            .setOrigin(0.5)
            .setDepth(2002)
            .setTint(0x39ff14);
        
        // Current opponent word display
        this.add.bitmapText(width / 2, popupY + 50, 'nokia16', `Current: ${gameState.opponentWord || 'none'}`, 16)
            .setOrigin(0.5)
            .setDepth(2002);
        
        // Input field background
        const inputBg = this.add.rectangle(width / 2, popupY + 80, 200, 30, 0x000000, 0.8)
            .setDepth(2002)
            .setInteractive();
        
        // Input text
        this.debugInputText = this.add.bitmapText(width / 2, popupY + 80, 'nokia16', '', 16)
            .setOrigin(0.5)
            .setDepth(2003);
        
        // Set button
        const setButton = this.add.bitmapText(width / 2, popupY + 120, 'nokia16', 'SET WORD', 18)
            .setOrigin(0.5)
            .setDepth(2002)
            .setInteractive();
        setButton.setTint(0x39ff14);
        
        // Close button
        const closeButton = this.add.bitmapText(width / 2, popupY + 150, 'nokia16', 'CLOSE', 18)
            .setOrigin(0.5)
            .setDepth(2002)
            .setInteractive();
        closeButton.setTint(0xff4444);
        
        // Input handling
        let currentInput = '';
        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'Backspace') {
                currentInput = currentInput.slice(0, -1);
            } else if (event.key === 'Enter') {
                if (currentInput.length === 5) {
                    gameState.opponentWord = currentInput.toLowerCase();
                    saveGameState();
                    this.closeDebugPopup();
                }
            } else if (/^[a-zA-Z]$/.test(event.key) && currentInput.length < 5) {
                currentInput += event.key.toLowerCase();
            }
            this.debugInputText.setText(currentInput.toUpperCase());
        });
        
        // Button handlers
        setButton.on('pointerdown', () => {
            if (currentInput.length === 5) {
                gameState.opponentWord = currentInput.toLowerCase();
                saveGameState();
                this.closeDebugPopup();
            }
        });
        
        closeButton.on('pointerdown', () => {
            this.closeDebugPopup();
        });
        
        overlay.on('pointerdown', () => {
            this.closeDebugPopup();
        });
        
        // Store references for cleanup
        this.debugPopup = {
            overlay,
            popup,
            inputText: this.debugInputText,
            keyboardHandler: (event) => {
                if (event.key === 'Backspace') {
                    currentInput = currentInput.slice(0, -1);
                } else if (event.key === 'Enter') {
                    if (currentInput.length === 5) {
                        gameState.opponentWord = currentInput.toLowerCase();
                        saveGameState();
                        this.closeDebugPopup();
                    }
                } else if (/^[a-zA-Z]$/.test(event.key) && currentInput.length < 5) {
                    currentInput += event.key.toLowerCase();
                }
                this.debugInputText.setText(currentInput.toUpperCase());
            }
        };
        
        // Add keyboard handler
        this.input.keyboard.on('keydown', this.debugPopup.keyboardHandler);
        
        // Focus on input
        this.debugInputText.setText('_'.repeat(5));
    }
    
    closeDebugPopup() {
        if (this.debugPopup) {
            // Remove keyboard handler
            this.input.keyboard.off('keydown', this.debugPopup.keyboardHandler);
            
            // Destroy all popup elements
            this.debugPopup.overlay.destroy();
            this.debugPopup.popup.destroy();
            this.debugPopup.inputText.destroy();
            
            // Find and destroy all elements with depth 2002 and 2003
            this.children.list.forEach(child => {
                if (child.depth >= 2002 && child.depth <= 2003) {
                    child.destroy();
                }
            });
            
            this.debugPopup = null;
        }
    }
} 