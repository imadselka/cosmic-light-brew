// This file creates placeholder assets for development
// We'll replace these with proper assets later

function createPlaceholderAssets(scene) {
    console.log("Creating placeholder assets...");
    
    // Create placeholder textures
    createSpaceshipTexture(scene);
    createStarTexture(scene);
    createAsteroidTexture(scene);
    createCoffeeTexture(scene);
    createMirrorTexture(scene);
    createLightBeamTexture(scene);
    createTargetTexture(scene);
    
    console.log("Placeholder assets created successfully");
}

function createSpaceshipTexture(scene) {
    try {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw ship body
        graphics.fillStyle(0x6699ff);
        graphics.fillTriangle(0, 20, 40, 10, 0, 0);
        
        // Add glow effect
        graphics.lineStyle(2, 0x9966ff);
        graphics.strokeTriangle(0, 20, 40, 10, 0, 0);
        
        // Add engine glow
        graphics.fillStyle(0xff9966);
        graphics.fillCircle(2, 10, 5);
        
        graphics.generateTexture('spaceship', 40, 20);
        graphics.destroy();
    } catch (error) {
        console.error("Error creating spaceship texture:", error);
        createFallbackTexture(scene, 'spaceship', 0x6699ff);
    }
}

function createStarTexture(scene) {
    try {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Simple star as a circle with glow
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(5, 5, 2);
        
        // Add glow
        graphics.lineStyle(1, 0x9966ff);
        graphics.strokeCircle(5, 5, 4);
        
        graphics.generateTexture('star', 10, 10);
        graphics.destroy();
    } catch (error) {
        console.error("Error creating star texture:", error);
        createFallbackTexture(scene, 'star', 0xffffff);
    }
}

function createAsteroidTexture(scene) {
    try {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw irregular asteroid shape
        graphics.fillStyle(0x666666);
        graphics.fillCircle(15, 15, 15);
        
        // Add some craters
        graphics.fillStyle(0x444444);
        graphics.fillCircle(10, 10, 3);
        graphics.fillCircle(20, 18, 4);
        graphics.fillCircle(8, 20, 2);
        
        // Add glow outline
        graphics.lineStyle(2, 0x6699ff);
        graphics.strokeCircle(15, 15, 15);
        
        graphics.generateTexture('asteroid', 30, 30);
        graphics.destroy();
    } catch (error) {
        console.error("Error creating asteroid texture:", error);
        createFallbackTexture(scene, 'asteroid', 0x666666);
    }
}

function createCoffeeTexture(scene) {
    try {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw coffee cup
        graphics.fillStyle(0xcc9966);
        graphics.fillRect(5, 5, 15, 20);
        
        // Cup details
        graphics.fillStyle(0x663300);
        graphics.fillRect(5, 5, 15, 5);
        
        // Handle
        graphics.lineStyle(2, 0xcc9966);
        graphics.strokeCircle(22, 15, 5);
        
        // Add glow
        graphics.lineStyle(2, 0xffcc00);
        graphics.strokeRect(4, 4, 17, 22);
        
        graphics.generateTexture('coffee', 30, 30);
        graphics.destroy();
    } catch (error) {
        console.error("Error creating coffee texture:", error);
        createFallbackTexture(scene, 'coffee', 0xcc9966);
    }
}

function createMirrorTexture(scene) {
    try {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Mirror surface
        graphics.fillStyle(0xaaaaff);
        graphics.fillRect(5, 0, 5, 30);
        
        // Frame
        graphics.lineStyle(2, 0xffffff);
        graphics.strokeRect(5, 0, 5, 30);
        
        // Glow effect
        graphics.lineStyle(2, 0x9966ff);
        graphics.strokeRect(3, -2, 9, 34);
        
        graphics.generateTexture('mirror', 15, 30);
        graphics.destroy();
    } catch (error) {
        console.error("Error creating mirror texture:", error);
        createFallbackTexture(scene, 'mirror', 0xaaaaff);
    }
}

function createLightBeamTexture(scene) {
    try {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Beam core
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 100, 10);
        
        // Glow effect
        graphics.lineStyle(4, 0x9966ff);
        graphics.strokeRect(-2, -2, 104, 14);
        
        graphics.generateTexture('lightBeam', 100, 10);
        graphics.destroy();
    } catch (error) {
        console.error("Error creating light beam texture:", error);
        createFallbackTexture(scene, 'lightBeam', 0xffffff, 100, 10);
    }
}

function createTargetTexture(scene) {
    try {
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Target outer ring
        graphics.lineStyle(2, 0xff66ff);
        graphics.strokeCircle(15, 15, 15);
        
        // Target inner ring
        graphics.lineStyle(2, 0xff99ff);
        graphics.strokeCircle(15, 15, 10);
        
        // Target center
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(15, 15, 5);
        
        // Glow effect
        graphics.lineStyle(3, 0xff66ff, 0.5);
        graphics.strokeCircle(15, 15, 18);
        
        graphics.generateTexture('target', 30, 30);
        graphics.destroy();
    } catch (error) {
        console.error("Error creating target texture:", error);
        createFallbackTexture(scene, 'target', 0xff66ff);
    }
}

// Create a simple fallback texture if the main one fails
function createFallbackTexture(scene, key, color, width = 30, height = 30) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(color);
    graphics.fillRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
} 