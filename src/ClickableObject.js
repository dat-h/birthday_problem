import Phaser from 'phaser';


// Returns the closest point on the edge of a polygon to a given point (expects polygon and a {x, y} object)
export function GetClosestPoint(shape, point) {
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

      scene.inventoryOverlay.setMessage('hmm...');
      scene.physics.moveToObject(scene.player, scene.target, 200);
      if (scene.player.anims && scene.player.anims.play) {
        scene.player.anims.play('walk', true);
      }
      scene.player.setFlipX(closest.x < scene.player.x);
    });
  }
}

export default ClickableObject;
