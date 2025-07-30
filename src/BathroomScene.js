import Phaser from 'phaser';
import ClickableObject from './ClickableObject.js';
import InventoryOverlay from './InventoryOverlay.js';
import { inventoryItemsDict } from './InventoryOverlay.js';

import DebuggingObject from './DebuggingObject.js';
import GameState from './GameState.js';

class BathroomScene extends Phaser.Scene {
  constructor() {
    super('BathroomScene');
    this.DEBUG_GRAPHICS = GameState.DEBUG_GRAPHICS;
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
    // Helper to get selected inventory item
    const getSelectedInventoryItem = () => {
      const idx = this.inventoryOverlay.selectedIndex;
      if (idx === null) return null;
      return this.inventoryOverlay.getItems()[idx];
    };

    // Door 
    this.door = new ClickableObject(
      this, 370, 440, 100, 40, 5, 5, 'invisible',
      () => this.scene.start('BedroomScene'),
      false // collides
    );
    this.door.setBodyOffset(0, -50)

    this.toilet = new ClickableObject(
      this, 200, 320, 60, 80, 60, 80, 'invisible',
      () => this.scene.start('ToiletScene'),
      false // collides
    );

    this.toilettop = new ClickableObject(
      this, 220, 250, 80, 60, 80, 60, 'invisible',
      () => this.inventoryOverlay.setMessage("Hmm .. no flush"),
      false // collides
    );

    this.sink = new ClickableObject(
      this, 365, 250, 85, 40, 5, 5, 'invisible',
      () => this.inventoryOverlay.setMessage("it's a sink"),
      false // collides
    );
    this.sink.setBodyOffset(0, -50)


    this.bath = new ClickableObject(
      this, 520, 280, 150, 50, 75, 10, 'invisible',
      () => this.inventoryOverlay.setMessage("it's a bath"),
      false // collides
    );
    this.bath.setBodyOffset(-70, -80)

    this.bathroom_mirror = new ClickableObject(
      this, 365, 160, 60, 65, 5, 5, 'invisible',
      () => {
          const selectedItem = getSelectedInventoryItem();
          if (selectedItem) {
            this.inventoryOverlay.setMessage("That doesn't work here.");
            this.inventoryOverlay.selectedIndex = null;
            this.inventoryOverlay.draw();
          } else {
            if (GameState.checkedMirror) {
              this.inventoryOverlay.setMessage("Looking.. handsome.");
            } else {
              this.inventoryOverlay.setMessage("Home dentistry? Guess I'm in America.");
              this.inventoryOverlay.addItem( inventoryItemsDict['pliers']);
              GameState.checkedMirror = true;
            }
          }
      },
      false // collides
    );
    this.bathroom_mirror.setBodyOffset(0, 50)

    this.towel = new ClickableObject(
      this, 280, 190, 40,50,40,50, 'invisible',
      () => this.inventoryOverlay.setMessage("Looks.. crusty.  I'm not touching that."),
      false // collides
    );

    this.plug = new ClickableObject(
      this, 415, 205, 20,20,20,20, 'invisible',
      () => this.inventoryOverlay.setMessage("If only I had my charger.. and the cord.. and my phone."),
      false // collides
    );

    this.showerfixture = new ClickableObject(
      this, 590, 250, 40,40,5,5, 'invisible',
      () => this.inventoryOverlay.setMessage("If only I had my charger.. and the cord.. and my phone."),
      false // collides
    );
    this.showerfixture.setBodyOffset(0, -50)


    this.showerhead = new ClickableObject(
      this, 580, 125, 40,40,5,5, 'invisible',
      () => this.inventoryOverlay.setMessage("If only I had my charger.. and the cord.. and my phone."),
      false // collides
    );
    this.showerhead.setBodyOffset(0, 80)



    this.laundry_hamper = new ClickableObject(
      this, 650, 400, 140, 140, 80, 20, 'laundry-hamper',
      () => this.inventoryOverlay.setMessage("Hmm .. no flush"),
      true // collides
    );
    this.laundry_hamper.setBodyOffset(20, 40)

    // Add clickable objects
    this.clickableObjects = [];
    this.clickableObjects.push(this.door);
    this.clickableObjects.push(this.toilet);
    this.clickableObjects.push(this.toilettop);
    this.clickableObjects.push(this.sink);
    this.clickableObjects.push(this.bath);
    this.clickableObjects.push(this.bathroom_mirror);
    this.clickableObjects.push(this.towel);    
    this.clickableObjects.push(this.plug);    
    this.clickableObjects.push(this.showerfixture);
    this.clickableObjects.push(this.showerhead);

    this.clickableObjects.push(this.laundry_hamper);



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
    if (!window.inventoryItems) window.inventoryItems = [];

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

export default BathroomScene;


export class ToiletScene extends Phaser.Scene {
  constructor() {
    super('ToiletScene');
    this.DEBUG_GRAPHICS = GameState.DEBUG_GRAPHICS;
  }

  create() {
    this.debugGraphics = new DebuggingObject(this);

    // Carry over inventory
    if (!window.inventoryItems) window.inventoryItems = [];
    this.clickableObjects = [];
    // Add background (placeholder color)
    this.cameras.main.setBackgroundColor('#021e60ff'); // light blue for bathroom

    // Add and rescale background image to fit the scene (800x600), positioned at the top
    const bg = this.add.image(400, 60, 'toilet-bg').setOrigin(0.5, 0);
    bg.setDepth(-1000); // Ensure background is behind all objects

    // Inventory overlay utility
    this.inventoryOverlay = new InventoryOverlay(this);
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

      this.inventoryOverlay.setMessage('...');
      this.inventoryOverlay.selectedIndex = null;
      this.inventoryOverlay.draw();
      
      this.clickedObject = null;
      this.scene.start('BathroomScene');
    });
  }

  update() {

  }
}