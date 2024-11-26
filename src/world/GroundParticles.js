import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Points,
  RawShaderMaterial,
  Vector3
} from "three";
import { random } from "utils";

export class SmokeMaterial extends RawShaderMaterial {
  constructor(options) {
    var uniforms = {
      size: { value: options.size || 12.0 },
      texture: { value: options.map }
    };

    super({
      uniforms: uniforms,
      vertexShader: `
        precision mediump float;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float size;
        attribute vec3 position;
        attribute vec3 acolor;
        varying vec4 color;
        void main() {
            color = vec4(acolor, 1.0);
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_PointSize = size - (position.y * 3.0);
            gl_Position = projectionMatrix * mvPosition;
        }`,

      fragmentShader: `
        precision mediump float;
        uniform sampler2D texture;
        varying vec4 color;
        void main() {
            gl_FragColor = color * texture2D( texture, gl_PointCoord.xy );
        }`,
      depthWrite: false,
      transparent: true,
      alphaTest: 0.5
      //blending: NormalBlending
    });

    this.uniforms = uniforms;
  }
}

const temp = new Vector3();
let material;

export class GroundParticles extends Points {
  constructor(capacity = 60, color = 0x2b1700) {
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

    this.speedsX = new Array(capacity);
    this.speedsY = new Array(capacity);
    this.speedsZ = new Array(capacity);

    let colors = new Float32Array(capacity * 3);

    let tempColor = new Color(color);
    let hsl = {};
    tempColor.getHSL(hsl);

    for (let i = 0; i < capacity; i++) {
      tempColor.setHSL(hsl.h, hsl.s, random(0.2, 0.4));

      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    this.geometry.setAttribute("position", new Float32BufferAttribute(capacity * 3, 3));
    this.geometry.setAttribute("acolor", new BufferAttribute(colors, 3));

    for (let i = 0; i < capacity; i++) {
      temp.x = random(-3, 3);
      temp.y = random(0.1, 1);
      temp.z = random(-5.5, 5.5);
      this.speedsX[i] = temp.x < 0 ? random(-1, -0.5) : random(0.5, 1);
      this.speedsZ[i] = temp.z < 0 ? random(-1, -0.5) : random(0.5, 1);
      this.speedsY[i] = random(0.5, 1);

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
    let speed = delta * 0.003;
    for (let i = 0; i < this._capacity; i++) {
      temp.x = this.geometry.attributes.position.getX(i);
      temp.y = this.geometry.attributes.position.getY(i);
      temp.z = this.geometry.attributes.position.getZ(i);

      temp.x -= speed * this.speedsX[i];
      temp.z -= speed * this.speedsZ[i];
      temp.y -= speed * this.speedsY[i];

      if (temp.y < 0) {
        temp.x = random(-3, 3);
        temp.y = 1;
        temp.z = random(-5.5, 5.5);
        this.speedsX[i] = temp.x < 0 ? random(-1, -0.5) : random(0.5, 1);
        this.speedsZ[i] = temp.z < 0 ? random(-1, -0.5) : random(0.5, 1);
        this.speedsY[i] = random(0.5, 1);
      }

      this.geometry.attributes.position.setXYZ(i, temp.x, temp.y, temp.z);
    }

    this.geometry.attributes.position.needsUpdate = true;
  }
}
