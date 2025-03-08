// Audio Manager for Cosmic Light Brew
// Handles audio generation and playback

class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
        
        // Initialize audio context
        this.audioContext = scene.sound.context;
        
        // Generate placeholder sounds
        this.generatePlaceholderSounds();
    }
    
    generatePlaceholderSounds() {
        // Generate background music
        this.generateBackgroundMusic();
        
        // Generate sound effects
        this.generateCoffeePickupSound();
        this.generateCrashSound();
        this.generateLaserSound();
        this.generateSuccessSound();
    }
    
    generateBackgroundMusic() {
        // Create a buffer for lofi background music
        const duration = 4; // 4 seconds loop
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, sampleRate * duration, sampleRate);
        
        // Generate a simple lofi pattern for both channels
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            
            // Create a simple lofi beat pattern
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                
                // Base frequency modulation for lofi feel
                const freq = 220 + Math.sin(t * 0.5) * 10;
                
                // Simple sine wave with some noise for lofi texture
                let sample = Math.sin(t * freq * 2 * Math.PI) * 0.1;
                
                // Add some noise for texture
                sample += (Math.random() * 2 - 1) * 0.01;
                
                // Add a simple beat pattern
                if (i % (sampleRate / 4) < 100) {
                    sample += Math.sin(t * 880 * 2 * Math.PI) * 0.05;
                }
                
                data[i] = sample;
            }
        }
        
        // Create a sound source from the buffer
        this.backgroundMusic = this.scene.sound.add('backgroundMusic', {
            loop: true,
            volume: 0.3
        });
    }
    
    generateCoffeePickupSound() {
        // Create a buffer for coffee pickup sound
        const duration = 0.3; // 0.3 seconds
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create a pleasant high-pitched beep that rises
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const freq = 880 + t * 220;
            data[i] = Math.sin(t * freq * 2 * Math.PI) * 0.5 * (1 - t / duration);
        }
        
        // Create a sound source from the buffer
        this.coffeePickupSound = this.scene.sound.add('coffeePickup', {
            volume: 0.5
        });
    }
    
    generateCrashSound() {
        // Create a buffer for crash sound
        const duration = 0.5; // 0.5 seconds
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create a crash sound (noise + low frequency)
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Mix noise and low frequency
            data[i] = (Math.random() * 2 - 1) * 0.5 * (1 - t / duration) + 
                      Math.sin(t * 110 * 2 * Math.PI) * 0.5 * (1 - t / duration);
        }
        
        // Create a sound source from the buffer
        this.crashSound = this.scene.sound.add('crash', {
            volume: 0.6
        });
    }
    
    generateLaserSound() {
        // Create a buffer for laser sound
        const duration = 0.4; // 0.4 seconds
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create a sci-fi laser sound (frequency sweep)
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const freq = 1200 - t * 800;
            data[i] = Math.sin(t * freq * 2 * Math.PI) * 0.5 * (1 - t / duration);
        }
        
        // Create a sound source from the buffer
        this.laserSound = this.scene.sound.add('laserSound', {
            volume: 0.5
        });
    }
    
    generateSuccessSound() {
        // Create a buffer for success sound
        const duration = 0.6; // 0.6 seconds
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create a success sound (ascending notes)
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Create three ascending notes
            let sample = 0;
            if (t < 0.2) {
                sample = Math.sin(t * 440 * 2 * Math.PI) * 0.5;
            } else if (t < 0.4) {
                sample = Math.sin(t * 550 * 2 * Math.PI) * 0.5;
            } else {
                sample = Math.sin(t * 660 * 2 * Math.PI) * 0.5;
            }
            
            // Apply envelope
            sample *= 1 - (t / duration) * 0.5;
            
            data[i] = sample;
        }
        
        // Create a sound source from the buffer
        this.successSound = this.scene.sound.add('success', {
            volume: 0.5
        });
    }
    
    playBackgroundMusic() {
        if (this.backgroundMusic && !this.backgroundMusic.isPlaying) {
            this.backgroundMusic.play();
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();
        }
    }
    
    fadeOutBackgroundMusic(duration = 2000) {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.scene.tweens.add({
                targets: this.backgroundMusic,
                volume: 0,
                duration: duration,
                onComplete: () => {
                    this.backgroundMusic.stop();
                }
            });
        }
    }
    
    playCoffeePickup() {
        if (this.coffeePickupSound) {
            this.coffeePickupSound.play();
        }
    }
    
    playCrash() {
        if (this.crashSound) {
            this.crashSound.play();
        }
    }
    
    playLaser() {
        if (this.laserSound) {
            this.laserSound.play();
        }
    }
    
    playSuccess() {
        if (this.successSound) {
            this.successSound.play();
        }
    }
}

// Export the AudioManager class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
} 