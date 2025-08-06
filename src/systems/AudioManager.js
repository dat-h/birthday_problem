/**
 * AudioManager - Centralized audio management system
 * Handles background music, sound effects, and voice synthesis
 */
class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.musicVolume = 1.0;
        this.sfxVolume = 1.0;
        this.bgMusic = null;
        this.sfxSounds = new Map();
        
        // Audio processing constants
        this.MIN_VOLUME = 0.005;
        this.MAX_VOLUME = 1.0;
        this.VOLUME_CURVE = 2.5;
    }

    /**
     * Initialize the audio manager with saved settings
     */
    init(musicVolume = 1.0, sfxVolume = 1.0) {
        this.musicVolume = musicVolume;
        this.sfxVolume = sfxVolume;
        this.updateGlobalMusicVolume();
    }

    /**
     * Set music volume with logarithmic curve for perceived loudness
     */
    setMusicVolume(value) {
        // Clamp between 0 and 1
        value = Math.max(0, Math.min(1, value));
        this.musicVolume = value;
        
        const logVolume = this.calculateLogVolume(value);
        
        // Update global background music if it exists
        if (window.bgMusic) {
            window.bgMusic.setVolume(logVolume);
        }
        
        // Update any scene-specific music
        this.updateGlobalMusicVolume();
    }

    /**
     * Set sound effects volume
     */
    setSFXVolume(value) {
        // Clamp between 0 and 1
        value = Math.max(0, Math.min(1, value));
        this.sfxVolume = value;
        
        // Update all registered SFX sounds
        this.updateAllSFXVolumes();
    }

    /**
     * Play background music
     */
    playMusic(key, options = {}) {
        const defaultOptions = {
            loop: true,
            volume: this.calculateLogVolume(this.musicVolume)
        };
        
        const config = { ...defaultOptions, ...options };
        
        // Stop existing music if playing
        if (this.bgMusic && this.bgMusic.isPlaying) {
            this.bgMusic.stop();
        }
        
        // Create and play new music
        if (this.scene && this.scene.sound) {
            this.bgMusic = this.scene.sound.add(key, config);
            this.bgMusic.play();
            
            // Store reference globally for cross-scene access
            window.bgMusic = this.bgMusic;
        }
        
        return this.bgMusic;
    }

    /**
     * Play sound effect
     */
    playSFX(key, options = {}) {
        if (!this.scene || !this.scene.sound) return null;
        
        const defaultOptions = {
            volume: this.calculateLogVolume(this.sfxVolume)
        };
        
        const config = { ...defaultOptions, ...options };
        
        const sound = this.scene.sound.add(key, config);
        sound.play();
        
        // Store reference for volume updates
        this.sfxSounds.set(key + '_' + Date.now(), sound);
        
        // Clean up reference when sound completes
        sound.once('complete', () => {
            this.sfxSounds.delete(key + '_' + Date.now());
        });
        
        return sound;
    }

    /**
     * Play voice synthesis with SFX volume control
     */
    playVoice(text, options = {}) {
        if (!('speechSynthesis' in window) || this.sfxVolume <= 0) {
            return false;
        }
        
        const defaultOptions = {
            rate: 1.5,
            pitch: 2,
            volume: this.sfxVolume
        };
        
        const config = { ...defaultOptions, ...options };
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = config.rate;
        utterance.pitch = config.pitch;
        utterance.volume = config.volume;
        
        window.speechSynthesis.speak(utterance);
        return true;
    }

    /**
     * Stop all audio
     */
    stopAll() {
        // Stop background music
        if (this.bgMusic && this.bgMusic.isPlaying) {
            this.bgMusic.stop();
        }
        
        // Stop all SFX sounds
        this.sfxSounds.forEach(sound => {
            if (sound.isPlaying) {
                sound.stop();
            }
        });
        this.sfxSounds.clear();
        
        // Stop speech synthesis
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }

    /**
     * Pause all audio
     */
    pauseAll() {
        if (this.bgMusic && this.bgMusic.isPlaying) {
            this.bgMusic.pause();
        }
        
        this.sfxSounds.forEach(sound => {
            if (sound.isPlaying) {
                sound.pause();
            }
        });
    }

    /**
     * Resume all audio
     */
    resumeAll() {
        if (this.bgMusic && this.bgMusic.isPaused) {
            this.bgMusic.resume();
        }
        
        this.sfxSounds.forEach(sound => {
            if (sound.isPaused) {
                sound.resume();
            }
        });
    }

    /**
     * Get current music volume (0-1)
     */
    getMusicVolume() {
        return this.musicVolume;
    }

    /**
     * Get current SFX volume (0-1)
     */
    getSFXVolume() {
        return this.sfxVolume;
    }

    /**
     * Calculate logarithmic volume for perceived loudness
     */
    calculateLogVolume(linearVolume) {
        if (linearVolume <= 0) return 0;
        
        return this.MIN_VOLUME + 
               (this.MAX_VOLUME - this.MIN_VOLUME) * 
               Math.pow(linearVolume, this.VOLUME_CURVE);
    }

    /**
     * Update global background music volume
     */
    updateGlobalMusicVolume() {
        if (window.bgMusic) {
            const logVolume = this.calculateLogVolume(this.musicVolume);
            window.bgMusic.setVolume(logVolume);
        }
    }

    /**
     * Update all SFX sound volumes
     */
    updateAllSFXVolumes() {
        const logVolume = this.calculateLogVolume(this.sfxVolume);
        
        this.sfxSounds.forEach(sound => {
            if (sound && sound.setVolume) {
                sound.setVolume(logVolume);
            }
        });
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.stopAll();
        this.bgMusic = null;
        this.sfxSounds.clear();
        this.scene = null;
    }
}

export default AudioManager;
