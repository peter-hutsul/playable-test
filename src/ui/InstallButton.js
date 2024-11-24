import { fitToSize } from "utils";
import { sdk } from "sdk";

export class InstallButton extends Tiny.Sprite {
  constructor(parent) {
    var g = new Tiny.Graphics();
    g.beginFill("#0850c0", 1);
    g.drawRoundedRect(-130, -35, 260, 85, 20);
    g.endFill();
    g.beginFill("#0969da", 1);
    g.drawRoundedRect(-130, -40, 260, 80, 20);
    g.endFill();

    super(g.generateTexture());

    g.destroy();
    parent.add(this);

    this.anchor.set(0.5);

    var text = new Tiny.Text(lang("Install").toUpperCase());
    text.anchor.set(0.5);
    text.style.font = `bold 42pt Arial`;
    text.style.fill = "#ffffff";
    text.y = 3;
    fitToSize(text, 220, 65, true);
    this.add(text);
    this.scale.set(0.9)

    this.game.input.add(this);
    this.input.on("down", (e) => {
      sdk.install();
    });
  }
}
