import { Mesh, MeshBasicMaterial, Object3D, Sprite, SpriteMaterial, Vector3 } from "three";
import { is } from "utils";

export class Placeholder extends Mesh {
  constructor() {
    const placeholder = app.cache.mesh3d["objects.placeholder"];

    super(placeholder.geometry, placeholder.material);
    this.material.transparent = true;

    this.scale.set(0.9, 0.9, 0.9);

    this.addButton = new PlusButton();
    this.addButton.position.y = 5;

    this.add(this.addButton);

    app.input.add3d(this, {
      hitBox: new Vector3(4, 12, 4)
    });

    this.input.on("down", () => {
      app.sound.play('click');
      app.emit("cell:click", this);
      app.tweens.remove(this.animation2);

      app.tweens
      .add(this.addButton.scale)
      .to({ x: 0, y: 0, z: 0 })
      .duration(100)
      .easing(Tiny.Easing.Back.In)
      .start();
    });

    this.material.opacity = 0.9;
    this.animation = app.tweens
      .add(this.material)
      .to({ opacity: 0.4 })
      .duration(600)
      .repeat(Infinity)
      .yoyo(true)
      .start();

    this.animation2 = app.tweens
      .add(this.addButton.position)
      .to({ y: 5.4 })
      .duration(900)
      .repeat(Infinity)
      .yoyo(true)
      .start();
  }

  destroy() {
    app.tweens.remove(this.animation);
    app.tweens.remove(this.animation2);
    this.addButton.destroy();
  }
}

class PlusButton extends Sprite {
  constructor() {
    const map = app.cache.texture3d["plus"];
    // map.encoding = sRGBEncoding;
    map.flipY = true;

    super(new SpriteMaterial({ map, transparent: true }));
    this.scale.set(3, 3, 3);

    this.animation = app.timer.loop(2000, () => {
      if (is(0.8)) {
        app.tweens
          .add(this.material.map.offset)
          .to({ y: [0, -0.1, 0] })
          .duration(300)
          .delay(600)
          .start();
      }

      if (is(0.6)) {
        app.tweens
          .add(this.material.map)
          .to({ rotation: [0, -0.1, 0, 0.1, -0.1, 0] })
          .duration(500)
          .start();
      }
    });
  }

  destroy() {
    this.animation.stop();
    app.timer.remove(this.animation);
  }
}

// this.material.onBeforeCompile = (shader) => {
//   shader.uniforms.time = timeUniform;
//   shader.uniforms.visibility = visibleUniform;
//   shader.vertexShader = vertextShader;
//   shader.fragmentShader = fragmentShader;
// };

// static visible(val) {
//   visibleUniform.value = val;
// }
