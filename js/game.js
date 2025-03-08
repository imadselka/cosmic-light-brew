// Cosmic Light Brew - Main Game File

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: false,
        noAudio: false
    }
};

// Initialize the game
const game = new Phaser.Game(config);

// Global variables
let spaceship;
let cursors;
let stars = [];
let backgroundMusic;
let score = 0;
let scoreText;
let energy = 100;
let energyBar;
let energyText;
let gameSpeed = 1;
let gameActive = true;
let dimOverlay;
let lightWall;
let mirrors = [];
let target;
let lightBeam;
let lastWallTime = 0;
let wallActive = false;
let soundManager;

// Asset loading
function preload() {
    console.log("Preloading assets...");
    
    // Load scripts for placeholder assets
    this.load.script('placeholderAssets', 'assets/placeholder.js');
    
    // Create empty textures that will be filled by our placeholder generators
    this.textures.addBase64('spaceship', '');
    this.textures.addBase64('star', '');
    this.textures.addBase64('asteroid', '');
    this.textures.addBase64('coffee', '');
    this.textures.addBase64('mirror', '');
    this.textures.addBase64('lightBeam', '');
    this.textures.addBase64('target', '');
    
    // Set up audio fallbacks
    if (typeof setupAudioFallbacks === 'function') {
        setupAudioFallbacks(this);
    } else {
        console.warn("Audio fallback system not available");
        
        // Create empty audio objects manually
        this.cache.audio.add('backgroundMusic', '');
        this.cache.audio.add('coffeePickup', '');
        this.cache.audio.add('crash', '');
        this.cache.audio.add('laserSound', '');
        this.cache.audio.add('success', '');
    }
    
    console.log("Preload complete");
}

// Game initialization
function create() {
    console.log("Starting game initialization...");
    
    // Create placeholder assets
    createPlaceholderAssets(this);
    
    // Initialize sound manager
    soundManager = new SoundManager(this);
    
    // Create starry background
    createStarryBackground(this);
    
    // Add spaceship
    spaceship = this.physics.add.sprite(150, 300, 'spaceship');
    spaceship.setCollideWorldBounds(true);
    
    // Add glow effect to spaceship
    spaceship.setData('glowColor', 0x9966ff);
    
    // Input controls
    cursors = this.input.keyboard.createCursorKeys();
    
    // UI elements
    scoreText = this.add.text(16, 16, 'Coffee: 0', { fontSize: '24px', fill: '#fff', fontFamily: 'Arial' });
    scoreText.setDepth(10);
    
    // Energy bar
    createEnergyBar(this);
    
    // Dim overlay for low energy
    dimOverlay = this.add.rectangle(config.width/2, config.height/2, config.width, config.height, 0x000000);
    dimOverlay.setAlpha(0);
    dimOverlay.setDepth(5);
    
    // Start background music
    try {
        soundManager.playBackgroundMusic();
    } catch (error) {
        console.error("Error playing background music:", error);
    }
    
    // Set up game systems
    setupAsteroidSystem(this);
    setupCoffeeSystem(this);
    setupLightWallSystem(this);
    
    // Add game over text (hidden initially)
    this.gameOverText = this.add.text(config.width/2, config.height/2, 'GAME OVER', {
        fontSize: '64px',
        fill: '#ff0000',
        fontFamily: 'Arial'
    });
    this.gameOverText.setOrigin(0.5);
    this.gameOverText.setDepth(20);
    this.gameOverText.setVisible(false);
    
    // Add restart button (hidden initially)
    this.restartButton = this.add.text(config.width/2, config.height/2 + 80, 'Play Again', {
        fontSize: '32px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        backgroundColor: '#6600cc',
        padding: { x: 20, y: 10 }
    });
    this.restartButton.setOrigin(0.5);
    this.restartButton.setInteractive({ useHandCursor: true });
    this.restartButton.on('pointerdown', () => restartGame(this));
    this.restartButton.setDepth(20);
    this.restartButton.setVisible(false);
    
    // Debug info
    console.log("Game initialized successfully");
}

