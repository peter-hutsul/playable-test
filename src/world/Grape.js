import { Object3D } from "three";
import { is, randomDirAngle, randomInt } from "utils";

export class Grape extends Object3D {

  static id = "grape"

  constructor() {
    super();
    this.form1 = app.cache.gltf.objects.scene.getObjectByName("grape_1");
    this.form2 = app.cache.gltf.objects.scene.getObjectByName("grape_2");
    this.form3 = app.cache.gltf.objects.scene.getObjectByName("grape_3");

    this.body = this.form1.clone();
    this.body.position.set(0, 0, 0);
    this.rotation.y = randomDirAngle();
    this._scale = 0.9;
    this.body.scale.set(this._scale, this._scale, this._scale);
    this.delay = randomInt(0, 1000);
    this.state = 0;

    app.timer.loop(randomInt(2000, 4000), () => {
      if (is(0.4)) {
        this.animation = app.tweens
          .add(this.scale)
          .to({
            y: [1.2, 1],
            x: [0.9, 1],
            z: [0.9, 1]
          })
          .duration(150)
          .easing(Tiny.Easing.Sinusoidal.Out)
          .start();
      }
    });

    this.add(this.body);
  }

  update(delta) {
    if (this.state === 0) {
      this.delay -= delta;
      if (this.delay <= 0) this.state = 1;
    } else if (this.state === 1) {
      this._scale += 0.00002 * delta;
      this.body.scale.set(this._scale, this._scale, this._scale);
      if (this._scale >= 1) {
        this.state = 2;
        this.remove(this.body);
        this.body = this.form2.clone();
        this.body.position.set(0, 0, 0);
        this.add(this.body);
      }
    } else if (this.state === 2) {
      this._scale += 0.00002 * delta;
      this.body.scale.set(this._scale, this._scale, this._scale);
      if (this._scale >= 1.2) {
        this.state = 3;
        this.remove(this.body);
        this.body = this.form3.clone();
        this.body.position.set(0, 0, 0);
        this.add(this.body);
      }
    }
  }
}
