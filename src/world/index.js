import { config } from "config";
import { resources } from "../resources";
import { Scene, AmbientLight, DirectionalLight, Color, PointLight, MeshBasicMaterial } from "three";
import { Chicken } from "./Chicken";
import { random } from "utils";
import { FallingLeavesParticles } from "./FallingLeaves";

export class World extends Scene {
  constructor(game) {
    super();
    this.game = game;
  }

  preload() {
    app.load.gltf("ground", resources.ground, false, function (gltf) {
      gltf.scene.traverse(function (obj) {
        if (obj.isMesh) {
          if (!obj.geometry.computed) {
            if (!config.graphics.smooth) obj.geometry = obj.geometry.toNonIndexed();
            obj.geometry.computeVertexNormals();
            obj.geometry.computed = true;
          }
        }
      });
    });

    app.load.gltf("objects", resources.objects, true, function (gltf) {
      gltf.scene.traverse(function (obj) {
        if (obj.isMesh) {
          obj.castShadow = true;
          if (!obj.geometry.computed) {
            if (!config.graphics.smooth) obj.geometry = obj.geometry.toNonIndexed();
            obj.geometry.computeVertexNormals();
            obj.geometry.computed = true;
          }
        }
      });

      app.cache.mesh3d["objects.placeholder"].material = new MeshBasicMaterial();
    });

    app.load.texture3d("plus", resources.plus);
    app.load.texture3d("smoke", resources.smoke);
    app.load.texture3d("leaf", resources.leaf);
  }

  create() {
    const ground = app.cache.gltf["ground"].scene;
    ground.traverse((obj) => {
      if (obj.isMesh) {
        if (obj.name && obj.name.startsWith("terrain")) {
          obj.receiveShadow = true;
        } else {
          obj.castShadow = true;
        }
      }
    });
    this.add(ground);

    const chicken = new Chicken();
    chicken.position.set(9.2, 4.15, -6.53);
    chicken.rotation.y = random(-Math.PI, Math.PI);
    this.add(chicken);

    const chicken2 = new Chicken();
    chicken2.position.set(11.69, 4.15, -8.2);
    chicken2.rotation.y = random(-Math.PI, Math.PI);
    this.add(chicken2);

    const chicken3 = new Chicken();
    chicken3.position.set(11, 4.15, -6);
    chicken3.rotation.y = random(-Math.PI, Math.PI);
    this.add(chicken3);

    const fallingLeaves = new FallingLeavesParticles();
    fallingLeaves.position.y = 4;
    fallingLeaves.start();
    this.add(fallingLeaves);

    this.setupLight();
  }

  setupLight() {
    this.ambient = new AmbientLight("#ffffff", 0.8);
    this.add(this.ambient);

    const direct = (this.direct = new DirectionalLight("#ffffff", 1.9));
    direct.position.set(-10, 59, -10);
    direct.lookAt(0, 0, 0);
    this.add(direct);

    if (config.graphics.shadows) {
      direct.castShadow = true;
      direct.shadow.mapSize.width = 1024;
      direct.shadow.mapSize.height = 1024;
      direct.shadow.camera.near = 0.1;
      direct.shadow.camera.far = 120;

      direct.shadow.camera.top = 25;
      direct.shadow.camera.bottom = -25;
      direct.shadow.camera.left = -25;
      direct.shadow.camera.right = 25;
    }

    const point1 = new PointLight("#ffff90", 0, 15);
    point1.position.set(-1.98, 6.8, -15.72);
    this.point1 = point1;
    this.add(point1);

    const point2 = new PointLight("#ffff90", 0, 15);
    point2.position.set(8.13, 6.22, -17.21);
    this.point2 = point2;
    this.add(point2);

    this.point1.visible = this.point2.visible = false;
  }

  nextDay() {
    app.sound.play("throw_spear", 0.5);

    /**
     * Duration of next day animation
     */
    if (this.skipDayLocked) return;
    this.skipDayLocked = true;

    const duration = 1000;
    this.point1.visible = this.point2.visible = true;

    app.tweens
      .add(this.direct.position)
      .to({ z: 50, x: 0 })
      .duration(duration * 0.4)
      .easing(Tiny.Easing.Cubic.Out)
      .start();
    app.tweens
      .add(this.direct)
      .to({ intensity: 0 })
      .duration(duration * 0.4)
      .easing(Tiny.Easing.Cubic.Out)
      .start();
    app.tweens
      .add(this.ambient)
      .to({ intensity: 0.1 })
      .duration(duration * 0.4)
      .easing(Tiny.Easing.Cubic.Out)
      .start();
    app.tweens
      .add(this.point1)
      .to({ intensity: 2 })
      .onUpdate(() => {
        this.point2.intensity = this.point1.intensity;
      })
      .duration(duration * 0.4)
      .easing(Tiny.Easing.Cubic.Out)
      .start();

    const nightColor = new Color(0x9999ff);
    app.tweens
      .add(this.ambient.color)
      .to({ r: nightColor.r, g: nightColor.g, b: nightColor.b })
      .duration(duration * 0.1)
      .easing(Tiny.Easing.Cubic.Out)
      .delay(duration * 0.1)
      .start();

    app.timer.add(duration * 0.5, () => {
      this.direct.position.z = -50;

      app.tweens
        .add(this.direct.position)
        .to({ z: -10, x: -10 })
        .duration(duration * 0.4)
        .easing(Tiny.Easing.Cubic.In)
        .start();
      app.tweens
        .add(this.direct)
        .to({ intensity: 1.9 })
        .duration(duration * 0.4)
        .easing(Tiny.Easing.Cubic.In)
        .start();
      app.tweens
        .add(this.ambient)
        .to({ intensity: 0.8 })
        .duration(duration * 0.4)
        .easing(Tiny.Easing.Cubic.In)
        .start();

      app.tweens
        .add(this.point1)
        .to({ intensity: 0 })
        .onUpdate(() => {
          this.point2.intensity = this.point1.intensity;
        })
        .onComplete(() => {
          this.point1.visible = this.point2.visible = false;
          this.skipDayLocked = false;
        })
        .duration(duration * 0.4)
        .easing(Tiny.Easing.Cubic.In)
        .start();

      app.tweens
        .add(this.ambient.color)
        .to({ r: 1, g: 1, b: 1 })
        .duration(duration * 0.1)
        .easing(Tiny.Easing.Cubic.In)
        .start();
    });
  }

  resize(width, height, scale) {}

  update(delta) {}
}
