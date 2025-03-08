// This file creates placeholder audio for development
// We'll replace these with proper audio files later

function createPlaceholderAudio(scene) {
    // Create placeholder audio using Web Audio API
    createBackgroundMusic(scene);
    createCoffeePickupSound(scene);
    createCrashSound(scene);
    createLaserSound(scene);
}

function createBackgroundMusic(scene) {
    // We'll use Phaser's built-in sound manager to create a simple looping tone
    // This is just a placeholder - in a real game, you'd use actual music files
    
    // Create a simple oscillator-based sound
    const lofiSound = scene.sound.add('backgroundMusic', {
        loop: true,
        volume: 0.3
    });
    
    // Store the sound in the scene for later use
    scene.backgroundMusic = lofiSound;
}

function createCoffeePickupSound(scene) {
    // Create a simple pickup sound
    const pickupSound = scene.sound.add('coffeePickup', {
        volume: 0.5
    });
    
    // Store the sound in the scene for later use
    scene.coffeePickupSound = pickupSound;
}

function createCrashSound(scene) {
    // Create a simple crash sound
    const crashSound = scene.sound.add('crash', {
        volume: 0.6
    });
    
    // Store the sound in the scene for later use
    scene.crashSound = crashSound;
}

function createLaserSound(scene) {
    // Create a simple laser sound
    const laserSound = scene.sound.add('laserSound', {
        volume: 0.5
    });
    
    // Store the sound in the scene for later use
    scene.laserSound = laserSound;
} 