import Phaser from 'phaser';
import ClickableObject from '../ClickableObject.js';
import InventoryOverlay from '../InventoryOverlay.js';
import DebuggingObject from '../DebuggingObject.js';

class ClosetScene extends Phaser.Scene {
  constructor() {
    super('ClosetScene');
    this.DEBUG_GRAPHICS = true;
  }

  preload() {

  }

  createPlayer() {
    // Create the character sprite in the center using Arcade Physics
    this.player = this.physics.add.sprite(400, 340, 'bernard-walk', 0); // 340
    this.player.setDepth(this.player.y);
    this.player.setCollideWorldBounds(true);

    // Set player's physics body to only cover the foot area
    // Example: width = 1/4 displayWidth, height = 1/6 displayHeight, positioned at the bottom center
    const footWidth = this.player.displayWidth / 4;
    const footHeight = this.player.displayHeight / 6;
    this.player.body.setSize(footWidth, footHeight);
    this.player.body.setOffset(
      (this.player.displayWidth - footWidth) / 2,
      (this.player.displayHeight - footHeight) /2 + 25 
    );
  }  

  createSceneObjects() {
    // Bed 
    this.door = new ClickableObject(
      this, 370, 440, 100, 40, 5, 5, 'invisible',
      () => this.inventoryOverlay.setMessage("No. I just woke up"),
      true // collides
    );
    this.door.setBodyOffset(0, -50)

    // Add clickable objects
    this.clickableObjects = [];
    this.clickableObjects.push(this.door);

    // Enable collision between player and clickable objects that have collides=true
    for (const obj of this.clickableObjects) {
      if (obj.collides) {
        this.physics.add.collider(this.player, obj.sprite);
      }
    }
  }



  create() {
    this.debugGraphics = new DebuggingObject(this);

    // Carry over inventory
    if (!GameState.inventoryItems) GameState.inventoryItems = [];

    // Add background (placeholder color)
    this.cameras.main.setBackgroundColor('#021e60ff'); // light blue for bathroom

    // Add and rescale background image to fit the scene (800x600), positioned at the top
    const bg = this.add.image(400, 60, 'bathroom-bg').setOrigin(0.5, 0);
    bg.setDepth(-1000); // Ensure background is behind all objects
    this.physics.world.setBounds(       
      180,
      250,
      450,
      150,
       true, true, true, 
      true
    );
    // Optional: debug draw the floor area
    this.worldBounds = this.add.graphics();
    this.worldBounds.setVisible(this.DEBUG_GRAPHICS);
    this.worldBounds.lineStyle(2, 0x00ff00, 1);
    this.worldBounds.strokeRect(
      180,
      250,
      450,
      150,
    );

    this.physics.world.on('collide', (player) => { 
        this.player.body.setVelocity(0, 0);
        this.player.anims.stop();
        this.player.setFrame(0); // Idle frame
    } );

    // Add player sprite (placeholder)
    this.createPlayer();
    this.target = new Phaser.Math.Vector2(this.player.x, this.player.y);

    // Inventory overlay utility
    this.inventoryOverlay = new InventoryOverlay(this);

    this.createSceneObjects();
    // Move player to pointer on click (except clickable objects)
    this.input.on('pointerdown', (pointer) => {
      if (pointer.y >= 470 && pointer.y <= 600) {
        return;
      }
      // Ignore if pointer is over any clickable object
      for (const obj of this.clickableObjects) {
        const s = obj.sprite;
        if (
          pointer.x >= s.x - s.displayWidth / 2 &&
          pointer.x <= s.x + s.displayWidth / 2 &&
          pointer.y >= s.y - s.displayHeight / 2 &&
          pointer.y <= s.y + s.displayHeight / 2
        ) {
          return;
        }
      }

      let targetX = pointer.x;
      let targetY = pointer.y;
      this.target = { x: targetX, y: targetY };
      if (targetX < this.player.x) {
        this.player.setFlipX(true);
      } else {
        this.player.setFlipX(false);
      }
      this.inventoryOverlay.setMessage('...');
      this.inventoryOverlay.selectedIndex = null;
      this.inventoryOverlay.draw();
      this.physics.moveToObject(this.player, this.target, 200);
      // No walk animation in placeholder
      this.player.anims.play('walk', true);
      
      this.clickedObject = null;
    });
  }

  update() {
    if (this.player && this.target) {
      this.player.setDepth(this.player.y + 50);
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        this.target.x, this.target.y
      );

      // Draw player's physics body for debugging
      if (this.DEBUG_GRAPHICS) {
        this.debugGraphics.updatePlayer(this.player);
        this.debugGraphics.updateTarget(this.target);
        this.debugGraphics.updateDistance(distance);
      }      
      if (distance < 50) {
        this.player.body.setVelocity(0, 0);
        this.player.anims.stop();
        this.player.setFrame(0); // Idle frame

        // Show arrival logic for clickable object
        if (this.clickedObject && typeof this.clickedObject.onArrive === 'function') {
          this.clickedObject.onArrive();
          this.clickedObject = null;
        }
      }
    }
  }
}

export default ClosetScene;