// Main game loop
function update(time) {
    if (!gameActive) return;
    
    // Move stars for parallax effect
    updateStarryBackground();
    
    // Handle player input
    handlePlayerMovement();
    
    // Update energy
    updateEnergy(this);
    
    // Check for light wall timing
    if (!wallActive && time - lastWallTime > 10000) { // 10 seconds between walls
        createLightWall(this);
        lastWallTime = time;
    }
    
    // Update light beam if wall is active
    if (wallActive) {
        updateLightBeam(this);
    }
}

// Create a starry background with parallax effect
function createStarryBackground(scene) {
    console.log("Creating starry background...");
    
    // Create multiple layers of stars for parallax effect
    for (let i = 0; i < 100; i++) {
        const x = Phaser.Math.Between(0, config.width);
        const y = Phaser.Math.Between(0, config.height);
        const scale = Phaser.Math.FloatBetween(0.1, 0.5);
        const alpha = Phaser.Math.FloatBetween(0.3, 1);
        const speed = Phaser.Math.FloatBetween(0.5, 3);
        
        const star = scene.add.image(x, y, 'star');
        star.setScale(scale);
        star.setAlpha(alpha);
        star.setTint(Phaser.Math.RND.pick([0x9966ff, 0x6699ff, 0xffffff]));
        star.setData('speed', speed);
        
        stars.push(star);
    }
    
    console.log(`Created ${stars.length} stars`);
}

// Update star positions for parallax scrolling
function updateStarryBackground() {
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.x -= star.getData('speed') * gameSpeed;
        
        if (star.x < -20) {
            star.x = config.width + 20;
            star.y = Phaser.Math.Between(0, config.height);
        }
    }
}

// Handle player movement with arrow keys
function handlePlayerMovement() {
    const speed = 5 * (energy > 0 ? 1 : 0.5);
    
    spaceship.setVelocity(0);
    
    if (cursors.left.isDown) {
        spaceship.setVelocityX(-200 * speed);
    } else if (cursors.right.isDown) {
        spaceship.setVelocityX(200 * speed);
    }
    
    if (cursors.up.isDown) {
        spaceship.setVelocityY(-200 * speed);
    } else if (cursors.down.isDown) {
        spaceship.setVelocityY(200 * speed);
    }
}

// Create energy bar UI
function createEnergyBar(scene) {
    console.log("Creating energy bar...");
    
    const barWidth = 200;
    const barHeight = 20;
    const x = config.width - barWidth - 20;
    const y = 20;
    
    // Background bar
    scene.add.rectangle(x + barWidth/2, y + barHeight/2, barWidth, barHeight, 0x333333).setDepth(9);
    
    // Energy bar
    energyBar = scene.add.rectangle(x + barWidth/2, y + barHeight/2, barWidth, barHeight, 0x00ff00).setDepth(10);
    energyBar.setOrigin(0.5);
    
    // Energy text
    energyText = scene.add.text(x + barWidth/2, y + barHeight + 10, 'Energy: 100', { 
        fontSize: '18px', 
        fill: '#fff',
        fontFamily: 'Arial'
    }).setDepth(10);
    energyText.setOrigin(0.5, 0);
    
    // Set up energy depletion timer
    scene.time.addEvent({
        delay: 1000,
        callback: () => {
            if (gameActive && energy > 0) {
                energy = Math.max(0, energy - 1);
                updateEnergyBar();
            }
        },
        callbackScope: scene,
        loop: true
    });
}

// Update energy bar UI
function updateEnergyBar() {
    const barWidth = 200;
    energyBar.width = (energy / 100) * barWidth;
    energyText.setText(`Energy: ${energy}`);
    
    // Change color based on energy level
    if (energy > 60) {
        energyBar.fillColor = 0x00ff00; // Green
    } else if (energy > 30) {
        energyBar.fillColor = 0xffff00; // Yellow
    } else {
        energyBar.fillColor = 0xff0000; // Red
    }
    
    // Dim screen when energy is low
    if (energy <= 0) {
        gameSpeed = 0.5;
        dimOverlay.setAlpha(0.3); // Dim the screen
    } else {
        gameSpeed = 1;
        dimOverlay.setAlpha(0); // Normal brightness
    }
}

// Update energy system
function updateEnergy(scene) {
    // Check for game over condition
    if (energy <= 0) {
        scene.time.addEvent({
            delay: 15000, // 15 seconds of low energy before game over
            callback: () => {
                if (energy <= 0) {
                    gameOver(scene);
                }
            },
            callbackScope: scene,
            loop: false
        });
    }
}

