import { sdk } from "sdk";
import { Vector3 } from "three";

export class Opaque extends Tiny.Object2D {
  constructor(parent) {
    super();

    this.bg = new Tiny.Sprite("opaque");
    this.bg.anchor.set(0.5);
    this.bg.scale.set(2);

    app.input.add(this);

    const hand = (this.hand = new Tiny.Object2D());

    const hand_sprite = new Tiny.Sprite("hand");
    hand_sprite.rotation = -1.57;
    hand_sprite.position.x = 190;
    hand_sprite.scale.set(1.2);
    hand_sprite.anchor.set(0.5);

    hand.add(hand_sprite);

    const text = (this.text = new Tiny.Text("", {
      wordWrap: true,
      wordWrapWidth: 300,
      align: "center",
      strokeThickness: 10,
      lineSpacing: -15
    }));
    text.anchor.set(0.5);
    text.scale.set(1.5);
    text.style.font = `bold 35pt Arial`;
    text.style.fill = "#ffffff";
    text.y = -150;

    this.follow3d = false;
    this.object3d = null;
    this.object2d = null;
    this.follow2d = false;

    this.add(this.bg);
    this.add(hand);
    this.add(text);
    this.temp = new Vector3();
    parent.add(this);
    this.visible = false;

    if (true) {
      this.wiggle = app.tweens
        .add(hand_sprite.anchor)
        .to({ y: 0.3 }, 400)
        .easing(Tiny.Easing.Quadratic.InOut)
        .yoyo(true)
        .repeat(Infinity);
    }

    const dg = new Tiny.Graphics();

    dg.clear();
    dg.beginFill("#000000", 0.85);
    dg.drawRect(-1, -1, 2, 2);
    dg.endFill();

    const darker = (this.darker = new Tiny.Sprite(dg.generateTexture()));
    darker.anchor.set(0.5);
    dg.destroy();

    darker.visible = false;

    this.parent.parent.add(darker);
  }

  showWorld(object3d, text = "", hand = true, scale = 2) {
    this.hide();
    this.bg.scale.set(scale);
    this.object3d = object3d;
    this.follow3d = true;
    this.text.setText(text);
    this.text.visible = !!text;
    this.hand.visible = hand;

    if (this.wiggle) {
      this.wiggle.stop();
      this.wiggle.start();
    }

    this.visible = true;
    this.resize();
  }

  showUI(object2d, text = "", hand = true, scale = 1) {
    this.hide();
    this.bg.scale.set(scale);
    this.object2d = object2d;
    this.follow2d = true;
    this.text.setText(text);
    this.x = this.object2d.x;
    this.y = this.object2d.y;
    this.text.visible = !!text;
    this.hand.visible = hand;

    if (this.wiggle) {
      this.wiggle.stop();
      this.wiggle.start();
    }

    // let tempWasEnabled = object2d.inputEnabled;
    // if (!tempWasEnabled) app.input.add(object2d);
    // object2d.input.once("down", (e) => {
    //   object2d.inputEnabled = tempWasEnabled;
    //   this.hide();
    //   cb();
    // });

    this.visible = true;
    this.resize();
  }

  dark(delay, cb) {
    this.hide();
    if (delay) {
      this.darker.alpha = 0;
      this.darker.visible = true;
      app.tweens.add(this.darker).to({ alpha: 1 }, delay).easing(Tiny.Easing.Cubic.Out).onComplete(cb).start();
    } else {
      this.darker.visible = true;
      cb && cb();
    }
    this.resize();
  }

  resize() {
    if (this.darker.visible) {
      this.darker.width = app.ui.scaledWidth * 2;
      this.darker.height = app.ui.scaledHeight * 2;
    } else if (this.visible) {
      if (this.follow2d) {
        this.x = this.object2d.x;
        this.y = this.object2d.y;
        this.updateTextPosition();
        this.updateHandPosition();

        if (this.center) {
          this.text.x -= this.x;
          this.text.y -= this.y;
        }
      } else if (this.follow3d) {
        this.updatePosition();
      }
    }
  }

  hide() {
    if (this.visible) {
      this.object3d = null;
      this.follow3d = false;
      this.follow2d = false;
      this.object2d = null;
      this.visible = false;
      if (this.wiggle) this.wiggle.stop();
    }
  }

  updateHandPosition() {
    if (!sdk.landscape) {
      if (this.x < 0) this.hand.rotation = 0.1;
      else this.hand.rotation = 3;
    } else {
      if (this.y < 0) this.hand.rotation = 1.8;
      else this.hand.rotation = 4.6;
    }
  }

  updateTextPosition() {
    if (!sdk.landscape) {
      this.text.x = 0;
      if (this.y < 0) this.text.y = app.ui.opaque.text.height / 2 + 130;
      else this.text.y = -app.ui.opaque.text.height / 2 - 130;

      if (this.x < -150) {
        this.text.x = -(this.x + 150);
      } else if (this.x > 150) {
        this.text.x = -(this.x - 150);
      }
    } else {
      this.text.y = 0;
      if (this.x < 0) this.text.x = app.ui.opaque.text.width / 2 + 130;
      else this.text.x = -app.ui.opaque.text.width / 2 - 130;

      if (this.y < -150) {
        this.text.y = -(this.y + 150);
      } else if (this.y > 150) {
        this.text.y = -(this.y - 150);
      }
    }
  }

  updatePosition() {
    if (this.follow3d && this.visible) {
      this.temp.set(0, 0);

      this.object3d.updateMatrixWorld();

      const matrix = this.object3d.matrixWorld;
      this.temp.setFromMatrixPosition(matrix);

      this.temp.project(app.camera);
      this.x = (this.temp.x * app.ui.scaledWidth) / 2;
      this.y = (-this.temp.y * app.ui.scaledHeight) / 2;

      this.updateTextPosition();
      this.updateHandPosition();

      if (this.center) {
        this.text.x -= this.x;
        this.text.y -= this.y;
      }
    }
  }
}
