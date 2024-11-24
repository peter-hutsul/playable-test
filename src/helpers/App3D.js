import { config } from "config";
import {
  WebGLRenderer,
  sRGBEncoding,
  OrthographicCamera,
  // PerspectiveCamera,
  Scene,
  BasicShadowMap,
  PCFSoftShadowMap,
  GammaEncoding
} from "three";
import { PL } from "utils";

export class App3D extends Tiny.App {
  constructor(width, height) {
    super();

    this.width = width;
    this.height = height;

    this.screen = {};

    this.renderer = new WebGLRenderer({
      antialias: true
    });

    this.renderer.outputEncoding = sRGBEncoding;

    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor("#63e7ff");

    const view = (this.canvas = this.inputView = this.renderer.domElement);

    let parentNode = document.getElementById("game");
    parentNode.appendChild(view);
    view.style.perspective = "1000px";

    this.scene = this.createWorld();
    this.camera = this.createCamera();
    this.screen2d = new Tiny.Screen2D(this.width, this.height);
    this.screen2d.container.game = this;

    this.setupCamera();

    if (config.graphics.shadows) {
      this.renderer.shadowMap.enabled = true;
      // this.renderer.shadowMap.type = BasicShadowMap;
      // this.renderer.shadowMap.type = PCFSoftShadowMap;
    }

    if (config.graphics.gamma) {
      this.renderer.outputEncoding = GammaEncoding;
      this.renderer.gammaFactor = 1.2;
    }

    this.timeScale = 1;
    this.setDPR(1.2);
  }

  createWorld() {
    let scene = new Scene();
    return scene;
  }

  createCamera() {
    const camera = new OrthographicCamera(1, 1, 1, 1, 0.3, 500);
    // let camera = new PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000);

    camera.position.set(40, 50, 40);
    camera.lookAt(0, 0, 0);
    camera.distance = 50;

    return camera;
  }

  setDistance(distance) {
    this.camera.distance = distance || this.camera.distance;
    this.setupCamera();
  }

  setupCamera() {
    if (this.camera) {
      const aspect = this.width / this.height;
      const distance = PL(this.camera.distance, this.camera.distance * 0.65);

      if (this.camera.isOrthographicCamera) {
        this.camera.left = -distance * aspect;
        this.camera.right = distance * aspect;
        this.camera.top = distance;
        this.camera.bottom = -distance;
      } else {
        this.camera.fov = distance * 1.2;
        this.camera.aspect = aspect;
      }

      this.camera.updateProjectionMatrix();
    }
  }

  setDPR(value) {
    let dpr = window.devicePixelRatio || 1.75;
    dpr = Math.min(dpr, value);

    this.renderer.setPixelRatio(dpr);
    this.screen2d.renderer.setPixelRatio(dpr);
  }

  render() {
    this.renderer.autoClear = true;
    this.renderer.render(this.scene, this.camera);
    this.renderer.autoClear = false;
    this.renderer.render(this.screen2d.scene, this.screen2d.camera);
  }

  volume(vol) {
    if (this.sound) this.sound.volume(vol);
  }

  resize(width, height) {
    super.resize(width, height);

    this.screen2d.setSize(width, height);
    this.renderer.setSize(width, height);
    this.setupCamera();
  }

  destroy(clearCache) {
    super.destroy(clearCache);

    this.screen2d.scene.dispose();
    this.scene.dispose();

    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }

    this.renderer.dispose();
  }
}