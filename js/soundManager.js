// Simple Sound Manager for Cosmic Light Brew
// This creates and manages basic sound effects without relying on complex audio generation

class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
        this.initialized = false;
        
        // Initialize sounds
        this.initSounds();
    }
    
    initSounds() {
        try {
            console.log("Initializing sound manager...");
            
            // Create simple sounds using Phaser's built-in capabilities
            this.createBackgroundMusic();
            this.createSoundEffects();
            
            this.initialized = true;
            console.log("Sound manager initialized successfully");
        } catch (error) {
            console.error("Failed to initialize sound manager:", error);
        }
    }
    
    createBackgroundMusic() {
        // Create a simple oscillator for background music
        this.sounds.backgroundMusic = this.scene.sound.add('backgroundMusic', {
            loop: true,
            volume: 0.2
        });
    }
    
    createSoundEffects() {
        // Create simple sound effects
        this.sounds.coffeePickup = this.scene.sound.add('coffeePickup', { volume: 0.5 });
        this.sounds.crash = this.scene.sound.add('crash', { volume: 0.6 });
        this.sounds.laser = this.scene.sound.add('laserSound', { volume: 0.5 });
        this.sounds.success = this.scene.sound.add('success', { volume: 0.5 });
    }
    
    playBackgroundMusic() {
        if (this.initialized && this.sounds.backgroundMusic) {
            try {
                if (!this.sounds.backgroundMusic.isPlaying) {
                    this.sounds.backgroundMusic.play();
                }
            } catch (error) {
                console.warn("Could not play background music:", error);
            }
        }
    }
    
    stopBackgroundMusic() {
        if (this.initialized && this.sounds.backgroundMusic && this.sounds.backgroundMusic.isPlaying) {
            try {
                this.sounds.backgroundMusic.stop();
            } catch (error) {
                console.warn("Could not stop background music:", error);
            }
        }
    }
    
    fadeOutBackgroundMusic(duration = 2000) {
        if (this.initialized && this.sounds.backgroundMusic && this.sounds.backgroundMusic.isPlaying) {
            try {
                this.scene.tweens.add({
                    targets: this.sounds.backgroundMusic,
                    volume: 0,
                    duration: duration,
                    onComplete: () => {
                        this.sounds.backgroundMusic.stop();
                    }
                });
            } catch (error) {
                console.warn("Could not fade out background music:", error);
                this.stopBackgroundMusic();
            }
        }
    }
    
    playCoffeePickup() {
        this.playSound('coffeePickup');
    }
    
    playCrash() {
        this.playSound('crash');
    }
    
    playLaser() {
        this.playSound('laser');
    }
    
    playSuccess() {
        this.playSound('success');
    }
    
    playSound(key) {
        if (this.initialized && this.sounds[key]) {
            try {
                this.sounds[key].play();
            } catch (error) {
                console.warn(`Could not play sound ${key}:`, error);
            }
        }
    }
}

// Make the sound manager available globally
if (typeof window !== 'undefined') {
    window.SoundManager = SoundManager;
} 