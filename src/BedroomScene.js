
import Phaser from 'phaser';
import ClickableObject from './ClickableObject.js';
import { GetClosestPoint } from './ClickableObject.js';
import InventoryOverlay from './InventoryOverlay.js';


class BedroomScene extends Phaser.Scene {
  constructor() {
    super('BedroomScene');
    this.DEBUG_GRAPHICS = true;
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

  createInventory() {
    // Add Bernard's face sprite at (0, 500)
    this.bernardFace = this.add.image(5, 530, 'bernard-face')
      .setOrigin(0, 0.5)
      .setDepth(10001);

    // Message text for clickable interactions (word wrap, max width 500)
    this.message = this.add.text(100, 530, '...', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: 'rgba(0,0,0,1)',
      padding: { x: 10, y: 6 },
      align: 'left',
      wordWrap: { width: 200, useAdvancedWrap: true }
    }).setOrigin(0, 0.5).setDepth(20000);


    // Add the inventory 
    // Inventory overlay setup
    if (!window.inventoryItems) window.inventoryItems = [];
    // Example inventory item objects


    this.inventoryOverlay = this.add.graphics();
    this.inventoryOverlay.setDepth(10000);
    this.inventoryOverlay.fillStyle(0x000000, 0.55);
    this.inventoryOverlay.fillRect(0, 470, 800, 130);
    this.inventoryOverlay.lineStyle(3, 0xffffff, 1);
    this.inventoryOverlay.strokeRect(0, 470, 800, 130);
    this.inventoryOverlay.setScrollFactor(0);

    // Inventory item icons
    this.inventoryIconSprites = [ ];
    this.selectedInventoryIndex = null;
    this.inventoryMessageText = this.add.text(400, 390, '', {
      font: '20px Arial',
      fill: '#fff',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 10, y: 6 },
      align: 'center'
    }).setOrigin(0.5, 1).setDepth(10001);
    this.inventoryMessageText.setVisible(false);
  }
  
  createInventoryItems() {
        this.inventoryItemsDict = {
      'flashlight-off': {
        key: 'flashlight-off',
        message: "It's a flashlight.",
        actions: {
          combine: {
            'batteries': { result: 'flashlight-on', message: 'You put the batteries in the flashlight.' }
          }
        }
      },
      'batteries': {
        key: 'batteries',
        message: "A pair of batteries.",
        actions: {
          combine: {
            'flashlight-off': { result: 'flashlight-on', message: 'You put the batteries in the flashlight.' }
          }
        }
      },
      'dirty-sock': {
        key: 'dirty-sock',
        message: "A dirty sock. Gross!",
        actions: {}
      },
      'punch-card': {
        key: 'punch-card',
        message: "A punch card",
        actions: {}
      }      
    };
    window.inventoryItems.push( this.inventoryItemsDict['batteries']);
    window.inventoryItems.push( this.inventoryItemsDict['punch-card']);
  }

  createSceneObjects() {

    // Bed 
    this.bed = new ClickableObject(
      this, 148, 320, 296, 133, 250, 40, 'bed-sprite',
      () => this.inventoryOverlay.setMessage("No. I just woke up"),
      true // collides
    );
    this.bed.setBodyOffset(30, 40)

   // Under Bed
    this.underbed = new ClickableObject(
      this, 130, 380, 80, 20, 80, 20, 'invisible',
      () => {
        if (this.foundsock ) {
          this.inventoryOverlay.setMessage("Nothing here");
        } else {
          this.inventoryOverlay.setMessage("Ooh... I found something!");
          window.inventoryItems.push(this.inventoryItemsDict['dirty-sock']);
          // this.drawInventory();
          this.foundsock = true;
        }
      },
      false // collides
    );    

    // Clock
    this.clock = new ClickableObject(
      this, 370, 60, 40, 40, 5, 5, 'invisible',
      () => this.inventoryOverlay.setMessage("uhh.. 4:55?.. I think the clock is broken."),
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
    this.box = new ClickableObject(
      this, 620, 270, 80, 60, 80, 60, 'invisible',
      () => this.inventoryOverlay.setMessage("the box is locked"),
      true // collides
    );        

    // Flashlight 
    this.flashlight = new ClickableObject(
      this, 350, 340, 60, 60, 60, 60, 'flashlight-off',
      () => {
      this.inventoryOverlay.setMessage("it's a flashlight");
      window.inventoryItems.push(this.inventoryItemsDict['flashlight-off']);
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
    this.createDebugGraphics();

    // Add background image to fit the scene (800x600), positioned at the top
    const bg = this.add.image(400, -60, 'bedroom-bg-light').setOrigin(0.5, 0);
    bg.setDepth(-1000); // Ensure background is behind all objects
   
    this.createPlayer();    
    this.target = new Phaser.Math.Vector2(this.player.x, this.player.y);


    // Inventory overlay utility
    this.inventoryOverlay = new InventoryOverlay(this);
    // this.createInventory();
    this.createInventoryItems();

    // Define the walkable floor area as a polygon (adjust points as needed)
    // Example: a trapezoid floor area
    this.floorPolygon = new Phaser.Geom.Polygon([
      { x: 0, y: 533 - 120 - 60}, // bottom left
      { x: 800, y: 533 - 120 - 60}, // bottom right
      { x: 680, y: 280 - 60 }, // top right
      { x: 120, y: 280 - 60 }  // top left
    ]);
    this.floorGraphics.strokePoints(this.floorPolygon.points, true);

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

    // Draw player's physics body for debugging
    if (this.DEBUG_GRAPHICS) {
      this.playerDebugGraphics.clear();
      this.playerDebugGraphics.lineStyle(2, 0xff00ff, 1);
      const body = this.player.body;
      if (body) {
        this.playerDebugGraphics.strokeRect(
          body.x,
          body.y,
          body.width,
          body.height
        );
      }
    }
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
      // Update debug text
      if (this.distanceDebugText) {
        this.distanceDebugText.setText(`Distance: ${distance.toFixed(2)}`);
      }
      // Draw yellow circle at target position
      if (this.targetGraphics) {
        this.targetGraphics.clear();
        this.targetGraphics.lineStyle(2, 0xffff00, 1);
        this.targetGraphics.strokeCircle(this.target.x, this.target.y, 16);
        this.targetGraphics.fillStyle(0xffff00, 0.3);
        this.targetGraphics.fillCircle(this.target.x, this.target.y, 8);
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
    this.inventoryOverlay.draw();


    // Redraw inventory if items changed (simple check)
    // if (window.inventoryItems && this.inventoryIconSprites.length !== window.inventoryItems.length) {
    //   this.drawInventory();
    // }
  }

//   drawInventory() {
//     // Remove old icons
//     for (const s of this.inventoryIconSprites) s.destroy();
//     this.inventoryIconSprites = [];
//     const items = window.inventoryItems;
//     const iconSize = 64;
//     const padding = 24;
//     const itemsPerRow = 5;
//     const startX = 375;
//     const startY = 500;
//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];
//       const row = Math.floor(i / itemsPerRow);
//       const col = i % itemsPerRow;
//       const x = startX + col * (iconSize + padding);
//       const y = startY + row * (iconSize);

//       // Draw item icon
//       const sprite = this.add.image(x, y, item.key)
//         .setDisplaySize(iconSize, iconSize)
//         .setDepth(10001)
//         .setInteractive({ useHandCursor: true });

//       // Highlight if selected
//       sprite.tintFill = true;
//       if (this.selectedInventoryIndex === i) {
//         sprite.setTint(0x0000ff);
//       } else {
//         sprite.clearTint();
//       }
//       // Single click: select/highlight or combine
//       sprite.on('pointerdown', () => {
//         if (this.selectedInventoryIndex !== null && this.selectedInventoryIndex !== i) {
//           // Try to combine selected item with this one
//           const selectedItem = items[this.selectedInventoryIndex];
//           let combineAction = selectedItem.actions?.combine?.[item.key];
//           if (!combineAction) {
//             combineAction = item.actions?.combine?.[selectedItem.key];
//           }
//           if (combineAction) {
//             // Remove both items, add result
//             window.inventoryItems = items.filter((_, idx) => idx !== this.selectedInventoryIndex && idx !== i);
//             window.inventoryItems.push({
//               key: combineAction.result,
//               message: combineAction.message,
//               actions: {} // Could be extended for more combos
//             });
//             this.selectedInventoryIndex = null;
//             this.message.setText(combineAction.message);
//             this.drawInventory();
//           } else {
//             // Invalid combination
//             this.message.setText("Those don't go together!");
//             this.selectedInventoryIndex = null;
//             this.drawInventory();
//           }
//         } else {
//           // Just select/highlight
//           this.selectedInventoryIndex = i;
//           this.drawInventory();
//         }
//       });
//       // Double click: show message
//       sprite.on('pointerup', (pointer) => {
//         if (pointer.getDuration() < 300 && pointer.downElement === pointer.upElement) {
//           if (pointer.event.detail === 2) {
//             this.message.setText(item.message);
//             // this.message.setVisible(true);
//             // this.time.delayedCall(1500, () => {
//             //   this.inventoryMessageText.setVisible(false);
//             // });
//           }
//         }
//       });
//       this.inventoryIconSprites.push(sprite);
//     }
//   }

}

export default BedroomScene;