// Game over state
function gameOver(scene) {
    console.log("Game over!");
    gameActive = false;
    
    // Show game over text and restart button
    scene.gameOverText.setVisible(true);
    scene.restartButton.setVisible(true);
    
    // Fade out music
    if (soundManager) {
        soundManager.fadeOutBackgroundMusic(2000);
    }
}

// Restart the game
function restartGame(scene) {
    console.log("Restarting game...");
    
    // Reset game state
    score = 0;
    energy = 100;
    gameSpeed = 1;
    gameActive = true;
    wallActive = false;
    
    // Reset UI
    scoreText.setText('Coffee: 0');
    updateEnergyBar();
    dimOverlay.setAlpha(0);
    
    // Hide game over elements
    scene.gameOverText.setVisible(false);
    scene.restartButton.setVisible(false);
    
    // Reset spaceship position
    spaceship.setPosition(150, 300);
    
    // Clear existing objects
    scene.asteroids.clear(true, true);
    scene.coffees.clear(true, true);
    
    // Remove light wall if active
    if (lightWall) {
        lightWall.destroy();
        lightWall = null;
    }
    
    // Remove mirrors
    mirrors.forEach(mirror => mirror.destroy());
    mirrors = [];
    
    // Remove target
    if (target) {
        target.destroy();
        target = null;
    }
    
    // Remove light beam
    if (lightBeam) {
        lightBeam.destroy();
        lightBeam = null;
    }
    
    // Reset wall timer
    lastWallTime = 0;
    
    // Restart music
    if (soundManager) {
        soundManager.stopBackgroundMusic();
        soundManager.playBackgroundMusic();
    }
    
    console.log("Game restarted successfully");
}

// Set up asteroid spawning system
function setupAsteroidSystem(scene) {
    console.log("Setting up asteroid system...");
    
    // Asteroid group
    scene.asteroids = scene.physics.add.group();
    
    // Collision with spaceship
    scene.physics.add.collider(spaceship, scene.asteroids, (ship, asteroid) => {
        if (soundManager) {
            soundManager.playCrash();
        }
        console.log('Crash!');
        
        // Reduce energy on crash
        energy = Math.max(0, energy - 10);
        updateEnergyBar();
        
        // Destroy asteroid
        asteroid.destroy();
    });
    
    // Spawn asteroids periodically
    scene.time.addEvent({
        delay: 1500,
        callback: () => {
            if (!gameActive) return;
            
            const y = Phaser.Math.Between(50, config.height - 50);
            const asteroid = scene.asteroids.create(config.width + 50, y, 'asteroid');
            
            // Random size and rotation
            const scale = Phaser.Math.FloatBetween(0.5, 1.5);
            asteroid.setScale(scale);
            
            // Add glow effect
            asteroid.setData('glowColor', 0x6699ff);
            
            // Set velocity
            const speed = Phaser.Math.Between(100, 200);
            asteroid.setVelocityX(-speed);
            
            // Add rotation
            asteroid.setAngularVelocity(Phaser.Math.FloatBetween(-50, 50));
            
            // Auto-destroy when off screen
            asteroid.checkWorldBounds = true;
            asteroid.outOfBoundsKill = true;
        },
        callbackScope: scene,
        loop: true
    });
}

// Set up coffee cup spawning system
function setupCoffeeSystem(scene) {
    console.log("Setting up coffee system...");
    
    // Coffee group
    scene.coffees = scene.physics.add.group();
    
    // Collision with spaceship
    scene.physics.add.overlap(spaceship, scene.coffees, (ship, coffee) => {
        // Collect coffee
        coffee.destroy();
        
        // Update score
        score += 1;
        scoreText.setText(`Coffee: ${score}`);
        
        // Play sound
        if (soundManager) {
            soundManager.playCoffeePickup();
        }
        
        // Increase energy
        energy = Math.min(100, energy + 10);
        updateEnergyBar();
    });
    
    // Spawn coffee cups periodically
    scene.time.addEvent({
        delay: 3000,
        callback: () => {
            if (!gameActive) return;
            
            const y = Phaser.Math.Between(50, config.height - 50);
            const coffee = scene.coffees.create(config.width + 50, y, 'coffee');
            
            // Add glow effect
            coffee.setData('glowColor', 0xffcc00);
            
            // Set velocity
            coffee.setVelocityX(-150);
            
            // Auto-destroy when off screen
            coffee.checkWorldBounds = true;
            coffee.outOfBoundsKill = true;
        },
        callbackScope: scene,
        loop: true
    });
}

