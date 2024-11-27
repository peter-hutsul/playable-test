import { sdk } from "sdk";
import { ChoiceButton } from "./ChoiceButton";
import { is, PL, randomInt } from "utils";

export class ChoiceBar extends Tiny.Object2D {
  buttons = [];

  constructor(parent) {
    super();
    parent.add(this);
    this.visible = false;

    const graphics = (this.graphics = new Tiny.Graphics());
    this.add(graphics);

    app.timer.loop(5000, () => {
      if (this.buttons.length > 0 && is(0.8)) {
        const random = this.buttons[randomInt(0, this.buttons.length - 1)];

        app.tweens
          .add(random)
          .to({ rotation: [0, -0.2, 0, 0.2, 0] })
          .duration(300)
          .start();
      }
    });
  }

  hideActions() {
    this.hide(() => {
      for (let button of this.buttons) {
        button.destroy();
        this.remove(button);
      }

      this.buttons.length = 0;
    });
  }

  showActions(elements) {
    for (let element of elements) {
      const button = new ChoiceButton(element.id, element.action);
      this.buttons.push(button);
      this.add(button);
    }

    this.alignButtons();
    this.show();
  }

  show() {
    this.x = PL(0, app.ui.scaledWidth / 2 + 90);
    this.y = PL(app.ui.scaledHeight / 2 + 90, 0);

    app.tweens
      .add(this)
      .to({
        x: PL(0, app.ui.scaledWidth / 2 - 90),
        y: PL(app.ui.scaledHeight / 2 - 90, 0)
      })
      .duration(250)
      .easing(Tiny.Easing.Back.Out)
      .onComplete(() => app.emit("options:show", this))
      .start();

    this.visible = true;
  }

  hide(onComplete) {
    this.x = PL(0, app.ui.scaledWidth / 2 - 90);
    this.y = PL(app.ui.scaledHeight / 2 - 90, 0);
    this.visible = true;

    app.tweens
      .add(this)
      .to({
        x: PL(0, app.ui.scaledWidth / 2 + 90),
        y: PL(app.ui.scaledHeight / 2 + 90, 0)
      })
      .duration(250)
      .easing(Tiny.Easing.Back.Out)
      .onComplete(() => {
        this.visible = false;
        onComplete();
      })
      .start();
  }

  alignButtons() {
    const center = this.children.length / 2;
    const isLandscape = sdk.landscape;

    this.graphics.clear();
    this.graphics.beginFill("#000000", 0.4);

    if (isLandscape) {
      for (let index = 0; index < this.buttons.length; index++) {
        const child = this.buttons[index];
        child.y = (-this.buttons.length + index + center) * 170;
        child.x = 0;
      }
      this.graphics.drawRoundedRect(-90, -this.buttons.length * 90, 200, this.buttons.length * 180, 30);
    } else {
      for (let index = 0; index < this.buttons.length; index++) {
        const child = this.buttons[index];
        child.x = (-this.buttons.length + index + center) * 170;
        child.y = 0;
      }
      this.graphics.drawRoundedRect(-this.buttons.length * 90, -90, this.buttons.length * 180, 200, 30);
    }

    this.graphics.endFill();
  }

  resize() {
    this.x = PL(0, app.ui.scaledWidth / 2 - 90);
    this.y = PL(app.ui.scaledHeight / 2 - 90, 0);

    this.alignButtons();
  }
}
