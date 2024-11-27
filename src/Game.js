import { OrthographicCamera, PerspectiveCamera } from "three";

import { UI } from "./ui";
import { World } from "./world";
import { App3D } from "./helpers/App3D";
import { MapControls } from "three/examples/jsm/controls/OrbitControls.js";
import { resources } from "./resources";
import { sdk } from "sdk";
import { GameplayManager } from "./managers/GameplayManager";
import { TutorialManager } from "./managers/TutorialManager";
import { config } from "config";

export class Game extends App3D {
  constructor(width, height) {
    super(width, height);

    this.ready = false;
    this.ui = new UI(this.screen2d);

    this.balance = config.economy.startBalance;
    this.income = config.economy.startIncome;
  }

  createWorld() {
    const scene = new World(this);
    return scene;
  }

  createCamera() {
    // let camera = new OrthographicCamera(1, 1, 1, 1, 0.3, 500);
    let camera = new PerspectiveCamera(100, this.width / this.height, 0.1, 1000);

    camera.position.set(20, 27, 6);
    camera.rotation.set(-1.1, 0.55, 0.86);

    camera.distance = 60;

    if (__DEV__) {
      // var controls = (window.controls = new MapControls(camera, this.inputView));
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
    for (let key in resources.sounds) {
      this.load.sound(key, resources.sounds[key]);
    }
    this.ui.preload();
    this.scene.preload();
  }

  create() {
    this.sound.loop("theme", 0.5);

    this.scene.create();
    this.ui.create();

    this.ready = true;

    sdk.create();

    this.timer.loop(1000, () => {
      this.balance += this.income;

      this.emit("balance", this.balance);
    });

    app.emit("ad:ready", this);

    let clicks = 0;

    if (config.tutorial.enabled) TutorialManager.init();
    GameplayManager.init();

    this.input.on("down", () => {
      clicks++;

      if (clicks >= 100) {
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
    GameplayManager.destroy();
    TutorialManager.destroy();
    this.ui = undefined;
    this.scene = undefined;
  }
}
