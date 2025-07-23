// Returns the closest point on the edge of a polygon to a given point (expects polygon and a {x, y} object)
function GetClosestPoint(shape, point) {
  let pts;
  // If shape is a rectangle, convert to 4 points
  if (shape instanceof Phaser.Geom.Rectangle) {
    pts = [
      { x: shape.x, y: shape.y },
      { x: shape.x + shape.width, y: shape.y },
      { x: shape.x + shape.width, y: shape.y + shape.height },
      { x: shape.x, y: shape.y + shape.height }
    ];
  } else if (shape instanceof Phaser.Geom.Polygon) {
    pts = shape.points;
  } else {
    throw new Error('GetClosestPoint: shape must be Polygon or Rectangle');
  }
  let minDist = Infinity;
  let closestPoint = { x: point.x, y: point.y };
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSq = dx * dx + dy * dy;
    let t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSq;
    t = Phaser.Math.Clamp(t, 0, 1);
    const px = a.x + t * dx;
    const py = a.y + t * dy;
    const dist = Phaser.Math.Distance.Between(point.x, point.y, px, py);
    if (dist < minDist) {
      minDist = dist;
      closestPoint = { x: px, y: py };
    }
  }
  return closestPoint;
}
import Phaser from 'phaser';

// Modular class for clickable scene objects
class ClickableObject {
  setBodyOffset(offsetX, offsetY) {
    this.sprite.body.setOffset(offsetX, offsetY);
    // Update debug graphics position to match new body offset
    const body = this.sprite.body;
    this.debugGraphics.clear();
    this.debugGraphics.lineStyle(2, 0xff0000, 1);
    this.debugGraphics.strokeRect(
      body.x,
      body.y,
      body.width,
      body.height
    );
  }
  constructor(scene, x, y, displayWidth, displayHeight, bodyWidth, bodyHeight, texture = 'invisible', onArrive, collides = true) {
    this.scene = scene;
    this.sprite = scene.physics.add.staticSprite(x, y, texture);
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.displayWidth = displayWidth;
    this.sprite.displayHeight = displayHeight;
    this.sprite.body.setSize(bodyWidth, bodyHeight);
    this.sprite.body.setOffset(-bodyWidth / 2, -bodyHeight / 2);
    this.sprite.setInteractive();
    this.sprite.setDepth(y);


    // Debug graphics
    const debugColor = 0xff0000;
    this.debugGraphics = scene.add.graphics();
    this.debugGraphics.setDepth(9999);
    this.debugGraphics.setVisible(scene.DEBUG_GRAPHICS);
    this.debugGraphics.lineStyle(2, debugColor, 1);
    this.debugGraphics.strokeRect(x - bodyWidth / 2, y - bodyHeight / 2, bodyWidth, bodyHeight);

    this.onArrive = onArrive;
    this.collides = collides;

    // Pointer event
    this.sprite.on('pointerdown', (pointer) => {
      const rect = new Phaser.Geom.Rectangle(
        this.sprite.body.x,
        this.sprite.body.y,
        bodyWidth,
        bodyHeight
      );

      const closest = GetClosestPoint(rect, scene.player);
      scene.target.x = closest.x;
      scene.target.y = closest.y;
      scene.clickedObject = this;
      scene.message.setText('');
      scene.physics.moveToObject(scene.player, scene.target, 200);
      scene.player.anims.play('walk', true);
      scene.player.setFlipX(closest.x < scene.player.x);

      // Create a Graphics object (only once, ideally in create())
      const graphics = scene.add.graphics();
      // Set fill style to blue (RGB) with full opacity
      graphics.fillStyle(0x0000ff, 1);
      graphics.setVisible(scene.DEBUG_GRAPHICS);

      // Draw the rectangle
      graphics.fillRectShape(rect);

      // Fade out after 1 second
      scene.tweens.add({
        targets: graphics,
        alpha: 0,
        duration: 200,      // fade duration in ms
        delay: 50,        // wait 1 second before starting fade
        onComplete: () => graphics.destroy()
      });


    });
  }

}
// Global debug flag
const DEBUG_GRAPHICS = true;

class BedroomScene extends Phaser.Scene {
  constructor() {
    super('BedroomScene');
    this.DEBUG_GRAPHICS = true;
  }

  preload() {
    // invisible
    this.load.image('invisible', 'assets/img/1x1.png');

    // Load the background and character sprite
    this.load.image('bedroom-bg-dark', 'assets/img/background-dark-closed.png');
    this.load.image('bedroom-bg-light', 'assets/img/background-light-closed.png');
    this.load.image('flashlight-on', 'assets/img/flashlight-on.png');
    this.load.image('flashlight-off', 'assets/img/flashlight-off.png');

    this.load.spritesheet('bernard-walk', 'assets/img/bernard-sprite.png', {
      frameWidth: 156, // Adjust to your sprite's frame width
      frameHeight: 218 // Adjust to your sprite's frame height
    });
  }

