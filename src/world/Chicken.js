import { AnimationMixer, LoopPingPong, Object3D } from "three";
import { randomInt, is } from "utils";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";

const animationConfig = {
  idle_chicken: {
    loop: LoopPingPong,
    timeScale: 1.5,
    play: true
  },
  action_chicken: {
    play: false,
    timeScale: 6,
    loop: LoopPingPong
  }
};

export class Chicken extends Object3D {
  constructor() {
    super();

    this.frustumCulled = false;
    this.loadModel();

    this.actionTimer = app.timer.loop(randomInt(6000, 16000), () => {
      if (is(1 / 4)) app.sound.play("chicken", 0.2);

      this.anims.action_chicken.weight = 1;
      this.anims.idle_chicken.stop();
      this.anims.action_chicken.play();

      app.tweens
        .add(this.anims.action_chicken)
        .to({ weight: 0 }, 500)
        .onComplete(() => {
          this.anims.action_chicken.stop();
          this.anims.idle_chicken.play();
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
    const scene = SkeletonUtils.clone(app.cache.gltf.objects.scene.getObjectByName("chicken_1"));
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
