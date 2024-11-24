import { OrthographicCamera } from "three";

import { UI } from "./ui";
import { World } from "./world";
import { App3D } from "./helpers/App3D";
import { MapControls, OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { resources } from "./resources";
import { sdk } from "sdk";

export class Game extends App3D {
  constructor(width, height) {
    super(width, height);

    this.ready = false;

    this.ui = new UI(this.screen2d);
  }

  createWorld() {
    const scene = new World(this);
    return scene;
  }

  createCamera() {
    let camera = new OrthographicCamera(1, 1, 1, 1, 0.3, 500);
    // let camera = new PerspectiveCamera(50, this.width/this.height, 0.1, 1000);

    camera.position.set(18, 30, 8);
    camera.rotation.set(-1.1, 0.62, 0.86);

    camera.distance = 25;

    if (__DEV__) {
      var controls = (window.controls = new MapControls(camera, this.inputView));
      // controls.addEventListener('change', game.update.bind(game));
      // controls.minDistance = 0;
      // controls.maxDistance = 5000;
      // controls.target.set(10, 0, 0)
      // controls.enablePan = false;
      // controls.enableRotate = false
      // controls.enableZoom = false
      // controls.rotateSpeed = 0.05
      // controls.zoomSpeed  = 0.05
    }

    return camera;
  }

  preload() {
    for (let key in resources.images) {
      this.load.image(key, resources.images[key]);
    }
    this.ui.preload();
    this.scene.preload();
    // if (window.resources.sounds.sfx) {
    //   this.load.sound("popup_chest", window.resources.sounds.sfx.popup_chest);
    //   this.load.sound("creeper_hurt", window.resources.sounds.sfx.creeper_hurt);
    // }
    // this.load.sound("theme", window.resources.sounds.theme);
  }

  startIntro() {
    this.tweens
      .add(this.camera.position)
      .to({
        x: 8.37,
        y: 25.81,
        z: 3
      })
      .delay(1500)
      .duration(1000)
      .easing(Tiny.Easing.Cubic.InOut)
      .start();

    this.tweens
      .add(this.camera)
      .to({
        distance: 10
      })
      .onUpdate(() => this.setupCamera())
      .delay(1500)
      .duration(1000)
      .easing(Tiny.Easing.Cubic.InOut)
      .start();

    this.tweens
      .add(this.camera.rotation)
      .to({ x: -1.6, y: 0.76, z: 1.62 })
      .delay(1500)
      .duration(1000)
      .easing(Tiny.Easing.Cubic.InOut)
      .start();

    this.timer.add(3000, this.showOptions, this);
    // this.showOptions();
  }

  showOptions() {
    this.ui.choiceBar.showActions([
      { icon: "corn", action: () => {} },
      { icon: "grape", action: () => {} },
      { icon: "strawberry", action: () => {} }
    ]);
  }

  create() {
    this.sound.loop("theme", 0.5);

    this.scene.create();
    this.ui.create();

    this.ready = true;

    sdk.create();

    app.emit("ad:ready", this);

    let clicks = 0;

    this.startIntro();

    this.input.on("down", () => {
      clicks++;

      if (clicks >= 215) {
        this.finish();
      }
    });
  }

  finish() {
    if (this.finished === true) return;
    this.finished = true;

    this.sound.play("popup_chest");

    this.ui.showEndcard();

    app.emit("ad:finish", this);

    sdk.finish();

    // this.input.on("down", () => sdk.install());
  }

  resize(width, height, scale) {
    super.resize(width, height);

    this.scale = scale;
    this.screen.scale = scale;
    this.screen.width = width / scale;
    this.screen.height = height / scale;

    this.screen.bottom = this.screen.height * 0.5;
    this.screen.top = -this.screen.bottom;
    this.screen.right = this.screen.width * 0.5;
    this.screen.left = -this.screen.right;

    this.ui.resize(this.width, this.height, scale);
    this.scene.resize(this.width, this.height, scale);
  }

  update(time, delta) {
    this.ui.update(delta);
    this.scene.update(delta);
  }

  destroy() {
    super.destroy();
    this.ui = undefined;
    this.scene = undefined;
  }
}
