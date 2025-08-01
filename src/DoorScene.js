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

    // Initialize dialog system
    this.dialogSystem = new DialogSystem(this);
    this.dialogSystem.startDialog(doorGuardDialog);
    this.dialogSystem.isActive = true;


    // Add visual representation of the guard (you can replace with actual sprite)
    this.guardSprite = this.add.rectangle(400, 300, 60, 100, 0x8B4513)
      .setDepth(100);
    this.guardText = this.add.text(400, 250, 'Door Guard', {
      font: '14px Arial',
      fill: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(101);

    // Inventory overlay utility
    this.inventoryOverlay = new InventoryOverlay(this);
    
    this.input.on('pointerdown', (pointer) => {
      // Don't allow scene changes if dialog is active
      if (this.dialogSystem.isActive) {
        return;
      }
      
      if (pointer.y >= 470 && pointer.y <= 600) {
        return;
      }

      // Check if clicking on the door guard
      if (pointer.x >= 360 && pointer.x <= 440 && pointer.y >= 240 && pointer.y <= 360) {
        return; // Let the ClickableObject handle it
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
