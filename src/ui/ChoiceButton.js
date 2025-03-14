import { randomInt } from "utils";

export class ChoiceButton extends Tiny.Sprite {
  constructor(key, action) {
    var g = new Tiny.Graphics();
    g.beginFill("#909090", 1);
    g.drawRoundedRect(-95, -95, 205, 205, 30);
    g.endFill();
    g.beginFill("#ffffff", 1);
    g.drawRoundedRect(-100, -100, 200, 200, 30);
    g.endFill();

    super(g.generateTexture());

    g.destroy();

    this.anchor.set(0.5);

    const icon = new Tiny.Sprite(key);
    icon.anchor.set(0.5);
    icon.scale.set(0.6);
    this.add(icon);

    this.scale.set(0.7);

    if (action) {
      app.input.add(this);
      this.input.on("down", () => {
        app.sound.play("click");
        action();
      });
    }

    this.animation = app.tweens
      .add(this.scale)
      .to({
        x: 0.72,
        y: 0.72
      })
      .duration(800)
      .repeat(Infinity)
      .yoyo(true)
      .repeatDelay(0)
      .delay(randomInt(200, 4000))
      .easing(Tiny.Easing.Sinusoidal.Out)
      .start(randomInt(200, 4000));
  }

  destroy() {
    super.destroy();
    app.tweens.remove(this.animation);
  }
}
