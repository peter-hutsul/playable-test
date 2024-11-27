import { Object3D } from "three";
import { GroundParticles } from "./GroundParticles";

export class Ground extends Object3D {
  constructor(PlantClass) {
    super();

    this.plants = [];
    const particles = new GroundParticles();
    particles.start();
    this.add(particles);

    app.sound.play('throw_spear')
    app.timer.add(1000, () => {
      const ground = app.cache.gltf.objects.scene.getObjectByName("ground");
      const positions = [];
      for (let child of ground.children) {
        positions.push(child.position);
        child.receiveShadow = true;
        child.castShadow = false;
        this.add(child.clone());
      }

      for (let position of positions) {
        const plant = new PlantClass();
        plant.position.copy(position);
        this.add(plant);
        this.plants.push(plant);
      }

      app.on("update", this.update, this);
      particles.stop();
    });
  }

  update(delta) {
    for (let i = 0; i < this.plants.length; i++) {
      this.plants[i].update(delta);
    }
  }

  destroy() {
    app.off("update", this.update, this);
  }
}
