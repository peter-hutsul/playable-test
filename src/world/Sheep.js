import { AnimationMixer, LoopPingPong, Object3D } from "three";
import { randomInt } from "utils";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";

const animationConfig = {
  idle_sheep: {
    loop: LoopPingPong,
    timeScale: 1.5,
    play: true
  },
  action_sheep: {
    play: false,
    timeScale: 3,
    loop: LoopPingPong
  }
};

export class Sheep extends Object3D {
  constructor() {
    super();

    this.frustumCulled = false;
    this.loadModel();

    this.actionTimer = app.timer.loop(randomInt(6000, 16000), () => {
      this.anims.action_sheep.weight = 1;
      this.anims.idle_sheep.stop();
      this.anims.action_sheep.play();

      app.tweens
        .add(this.anims.action_sheep)
        .to({ weight: 0 }, 500)
        .onComplete(() => {
          this.anims.action_sheep.stop();
          this.anims.idle_sheep.play();
        })
        .delay(1100)
        .start();

      this.actionTimer.delay = randomInt(6000, 16000);
    });

    this.animate();
  }

  static getAnimConfig() {
    return animationConfig;
  }

  animate() {
    app.on("update", this.update, this);
  }
  freeze() {
    app.off("update", this.update, this);
  }

  update(delta) {
    this.animator.update(delta * 0.00025);
  }

  loadModel() {
    const scene = SkeletonUtils.clone(app.cache.gltf.objects.scene.getObjectByName("sheep_1"));
    this.add(scene);
    scene.position.set(0, 0, 0);

    this.traverse((obj) => {
      obj.frustumCulled = false;
      if (obj.isMesh) obj.material.skinning = true;
    });

    this.anims = {};

    this.animator = new AnimationMixer(this);

    for (const key in animationConfig) {
      const config = animationConfig[key];
      var animation = app.cache.animation3d[`objects.${key}`];
      if (animation) {
        var clip = animation;
        var action = this.animator.clipAction(clip);
        action.timeScale = typeof config.timeScale === "undefined" ? 1 : config.timeScale;
        action.weight = typeof config.weight === "undefined" ? 1 : config.weight;
        config.loop && action.setLoop(config.loop);
        config.play && action.play();
        this.anims[key] = action;
      }
    }
  }
}
