// Audio Fallback System for Cosmic Light Brew
// This creates basic audio objects when the Web Audio API is not available

function setupAudioFallbacks(scene) {
    console.log("Setting up audio fallbacks...");
    
    // Check if audio is available
    if (!scene.sound || !scene.sound.context) {
        console.warn("Web Audio API not available, using fallbacks");
        createFallbackAudio(scene);
        return;
    }
    
    // Create empty audio objects if they don't exist
    if (!scene.cache.audio.exists('backgroundMusic')) {
        createEmptyAudio(scene, 'backgroundMusic');
    }
    
    if (!scene.cache.audio.exists('coffeePickup')) {
        createEmptyAudio(scene, 'coffeePickup');
    }
    
    if (!scene.cache.audio.exists('crash')) {
        createEmptyAudio(scene, 'crash');
    }
    
    if (!scene.cache.audio.exists('laserSound')) {
        createEmptyAudio(scene, 'laserSound');
    }
    
    if (!scene.cache.audio.exists('success')) {
        createEmptyAudio(scene, 'success');
    }
}

function createEmptyAudio(scene, key) {
    // Create an empty audio object
    scene.cache.audio.add(key, '');
}

function createFallbackAudio(scene) {
    // Create a dummy sound manager that doesn't actually play sounds
    scene.sound = {
        add: function(key, config) {
            return {
                play: function() { console.log(`Playing sound: ${key}`); },
                stop: function() { console.log(`Stopping sound: ${key}`); },
                isPlaying: false,
                volume: config && config.volume ? config.volume : 1,
                loop: config && config.loop ? config.loop : false
            };
        },
        context: null
    };
}

// Make the audio fallback system available globally
if (typeof window !== 'undefined') {
    window.setupAudioFallbacks = setupAudioFallbacks;
} 