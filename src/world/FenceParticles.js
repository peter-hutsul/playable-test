import { BufferAttribute, BufferGeometry, Color, Float32BufferAttribute, Points, Vector3 } from "three";
import { random } from "utils";
import { SmokeMaterial } from "./GroundParticles";

const temp = new Vector3();
let material;

export class FenceParticles extends Points {
  constructor(capacity = 60, color = 0xffffff) {
    if (!material) {
      material = new SmokeMaterial({
        size: 120,
        map: app.cache.texture3d.smoke
      });
    }

    var geometry = new BufferGeometry();
    super(geometry, material);
    this.material.uniforms.size.value = 120;

    this._capacity = capacity;

    this.speeds = new Array(capacity);
    this.speedsY = new Array(capacity);
    this.radiuses = new Array(capacity);
    this.angles = new Array(capacity);

    let colors = new Float32Array(capacity * 3);

    let tempColor = new Color(color);
    let hsl = {};
    tempColor.getHSL(hsl);

    for (let i = 0; i < capacity; i++) {
      tempColor.setHSL(hsl.h, hsl.s, random(hsl.l - 0.2, hsl.l));

      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    this.geometry.setAttribute("position", new Float32BufferAttribute(capacity * 3, 3));
    this.geometry.setAttribute("acolor", new BufferAttribute(colors, 3));

    for (let i = 0; i < capacity; i++) {
      this.angles[i] = random(0, 360);
      this.radiuses[i] = random(0, 0.3);
      this.speeds[i] = random(1, 3);
      this.speedsY[i] = random(1, 1.5);

      temp.x = this.radiuses[i] * Math.cos((Math.PI * 2 * this.angles[i]) / 360);
      temp.z = this.radiuses[i] * Math.sin((Math.PI * 2 * this.angles[i]) / 360);
      temp.y = 1;

      this.geometry.attributes.position.setXYZ(i, temp.x, temp.y, temp.z);
    }

    this.visible = false;
  }

  stop() {
    app.tweens
      .add(this.material.uniforms.size)
      .to({ value: 10 })
      .duration(500)
      .easing(Tiny.Easing.Cubic.Out)
      .onComplete(() => {
        app.off("update", this.update, this);
        this.visible = false;
      })
      .start();

    return this;
  }

  start() {
    app.on("update", this.update, this);
    this.visible = true;
    return this;
  }

  update(delta) {
    let speed = delta * 0.006;
    for (let i = 0; i < this._capacity; i++) {
      temp.x = this.geometry.attributes.position.getX(i);
      temp.y = this.geometry.attributes.position.getY(i);
      temp.z = this.geometry.attributes.position.getZ(i);

      this.radiuses[i] += speed * this.speeds[i];

      temp.x = this.radiuses[i] * Math.cos((Math.PI * 2 * this.angles[i]) / 360);
      temp.z = this.radiuses[i] * Math.sin((Math.PI * 2 * this.angles[i]) / 360);
      temp.y += speed * this.speedsY[i];

      this.speeds[i] -= speed * 0.4;

      this.geometry.attributes.position.setXYZ(i, temp.x, temp.y, temp.z);
    }

    this.geometry.attributes.position.needsUpdate = true;
  }
}
