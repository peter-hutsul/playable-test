import { Object3D } from "three";
import { FenceParticles } from "./FenceParticles";
import { random } from "utils";

export class Fence extends Object3D {
  constructor(AnimalClass) {
    super();

    const particles = new FenceParticles();
    particles.start();
    this.add(particles);
    app.sound.play('throw_spear')
    
    const fence = app.cache.gltf.objects.scene.getObjectByName("fence");
    for (let child of fence.children) {
      this.add(child.clone());
    }

    app.timer.add(100, () => {
      const animal = new AnimalClass();
      animal.position.set(0, -0.3, 0);
      animal.rotation.y = random(-0.5, 0.5);
      this.add(animal);

      app.timer.add(300, () => {
        particles.stop();
      });
    });
  }

  destroy() {}
}
