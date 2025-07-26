
import Phaser from 'phaser';
import ClickableObject from './ClickableObject.js';
import { GetClosestPoint } from './ClickableObject.js';
import { inventoryItemsDict } from './InventoryOverlay.js';

import InventoryOverlay from './InventoryOverlay.js';
import DebuggingObject from './DebuggingObject.js';


class BedroomScene extends Phaser.Scene {
  constructor() {
    super('BedroomScene');
    this.DEBUG_GRAPHICS = false;
  }

  preload() {
  }

  createPlayer() {
    // Create the character sprite in the center using Arcade Physics
    this.player = this.physics.add.sprite(400, 240, 'bernard-walk', 0);
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

  createInventoryItems() {

    window.inventoryItems.push( inventoryItemsDict['batteries']);
    window.inventoryItems.push( inventoryItemsDict['punch-card']);
    window.inventoryItems.push( inventoryItemsDict['key']);
  }

  createSceneObjects() {
    // Helper to get selected inventory item
    const getSelectedInventoryItem = () => {
      const idx = this.inventoryOverlay.selectedIndex;
      if (idx === null) return null;
      return this.inventoryOverlay.getItems()[idx];
    };

    // Bed 
    this.bed = new ClickableObject(
      this, 148, 320, 296, 133, 250, 40, 'bed-sprite',
      () => {
        const selectedItem = getSelectedInventoryItem();
        if (selectedItem) {
          this.inventoryOverlay.setMessage("That doesn't work here.");
          this.inventoryOverlay.selectedIndex = null;
          this.inventoryOverlay.draw();
        } else {
          this.inventoryOverlay.setMessage("No. I just woke up");
        }
      },
      true // collides
    );
    this.bed.setBodyOffset(30, 40)

    // Under Bed
    this.underbed = new ClickableObject(
      this, 130, 380, 80, 20, 80, 20, 'invisible',
      () => {
        const selectedItem = getSelectedInventoryItem();
        if (selectedItem) {
          this.inventoryOverlay.setMessage("That doesn't work here.");
          this.inventoryOverlay.selectedIndex = null;
          this.inventoryOverlay.draw();
        } else {
          if (this.foundsock ) {
            this.inventoryOverlay.setMessage("Nothing here");
          } else {
            this.inventoryOverlay.setMessage("Ooh... I found something!");
            this.inventoryOverlay.addItem( inventoryItemsDict['dirty-sock']);
            this.foundsock = true;
          }
        }
      },
      false // collides
    );    

    // Clock
    this.clock = new ClickableObject(
      this, 370, 60, 40, 40, 5, 5, 'invisible',
      () => {
        const selectedItem = this.inventoryOverlay.selectedItem;
        if (selectedItem) {
          this.inventoryOverlay.setMessage("That doesn't work here.");
          this.inventoryOverlay.selectedIndex = null;
          this.inventoryOverlay.draw();
        } else {
          this.inventoryOverlay.setMessage("uhh.. 4:55?.. I think the clock is broken.");
        }
      },
      false // collides
    );
    this.clock.setBodyOffset(0, 120)


    // Lamp
    this.lamp = new ClickableObject(
      this, 130, 220, 40, 80, 40, 80, 'invisible',
      () => this.inventoryOverlay.setMessage("I'm afraid of the dark"),
      true // collides
    );    

    // Bathroom Door 
    this.bathroomdoor = new ClickableObject(
      this, 365, 220, 80, 180, 5, 5, 'invisible',
      () => {
        this.scene.launch('BathroomScene');
      },
      false // collides
    );

    // Mirror
    this.mirror = new ClickableObject(
      this, 180, 140, 40, 40, 5, 5, 'invisible',
      () => this.inventoryOverlay.setMessage("I can't talk to myself"),
      false // collides
    ); 
    this.mirror.setBodyOffset(0, 40)


    // Box
    this.boxLocked = true;
    this.box = new ClickableObject(
      this, 620, 270, 80, 60, 80, 60, 'invisible',
      () => {
        const selectedItem = getSelectedInventoryItem();
        if (this.boxLocked) {
          if (selectedItem && selectedItem.key === 'key') {
            // Unlock the box
            this.boxLocked = false;
            this.inventoryOverlay.setMessage("You unlocked the box! There was a note inside.");
            this.inventoryOverlay.removeItemByKey('key');
            // Optionally add a new item to inventory, e.g. note
            this.inventoryOverlay.addItem({
              key: 'note',
              message: "A mysterious note from the box.",
              actions: {}
            });
            this.inventoryOverlay.selectedIndex = null;
            this.inventoryOverlay.draw();
          } else if (selectedItem) {
            this.inventoryOverlay.setMessage("That doesn't work on the box.");
            this.inventoryOverlay.selectedIndex = null;
            this.inventoryOverlay.draw();
          } else {
            this.inventoryOverlay.setMessage("the box is locked");
          }
        } else {
          this.inventoryOverlay.setMessage("The box is already unlocked.");
        }
      },
      true // collides
    );        

    // Flashlight 
    this.flashlight = new ClickableObject(
      this, 350, 420, 60, 60, 60, 60, 'flashlight-off',
      () => {
      this.inventoryOverlay.setMessage("it's a flashlight");
      this.inventoryOverlay.addItem( inventoryItemsDict['flashlight-off']);
      // Remove flashlight from scene
      this.flashlight.sprite.destroy();
      this.clickableObjects = this.clickableObjects.filter(obj => obj !== this.flashlight);
      // this.drawInventory();
      },
      false // collides
    );        
    this.flashlight.setBodyOffset(0, 0);
    this.flashlight.sprite.setDepth( this.flashlight.sprite.y - 50 );
    // Add clickable objects
    this.clickableObjects = [];


    this.clickableObjects.push(this.flashlight);
    this.clickableObjects.push(this.bed);
    this.clickableObjects.push(this.underbed);
    this.clickableObjects.push(this.clock);
    this.clickableObjects.push(this.lamp);
    this.clickableObjects.push(this.bathroomdoor);
    this.clickableObjects.push(this.mirror);
    this.clickableObjects.push(this.box);

    // Enable collision between player and clickable objects that have collides=true
    for (const obj of this.clickableObjects) {
      if (obj.collides) {
        this.physics.add.collider(this.player, obj.sprite);
      }
    }
  }

  create() {
    this.debugGraphics = new DebuggingObject(this);

    // Add background image to fit the scene (800x600), positioned at the top
    const bg = this.add.image(400, -60, 'bedroom-bg-light').setOrigin(0.5, 0);
    bg.setDepth(-1000); // Ensure background is behind all objects
   
    this.createPlayer();    
    this.target = new Phaser.Math.Vector2(this.player.x, this.player.y);

    // Carry over inventory
    if (!window.inventoryItems) window.inventoryItems = [];
    // Inventory overlay utility
    this.inventoryOverlay = new InventoryOverlay(this);
    // this.createInventory();
    this.createInventoryItems();
    this.inventoryOverlay.draw();


    // Define the walkable floor area as a polygon (adjust points as needed)
    // Example: a trapezoid floor area
    this.floorPolygon = new Phaser.Geom.Polygon([
      { x: 0, y: 533 - 120 - 60}, // bottom left
      { x: 800, y: 533 - 120 - 60}, // bottom right
      { x: 680, y: 280 - 60 }, // top right
      { x: 120, y: 280 - 60 }  // top left
    ]);
    // this.floorGraphics.strokePoints(this.floorPolygon.points, true);
    this.debugGraphics.updateFloorGraphics( this.floorPolygon.points);

    this.createSceneObjects();
     
    // Move player to pointer on click (except clickable objects)
    this.input.on('pointerdown', (pointer) => {
      // Prevent movement if clicking inside inventory area
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
      if (!Phaser.Geom.Polygon.Contains(this.floorPolygon, pointer.x, pointer.y)) {
        const closest = GetClosestPoint(this.floorPolygon, { x: pointer.x, y: pointer.y });
        targetX = closest.x;
        targetY = closest.y;
      }
      this.target.x = targetX;
      this.target.y = targetY;
      if (targetX < this.player.x) {
        this.player.setFlipX(true);
      } else {
        this.player.setFlipX(false);
      }

      this.inventoryOverlay.setMessage('...');
      this.inventoryOverlay.selectedIndex = null;
      this.inventoryOverlay.draw();

      this.physics.moveToObject(this.player, this.target, 200);
      this.player.anims.play('walk', true);
      this.clickedObject = null;
    });
  }

  update() {
    if (this.player && this.target) {
      this.player.setDepth(this.player.y+50);
      // If the player's center is outside the floor polygon, stop movement and reset target
      if (!Phaser.Geom.Polygon.Contains(this.floorPolygon, this.player.x, this.player.y)) {
        const corrected = GetClosestPoint(this.floorPolygon, this.player);
        // Bounce the player 20 pixels further inside the polygon
        const dx = corrected.x - this.player.x;
        const dy = corrected.y - this.player.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        let bounceX = corrected.x;
        let bounceY = corrected.y;
        if (len > 0) {
          bounceX = corrected.x + (dx / len) * 10;
          bounceY = corrected.y + (dy / len) * 10;
        }
        this.player.setPosition(bounceX, bounceY);
      }

      // Stop moving when close to target
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

export default BedroomScene;
