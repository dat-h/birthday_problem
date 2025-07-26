import Phaser from 'phaser';

class DebuggingObject {
  constructor(scene) {
    // Debug graphics for player's physics body
    this.scene = scene;
    this.playerDebugGraphics = scene.add.graphics();
    this.playerDebugGraphics.setDepth(9999); // Ensure it's above everything
    this.playerDebugGraphics.setVisible(scene.DEBUG_GRAPHICS);

    // Debug text for player-target distance
    this.distanceDebugText = scene.add.text(10, 10, 'Distance: 0', {
      font: '16px Arial',
      fill: '#ff0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 6, y: 2 }
    }).setOrigin(0, 0).setDepth(9999);
    this.distanceDebugText.setVisible( scene.DEBUG_GRAPHICS);

    // Graphics for target indicator
    this.targetGraphics = scene.add.graphics();
    this.targetGraphics.setDepth(9998); // Just below debug text
    this.targetGraphics.setVisible(scene.DEBUG_GRAPHICS);

    // Optional: debug draw the floor area
    this.floorGraphics = scene.add.graphics();
    this.floorGraphics.setVisible(scene.DEBUG_GRAPHICS);
    this.floorGraphics.lineStyle(2, 0x00ff00, 1);
  }

  updatePlayer( player ) {
      this.playerDebugGraphics.clear();
      this.playerDebugGraphics.lineStyle(2, 0xff00ff, 1);
      const body = player.body;
      if (body) {
        this.playerDebugGraphics.strokeRect(
          body.x,
          body.y,
          body.width,
          body.height
        );
      }
  }

  updateFloorGraphics( points ) {
    this.floorGraphics.strokePoints(points, true);
  }


  updateDistance( distance ) { 
        this.distanceDebugText.setText(`Distance: ${distance.toFixed(2)}`);    
  }

  updateTarget( target ) {
        this.targetGraphics.clear();
        this.targetGraphics.lineStyle(2, 0xffff00, 1);
        this.targetGraphics.strokeCircle(target.x, target.y, 16);
        this.targetGraphics.fillStyle(0xffff00, 0.3);
        this.targetGraphics.fillCircle(target.x, target.y, 8);
  }
}

export default DebuggingObject;