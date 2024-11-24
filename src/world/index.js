import { config } from "config";
import { resources } from "../resources";
import {
  Scene,
  AmbientLight,
  DirectionalLight,
  MeshLambertMaterial,
  SphereGeometry,
  Mesh,
  DoubleSide,
  BoxGeometry,
  PlaneGeometry,
  Color,
  PointLight
} from "three";

// import { TrailRenderer, M } from '@gpg-web/playable-libs';
// import Lorry from '../../../prefabs/Transports/Lorry';
// import Queue from '../../../managers/Queue';
// import MineExplosionParticle from '../../../prefabs/particles/points/MineExplosion';
// import SmokeParticles from '../../../prefabs/particles/points/Smoke';

export class World extends Scene {
  constructor(game) {
    super();
    this.game = game;
  }

  preload() {
    this.game.load.gltf("ground", resources.ground);
    // this.game.load.gltf('Lorry', window.resources.models.Lorry, false, function (gltf) {
    //     gltf.scene.traverse(function (obj) {
    //         if (obj.isMesh) obj.geometry.computeVertexNormals();
    //     });
    // });
    // this.game.load.texture3d('main', window.resources.textures.main);
    // this.game.load.texture3d('explosion_1', window.resources.textures.explosion_1);
    // this.game.load.texture3d('explosion_2', window.resources.textures.explosion_2);
    // this.game.cache.gltf["key"];
    // this.game.cache.texture3d["key"];
    // this.game.cache.mesh3d["key.meshName"];
    // this.game.cache.animation3d["key.animationName"];
  }

  create() {
    // this.material = this.game.material = new MeshLambertMaterial({
    //   map: this.game.cache.texture3d["main"]
    // });
    const ground = this.game.cache.gltf["ground"].scene;
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

    /**
     * Terrain creating
     */
    // const terrain = new Mesh(new PlaneGeometry(100, 100, 1, 1), new MeshLambertMaterial({ color: 0x298933 }));
    // terrain.material.color.convertSRGBToLinear();
    // terrain.rotation.x = -Math.PI / 2;
    // terrain.receiveShadow = true;
    // this.add(terrain);

    /**
     * Queue manager creating
     */
    // const queue = (this.queue = new Queue());

    // const path = [];

    // path.push([0, 0]);
    // for (let i = 0; i < 20; i++) {
    //     path.push([M.random(-50, 50), M.random(-50, 50)]);
    // }
    // path.push([0, 0]);

    // queue.setPath(path);

    // queue.setSpeed(6);
    // game.timer.loop(7000, function () {
    //     queue.setSpeed(M.random(4, 8));
    // });

    // queue.setDistance(2);
    // if (__DEV__) {
    //     setTimeout(() => debug3d.drawPath(queue.path), 0);
    //     setTimeout(() => debug3d.control(queue.path), 0);
    // }

    // /**
    //  * Car #1 object creating
    //  */
    // const car = new Lorry(this);
    // car.scale.set(2, 2, 2);
    // this.add(car);
    // queue.addOne(car);

    // if (__DEV__) {
    //     car.add(new THREE.AxesHelper(5));
    // }

    // /**
    //  * Car #2 object creating
    //  */
    // const car2 = new Lorry(this);
    // car2.scale.set(2, 2, 2);
    // this.add(car2);
    // queue.addOne(car2);

    // /**
    //  * Box object creating
    //  */
    // const box = new Mesh(new BoxGeometry(3, 3, 3), new MeshLambertMaterial({ color: 0x7878ff }));
    // box.name = 'box';
    // box.castShadow = true;
    // box.geometry.translate(0, 1.5, 0);
    // box.update = function () {};
    // box.stopped = function () {};
    // box.move = function (point) {
    //     this.rotation.y = Math.atan2(this.position.z - point.z, point.x - this.position.x) + 1.57;
    //     this.position.set(point.x, point.y, point.z);
    // };
    // this.add(box);
    // const boxText = new Tiny.Text3D('Gold', {
    //     wordWrap: false,
    //     font: 'bold 20pt Arial',
    //     fill: '#f10000',
    //     size: 5
    // });
    // boxText.material.side = DoubleSide;
    // boxText.position.y = 2.8;
    // boxText.position.z = 1.6;
    // box.add(boxText);

    // queue.addOne(box);

    // /**
    //  * Gold object creating
    //  */
    // const gold = game.cache.gltf['Lorry'].scene.children[3].clone();
    // gold.material = this.material;
    // gold.scale.set(4, 4, 4);
    // gold.name = 'gold';
    // gold.update = function () {};
    // gold.stopped = function () {};
    // gold.move = function (point) {
    //     this.rotation.z = Math.atan2(point.x - this.position.x, this.position.z - point.z) + 1.57;
    //     this.position.set(point.x, point.y + 1, point.z);
    // };
    // this.add(gold);
    // queue.addOne(gold);

    // /**
    //  * Adding control points for queue
    //  */
    // queue.addPoint('point1', M.random(0.2, 0.3));
    // queue.addPoint('point2', M.random(0.5, 0.8));

    // queue.onCheckPoint = function (name, obj) {
    //     console.log(obj.name + ' at ' + name);

    //     game.timer.add(M.random(500, 2000), function () {
    //         if (obj.name === 'lorry') {
    //             if (name === 'point1') obj.fill(0);
    //             else if (name === 'point2') obj.fill(100);
    //         }

    //         queue.cont(obj, name);
    //     });
    // };

    // /**
    //  * Added Tiny text board
    //  */
    // const board = new Tiny.Text3D('Welcome\nTiny framework', {
    //     align: 'center',
    //     wordWrap: true,
    //     wordWrapWidth: 600,
    //     font: 'bold 40pt Arial',
    //     fill: '#4545f2',
    //     strokeThickness: 5,
    //     stroke: '#ffffff',
    //     size: 35
    // });
    // board.rotation.y = -2.3;
    // board.rotation.z = -0.1;
    // board.position.y = 7;
    // this.game.tweens
    //     .add(board.position)
    //     .to({ y: 11 }, 1000)
    //     .easing(Tiny.Easing.Back.InOut)
    //     .yoyo(true)
    //     .repeat(Infinity)
    //     .start();
    // this.game.tweens
    //     .add(board.rotation)
    //     .to({ z: 0.1 }, 450)
    //     .yoyo(true)
    //     .easing(Tiny.Easing.Sinusoidal.InOut)
    //     .repeat(Infinity)
    //     .start();
    // this.add(board);

    // if (__DEV__) {
    //     setTimeout(() => debug3d.control(board));
    // }

    // /**
    //  * Added points particle
    //  */
    // const explosionParticles = new MineExplosionParticle(this.game, 80);
    // explosionParticles.position.y = 5;
    // this.add(explosionParticles);

    // game.timer.loop(6000, function () {
    //     explosionParticles.explode();
    // });

    // let smoke = new SmokeParticles(null, 0.8);
    // smoke.position.set(0, 0, 0);
    // this.add(smoke);

    // if (__DEV__) {
    //     setTimeout(() => debug3d.control(smoke));
    // }

    // smoke.start();

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
      direct.shadow.mapSize.width = 1024; // default
      direct.shadow.mapSize.height = 1024; // default
      direct.shadow.camera.near = 0.1; // default
      direct.shadow.camera.far = 120; // default

      direct.shadow.camera.top = 25;
      direct.shadow.camera.bottom = -25;
      direct.shadow.camera.left = -25;
      direct.shadow.camera.right = 25;

      //const helper = new THREE.CameraHelper( direct.shadow.camera );
      //world.add( helper );
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

    // debug3d.control(point1)
  }

