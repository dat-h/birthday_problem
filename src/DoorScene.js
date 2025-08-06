import Phaser from 'phaser';
import ClickableObject from './ClickableObject.js';
import { GetClosestPoint } from './ClickableObject.js';
import { inventoryItemsDict } from './InventoryOverlay.js';
import GameState from './GameState.js';

import InventoryOverlay from './InventoryOverlay.js';
import DialogSystem from './DialogSystem.js';
import { doorGuardDialog } from './DialogData.js';


class DoorScene extends Phaser.Scene {
  constructor() {
    super('DoorScene');
  }

  preload() {
  }


  create() {
    const { width, height } = this.cameras.main;

    // Add background (placeholder color)
    this.cameras.main.setBackgroundColor('#000000ff'); // light blue for bathroom

    // Add and rescale background image to fit the scene (800x600), positioned at the top
    const bg = this.add.image(400, 60, 'door-bg').setOrigin(0.5, 0);
    bg.setDepth(-1000); // Ensure background is behind all objects

    // Continuously play knock animations until player clicks on the door
    let knockLoopActive = true;
    const playKnockSequence = () => {
      if (!knockLoopActive) return;
      const knock1 = this.add.sprite(440, 220, 'knock-sprite', 0);
      knock1.setDepth(100);
      knock1.anims.play('knock', true);
      knock1.on('animationcomplete', () => {
        knock1.destroy();
        const knock2 = this.add.sprite(480, 230, 'knock-sprite', 0);
        knock2.setDepth(100);
        knock2.anims.play('knock', true);
        knock2.on('animationcomplete', () => {
          knock2.destroy();
          // Add 2000ms delay before looping again
          this.time.delayedCall(2000, () => {
            playKnockSequence();
          });
        });
      });
    };
    playKnockSequence();

    this.rectTopLeft = { x: 350, y: 100 };
    this.rectBottomRight = { x: 550, y: 450 };
    const rectWidth = this.rectBottomRight.x - this.rectTopLeft.x;
    const rectHeight = this.rectBottomRight.y - this.rectTopLeft.y;

    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.strokeRect(this.rectTopLeft.x, this.rectTopLeft.y, rectWidth, rectHeight);
    graphics.setDepth(200);
    graphics.setVisible(false);
    
    // Inventory overlay utility
    this.inventoryOverlay = new InventoryOverlay(this);
    
    if( this.dialogSystem ) {
      this.dialogSystem.isActive = false;      
      this.dialogSystem.destroy();
    }

    this.input.on('pointerdown', (pointer) => {
      // Don't allow scene changes if dialog is active
      if (this.dialogSystem && this.dialogSystem.isActive) {
        return;
      }
      // Ignore if clicking in the inventory area
      if (pointer.y >= 470 && pointer.y <= 600) {
        return;
      }
      // Ignore if clicking on the menu button
      if (pointer.x <= 65 && pointer.y <= 65) {
        return;
      }      

      // Check if clicking on the door guard (the door area)
      if (pointer.x >= this.rectTopLeft.x && pointer.x <= this.rectBottomRight.x && pointer.y >= this.rectTopLeft.y && pointer.y <= this.rectBottomRight.y) {
        // Stop knock loop and start dialog system
        knockLoopActive = false;
        this.dialogSystem = new DialogSystem(this);
        this.dialogSystem.startDialog(doorGuardDialog);
        this.dialogSystem.isActive = true;
        return;
      }

      this.inventoryOverlay.setMessage('...');
      this.inventoryOverlay.selectedIndex = null;
      this.inventoryOverlay.draw();

      this.clickedObject = null;
      this.scene.start('BedroomScene');
    });
  }

  update() {

  }
}
export default DoorScene;