  create() {
    // Debug graphics for player's physics body
    this.playerDebugGraphics = this.add.graphics();
    this.playerDebugGraphics.setDepth(9999); // Ensure it's above everything
    this.playerDebugGraphics.setVisible(DEBUG_GRAPHICS);

    // Debug text for player-target distance
    this.distanceDebugText = this.add.text(10, 10, 'Distance: 0', {
      font: '16px Arial',
      fill: '#ff0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 6, y: 2 }
    }).setOrigin(0, 0).setDepth(9999);
    this.distanceDebugText.setVisible( DEBUG_GRAPHICS);
    // Graphics for target indicator
    this.targetGraphics = this.add.graphics();
    this.targetGraphics.setDepth(9998); // Just below debug text
    this.targetGraphics.setVisible(DEBUG_GRAPHICS);

    // Add and rescale background image to fit the scene (800x600), positioned at the top
    const bg = this.add.image(400, -60, 'bedroom-bg-light').setOrigin(0.5, 0);
    bg.setDepth(-1000); // Ensure background is behind all objects

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

    // Message text for clickable interactions
    this.message = this.add.text(400, 580, '', {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 10, y: 6 },
      align: 'center'
    }).setOrigin(0.5, 1).setDepth(9999);    

    // Create walk animation (assumes right-facing walk frames 0-5)
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('bernard-walk', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
    });

    this.target = new Phaser.Math.Vector2(this.player.x, this.player.y);

    // Define the walkable floor area as a polygon (adjust points as needed)
    // Example: a trapezoid floor area
    this.floorPolygon = new Phaser.Geom.Polygon([
      { x: 0, y: 533 - 120 - 60}, // bottom left
      { x: 800, y: 533 - 120 - 60}, // bottom right
      { x: 680, y: 280 - 60 }, // top right
      { x: 120, y: 280 - 60 }  // top left
    ]);
    // Optional: debug draw the floor area
    this.floorGraphics = this.add.graphics();
    this.floorGraphics.setVisible(DEBUG_GRAPHICS);
    this.floorGraphics.lineStyle(2, 0x00ff00, 1);
    this.floorGraphics.strokePoints(this.floorPolygon.points, true);

    // Add clickable objects
    this.clickableObjects = [];
    // Bed 
    this.bed = new ClickableObject(
      this, 180, 310, 250, 40, 250, 40, 'invisible',
      () => this.message.setText("there's no time to sleep now"),
      true // collides
    );

    // Clock
    this.clock = new ClickableObject(
      this, 370, 60, 40, 40, 40, 40, 'invisible',
      () => this.message.setText("the clock is stopped"),
      false // collides
    );
    this.clock.setBodyOffset(0, 120)


    // Lamp
    this.lamp = new ClickableObject(
      this, 130, 220, 40, 80, 40, 80, 'invisible',
      () => this.message.setText("I'm afraid of the dark"),
      true // collides
    );    

    // Box
    this.box = new ClickableObject(
      this, 620, 270, 80, 60, 80, 60, 'invisible',
      () => this.message.setText("the box is locked"),
      true // collides
    );        

    // Flashlight - problem with flashlight is the target gets changed because of the border
    this.flashlight = new ClickableObject(
      this, 350, 420, 60, 60, 60, 60, 'flashlight-off',
      () => this.message.setText("it's a flashlight"),
      true // collides
    );        
    this.flashlight.setBodyOffset(0, 0)

    this.clickableObjects.push(this.flashlight);

    this.clickableObjects.push(this.bed);
    this.clickableObjects.push(this.clock);
    this.clickableObjects.push(this.lamp);
    this.clickableObjects.push(this.box);

    // Add more clickable objects here as needed

    // Enable collision between player and clickable objects that have collides=true
    for (const obj of this.clickableObjects) {
      if (obj.collides) {
        this.physics.add.collider(this.player, obj.sprite);
      }
    }

    // Move player to pointer on click (except clickable objects)
    this.input.on('pointerdown', (pointer) => {
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
      this.message.setText('');
      this.physics.moveToObject(this.player, this.target, 200);
      this.player.anims.play('walk', true);
      this.clickedObject = null;
    });
  }

  update() {

    // Draw player's physics body for debugging
    if (DEBUG_GRAPHICS) {
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
      // Set player and cube depth to their y values for layering
      this.player.setDepth(this.player.y);
      // this.cube.setDepth(this.cube.y);
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
  }
}

export default BedroomScene;
