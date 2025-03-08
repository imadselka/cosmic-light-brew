// This file generates placeholder audio data for our game
// We'll use Phaser's built-in audio capabilities to create simple sounds

function generatePlaceholderAudioData(scene) {
    // Generate audio data for our game
    generateBackgroundMusicData(scene);
    generateSoundEffectsData(scene);
}

function generateBackgroundMusicData(scene) {
    // Create a simple oscillator-based lofi background music
    const audioContext = scene.sound.context;
    const buffer = audioContext.createBuffer(2, audioContext.sampleRate * 4, audioContext.sampleRate);
    
    // Generate a simple lofi pattern
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const data = buffer.getChannelData(channel);
        
        // Create a simple lofi beat pattern
        for (let i = 0; i < buffer.length; i++) {
            // Base frequency modulation for lofi feel
            const t = i / audioContext.sampleRate;
            const freq = 220 + Math.sin(t * 0.5) * 10;
            
            // Simple sine wave with some noise for lofi texture
            let sample = Math.sin(t * freq * 2 * Math.PI) * 0.1;
            
            // Add some noise for texture
            sample += (Math.random() * 2 - 1) * 0.01;
            
            // Add a simple beat pattern
            if (i % (audioContext.sampleRate / 4) < 100) {
                sample += Math.sin(t * 880 * 2 * Math.PI) * 0.05;
            }
            
            data[i] = sample;
        }
    }
    
    // Create a sound source from the buffer
    const sound = scene.sound.add('backgroundMusic', {
        loop: true,
        volume: 0.3
    });
    
    // Store the sound in the scene
    scene.backgroundMusic = sound;
}

function generateSoundEffectsData(scene) {
    // Generate coffee pickup sound (high pleasant beep)
    generateCoffeePickupSound(scene);
    
    // Generate crash sound (low impact sound)
    generateCrashSound(scene);
    
    // Generate laser sound (sci-fi zap)
    generateLaserSound(scene);
}

function generateCoffeePickupSound(scene) {
    const audioContext = scene.sound.context;
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.3, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Create a pleasant high-pitched beep that rises
    for (let i = 0; i < buffer.length; i++) {
        const t = i / audioContext.sampleRate;
        const freq = 880 + t * 220;
        data[i] = Math.sin(t * freq * 2 * Math.PI) * 0.5 * (1 - t / 0.3);
    }
    
    // Create a sound source from the buffer
    const sound = scene.sound.add('coffeePickup', {
        volume: 0.5
    });
    
    // Store the sound in the scene
    scene.coffeePickupSound = sound;
}

function generateCrashSound(scene) {
    const audioContext = scene.sound.context;
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Create a crash sound (noise + low frequency)
    for (let i = 0; i < buffer.length; i++) {
        const t = i / audioContext.sampleRate;
        
        // Mix noise and low frequency
        data[i] = (Math.random() * 2 - 1) * 0.5 * (1 - t / 0.5) + 
                  Math.sin(t * 110 * 2 * Math.PI) * 0.5 * (1 - t / 0.5);
    }
    
    // Create a sound source from the buffer
    const sound = scene.sound.add('crash', {
        volume: 0.6
    });
    
    // Store the sound in the scene
    scene.crashSound = sound;
}

function generateLaserSound(scene) {
    const audioContext = scene.sound.context;
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.4, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Create a sci-fi laser sound (frequency sweep)
    for (let i = 0; i < buffer.length; i++) {
        const t = i / audioContext.sampleRate;
        const freq = 1200 - t * 800;
        data[i] = Math.sin(t * freq * 2 * Math.PI) * 0.5 * (1 - t / 0.4);
    }
    
    // Create a sound source from the buffer
    const sound = scene.sound.add('laserSound', {
        volume: 0.5
    });
    
    // Store the sound in the scene
    scene.laserSound = sound;
} 