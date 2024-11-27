import { config } from "config";

export class TutorialManager {
  static init() {
    app.once("cell:show", this.showFirstTip, this);
  }

  static showFirstTip(placeholder) {
    app.once("cell:click", () => app.opaque.hide());
    app.once("options:show", this.showSecondTip, this);
    app.opaque.showWorld(placeholder.children[0], "Tap to seed first plant", true, 3);
  }

  static showSecondTip(options) {
    app.once("cell:show", this.idleThirdTip, this);
    app.once("plant:place", () => app.opaque.hide());
    app.opaque.showUI(options, "Choose your plant", false, 0);
  }

  static idleThirdTip(placeholder) {
    const timer = app.timer.add(config.tutorial.idleTimer, () => {
      app.opaque.showWorld(placeholder.children[0], "Tap to seed your plant", true, 3);
    });

    app.once("cell:click", () => {
      app.timer.remove(timer);
      app.opaque.hide();
    });

    app.once("options:show", this.idleFourthTip, this);
  }

  static idleFourthTip(options) {
    const timer = app.timer.add(config.tutorial.idleTimer, () => {
      app.opaque.showUI(options, "Choose your plant", false, 0);
    });

    app.once("plant:place", () => {
      app.timer.remove(timer);
      app.opaque.hide();
    });

    app.once("cell:show", this.idleFifthTip, this);
  }

  static idleFifthTip(placeholder) {
    const timer = app.timer.add(config.tutorial.idleTimer, () => {
      app.opaque.showWorld(placeholder.children[0], "Tap to breed your first livestock", true, 3);
    });

    app.once("cell:click", () => {
      app.timer.remove(timer);
      app.opaque.hide();
    });

    app.once("options:show", this.idleSixthTip, this);
  }

  static idleSixthTip(options) {
    const timer = app.timer.add(config.tutorial.idleTimer, () => {
      app.opaque.showUI(options, "Choose your livestock", false, 0);
    });

    app.once("animal:place", () => {
      app.timer.remove(timer);
      app.opaque.hide();
    });
  }

  static destroy() {
    app.off("cell:show", this.showFirstTip, this);
  }
}
