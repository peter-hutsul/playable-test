import { Vector3 } from "three";

export default class Opaque extends Tiny.Object2D {
  constructor(parent) {
    super();

    this.bg = new Tiny.Sprite("opaque");
    this.bg.anchor.set(0.5);
    this.bg.scale.set(2);

    this.game.input.add(this);

    var hand = (this.hand = new Tiny.Object2D());

    var hand_sprite = new Tiny.Sprite("hand");
    hand_sprite.rotation = -1.57;
    hand_sprite.position.x = 190;
    hand_sprite.scale.set(1.5);
    hand_sprite.anchor.set(0.5);

    hand.add(hand_sprite);

    var text = (this.text = new Tiny.Text("", {
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
      this.wiggle = this.tweens
        .add(hand_sprite.anchor)
        .to({ y: 0.3 }, 400)
        .easing(Tiny.Easing.Quadratic.InOut)
        .yoyo(true)
        .repeat(Infinity);
    }

    var dg = new Tiny.Graphics();

    dg.clear();
    dg.beginFill("#000000", 0.85);
    dg.drawRect(-1, -1, 2, 2);
    dg.endFill();

    var darker = (this.darker = new Tiny.Sprite(dg.generateTexture()));
    darker.anchor.set(0.5);
    dg.destroy();

    darker.visible = false;

    this.parent.parent.add(darker);
  }

  opaque3D(object3d, text = "", scale = 2) {
    this.hide();
    this.bg.scale.set(scale);
    this.object3d = object3d;
    this.follow3d = true;
    this.text.setText(text);

    if (this.wiggle) {
      this.wiggle.stop();
      this.wiggle.start();
    }
    //  this.hand.rotation = Tiny.Math.degToRad(hand_angle)

    this.visible = true;
    this.resize();
  }

  opaque2D(object2d, text, scale, cb = () => {}) {
    this.hide();
    this.bg.scale.set(scale);
    this.object2d = object2d;
    this.follow2d = true;
    this.text.setText(text);
    this.x = this.object2d.x;
    this.y = this.object2d.y;

    if (this.wiggle) {
      this.wiggle.stop();
      this.wiggle.start();
    }

    this.input.on("down", (e) => {
      if (this.game.input._active_objects.includes(this.object2d)) {
        this.object2d.input.emit("down");
        this.hide();
        cb();
      }
      e.stopPropagation();
    });

    this.visible = true;
    this.resize();
  }

  dark(delay, cb) {
    this.hide();
    if (delay) {
      this.darker.alpha = 0;
      this.darker.visible = true;
      this.tweens.add(this.darker).to({ alpha: 1 }, delay).easing(Tiny.Easing.Cubic.Out).onComplete(cb).start();
    } else {
      this.darker.visible = true;
      cb && cb();
    }
    this.resize();
  }

  resize() {
    if (this.darker.visible) {
      this.darker.width = this.game.ui.scaledWidth * 2;
      this.darker.height = this.game.ui.scaledHeight * 2;
    } else if (this.visible) {
      if (this.follow2d) {
        this.x = this.object2d.x;
        this.y = this.object2d.y;
        this.updateTextPos();
        this.updateHandPos();

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
      this.input.removeAllListeners("down");
      if (this.wiggle) this.wiggle.stop();
    }
  }

  updateHandPos() {
    if (!this.game.parent.isLandscape) {
      if (this.x < 0) this.hand.rotation = 0.1;
      else this.hand.rotation = 3;
    } else {
      if (this.y < 0) this.hand.rotation = 1.8;
      else this.hand.rotation = 4.6;
    }
  }

  updateTextPos() {
    if (!this.game.parent.isLandscape) {
      this.text.x = 0;
      if (this.y < 0) this.text.y = game.ui.opaque.text.height / 2 + 130;
      else this.text.y = -game.ui.opaque.text.height / 2 - 130;

      if (this.x < -150) {
        this.text.x = -(this.x + 150);
      } else if (this.x > 150) {
        this.text.x = -(this.x - 150);
      }
    } else {
      this.text.y = 0;
      if (this.x < 0) this.text.x = game.ui.opaque.text.width / 2 + 130;
      else this.text.x = -game.ui.opaque.text.width / 2 - 130;

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

      var m = this.object3d.matrixWorld;
      this.temp.setFromMatrixPosition(m);

      this.temp.project(this.game.parent.camera);
      this.x = (this.temp.x * this.game.ui.scaledWidth) / 2;
      this.y = (-this.temp.y * this.game.ui.scaledHeight) / 2;

      this.updateTextPos();
      this.updateHandPos();

      if (this.center) {
        this.text.x -= this.x;
        this.text.y -= this.y;
      }
    }
  }
}