// Set up light wall system
function setupLightWallSystem(scene) {
    console.log("Setting up light wall system...");
    // We'll create light walls periodically in the update function
    // The first wall will appear after 10 seconds
}

// Create a light wall obstacle
function createLightWall(scene) {
    console.log("Creating light wall...");
    wallActive = true;
    
    // Create the light wall
    lightWall = scene.add.rectangle(config.width - 200, config.height/2, 20, config.height, 0xaaaaff);
    lightWall.setAlpha(0.8);
    
    // Add glow effect
    const wallGlow = scene.add.rectangle(config.width - 200, config.height/2, 30, config.height, 0x9966ff);
    wallGlow.setAlpha(0.4);
    
    // Create physics body for the wall
    scene.physics.add.existing(lightWall, true); // true = static body
    
    // Collision with spaceship
    scene.physics.add.collider(spaceship, lightWall);
    
    // Create draggable mirrors
    createMirrors(scene);
    
    // Create target
    createTarget(scene);
    
    // Create light beam
    createLightBeam(scene);
}

// Create draggable mirrors
function createMirrors(scene) {
    console.log("Creating mirrors...");
    
    // Create 2-3 mirrors
    const mirrorCount = Phaser.Math.Between(2, 3);
    
    for (let i = 0; i < mirrorCount; i++) {
        // Position mirrors on the left side of the wall
        const x = Phaser.Math.Between(100, config.width - 300);
        const y = Phaser.Math.Between(100, config.height - 100);
        
        const mirror = scene.physics.add.image(x, y, 'mirror');
        mirror.setInteractive({ draggable: true });
        
        // Make mirror draggable
        scene.input.setDraggable(mirror);
        
        // Handle drag events
        mirror.on('drag', (pointer, dragX, dragY) => {
            mirror.x = dragX;
            mirror.y = dragY;
        });
        
        // Add to mirrors array
        mirrors.push(mirror);
    }
    
    // Set up drag events
    scene.input.on('dragstart', (pointer, gameObject) => {
        gameObject.setTint(0xffff00);
    });
    
    scene.input.on('dragend', (pointer, gameObject) => {
        gameObject.clearTint();
    });
}

// Create target for the light beam
function createTarget(scene) {
    console.log("Creating target...");
    
    // Position target on the right side of the wall
    const x = Phaser.Math.Between(config.width - 150, config.width - 50);
    const y = Phaser.Math.Between(100, config.height - 100);
    
    target = scene.physics.add.image(x, y, 'target');
    
    // Add pulsing effect
    scene.tweens.add({
        targets: target,
        scale: { from: 0.8, to: 1.2 },
        alpha: { from: 0.6, to: 1 },
        duration: 1000,
        yoyo: true,
        repeat: -1
    });
}

// Create light beam
function createLightBeam(scene) {
    console.log("Creating light beam...");
    
    // Create a light beam from the wall
    const beamX = lightWall.x - 10;
    const beamY = config.height / 2;
    
    lightBeam = scene.add.image(beamX, beamY, 'lightBeam');
    lightBeam.setOrigin(0, 0.5); // Set origin to left center
    lightBeam.setScale(0.5, 1);
    
    // Add glow effect
    scene.tweens.add({
        targets: lightBeam,
        alpha: { from: 0.7, to: 1 },
        duration: 500,
        yoyo: true,
        repeat: -1
    });
}

