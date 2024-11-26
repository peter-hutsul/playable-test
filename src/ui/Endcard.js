import { sdk } from "sdk";
import { fitToSize, PL } from "utils";
import { ChoiceButton } from "./ChoiceButton";

export class Endcard extends Tiny.Object2D {
  constructor(parent) {
    super();
    parent.add(this);

    this.visible = false;

    this.#drawButton();

    this.btnSprite.anchor.set(0.5);

    this.button = new Tiny.Object2D();
    this.button.add(this.btnSprite);
    this.button.scale.set(0.75)
    this.add(this.button);

    const text = new Tiny.Text("Get more in full game", {
      font: "bold 50pt Arial",
      fill: "#ffffff",
      align: "center",
      wordWrap: true,
      wordWrapWidth: 400
    });

    text.y = -180;
    text.anchor.set(0.5);
    this.add(text);

    const icon = new ChoiceButton("cow");
    icon.y = 20;
    icon.anchor.set(0.5);
    this.add(icon);

    this.btnText = new Tiny.Text("Download", {
      font: "bold 65pt Arial",
      fill: "#ffffff",
      align: "center"
    });

    fitToSize(this.btnText, this.btnSprite.width * 0.65, 125, true);

    this.btnText.anchor.set(0.5);
    this.btnSprite.add(this.btnText);

    app.input.add(this.btnSprite);
    this.btnSprite.input.on("down", () => {
      sdk.install();
    });

    this.offset = { y: 0 };

    this.appearTween = app.tweens.add(this.offset).to({ y: 0 }, 500).easing(Tiny.Easing.Bounce.Out);
    this.appearTween.onStart(() => {
      this.appearTween._valuesStart.y = 500;
      this.button.y = app.ui.scaledHeight / 2 - PL(150, 120) + this.offset.y;
      this.visible = true;
    });

    this.appearTween.onUpdate(() => {
      this.button.y = app.ui.scaledHeight / 2 - PL(150, 120) + this.offset.y;
    });

    this.resize();
  }

  #drawButton() {
    const g = new Tiny.Graphics();

    g.clear();
    g.beginFill("#ffffff", 1);
    g.drawRoundedRect(-355, -85, 710, 170, 35);
    g.endFill();

    g.beginFill("#44b678", 1);
    g.drawRoundedRect(-345, -75, 690, 150, 32);
    g.endFill();

    this.btnSprite = new Tiny.Sprite(g.generateTexture());
    g.destroy();
  }

  show() {
    this.appearTween.start();

    if (true) {
      var t = app.tweens.add(this.btnSprite.scale).to({ x: 1.05, y: 1.05 }, 300).yoyo(true).repeat(Infinity);

      app.timer.add(700, function () {
        t.start();
      });
    }
  }

  resize() {
    this.button.y = app.ui.scaledHeight / 2 - PL(150, 120) + this.offset.y;
  }
}
