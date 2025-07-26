import Phaser from 'phaser';

/**
 * InventoryOverlay handles inventory UI, state, and messaging for all scenes.
 * Usage: new InventoryOverlay(scene, { x, y, width, height })
 */
class InventoryOverlay {
  constructor(scene, opts = {}) {
    this.scene = scene;
    this.x = opts.x ?? 0;
    this.y = opts.y ?? 470;
    this.width = opts.width ?? 800;
    this.height = opts.height ?? 130;
    this.iconSize = opts.iconSize ?? 64;
    this.padding = opts.padding ?? 24;
    this.itemsPerRow = opts.itemsPerRow ?? 5;
    this.depth = opts.depth ?? 10000;
    this.inventoryItems = window.inventoryItems ?? [];
    window.inventoryItems = this.inventoryItems; // ensure global
    this.selectedIndex = null;
    this.selectedItem = null;
    this.iconSprites = [];


    // Add Bernard's face sprite at (0, 500)
    this.bernardFace = this.scene.add.image(5, 530, 'bernard-face')
      .setOrigin(0, 0.5)
      .setDepth(10001);


    this.messageText = this.scene.add.text(
      this.x + 100,
      this.y + 60,
      '...',
      {
        font: '24px Arial',
        fill: '#fff',
        backgroundColor: 'rgba(0,0,0,1)',
        padding: { x: 10, y: 6 },
        align: 'left',
        wordWrap: { width: 200, useAdvancedWrap: true },
        depth: this.depth + 1
      }
    ).setOrigin(0, 0.5).setDepth(this.depth + 1);
    // this.messageText.setVisible(false);
    this._drawOverlay();
    this.draw();
  }

  _drawOverlay() {
    if (this.bg) this.bg.destroy();
    this.bg = this.scene.add.graphics();
    this.bg.setDepth(this.depth);
    this.bg.fillStyle(0x000000, 0.55);
    this.bg.fillRect(this.x, this.y, this.width, this.height);
    this.bg.lineStyle(3, 0xffffff, 1);
    this.bg.strokeRect(this.x, this.y, this.width, this.height);
    this.bg.setScrollFactor(0);
   
  }

  addItem(item) {
    this.inventoryItems.push(item);
    window.inventoryItems = this.inventoryItems;
    this.draw();
  }

  removeItemByKey(key) {
    this.inventoryItems = this.inventoryItems.filter(i => i.key !== key);
    window.inventoryItems = this.inventoryItems;
    this.draw();
  }

  getItems() {
    return this.inventoryItems;
  }

  setMessage(msg) {
    this.messageText.setText(msg);
  }

  draw() {
    for (const s of this.iconSprites) s.destroy();
    this.iconSprites = [];
    const items = this.inventoryItems;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const row = Math.floor(i / this.itemsPerRow);
      const col = i % this.itemsPerRow;
      const x = this.x + 375 + col * (this.iconSize + this.padding);
      const y = this.y + 30 + row * (this.iconSize);
      const sprite = this.scene.add.image(x, y, item.key)
        .setDisplaySize(this.iconSize, this.iconSize)
        .setDepth(this.depth + 1)
        .setInteractive({ useHandCursor: true });
      sprite.tintFill = true;
      if (this.selectedIndex === i) {
        sprite.setTint(0x0000ff);
      } else {
        sprite.clearTint();
      }
      sprite.on('pointerdown', () => {
        if (this.selectedIndex !== null && this.selectedIndex !== i) {
          this.selectedItem = items[this.selectedIndex];
          const selectedItem = items[this.selectedIndex];
          let combineAction = selectedItem.actions?.combine?.[item.key];
          if (!combineAction) {
            combineAction = item.actions?.combine?.[selectedItem.key];
          }
          if (combineAction) {
            // Remove both items, add result
            this.inventoryItems = items.filter((_, idx) => idx !== this.selectedIndex && idx !== i);
            this.inventoryItems.push({
              key: combineAction.result,
              message: combineAction.message,
              actions: {}
            });
            window.inventoryItems = this.inventoryItems;
            this.selectedIndex = null;
            this.setMessage(combineAction.message);
            this.draw();
          } else {
            this.setMessage("Those don't go together!");
            this.selectedIndex = null;
            this.draw();
          }
        } else {
          this.selectedIndex = i;
          this.draw();
        }
      });
      sprite.on('pointerup', (pointer) => {
        if (pointer.getDuration() < 300 && pointer.downElement === pointer.upElement) {
          if (pointer.event.detail === 2) {
            this.setMessage(item.message);
          }
        }
      });
      this.iconSprites.push(sprite);
    }
  }

  destroy() {
    if (this.bg) this.bg.destroy();
    for (const s of this.iconSprites) s.destroy();
    this.messageText.destroy();
  }
}

export default InventoryOverlay;

export const inventoryItemsDict = {
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
      },
      'key': {
        key: 'key',
        message: "Where does this key go?",
        actions: {}
      }
    };