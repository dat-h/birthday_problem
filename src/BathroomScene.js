import Phaser from 'phaser';
import ClickableObject from './ClickableObject.js';
import InventoryOverlay from './InventoryOverlay.js';

class BathroomScene extends Phaser.Scene {
  constructor() {
    super('BathroomScene');
    this.DEBUG_GRAPHICS = false;
  }

  preload() {

  }

  createDebugGraphics() {
    // Debug graphics for player's physics body
    this.playerDebugGraphics = this.add.graphics();
    this.playerDebugGraphics.setDepth(9999); // Ensure it's above everything
    this.playerDebugGraphics.setVisible(this.DEBUG_GRAPHICS);

    // Debug text for player-target distance
    this.distanceDebugText = this.add.text(10, 10, 'Distance: 0', {
      font: '16px Arial',
      fill: '#ff0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 6, y: 2 }
    }).setOrigin(0, 0).setDepth(9999);
    this.distanceDebugText.setVisible( this.DEBUG_GRAPHICS);

    // Graphics for target indicator
    this.targetGraphics = this.add.graphics();
    this.targetGraphics.setDepth(9998); // Just below debug text
    this.targetGraphics.setVisible(this.DEBUG_GRAPHICS);

    // Optional: debug draw the floor area
    this.floorGraphics = this.add.graphics();
    this.floorGraphics.setVisible(this.DEBUG_GRAPHICS);
    this.floorGraphics.lineStyle(2, 0x00ff00, 1);
  }

  createSceneObjects() {

    // Bed 
    this.bed = new ClickableObject(
      this, 148, 320, 296, 133, 250, 40, 'bed-sprite',
      () => this.inventoryOverlay.setMessage("No. I just woke up"),
      true // collides
    );
    this.bed.setBodyOffset(30, 40)

    // Add clickable objects
    this.clickableObjects = [];
    this.clickableObjects.push(this.bed);

    // Enable collision between player and clickable objects that have collides=true
    for (const obj of this.clickableObjects) {
      if (obj.collides) {
        this.physics.add.collider(this.player, obj.sprite);
      }
    }
  }



  create() {
    this.createDebugGraphics();

    // Carry over inventory
    if (!window.inventoryItems) window.inventoryItems = [];

    // Add background (placeholder color)
    this.cameras.main.setBackgroundColor('#021e60ff'); // light blue for bathroom

    // Add and rescale background image to fit the scene (800x600), positioned at the top
    const bg = this.add.image(400, 60, 'bathroom-bg').setOrigin(0.5, 0);
    bg.setDepth(-1000); // Ensure background is behind all objects

    // Add placeholder sink in the middle
    this.sink = new ClickableObject(
      this,
      400, 300, // center of 800x600
      120, 60, 100, 40, 'invisible',
      () => this.inventoryOverlay.setMessage("It's a sink. Nothing interesting here."),
      false // collides
    );

    // Add player sprite (placeholder)

    this.player = this.physics.add.sprite(400, 240, 'bernard-walk', 0);
    this.player.setDepth(this.player.y);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(40, 40);
    this.player.body.setOffset(-20, -20);

    // Inventory overlay utility
    this.inventoryOverlay = new InventoryOverlay(this);

    // Move player to pointer on click (except clickable objects)
    this.input.on('pointerdown', (pointer) => {
      if (pointer.y >= 470 && pointer.y <= 600) {
        return;
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

export default BathroomScene;