// Update light beam position and check for target hit
function updateLightBeam(scene) {
    if (!lightBeam || !lightWall || !target || mirrors.length === 0) return;
    
    // Find the closest mirror
    let closestMirror = null;
    let closestDistance = Infinity;
    
    for (const mirror of mirrors) {
        const distance = Phaser.Math.Distance.Between(lightWall.x, lightWall.y, mirror.x, mirror.y);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestMirror = mirror;
        }
    }
    
    if (closestMirror) {
        // Update beam to point from wall to mirror
        const angle = Phaser.Math.Angle.Between(lightWall.x, lightWall.y, closestMirror.x, closestMirror.y);
        lightBeam.rotation = angle;
        
        // Set beam length to reach the mirror
        const distance = Phaser.Math.Distance.Between(lightWall.x, lightWall.y, closestMirror.x, closestMirror.y);
        lightBeam.scaleX = distance / 100;
        
        // Check if mirror is pointing at target
        const mirrorToTargetAngle = Phaser.Math.Angle.Between(closestMirror.x, closestMirror.y, target.x, target.y);
        const mirrorToTargetDistance = Phaser.Math.Distance.Between(closestMirror.x, closestMirror.y, target.x, target.y);
        
        // Create a second beam from mirror to target direction
        if (!scene.secondBeam) {
            scene.secondBeam = scene.add.image(closestMirror.x, closestMirror.y, 'lightBeam');
            scene.secondBeam.setOrigin(0, 0.5);
            scene.secondBeam.setAlpha(0.7);
        }
        
        // Update second beam
        scene.secondBeam.x = closestMirror.x;
        scene.secondBeam.y = closestMirror.y;
        scene.secondBeam.rotation = mirrorToTargetAngle;
        scene.secondBeam.scaleX = mirrorToTargetDistance / 100;
        
        // Check if the beam hits the target
        const targetHitThreshold = 30; // Pixels of tolerance for hitting target
        if (mirrorToTargetDistance < 150 && 
            Phaser.Math.Distance.Between(
                target.x, 
                target.y, 
                closestMirror.x + Math.cos(mirrorToTargetAngle) * mirrorToTargetDistance,
                closestMirror.y + Math.sin(mirrorToTargetAngle) * mirrorToTargetDistance
            ) < targetHitThreshold) {
            
            // Target hit! Solve the puzzle
            solveLightPuzzle(scene);
        }
    }
}

// Solve the light puzzle when beam hits target
function solveLightPuzzle(scene) {
    console.log("Light puzzle solved!");
    
    // Play success sound
    if (soundManager) {
        soundManager.playSuccess();
    }
    
    // Determine reward type (70% coffee, 30% laser)
    const rewardType = Math.random() < 0.7 ? 'coffee' : 'laser';
    
    if (rewardType === 'coffee') {
        console.log("Reward: Coffee cups");
        // Spawn bonus coffee cups
        for (let i = 0; i < 3; i++) {
            const x = lightWall.x + Phaser.Math.Between(-50, 50);
            const y = Phaser.Math.Between(100, config.height - 100);
            
            const coffee = scene.coffees.create(x, y, 'coffee');
            coffee.setVelocityX(-150);
        }
    } else {
        console.log("Reward: Laser clearance");
        // Trigger laser to clear asteroids
        triggerLaserClearance(scene);
    }
    
    // Remove the wall and related objects
    cleanupLightWall(scene);
}

// Trigger laser effect to clear asteroids
function triggerLaserClearance(scene) {
    // Play laser sound
    if (soundManager) {
        soundManager.playLaser();
    }
    
    // Create laser effect
    const laser = scene.add.rectangle(config.width/2, config.height/2, config.width, 20, 0x66ffff);
    laser.setAlpha(0.8);
    
    // Add glow effect
    scene.tweens.add({
        targets: laser,
        scaleY: 5,
        alpha: 0,
        duration: 1000,
        onComplete: () => {
            laser.destroy();
        }
    });
    
    // Clear all asteroids
    scene.asteroids.clear(true, true);
}

// Clean up light wall and related objects
function cleanupLightWall(scene) {
    console.log("Cleaning up light wall...");
    
    // Remove light wall
    if (lightWall) {
        lightWall.destroy();
        lightWall = null;
    }
    
    // Remove mirrors
    mirrors.forEach(mirror => mirror.destroy());
    mirrors = [];
    
    // Remove target
    if (target) {
        target.destroy();
        target = null;
    }
    
    // Remove light beams
    if (lightBeam) {
        lightBeam.destroy();
        lightBeam = null;
    }
    
    if (scene.secondBeam) {
        scene.secondBeam.destroy();
        scene.secondBeam = null;
    }
    
    // Reset wall state
    wallActive = false;
} 