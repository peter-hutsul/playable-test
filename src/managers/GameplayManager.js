import { Ground } from "../world/Ground";
import { Grape } from "../world/Grape";
import { Placeholder } from "../world/Placeholder";
import { Corn } from "../world/Corn";
import { Tomato } from "../world/Tomato";
import { Strawberry } from "../world/Strawberry";
import { Cow } from "../world/Cow";
import { Sheep } from "../world/Sheep";
import { Fence } from "../world/Fence";
import { remove } from "utils";

export class GameplayManager {
  static init() {
    this.introCamera();
    this.showFirstCell();
    this.plants = [
      { id: "corn", objectClass: Corn },
      { id: "grape", objectClass: Grape },
      { id: "tomato", objectClass: Tomato },
      { id: "strawberry", objectClass: Strawberry }
    ];

    this.animals = [
      { id: "cow", objectClass: Cow },
      { id: "sheep", objectClass: Sheep }
    ];
  }

  static introCamera() {
    app.tweens
      .add(app.camera.position)
      .to({
        x: 8.37,
        y: 24.81,
        z: 4
      })
      .delay(1500)
      .duration(1000)
      .easing(Tiny.Easing.Cubic.InOut)
      .start();

    app.tweens
      .add(app.camera)
      .to({
        distance: 40
      })
      .onUpdate(() => app.setupCamera())
      .delay(1500)
      .duration(1000)
      .easing(Tiny.Easing.Cubic.InOut)
      .start();

    app.tweens
      .add(app.camera.rotation)
      .to({ x: -1.6, y: 0.76, z: 1.62 })
      .delay(1500)
      .duration(1000)
      .easing(Tiny.Easing.Cubic.InOut)
      .start();
  }

  static cameraToSecondCell() {
    app.tweens
      .add(app.camera.position)
      .to({
        x: 4.5,
        y: 22,
        z: -3
      })
      .duration(1000)
      .easing(Tiny.Easing.Cubic.InOut)
      .start();
  }

  static cameraToThirdCell() {
    app.tweens
      .add(app.camera.position)
      .to({
        x: [-1.62, -2.93],
        y: [9.9, 22],
        z: [0.541, 1.91]
      })
      .interpolation(Tiny.Interpolation.CatmullRom)
      .duration(3000)
      .delay(1000)
      .easing(Tiny.Easing.Cubic.In)
      .start();

    app.tweens
      .add(app.camera.rotation)
      .to({ x: [-0.371, -1.55], y: [-0.053, -0.647], z: [-0.02, -1.54] })
      .interpolation(Tiny.Interpolation.CatmullRom)
      .duration(3000)
      .delay(1000)
      .easing(Tiny.Easing.Cubic.In)
      .start();
  }

  static cameraToFourthCell() {
    app.tweens
      .add(app.camera.position)
      .to({
        x: -2.93,
        y: 22,
        z: 8
      })
      .duration(1000)
      .easing(Tiny.Easing.Cubic.InOut)
      .start();
  }

  static showFirstCell() {
    app.once("cell:click", () =>
      app.ui.choiceBar.showActions(
        this.plants.slice(0, 3).map((e) => {
          return {
            id: e.id,
            action: () => this.placePlant(e.objectClass, this.showSecondCell)
          };
        })
      )
    );

    const placeholder = new Placeholder();
    placeholder.position.set(-10.35, 4.55, 4.15);
    placeholder.rotation.y = -Math.PI / 2;
    app.scene.add(placeholder);

    this.placeholder = placeholder;
  }

  static showSecondCell() {
    this.cameraToSecondCell();

    app.once("cell:click", () =>
      app.ui.choiceBar.showActions(
        this.plants.slice(0, 3).map((e) => {
          return {
            id: e.id,
            action: () => this.placePlant(e.objectClass, this.showThirdCell)
          };
        })
      )
    );

    const placeholder = new Placeholder();
    placeholder.position.set(-10.35, 4.55, -3.3);
    placeholder.rotation.y = -Math.PI / 2;
    app.scene.add(placeholder);

    this.placeholder = placeholder;
  }

  static showThirdCell() {
    this.cameraToThirdCell();

    app.once("cell:click", () =>
      app.ui.choiceBar.showActions(
        this.animals.map((e) => {
          return { id: e.id, action: () => this.placeAnimal(e.objectClass, this.showFourthCell) };
        })
      )
    );

    const placeholder = new Placeholder();
    placeholder.position.set(9, 4.55, 1.46);
    placeholder.rotation.y = -Math.PI / 2;
    app.scene.add(placeholder);
    this.placeholder = placeholder;
  }

  static showFourthCell() {
    this.cameraToFourthCell();
    app.once("cell:click", () => {
      this.placeholder.destroy();
      app.scene.remove(this.placeholder);
      app.finish();
    });

    const placeholder = new Placeholder();
    placeholder.position.set(9, 4.55, 8.57);
    placeholder.rotation.y = -Math.PI / 2;
    app.scene.add(placeholder);
    this.placeholder = placeholder;
  }

  static placePlant(ItemClass, nextStep) {
    remove(this.plants, (e) => e.id === ItemClass.id);

    app.ui.choiceBar.hideActions();

    const item = new Ground(ItemClass);
    item.position.copy(this.placeholder.position);
    item.rotation.copy(this.placeholder.rotation);
    app.scene.add(item);

    this.placeholder.destroy();
    app.scene.remove(this.placeholder);

    app.timer.add(2000, nextStep, this);
  }

  static placeAnimal(ItemClass, nextStep) {
    remove(this.plants, (e) => e.id === ItemClass.id);

    app.ui.choiceBar.hideActions();

    const item = new Fence(ItemClass);
    item.position.copy(this.placeholder.position);
    item.rotation.copy(this.placeholder.rotation);
    app.scene.add(item);

    this.placeholder.destroy();
    app.scene.remove(this.placeholder);

    app.timer.add(2000, nextStep, this);
  }

  destroy() {
    app.off("gameplay:start", this.showCell, this);
  }
}
