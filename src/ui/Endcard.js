import { sdk } from "sdk";
import { fitToSize, PL } from "utils";

export class Endcard extends Tiny.Object2D {
  constructor(parent) {
    super();

    parent.add(this);
    this.visible = false;

    this._draw_bg();

    this.btn.anchor.set(0.5);

    this.button = new Tiny.Object2D();
    this.button.add(this.btn);
    this.add(this.button);

    this.btn_text = new Tiny.Text("Download", {
      font: "bold 65pt Arial",
      fill: "#ffffff",
      align: "center"
    });

    fitToSize(this.btn_text, this.btn.width * 0.65, 125, true);

    this.btn_text.anchor.set(0.5);
    this.btn.add(this.btn_text);

    this.game.input.add(this.btn);
    this.btn.input.on("down", () => {
      sdk.install();
    });

    this.offset = { y: 0 };

    this.appearTween = this.game.tweens.add(this.offset).to({ y: 0 }, 500).easing(Tiny.Easing.Bounce.Out);
    this.appearTween.onStart(() => {
      this.appearTween._valuesStart.y = 500;
      this.button.y = this.game.ui.scaledHeight / 2 - 150 + this.offset.y;
      this.visible = true;
    });

    this.appearTween.onUpdate(() => {
      this.button.y = this.game.ui.scaledHeight / 2 - 150 + this.offset.y;
    });

    this.resize();
  }

  _draw_bg() {
    var g = new Tiny.Graphics();

    g.clear();
    g.beginFill("#ffffff", 1);
    g.drawRoundedRect(-355, -85, 710, 170, 35);
    g.endFill();

    g.beginFill("#4986e8", 1);
    g.drawRoundedRect(-345, -75, 690, 150, 35);
    g.endFill();

    this.btn = new Tiny.Sprite(g.generateTexture());
    g.destroy();
  }

  show() {
    this.appearTween.start();

    if (true) {
      var t = this.game.tweens.add(this.btn.scale).to({ x: 1.05, y: 1.05 }, 300).yoyo(true).repeat(Infinity);

      this.game.timer.add(700, function () {
        t.start();
      });
    }
  }

  resize() {
    this.button.scale.set(PL(0.8, 0.75));
    this.button.y = this.game.ui.scaledHeight / 2 - 150 + this.offset.y;
  }
}
