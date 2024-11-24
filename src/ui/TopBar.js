export class TopBar extends Tiny.Object2D {
  constructor(parent) {
    super();

    const graphics = new Tiny.Graphics();
    graphics.clear();
    graphics.beginFill("#000000", 0.2);
    graphics.drawRoundedRect(0, 0, 600, 100, 30);
    graphics.endFill();

    this.bg = new Tiny.Sprite(graphics.generateTexture());
    this.add(this.bg);
    graphics.destroy();

    parent.add(this);
    this.bg.anchor.set(0.5);
  }

  resize() {
    this.y = -this.game.ui.scaledHeight / 2 + 70;
  }
}
