import {
  Color,
  DoubleSide,
  DynamicDrawUsage,
  InstancedBufferAttribute,
  InstancedMesh,
  MeshLambertMaterial,
  Object3D
} from "three";
import { random } from "utils";

let transform = new Object3D();

let leafMaterial = new MeshLambertMaterial({ side: DoubleSide });

var colorParsChunk = ["attribute vec3 tint;", "varying vec3 vTint;", "#include <common>"].join("\n");

var instanceColorChunk = ["#include <begin_vertex>", "\tvTint = tint;"].join("\n");

var fragmentParsChunk = ["varying vec3 vTint;", "#include <common>"].join("\n");

var colorChunk = ["vec4 diffuseColor = vec4( diffuse * vTint, opacity );"].join("\n");

leafMaterial.onBeforeCompile = function (shader) {
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", colorParsChunk)
    .replace("#include <begin_vertex>", instanceColorChunk);

  shader.fragmentShader = shader.fragmentShader
    .replace("#include <common>", fragmentParsChunk)
    .replace("vec4 diffuseColor = vec4( diffuse, opacity );", colorChunk);
};

export class FallingLeavesParticles extends InstancedMesh {
  constructor(capacity = 50) {
    var geometry = app.cache.gltf.ground.scene.getObjectByName("leaf").geometry;
    const tint = new InstancedBufferAttribute(new Uint8Array(capacity * 3), 3, true);
    geometry.attributes.tint = tint;

    super(geometry, leafMaterial, capacity);

    this.width = 35;
    this.height = 10;

    this.wind = {
      magnitude: 1.2,
      maxSpeed: 12,
      duration: 300,
      start: 0,
      speed: 0
    };
    this.timer = 0;
    this.frustumCulled = false;
    this.leaves = [];
    this.capacity = capacity;

    for (let i = 0; i < capacity; i++) {
      const leaf = {
        index: i,
        x: 0,
        y: 0,
        z: 0,
        rotation: {
          axis: "x",
          value: 0,
          speed: 0,
          x: 0
        },
        xSpeedVariation: 0,
        ySpeed: 0,
        path: {
          type: 1,
          start: 0
        }
      };
      this.#resetLeaf(leaf);
      this.leaves.push(leaf);
      const color = new Color(Math.random() > 0.5 ? 0x9e2e10 : 0xf0e62d);
      window.color = color;
      color.convertSRGBToLinear();
      tint.setXYZ(i, color.r * 255, color.g * 255, color.b * 255);
    }
    window.te = this;
    this.instanceMatrix.setUsage(DynamicDrawUsage);

    this.visible = false;
  }

  #resetLeaf(leaf) {
    leaf.x = random(-this.width / 2, this.width / 2);
    leaf.y = this.height;
    leaf.z = random(-this.width / 2, this.width / 2);

    if (this.timer == 0) {
      leaf.y = Math.random() * this.height;
    }

    leaf.rotation.speed = Math.random() * 10;
    var randomAxis = Math.random();
    if (randomAxis > 0.5) {
      leaf.rotation.axis = "x";
    } else if (randomAxis > 0.25) {
      leaf.rotation.axis = "y";
      leaf.rotation.x = random(Math.PI, (Math.PI * 3) / 2);
    } else {
      leaf.rotation.axis = "z";
      leaf.rotation.x = random(-Math.PI, Math.PI);
      leaf.rotation.speed = Math.random() * 3;
    }

    leaf.xSpeedVariation = Math.random() * 0.8 - 0.4;
    leaf.ySpeed = Math.random() + 1.5;

    return leaf;
  }

  #updateLeaf(leaf, delta) {
    delta = delta * 0.0004;
    var leafWindSpeed = this.wind.speed(this.timer - this.wind.start, leaf.y);

    var xSpeed = leafWindSpeed + leaf.xSpeedVariation;
    leaf.x -= xSpeed * delta;
    leaf.y -= leaf.ySpeed * delta;
    leaf.rotation.value += leaf.rotation.speed * delta;

    transform.matrix.identity();
    transform.position.set(leaf.x, leaf.y, leaf.z);
    transform.rotation[leaf.rotation.axis] = leaf.rotation.value;
    if (leaf.rotation.axis !== "x") {
      transform.rotation.x = leaf.rotation.x;
    }

    transform.updateMatrix();
    this.setMatrixAt(leaf.index, transform.matrix);

    if (leaf.x < -this.width || leaf.x > this.width || leaf.y < 0) {
      this.#resetLeaf(leaf);
    }
  }

  #updateWind() {
    if (this.timer === 0 || this.timer > this.wind.start + this.wind.duration) {
      this.wind.magnitude = random(-this.wind.maxSpeed, this.wind.maxSpeed);
      this.wind.duration = Math.abs(this.wind.magnitude) * 50 + (Math.random() * 20 - 10);
      this.wind.start = this.timer;

      const height = this.height;

      this.wind.speed = function (t, y) {
        const a = ((this.magnitude / 2) * (height - (2 * y) / 3)) / height;
        return a * Math.sin(((2 * Math.PI) / this.duration) * t + (3 * Math.PI) / 2) + a;
      };
    }
  }

  stop() {
    app.off("update", this.update, this);
    this.visible = false;
    return this;
  }

  start() {
    app.on("update", this.update, this);
    this.visible = true;
    return this;
  }

  update(delta) {
    this.#updateWind();
    for (var i = 0; i < this.leaves.length; i++) {
      this.#updateLeaf(this.leaves[i], delta);
    }
    this.instanceMatrix.needsUpdate = true;

    this.timer += delta * 0.0625;
  }
}