  nextDay() {
    /**
     * Duration of next day animation
     */
    if (this.skipDayLocked) return;
    this.skipDayLocked = true;

    const duration = 1000;
    this.point1.visible = this.point2.visible = true;

    this.game.tweens
      .add(this.direct.position)
      .to({ z: 50, x: 0 })
      .duration(duration * 0.4)
      .easing(Tiny.Easing.Cubic.Out)
      .start();
    this.game.tweens
      .add(this.direct)
      .to({ intensity: 0 })
      .duration(duration * 0.4)
      .easing(Tiny.Easing.Cubic.Out)
      .start();
    this.game.tweens
      .add(this.ambient)
      .to({ intensity: 0.1 })
      .duration(duration * 0.4)
      .easing(Tiny.Easing.Cubic.Out)
      .start();
    this.game.tweens
      .add(this.point1)
      .to({ intensity: 2 })
      .onUpdate(() => {
        this.point2.intensity = this.point1.intensity;
      })
      .duration(duration * 0.4)
      .easing(Tiny.Easing.Cubic.Out)
      .start();

    const nightColor = new Color(0x9999ff);
    this.game.tweens
      .add(this.ambient.color)
      .to({ r: nightColor.r, g: nightColor.g, b: nightColor.b })
      .duration(duration * 0.1)
      .easing(Tiny.Easing.Cubic.Out)
      .delay(duration * 0.1)
      .start();

    this.game.timer.add(duration * 0.5, () => {
      this.direct.position.z = -50;

      this.game.tweens
        .add(this.direct.position)
        .to({ z: -10, x: -10 })
        .duration(duration * 0.4)
        .easing(Tiny.Easing.Cubic.In)
        .start();
      this.game.tweens
        .add(this.direct)
        .to({ intensity: 1.9 })
        .duration(duration * 0.4)
        .easing(Tiny.Easing.Cubic.In)
        .start();
      this.game.tweens
        .add(this.ambient)
        .to({ intensity: 0.8 })
        .duration(duration * 0.4)
        .easing(Tiny.Easing.Cubic.In)
        .start();

      this.game.tweens
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

      this.game.tweens
        .add(this.ambient.color)
        .to({ r: 1, g: 1, b: 1 })
        .duration(duration * 0.1)
        .easing(Tiny.Easing.Cubic.In)
        .start();
    });
  }

  resize(width, height, scale) {}

  update(delta) {
    // this.queue.update(delta);
  }
}
